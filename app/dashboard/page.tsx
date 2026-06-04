"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CustomTable, type TableColumn } from "@/components/CustomTable"
import { ProjectManagementModals } from "@/components/dashboard/ProjectManagementModals"

import { type Project } from "@/utils/api"
import { useProjectStore } from "@/stores/projectStore"
import { useUIStore } from "@/stores/uiStore"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { ProjectDetailsPanel } from "@/components/dashboard/ProjectDetailsPanel"
import dynamic from "next/dynamic"
import {
  PerformanceIndexCard,
  TopCapacityProjectsCard,
} from "@/components/dashboard/StaticStatCards"

const PlantCapacityUtilizationCard = dynamic(
  () => import("@/components/dashboard/RechartsStatCards").then((mod) => mod.PlantCapacityUtilizationCard),
  { ssr: false, loading: () => <div className="h-[100px] bg-white dark:bg-[#1c1c1e]/80 border border-gray-200 dark:border-white/10 rounded-3xl animate-pulse" /> }
)
const PortfolioSitesCard = dynamic(
  () => import("@/components/dashboard/RechartsStatCards").then((mod) => mod.PortfolioSitesCard),
  { ssr: false, loading: () => <div className="h-[100px] bg-white dark:bg-[#1c1c1e]/80 border border-gray-200 dark:border-white/10 rounded-3xl animate-pulse" /> }
)
const EnergyOutputCard = dynamic(
  () => import("@/components/dashboard/RechartsStatCards").then((mod) => mod.EnergyOutputCard),
  { ssr: false, loading: () => <div className="lg:col-span-8 h-[216px] bg-white dark:bg-[#1c1c1e]/80 border border-gray-200 dark:border-white/10 rounded-3xl animate-pulse" /> }
)
const PortfolioValuationCard = dynamic(
  () => import("@/components/dashboard/RechartsStatCards").then((mod) => mod.PortfolioValuationCard),
  { ssr: false, loading: () => <div className="lg:col-span-4 h-[200px] md:h-[250px] bg-white dark:bg-[#1c1c1e]/80 border border-gray-200 dark:border-white/10 rounded-3xl animate-pulse" /> }
)

function DashboardPage() {
  // URL State for filters
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const filterCategory = searchParams.get("category") || "All"

  // Update URL params helper
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const setSearchQuery = (query: string) => updateSearchParams({ search: query })
  const setFilterCategory = (category: string) => updateSearchParams({ category })

  // Zustand Stores
  const projects = useProjectStore((s) => s.projects)
  const loading = useProjectStore((s) => s.loading)
  const fetchProjectsFromApi = useProjectStore((s) => s.fetchProjectsFromApi)

  const openAddModal = useUIStore((s) => s.openAddModal)
  const openEditModal = useUIStore((s) => s.openEditModal)
  const openDeleteModal = useUIStore((s) => s.openDeleteModal)

  // Load projects on mount
  React.useEffect(() => {
    fetchProjectsFromApi()
  }, [fetchProjectsFromApi])

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const title = project.title || ""
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "All" || project.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [projects, searchQuery, filterCategory])

  // Dynamic statistics based on projects
  const stats = useDashboardStats(projects)

  const handleEdit = async (project: Project) => {
    try {
      const details = await useProjectStore.getState().fetchProjectDetailsCached(project._id || '')
      openEditModal(project, details)
    } catch (e) {
      console.error("Failed to load project details for editing", e)
      openEditModal(project)
    }
  }

  const columns: TableColumn<Project>[] = [
    { key: "title", label: "Project Name", sortable: true },
    {
      key: "capacity",
      label: "Capacity",
      sortable: true,
      hideOnMobile: true,
      render: (row: Project) => (
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {typeof row.capacity === "number" ? `${row.capacity.toFixed(1)} MW` : row.capacity || "—"}
        </span>
      ),
    },
    {
      key: "subProjects",
      label: "Sub-Projects",
      sortable: true,
      hideOnMobile: true,
      render: (row: Project) => (
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {row.subProjects || 1}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      hideOnMobile: true,
      render: (row: Project) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border w-max whitespace-nowrap ${
            row.status === "Active"
              ? "bg-[#D3FF33]/10 text-[#D3FF33] border-[#D3FF33]/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:py-6 px-4 lg:px-6">
      {/* Top Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
        {/* Left stacked cards — full width on mobile, half on tablet, 4/12 on desktop */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-4">
          <PlantCapacityUtilizationCard stats={stats} />
          <PortfolioSitesCard stats={stats} />
        </div>

        {/* Energy Output — full width on mobile, half on tablet, 8/12 on desktop */}
        <div className="md:col-span-4 lg:col-span-8">
          <EnergyOutputCard stats={stats} />
        </div>
      </div>

      {/* Bottom Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4">
        <div className="md:col-span-3 lg:col-span-4"><PortfolioValuationCard stats={stats} /></div>
        <div className="md:col-span-3 lg:col-span-4"><PerformanceIndexCard stats={stats} /></div>
        <div className="md:col-span-6 lg:col-span-4"><TopCapacityProjectsCard stats={stats} /></div>
      </div>

      {/* Data Area - Search, Filter, Add Button, Table */}
      <div className="mt-4 space-y-4">
        {/* Sleek Controls Container */}
        <div className="bg-white dark:bg-[#1c1c1e]/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl">
          <div className="flex flex-col gap-3">
            {/* Top row: Search and Add button */}
            <div className="flex items-center gap-2">
              {/* Search with icon */}
              <div className="flex-1 min-w-0">
                <div className="relative group">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#D3FF33] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-[#0a0a0a]/80 border border-gray-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D3FF33]/50 focus:ring-1 focus:ring-[#D3FF33]/20 transition-all"
                  />
                </div>
              </div>
              {/* Add Button - Icon only on mobile */}
              <Button
                onClick={openAddModal}
                className="bg-[#D3FF33] text-black hover:bg-[#b8e62c] hover:scale-105 active:scale-95 rounded-xl h-10 w-10 sm:h-11 sm:w-auto sm:px-5 font-semibold shrink-0 transition-all duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline ml-1.5 text-sm">Add Project</span>
              </Button>
            </div>
            {/* Bottom row: Filter */}
            <div className="w-full sm:w-44">
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-[#0a0a0a]/80 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-[#D3FF33]/50 transition-all hover:border-gray-400 dark:hover:border-white/20"
                >
                  <option value="All">All Technologies</option>
                  <option value="Solar">Solar</option>
                  <option value="Wind">Wind</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Centralized Table Component */}
        {loading && projects.length === 0 ? (
          <div className="w-full h-48 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded-3xl bg-gray-100 dark:bg-[#1c1c1e] text-gray-500 dark:text-gray-400">
            Loading projects...
          </div>
        ) : (
          <CustomTable
            data={filteredProjects}
            columns={columns}
            sortable={true}
            pagination={true}
            pageSize={10}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            expandable={true}
            renderExpanded={(row: Project) => (
              <ProjectDetailsPanel 
                projectId={row._id || ''} 
                projectCapacity={row.capacity} 
                projectSubQty={row.subProjects} 
              />
            )}
          />
        )}
      </div>
      {/* Modals Container */}
      <ProjectManagementModals />
    </div>
  )
}

// Wrapper with Suspense for useSearchParams
export default function DashboardPageWrapper() {
  return (
    <React.Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <DashboardPage />
    </React.Suspense>
  )
}
