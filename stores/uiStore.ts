import { create } from "zustand"
import { type Project, type ProjectDetails } from "@/utils/api"

export interface FormData {
  title: string
  category: "Solar" | "Wind"
  status: "Active" | "Inactive"
  capacity: number
  subProjects: number

  // Form 1 details
  startDate: string
  subProject: string
  city: string
  size: string
  code: string
  clientBusiness: string
  offTakeAgreement: string
  cod: string
  panel: string
  panelQt: number
  inverter: string
  structure: string
  netMetering: string
  address: string
  lat: number
  lng: number
  contactName: string
  contactEmail: string
  contactCell: string
}

interface UIState {
  // Modal State
  isModalOpen: boolean
  editingProject: Project | null
  openAddModal: () => void
  openEditModal: (project: Project, details?: ProjectDetails) => void
  closeModal: () => void

  // Delete Modal State
  deleteModalOpen: boolean
  projectToDelete: Project | null
  openDeleteModal: (project: Project) => void
  closeDeleteModal: () => void

  // Form State
  formData: FormData
  setFormData: (data: Partial<FormData> | ((prev: FormData) => Partial<FormData>)) => void
  resetFormData: () => void
}

const defaultFormData: FormData = {
  title: "",
  category: "Solar",
  status: "Active",
  capacity: 100,
  subProjects: 1,

  startDate: "",
  subProject: "",
  city: "",
  size: "",
  code: "",
  clientBusiness: "",
  offTakeAgreement: "",
  cod: "",
  panel: "",
  panelQt: 0,
  inverter: "",
  structure: "",
  netMetering: "No",
  address: "",
  lat: 0,
  lng: 0,
  contactName: "",
  contactEmail: "",
  contactCell: "",
}

export const useUIStore = create<UIState>()((set) => ({
  // Modal State
  isModalOpen: false,
  editingProject: null,
  openAddModal: () => set({
    isModalOpen: true,
    editingProject: null,
    formData: defaultFormData,
  }),
  openEditModal: (project, details) => set({
    isModalOpen: true,
    editingProject: project,
    formData: {
      title: project.title,
      category: project.category,
      status: project.status,
      capacity: project.capacity || 100,
      subProjects: project.subProjects || 1,

      startDate: details?.startDate || "",
      subProject: details?.subProject || "",
      city: details?.city || "",
      size: details?.size || "",
      code: details?.code || "",
      clientBusiness: details?.clientBusiness || "",
      offTakeAgreement: details?.offTakeAgreement || "",
      cod: details?.cod || "",
      panel: details?.panel || "",
      panelQt: details?.panelQt || 0,
      inverter: details?.inverter || "",
      structure: details?.structure || "",
      netMetering: details?.netMetering || "No",
      address: details?.address || "",
      lat: details?.lat || 0,
      lng: details?.lng || 0,
      contactName: details?.contacts?.[0]?.name || "",
      contactEmail: details?.contacts?.[0]?.email || "",
      contactCell: details?.contacts?.[0]?.cell?.[0] || "",
    },
  }),
  closeModal: () => set({ isModalOpen: false, editingProject: null }),

  // Delete Modal State
  deleteModalOpen: false,
  projectToDelete: null,
  openDeleteModal: (project) => set({ deleteModalOpen: true, projectToDelete: project }),
  closeDeleteModal: () => set({ deleteModalOpen: false, projectToDelete: null }),

  // Form State
  formData: defaultFormData,
  setFormData: (data) => set((state) => {
    const updates = typeof data === "function" ? data(state.formData) : data
    return { formData: { ...state.formData, ...updates } }
  }),
  resetFormData: () => set({ formData: defaultFormData }),
}))
