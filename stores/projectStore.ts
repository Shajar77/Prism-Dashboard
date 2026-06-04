import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  fetchProjects,
  fetchProjectDetails,
  createProject,
  updateProjectApi,
  deleteProjectApi,
  type Project,
  type ProjectDetails,
} from "@/utils/api"

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

const mockProjects: Project[] = [
  { id: 1, title: "Quaid-e-Azam Solar Park", category: "Solar", status: "Active", capacity: 100, subProjects: 1 },
  { id: 2, title: "Jhimpir Wind Farm",        category: "Wind",  status: "Active", capacity: 50,  subProjects: 1 },
  { id: 3, title: "Sindh Solar Grid",         category: "Solar", status: "Active", capacity: 150, subProjects: 1 },
  { id: 4, title: "Gharo Wind Power",         category: "Wind",  status: "Active", capacity: 80,  subProjects: 1 },
]

interface CachedDetails {
  data: ProjectDetails
  fetchedAt: number // Unix ms timestamp
  isLocalEdited?: boolean
}

interface ProjectState {
  projects: Project[]
  loading: boolean
  detailsCache: Record<string, CachedDetails>
  fetchProjectsFromApi: () => Promise<void>
  fetchProjectDetailsCached: (projectId: string) => Promise<ProjectDetails>
  addProject: (project: Omit<Project, "id">, details?: Omit<ProjectDetails, "id" | "projectId" | "price" | "quantity" | "description" | "vendor" | "purchaseDate" | "warrantyMonths">) => Promise<void>
  updateProject: (projectId: string, updates: Partial<Project>, detailsUpdates?: Partial<ProjectDetails>) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      loading: false,
      detailsCache: {},

      fetchProjectsFromApi: async () => {
        set({ loading: true })
        try {
          const data = await fetchProjects()
          set({ projects: data.length > 0 ? data : mockProjects, loading: false })
        } catch {
          console.error("Failed to fetch projects from API, falling back to mock data")
          // Only use mock if the store is currently empty (don't overwrite stale cached data)
          const { projects } = get()
          set({ projects: projects.length > 0 ? projects : mockProjects, loading: false })
        }
      },

      fetchProjectDetailsCached: async (projectId: string) => {
        const { detailsCache } = get()
        const cached = detailsCache[projectId]

        // Return cached entry if it exists and is not older than TTL, or was edited locally
        if (cached && (cached.isLocalEdited || Date.now() - cached.fetchedAt < CACHE_TTL_MS)) {
          return cached.data
        }

        // Fetch fresh data (either first load or TTL expired)
        const details = await fetchProjectDetails(projectId)
        set((state) => ({
          detailsCache: {
            ...state.detailsCache,
            [projectId]: { data: details, fetchedAt: Date.now() },
          },
        }))
        return details
      },

      addProject: async (project, details) => {
        let finalId = `local_${Date.now()}`
        try {
          const newProjData = await createProject(project) as { _id?: string }
          if (newProjData?._id) {
            finalId = newProjData._id
          }
          // Re-fetch to get the authoritative list with real IDs from the backend
          const data = await fetchProjects()
          if (data.length > 0) {
            set({ projects: data })
            // Find the added project in the refreshed list by title matching to get backend ID
            const matched = data.find((p) => p.title === project.title)
            if (matched?._id) {
              finalId = matched._id
            }
          } else {
            const { projects } = get()
            const localProj: Project = {
              id: Math.max(0, ...projects.map((p) => p.id)) + 1,
              _id: finalId,
              ...project,
            }
            set({ projects: [localProj, ...projects] })
          }
        } catch {
          console.error("Failed to add project via API — using offline fallback")
          const { projects } = get()
          const localProj: Project = {
            id: Math.max(0, ...projects.map((p) => p.id)) + 1,
            _id: finalId,
            ...project,
          }
          set({ projects: [localProj, ...projects] })
        }

        // Save Form 1 details to local cache
        if (details) {
          const finalDetails: ProjectDetails = {
            ...details,
            id: 1,
            projectId: finalId,
            price: details.panelQt || 0,
            quantity: 1,
            description: details.address || "",
            vendor: details.inverter || "",
            purchaseDate: details.cod || new Date().toISOString().split("T")[0],
            warrantyMonths: 60,
          }
          set((state) => ({
            detailsCache: {
              ...state.detailsCache,
              [finalId]: { data: finalDetails, fetchedAt: Date.now(), isLocalEdited: true },
            },
          }))
        }
      },

      updateProject: async (projectId, updates, detailsUpdates) => {
        // Optimistic update immediately so UI feels fast
        const { projects } = get()
        set({
          projects: projects.map((p) =>
            p._id === projectId ? { ...p, ...updates } : p
          ),
        })

        // Save details updates to cache if provided
        if (detailsUpdates) {
          set((state) => {
            const currentDetails = state.detailsCache[projectId]?.data
            const finalDetails: ProjectDetails = {
              ...(currentDetails || {}),
              ...detailsUpdates,
              id: 1,
              projectId,
              price: detailsUpdates.panelQt ?? currentDetails?.panelQt ?? 0,
              quantity: 1,
              description: detailsUpdates.address ?? currentDetails?.address ?? "",
              vendor: detailsUpdates.inverter ?? currentDetails?.inverter ?? "",
              purchaseDate: detailsUpdates.cod ?? currentDetails?.cod ?? new Date().toISOString().split("T")[0],
              warrantyMonths: 60,
            }
            return {
              detailsCache: {
                ...state.detailsCache,
                [projectId]: { data: finalDetails, fetchedAt: Date.now(), isLocalEdited: true },
              },
            }
          })
        } else {
          // If no details updates and it was not locally edited, we can invalidate to fetch fresh
          set((state) => {
            const cached = state.detailsCache[projectId]
            if (cached && !cached.isLocalEdited) {
              const { [projectId]: _removed, ...rest } = state.detailsCache
              return { detailsCache: rest }
            }
            return {}
          })
        }

        try {
          if (projectId && !projectId.startsWith("local_")) {
            await updateProjectApi(projectId, updates)
          }
        } catch {
          console.error("Failed to update project via API — local state kept")
        }
      },

      deleteProject: async (projectId) => {
        // Optimistic removal
        const { projects } = get()
        set({ projects: projects.filter((p) => p._id !== projectId) })
        // Clear cache entry
        set((state) => {
          const { [projectId]: _removed, ...rest } = state.detailsCache
          return { detailsCache: rest }
        })
        try {
          if (projectId && !projectId.startsWith("local_")) {
            await deleteProjectApi(projectId)
          }
        } catch {
          console.error("Failed to delete project via API — reverting local removal")
          // Rollback: restore the deleted project
          set({ projects })
        }
      },
    }),
    {
      name: "dashboard_projects",
      partialize: (state) => ({
        projects: state.projects,
        detailsCache: state.detailsCache,
      }),
    }
  )
)
