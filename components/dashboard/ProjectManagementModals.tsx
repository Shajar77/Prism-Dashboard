// components/dashboard/ProjectManagementModals.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/Modal"
import { TextField, SelectField } from "@/components/CustomFormElements"
import { useProjectStore } from "@/stores/projectStore"
import { useUIStore, type FormData } from "@/stores/uiStore"

interface FormErrors {
  title?: string
  capacity?: string
  subProjects?: string
  lat?: string
  lng?: string
  panelQt?: string
  contactEmail?: string
}

function validateForm(formData: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!formData.title.trim()) {
    errors.title = "Project name is required."
  } else if (formData.title.trim().length > 100) {
    errors.title = "Project name must be 100 characters or fewer."
  }
  if (!formData.capacity || formData.capacity <= 0) {
    errors.capacity = "Capacity must be a positive number."
  }
  if (!formData.subProjects || formData.subProjects < 1) {
    errors.subProjects = "Sub-projects count must be at least 1."
  }
  if (formData.lat !== undefined && (isNaN(formData.lat) || formData.lat < -90 || formData.lat > 90)) {
    errors.lat = "Latitude must be between -90 and 90."
  }
  if (formData.lng !== undefined && (isNaN(formData.lng) || formData.lng < -180 || formData.lng > 180)) {
    errors.lng = "Longitude must be between -180 and 180."
  }
  if (formData.panelQt !== undefined && (isNaN(formData.panelQt) || formData.panelQt < 0)) {
    errors.panelQt = "Panel quantity must be a non-negative number."
  }
  if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
    errors.contactEmail = "Please enter a valid email address."
  }
  return errors
}

