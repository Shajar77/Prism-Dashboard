import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react"

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  sortable?: boolean
  hideOnMobile?: boolean
  render?: (row: T) => React.ReactNode
}

export interface CustomTableProps<T extends { id: number }> {
  data: T[]
  columns: TableColumn<T>[]
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  expandable?: boolean
  renderExpanded?: (row: T) => React.ReactNode
}

export function CustomTable<T extends { id: number }>({
  data,
  columns,
  sortable = false,
  pagination = false,
  pageSize = 10,
  onEdit,
  onDelete,
  expandable = false,
  renderExpanded,
}: CustomTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null)

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  const handleSort = (colKey: string) => {
    if (!sortable) return
    if (sortKey === colKey) {
      if (sortDir === "asc") setSortDir("desc")
      else { setSortKey(null); setSortDir("asc") }
    } else {
      setSortKey(colKey)
      setSortDir("asc")
    }
  }

  // Reset to page 1 when data changes (e.g. filter applied)
  React.useEffect(() => { setCurrentPage(1) }, [data])

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, string | number>)[sortKey]
      const bVal = (b as Record<string, string | number>)[sortKey]
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return 0
    })
  }, [data, sortKey, sortDir])

  const totalPages = Math.ceil(sortedData.length / pageSize)
  const displayData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData

  const hasActions = !!onEdit || !!onDelete

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Horizontal scroll container prevents overflow on small screens */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c1c1e]/80 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full sm:min-w-[560px] text-sm text-left align-middle border-collapse">
            <thead className="bg-gradient-to-r from-[#D3FF33] to-[#b8e62c] border-b border-white/10 text-black uppercase text-xs">
              <tr>
                {expandable && <th className="p-3 md:p-4 w-10" aria-label="Expand row" />}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => sortable && col.sortable !== false ? handleSort(col.key) : undefined}
                    className={`p-3 md:p-4 font-bold tracking-wider select-none whitespace-nowrap ${
                      sortable && col.sortable !== false ? "cursor-pointer hover:bg-black/5" : ""
                    } ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortKey === col.key && (
                        sortDir === "asc"
                          ? <ChevronUp className="w-3 h-3 flex-shrink-0" />
                          : <ChevronDown className="w-3 h-3 flex-shrink-0" />
                      )}
                    </div>
                  </th>
                ))}
                {hasActions && (
                  <th className="p-3 md:p-4 font-bold text-right tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="wait">
                {displayData.map((row) => (
                  <React.Fragment key={row.id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors duration-150 ${
                        expandable ? "cursor-pointer" : ""
                      }`}
                      onClick={() => expandable && toggleExpand(row.id)}
                    >
                      {expandable && (
                        <td className="p-3 md:p-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleExpand(row.id) }}
                            aria-label={expandedRow === row.id ? "Collapse row" : "Expand row"}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                              expandedRow === row.id
                                ? "bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                                : "bg-[#D3FF33] border-[#D3FF33] hover:bg-[#c2eb2a] hover:border-[#c2eb2a]"
                            }`}
                          >
                            {expandedRow === row.id
                              ? <ChevronUp className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                              : <ChevronDown className="w-3.5 h-3.5 text-black" />
                            }
                          </button>
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={`py-3 px-3 md:py-4 md:px-4 ${
                            col.key === "title" ? "max-w-[180px] truncate" : "whitespace-nowrap"
                          } ${col.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                        >
                          {col.render
                            ? col.render(row)
                            : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                        </td>
                      ))}
                      {hasActions && (
                        <td className="p-3 md:p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(row)}
                                aria-label="Edit row"
                                className="h-7 w-7 md:h-8 md:w-8 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-[#D3FF33] hover:border-[#D3FF33]/30 hover:bg-[#D3FF33]/10 transition-all duration-200 flex items-center justify-center"
                              >
                                <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(row)}
                                aria-label="Delete row"
                                className="h-7 w-7 md:h-8 md:w-8 rounded-md bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all duration-200 flex items-center justify-center"
                              >
                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>

                    {expandable && expandedRow === row.id && renderExpanded && (
                      <motion.tr
                        key={`${row.id}-expanded`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td colSpan={columns.length + (hasActions ? 1 : 0) + 1} className="p-0">
                          {renderExpanded(row)}
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>

              {displayData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + (hasActions ? 1 : 0) + (expandable ? 1 : 0)}
                    className="p-12 text-center text-gray-500 dark:text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>No records to display</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-3 md:px-4 py-2.5 bg-gray-100 dark:bg-[#1c1c1e]/60 border border-gray-200 dark:border-white/10 rounded-xl backdrop-blur-sm">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Page{" "}
            <span className="text-gray-900 dark:text-white">{currentPage}</span>
            {" "}of{" "}
            <span className="text-gray-900 dark:text-white">{totalPages}</span>
            <span className="text-gray-400 dark:text-gray-600 ml-2">({sortedData.length} total)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
