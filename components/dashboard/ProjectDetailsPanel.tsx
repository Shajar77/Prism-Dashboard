// components/dashboard/ProjectDetailsPanel.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useProjectStore } from "@/stores/projectStore"
import { type Contact } from "@/utils/api"
import { 
  Building2, 
  MapPin, 
  User, 
  ExternalLink,
  BarChart3
} from "lucide-react"

interface ProjectDetailsPanelProps {
  projectId: string
  projectCapacity?: number
  projectSubQty?: number
}

export function ProjectDetailsPanel({ projectId, projectCapacity, projectSubQty }: ProjectDetailsPanelProps) {
  const detailsCache = useProjectStore((state) => state.detailsCache)
  const fetchProjectDetailsCached = useProjectStore((state) => state.fetchProjectDetailsCached)
  const [loading, setLoading] = React.useState(!detailsCache[projectId]?.data)

  React.useEffect(() => {
    let cancelled = false

    if (detailsCache[projectId]?.data) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetchProjectDetailsCached(projectId).then(() => {
      if (!cancelled) {
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [projectId, fetchProjectDetailsCached])

  const details = detailsCache[projectId]?.data

  if (loading) {
    return (
      <div className="p-8 bg-transparent dark:bg-[#0a0a0c]/20 border-t border-gray-100 dark:border-white/[0.02] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <svg className="w-5 h-5 animate-spin text-[#D3FF33]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-semibold tracking-wide">Retrieving site specifications...</span>
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="p-8 bg-transparent dark:bg-[#0a0a0c]/20 border-t border-gray-100 dark:border-white/[0.02] text-center text-gray-500 dark:text-gray-400 text-xs">
        No specification details available for this project.
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden bg-gray-50/30 dark:bg-[#08080a]/30 backdrop-blur-sm border-t border-gray-200/50 dark:border-white/[0.03] p-4 md:p-8 space-y-6 md:space-y-8">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200/50 dark:border-white/[0.03]">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#D3FF33]">
            System Specifications
          </span>
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">
            {details.subProject || "Project Deployment Details"}
          </h3>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {details.lat !== undefined && details.lng !== undefined && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${details.lat},${details.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-[#D3FF33] dark:hover:bg-[#D3FF33] dark:hover:text-black font-bold text-[9px] uppercase tracking-wider rounded-xl transition duration-200 border border-gray-200/50 dark:border-white/5"
            >
              <MapPin className="w-2.5 h-2.5" />
              Maps
            </a>
          )}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono min-w-0">
            <span className="shrink-0">ID:</span>
            <span className="truncate max-w-[120px] sm:max-w-[200px]">{projectId}</span>
          </div>
        </div>
      </div>

      {/* Quick Metrics Inline Bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-1.5">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Capacity</span>
          <span className="text-sm font-extrabold text-gray-900 dark:text-white block mt-0.5">{projectCapacity || details.price} MW</span>
        </div>
        <div className="w-px h-5 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Sub-Projects</span>
          <span className="text-sm font-extrabold text-gray-900 dark:text-white block mt-0.5">{projectSubQty || details.quantity}</span>
        </div>
        <div className="w-px h-5 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Scale</span>
          <span className="text-sm font-extrabold text-gray-900 dark:text-white block mt-0.5">{details.size || "Standard"}</span>
        </div>
        <div className="w-px h-5 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Project Code</span>
          <span className="text-sm font-extrabold text-gray-900 dark:text-white font-mono uppercase block mt-0.5">{details.code || "—"}</span>
        </div>
      </div>

      {/* Forms & Reports Sections Side-by-Side (Replacing Timeline & Technicals) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Deployment Forms */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100 dark:border-white/[0.03]">
            <Building2 className="w-3.5 h-3.5 text-[#D3FF33]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              Deployment Forms
            </h4>
          </div>
          <div className="flex flex-col gap-1">
            {[
              { id: 1, name: "Project Introduction" },
              { id: 2, name: "Operations Log" },
              { id: 3, name: "Clients & Site Issues" },
              { id: 4, name: "Daily Generation" },
              { id: 5, name: "Project Photos" }
            ].map((f) => (
              <Link
                key={f.id}
                href={`/dashboard/projects/${projectId}/forms/${f.id}`}
                className="flex items-center justify-between text-xs font-semibold px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-[#D3FF33] hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl group transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 group-hover:text-[#D3FF33] font-mono text-[10px] w-4">{f.id}.</span>
                  <span>{f.name}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#D3FF33] opacity-40 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Executive Reports */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100 dark:border-white/[0.03]">
            <BarChart3 className="w-3.5 h-3.5 text-[#D3FF33]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              Executive Reports
            </h4>
          </div>
          <div className="flex flex-col gap-1">
            {[
              { id: 1, name: "Monthly Internal Report" },
              { id: 2, name: "Monthly Client Report" },
              { id: 3, name: "Monthly Invoice Register" },
              { id: 4, name: "Site Issues" }
            ].map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/projects/${projectId}/reports/${r.id}`}
                className="flex items-center justify-between text-xs font-semibold px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl group transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 group-hover:text-blue-400 font-mono text-[10px] w-4">{r.id}.</span>
                  <span>{r.name}</span>
                </div>
                <BarChart3 className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-400 opacity-40 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      {details.contacts && details.contacts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-gray-200/50 dark:border-white/[0.03]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#D3FF33]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              Key Contacts
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.contacts.map((contact, idx) => {
              const initials = contact.name ? contact.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "PM"
              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs py-2.5 border-b border-gray-100/50 dark:border-white/[0.02] last:border-0 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h5 className="font-bold text-gray-800 dark:text-white">{contact.name}</h5>
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide block mt-0.5">{contact.type}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-0.5 font-mono text-[10px] pl-10 sm:pl-0">
                    <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-[#D3FF33] transition-colors truncate max-w-[200px]">
                      {contact.email}
                    </a>
                    {contact.cell?.[0] && (
                      <a href={`tel:${contact.cell[0]}`} className="text-gray-500 hover:text-[#D3FF33] transition-colors">
                        {contact.cell[0]}
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