export function ProjectManagementModals() {
  const addProject = useProjectStore((s) => s.addProject)
  const updateProject = useProjectStore((s) => s.updateProject)
  const deleteProject = useProjectStore((s) => s.deleteProject)

  const isModalOpen = useUIStore((s) => s.isModalOpen)
  const editingProject = useUIStore((s) => s.editingProject)
  const closeModal = useUIStore((s) => s.closeModal)
  const deleteModalOpen = useUIStore((s) => s.deleteModalOpen)
  const projectToDelete = useUIStore((s) => s.projectToDelete)
  const closeDeleteModal = useUIStore((s) => s.closeDeleteModal)
  const formData = useUIStore((s) => s.formData)
  const setFormData = useUIStore((s) => s.setFormData)

  // Errors are only shown after the first save attempt
  const [submitted, setSubmitted] = React.useState(false)
  const errors = submitted ? validateForm(formData) : {}
  const isValid = Object.keys(validateForm(formData)).length === 0

  // Reset submitted state when modal opens/closes
  React.useEffect(() => {
    if (!isModalOpen) setSubmitted(false)
  }, [isModalOpen])

  const handleSave = () => {
    setSubmitted(true)
    if (!isValid) return

    // Split formData into core fields and specs fields
    const {
      title,
      category,
      status,
      capacity,
      subProjects,
      startDate,
      subProject,
      city,
      size,
      code,
      clientBusiness,
      offTakeAgreement,
      cod,
      panel,
      panelQt,
      inverter,
      structure,
      netMetering,
      address,
      lat,
      lng,
      contactName,
      contactEmail,
      contactCell,
    } = formData

    const coreData = { title, category, status, capacity, subProjects }
    const specsData = {
      startDate,
      subProject,
      city,
      size,
      code,
      clientBusiness,
      offTakeAgreement,
      cod,
      panel,
      panelQt,
      inverter,
      structure,
      netMetering,
      address,
      lat,
      lng,
      contacts: contactName || contactEmail || contactCell ? [
        {
          type: "Primary Contact",
          name: contactName,
          email: contactEmail,
          cell: contactCell ? [contactCell] : [],
          landline: [],
          info: "Primary contact listed at project creation",
        }
      ] : [],
    }

    if (editingProject) {
      if (editingProject._id) {
        updateProject(editingProject._id, coreData, specsData)
      }
    } else {
      addProject(coreData, specsData)
    }
    closeModal()
  }

  const confirmDelete = () => {
    if (projectToDelete && projectToDelete._id) {
      deleteProject(projectToDelete._id)
      closeDeleteModal()
    }
  }

  const cancelDelete = () => {
    closeDeleteModal()
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => closeModal()}
        title={editingProject ? "Edit Project" : "Add New Project"}
        description={editingProject ? "Modify the details for this project." : "Fill out the fields to register a new project."}
        className="sm:max-w-3xl"
      >
        <div className="max-h-[68vh] overflow-y-auto px-1 pr-3 -mr-3 space-y-6 pt-2">
          {/* Section 1: Core Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#D3FF33] border-b border-gray-200 dark:border-white/5 pb-1">
              1. Core Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextField
                  label="Project Name"
                  value={formData.title}
                  onChange={(val) => setFormData((prev) => ({ ...prev, title: val }))}
                  placeholder="e.g. Sindh Solar Grid"
                  required
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Technology"
                  value={formData.category}
                  onChange={(val: string) => setFormData((prev) => ({ ...prev, category: val as "Solar" | "Wind" }))}
                  options={[
                    { label: "Solar", value: "Solar" },
                    { label: "Wind", value: "Wind" },
                  ]}
                  required
                />

                <SelectField
                  label="Status"
                  value={formData.status}
                  onChange={(val: string) => setFormData((prev) => ({ ...prev, status: val as "Active" | "Inactive" }))}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                  required
                />
              </div>

              <div>
                <TextField
                  label="Capacity (MW)"
                  type="number"
                  value={formData.capacity.toString()}
                  onChange={(val) => setFormData((prev) => ({ ...prev, capacity: parseFloat(val) || 0 }))}
                  placeholder="e.g. 100"
                  required
                />
                {errors.capacity && (
                  <p className="mt-1 text-xs text-red-500">{errors.capacity}</p>
                )}
              </div>

              <div>
                <TextField
                  label="Sub-projects Count"
                  type="number"
                  value={formData.subProjects.toString()}
                  onChange={(val) => setFormData((prev) => ({ ...prev, subProjects: parseInt(val) || 0 }))}
                  placeholder="e.g. 1"
                  required
                />
                {errors.subProjects && (
                  <p className="mt-1 text-xs text-red-500">{errors.subProjects}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Timeline & Agreements */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#D3FF33] border-b border-gray-200 dark:border-white/5 pb-1">
              2. Timeline & Agreements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Client Business"
                value={formData.clientBusiness}
                onChange={(val) => setFormData((prev) => ({ ...prev, clientBusiness: val }))}
                placeholder="e.g. Commercial Utility"
              />

              <TextField
                label="Project Code"
                value={formData.code}
                onChange={(val) => setFormData((prev) => ({ ...prev, code: val }))}
                placeholder="e.g. PRISM-SL-01"
              />

              <TextField
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(val) => setFormData((prev) => ({ ...prev, startDate: val }))}
              />

              <TextField
                label="Commercial Operation Date (COD)"
                type="date"
                value={formData.cod}
                onChange={(val) => setFormData((prev) => ({ ...prev, cod: val }))}
              />

              <TextField
                label="Offtake Agreement Date"
                type="date"
                value={formData.offTakeAgreement}
                onChange={(val) => setFormData((prev) => ({ ...prev, offTakeAgreement: val }))}
              />

              <SelectField
                label="Net Metering Approved"
                value={formData.netMetering}
                onChange={(val: string) => setFormData((prev) => ({ ...prev, netMetering: val }))}
                options={[
                  { label: "Yes", value: "Yes" },
                  { label: "No", value: "No" },
                  { label: "Pending", value: "Pending" },
                ]}
              />
            </div>
          </div>

          {/* Section 3: Technical Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#D3FF33] border-b border-gray-200 dark:border-white/5 pb-1">
              3. Technical Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="PV Panels Make/Model"
                value={formData.panel}
                onChange={(val) => setFormData((prev) => ({ ...prev, panel: val }))}
                placeholder="e.g. Jinko Tiger Neo 550W"
              />

              <div>
                <TextField
                  label="Panel Quantity"
                  type="number"
                  value={formData.panelQt.toString()}
                  onChange={(val) => setFormData((prev) => ({ ...prev, panelQt: parseInt(val) || 0 }))}
                  placeholder="e.g. 90909"
                />
                {errors.panelQt && (
                  <p className="mt-1 text-xs text-red-500">{errors.panelQt}</p>
                )}
              </div>

              <TextField
                label="Inverter Model"
                value={formData.inverter}
                onChange={(val) => setFormData((prev) => ({ ...prev, inverter: val }))}
                placeholder="e.g. Huawei SUN2000-185KTL"
              />

              <TextField
                label="Mounting Structure"
                value={formData.structure}
                onChange={(val) => setFormData((prev) => ({ ...prev, structure: val }))}
                placeholder="e.g. Fixed Tilt, 10 Degree"
              />

              <TextField
                label="Sub-project Phase"
                value={formData.subProject}
                onChange={(val) => setFormData((prev) => ({ ...prev, subProject: val }))}
                placeholder="e.g. Phase 1 - Generation"
              />

              <TextField
                label="Project Scale/Size"
                value={formData.size}
                onChange={(val) => setFormData((prev) => ({ ...prev, size: val }))}
                placeholder="e.g. 50 MW"
              />
            </div>
          </div>

          {/* Section 4: Location & Geospatial */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#D3FF33] border-b border-gray-200 dark:border-white/5 pb-1">
              4. Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <TextField
                  label="Site Address"
                  value={formData.address}
                  onChange={(val) => setFormData((prev) => ({ ...prev, address: val }))}
                  placeholder="e.g. Plot 42, Wind & Solar Corridor, Jhimpir, Sindh"
                />
              </div>

              <TextField
                label="City"
                value={formData.city}
                onChange={(val) => setFormData((prev) => ({ ...prev, city: val }))}
                placeholder="e.g. Jhimpir"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <TextField
                    label="Latitude"
                    type="number"
                    value={formData.lat.toString()}
                    onChange={(val) => setFormData((prev) => ({ ...prev, lat: parseFloat(val) || 0 }))}
                    placeholder="e.g. 25.0245"
                  />
                  {errors.lat && (
                    <p className="mt-1 text-xs text-red-500">{errors.lat}</p>
                  )}
                </div>

                <div>
                  <TextField
                    label="Longitude"
                    type="number"
                    value={formData.lng.toString()}
                    onChange={(val) => setFormData((prev) => ({ ...prev, lng: parseFloat(val) || 0 }))}
                    placeholder="e.g. 67.9912"
                  />
                  {errors.lng && (
                    <p className="mt-1 text-xs text-red-500">{errors.lng}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Key Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#D3FF33] border-b border-gray-200 dark:border-white/5 pb-1">
              5. Key Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Contact Name"
                value={formData.contactName}
                onChange={(val) => setFormData((prev) => ({ ...prev, contactName: val }))}
                placeholder="e.g. Muhammad Asif"
              />

              <div>
                <TextField
                  label="Contact Email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(val) => setFormData((prev) => ({ ...prev, contactEmail: val }))}
                  placeholder="e.g. asif@mrhammadasif.com"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-xs text-red-500">{errors.contactEmail}</p>
                )}
              </div>

              <TextField
                label="Contact Cell"
                value={formData.contactCell}
                onChange={(val) => setFormData((prev) => ({ ...prev, contactCell: val }))}
                placeholder="e.g. +92-300-1234567"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-6 border-t border-gray-200 dark:border-white/5">
          <Button variant="outline" onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-[#D3FF33] text-black hover:bg-[#b8e62c]">
            Save Project
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={cancelDelete} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-gray-500 dark:text-gray-400">
            Are you sure you want to delete <span className="text-gray-900 dark:text-white font-semibold">{projectToDelete?.title}</span>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
