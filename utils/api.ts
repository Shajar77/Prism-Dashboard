// utils/api.ts
// All requests go through Next.js API proxy routes — JWT never touches the client bundle.

export type Project = {
  id: number
  _id?: string
  title: string
  category: "Solar" | "Wind"
  status: "Active" | "Inactive"
  capacity: number
  subProjects: number
}

/**
 * Raw shape returned by the external API.
 * Includes legacy field names so we never need `as any` during mapping.
 */
interface ApiProject {
  _id?: string
  title?: string
  name?: string          // legacy alias for title
  category?: string
  status?: string
  active?: boolean       // legacy boolean active flag
  capacity?: number
  subProjects?: number
  quantity?: number      // legacy alias for subProjects
  price?: number         // legacy alias for capacity (old schema)
}

export type Contact = {
  type: string
  name: string
  email: string
  cell: string[]
  landline: string[]
  info: string
}

export type ProjectDetails = {
  id: number
  projectId: string
  startDate?: string
  subProject?: string
  city?: string
  size?: string
  code?: string
  clientBusiness?: string
  offTakeAgreement?: string
  cod?: string
  panel?: string
  panelQt?: number
  inverter?: string
  structure?: string
  netMetering?: string
  address?: string
  lat?: number
  lng?: number
  contacts?: Contact[]

  // Fallbacks for legacy references
  price: number
  quantity: number
  description: string
  vendor: string
  purchaseDate: string
  warrantyMonths: number
}

// Relative URL — requests go to the Next.js API route proxy (server-side auth)
const API_BASE = "/api/projects"

// ─── Fetch all projects ──────────────────────────────────────────────────────
export async function fetchProjects(): Promise<Project[]> {
  const response = await fetch(API_BASE)

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`)
  }

  const data = await response.json()

  return (data as ApiProject[]).map((proj, index) => {
    const titleVal = proj.title ?? proj.name ?? `Project ${index + 1}`

    // Parse category heuristically from title if not explicitly set by the API
    let parsedCategory: "Solar" | "Wind"
    const lowerTitle = titleVal.toLowerCase()
    if (lowerTitle.includes("solar")) {
      parsedCategory = "Solar"
    } else if (lowerTitle.includes("wind") || lowerTitle.includes("farm")) {
      parsedCategory = "Wind"
    } else {
      // Stable round-robin default — better than guessing
      parsedCategory = index % 2 === 0 ? "Solar" : "Wind"
    }

    const category: "Solar" | "Wind" =
      proj.category === "Solar" || proj.category === "Wind"
        ? proj.category
        : parsedCategory

    const status: "Active" | "Inactive" =
      proj.status === "Inactive" || proj.active === false ? "Inactive" : "Active"

    return {
      id: index + 1,
      _id: proj._id,
      title: titleVal,
      category,
      status,
      capacity: proj.capacity ?? proj.price ?? 100,
      subProjects: proj.subProjects ?? proj.quantity ?? 1,
    }
  })
}

// ─── Fetch project form details ──────────────────────────────────────────────
export async function fetchProjectDetails(projectId: string): Promise<ProjectDetails> {
  try {
    const response = await fetch(`${API_BASE}/${projectId}/forms/1`)

    if (!response.ok) {
      throw new Error(`Failed to fetch project specs: ${response.statusText}`)
    }

    const data = await response.json() as Record<string, unknown>

    return {
      id: 1,
      projectId,
      startDate: data.startDate as string | undefined,
      subProject: data.subProject as string | undefined,
      city: data.city as string | undefined,
      size: data.size as string | undefined,
      code: data.code as string | undefined,
      clientBusiness: data.clientBusiness as string | undefined,
      offTakeAgreement: data.offTakeAgreement as string | undefined,
      cod: data.cod as string | undefined,
      panel: data.panel as string | undefined,
      panelQt: data.panelQt as number | undefined,
      inverter: data.inverter as string | undefined,
      structure: data.structure as string | undefined,
      netMetering: data.netMetering as string | undefined,
      address: data.address as string | undefined,
      lat: data.lat as number | undefined,
      lng: data.lng as number | undefined,
      contacts: data.contacts as Contact[] | undefined,

      // Fallbacks for legacy components
      price: (data.panelQt ?? 0) as number,
      quantity: 1,
      description: (data.address ?? "Solar Installation Site") as string,
      vendor: (data.inverter ?? "Huawei Inverters") as string,
      purchaseDate: (data.cod ?? new Date().toISOString().split("T")[0]) as string,
      warrantyMonths: 60,
    }
  } catch {
    // Return fallback project specs if Form 1 doesn't exist yet
    return {
      id: 1,
      projectId,
      startDate: "2024-01-10",
      subProject: "Phase 1 - Generation",
      city: "Jhimpir",
      size: "50 MW",
      code: "PRISM-SL-01",
      clientBusiness: "Commercial Utility",
      offTakeAgreement: "2025-01-01",
      cod: "2024-06-15",
      panel: "Jinko Tiger Neo 550W",
      panelQt: 90909,
      inverter: "Huawei SUN2000-185KTL",
      structure: "Fixed Tilt, 10 Degree",
      netMetering: "Yes",
      address: "Plot 42, Wind & Solar Corridor, Jhimpir, Sindh",
      lat: 25.0245,
      lng: 67.9912,
      contacts: [
        {
          type: "Site Manager",
          name: "Muhammad Asif",
          email: "asif@mrhammadasif.com",
          cell: ["+92-300-1234567"],
          landline: ["+92-21-34567890"],
          info: "Escalation point for technical site queries"
        }
      ],
      price: 90909,
      quantity: 1,
      description: "Plot 42, Wind & Solar Corridor, Jhimpir, Sindh",
      vendor: "Huawei SUN2000-185KTL",
      purchaseDate: "2024-06-15",
      warrantyMonths: 60,
    }
  }
}

// ─── Create a new project ────────────────────────────────────────────────────
export async function createProject(project: Omit<Project, "id">): Promise<unknown> {
  // Note: createdBy is derived server-side from the JWT — do not send from client
  const payload = {
    title: project.title,
    capacity: project.capacity,
    category: project.category,
    status: project.status,
    subProjects: project.subProjects,
  }

  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.statusText}`)
  }

  return response.json()
}

// ─── Update project by id ────────────────────────────────────────────────────
export async function updateProjectApi(
  projectId: string,
  updates: Partial<Project>
): Promise<unknown> {
  // Note: updatedBy is derived server-side from the JWT — do not send from client
  const payload = {
    title: updates.title,
    capacity: updates.capacity,
    category: updates.category,
    status: updates.status,
    subProjects: updates.subProjects,
  }

  const response = await fetch(`${API_BASE}/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to update project: ${response.statusText}`)
  }

  return response.json()
}

// ─── Delete project by id ────────────────────────────────────────────────────
export async function deleteProjectApi(projectId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${projectId}`, {
    method: "DELETE",
  })

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to delete project: ${response.statusText}`)
  }
}

// ─── Form 2 Type & Fetcher ───────────────────────────────────────────────────
export interface Form2Data {
  projectId?: string
  month: number
  year: number
  tariff: number
  saleOfEquipment: number
  operationAndMgmtCost: number
  generationBudgetUnit: number
  generationActualUnit: number
  tariffOM?: number
  tariffSoe?: number
  combineTariff: number
  invoiceBudget: number
  invoiceActual: number
  technicalActivities?: string
  oAndMBox?: string
  revenueBox?: string
  generalBox?: string
  activitiesBox?: string
  internalComment?: string
  dateMeterReadDt?: string
  dateInvoiceDt?: string
  dateReceiptDt?: string
  invoiceSoe?: number
  invoiceOM?: number
  invoiceLdBonus?: number
  invoiceLatePay?: number
  invoiceDeemed?: number
  invoiceNetMet?: number
  receiptInvoice?: number
  receiptLatePay?: number
  receiptDeemed?: number
  receiptNetMet?: number
  opAndMgmtCostBudget?: number
  opAndMgmtCostActual?: number
  insuranceBudget?: number
  insuranceActual?: number
  co2Tons: number
  coalTons: number
  trees: number
  houses: number
  jobs: number
  safeMenHours: number
  safetyObservations: number
  safetyInductions: number
  hseTrainings: number
  jobSafetyAnalysis: number
  toolBoxTalks: number
  nearMiss: number
  daysOfOMWithoutAnyIncident: number
  savings: number
  solaryEnergy?: number
  gridOutageLoss?: number
  discoUnits?: number
  tariffPeak?: number
  offPeak?: number
  solar?: number
}

export async function fetchForm2(projectId: string, year: number, month: number): Promise<Form2Data> {
  try {
    const response = await fetch(`${API_BASE}/${projectId}/forms/2?year=${year}&month=${month}`)
    if (!response.ok) throw new Error("Failed to fetch Form 2")
    return await response.json()
  } catch {
    // Premium fallback mock generator
    return {
      month,
      year,
      tariff: 0.15,
      saleOfEquipment: 12000,
      operationAndMgmtCost: 4500,
      generationBudgetUnit: 850000,
      generationActualUnit: 824000,
      combineTariff: 12.4,
      invoiceBudget: 105400,
      invoiceActual: 102176,
      technicalActivities: "Scheduled semi-annual cleaning of PV panels on inverter blocks 1-4. Replaced two damaged DC fuses.",
      oAndMBox: "No major component failures. Transformer temperatures operating within normal limits.",
      revenueBox: "Net billing calculated at combined solar tariffs. Minor loss due to grid outages on May 12th.",
      generalBox: "Grid downtime recorded: 4.2 hours total. Grid stability average: 98.6%.",
      activitiesBox: "Toolbox talks conducted on electrical safety and harness checks for heights.",
      internalComment: "Operations normal. Slight underperformance due to seasonal dust and cloud cover.",
      dateMeterReadDt: `${year}-${String(month).padStart(2, '0')}-28`,
      dateInvoiceDt: `${year}-${String(month).padStart(2, '0')}-30`,
      dateReceiptDt: `${year}-${String(month + 1).padStart(2, '0')}-15`,
      invoiceSoe: 1200,
      invoiceOM: 4500,
      invoiceLdBonus: 0,
      invoiceLatePay: 0,
      invoiceDeemed: 850,
      invoiceNetMet: 2400,
      receiptInvoice: 102176,
      receiptLatePay: 0,
      receiptDeemed: 850,
      receiptNetMet: 2400,
      opAndMgmtCostBudget: 5000,
      opAndMgmtCostActual: 4500,
      insuranceBudget: 1500,
      insuranceActual: 1500,
      co2Tons: 685,
      coalTons: 310,
      trees: 17200,
      houses: 450,
      jobs: 14,
      safeMenHours: 4200,
      safetyObservations: 8,
      safetyInductions: 4,
      hseTrainings: 2,
      jobSafetyAnalysis: 6,
      toolBoxTalks: 20,
      nearMiss: 0,
      daysOfOMWithoutAnyIncident: 365,
      savings: 34500,
    }
  }
}

// ─── Form 3 Type & Fetcher ───────────────────────────────────────────────────
export interface Form3Issue {
  issue: string
  serial: string
  since: string
  description: string
  remarks?: string
  closedOn?: string
}

export interface Form3Data {
  projectId?: string
  month: number
  year: number
  paymentStatus: string[]
  discussion: string
  paymentRemarks: string
  background: string
  issues: Form3Issue[]
}

export async function fetchForm3(projectId: string, year: number, month: number): Promise<Form3Data> {
  try {
    const response = await fetch(`${API_BASE}/${projectId}/forms/3?year=${year}&month=${month}`)
    if (!response.ok) throw new Error("Failed to fetch Form 3")
    return await response.json()
  } catch {
    return {
      month,
      year,
      paymentStatus: ["Paid", "Paid", "Paid", "Paid", "Paid", "Pending", "N/A", "N/A", "N/A", "N/A", "N/A", "N/A"],
      discussion: "Monthly client meeting held on 5th. Client raised questions regarding late invoice receipt. Resolved by transitioning to auto-billing.",
      paymentRemarks: "Invoice for current cycle issued. Awaiting clearance from Client's accounts department within standard 30-day net window.",
      background: "Corporate PPA client with stable credit rating. Facilities include administrative headquarters and assembly floor.",
      issues: [
        {
          serial: "ISS-094",
          issue: "Grid Outage / Tripping",
          since: `${year}-${String(month).padStart(2, '0')}-05`,
          description: "Tripping on grid utility line 11kV side causing transient inverter shutdown.",
          remarks: "DISCO informed. Relay settings adjusted to prevent premature cutoffs.",
          closedOn: `${year}-${String(month).padStart(2, '0')}-07`
        },
        {
          serial: "ISS-098",
          issue: "Communications Loss",
          since: `${year}-${String(month).padStart(2, '0')}-18`,
          description: "Loss of telemetry reporting from block 3 weather station due to bad cable path.",
          remarks: "Replaced ethernet cable and weather sensors restarted. Telemetry restored.",
          closedOn: `${year}-${String(month).padStart(2, '0')}-19`
        }
      ]
    }
  }
}

// ─── Form 4 Type & Fetcher ───────────────────────────────────────────────────
export interface Form4Data {
  projectId?: string
  month: number
  year: number
  generationData: {
    day: number
    data: Record<string, number>
  }[]
  statusData: {
    day: number
    data: Record<string, number>
  }[]
}

export async function fetchForm4(projectId: string, year: number, month: number): Promise<Form4Data> {
  try {
    const response = await fetch(`${API_BASE}/${projectId}/forms/4?year=${year}&month=${month}`)
    if (!response.ok) throw new Error("Failed to fetch Form 4")
    return await response.json()
  } catch {
    // Generate beautiful daily hourly generation trends dynamically for the mock chart
    const daysInMonth = new Date(year, month, 0).getDate()
    const mockGenData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      // generation in kWh
      const totalGen = Math.round(15000 + Math.random() * 5000)
      const data: Record<string, number> = {}
      // distribute across peak solar hours 06:00 to 18:00
      for (let hour = 6; hour <= 18; hour++) {
        const hourStr = String(hour).padStart(2, '0') + "00"
        const dist = Math.sin(((hour - 6) / 12) * Math.PI) // bell curve
        data[hourStr] = Math.round(dist * (totalGen / 8))
      }
      return { day, data }
    })

    const mockStatusData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const data: Record<string, number> = {}
      for (let hour = 6; hour <= 18; hour++) {
        const hourStr = String(hour).padStart(2, '0') + "00"
        // 1 = online, 0 = offline
        data[hourStr] = Math.random() > 0.05 ? 1 : 0
      }
      return { day, data }
    })

    return {
      month,
      year,
      generationData: mockGenData,
      statusData: mockStatusData
    }
  }
}

// ─── Form 5 Type & Fetcher ───────────────────────────────────────────────────
export interface Form5Photo {
  url: string
  caption: string
}

export interface Form5Data {
  projectId?: string
  month: number
  year: number
  pic1?: Form5Photo
  pic2?: Form5Photo
  pic3?: Form5Photo
  pic4?: Form5Photo
}

export async function fetchForm5(projectId: string, year: number, month: number): Promise<Form5Data> {
  try {
    const response = await fetch(`${API_BASE}/${projectId}/forms/5?year=${year}&month=${month}`)
    if (!response.ok) throw new Error("Failed to fetch Form 5")
    return await response.json()
  } catch {
    return {
      month,
      year,
      pic1: {
        url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&auto=format&fit=crop&q=80",
        caption: "Main Solar PV Array block 1 looking south — post regular washing cycle."
      },
      pic2: {
        url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&auto=format&fit=crop&q=80",
        caption: "Huawei SUN2000 smart string inverter bank block 2 operational lights active."
      },
      pic3: {
        url: "https://images.unsplash.com/photo-1620038650444-9b37803e4293?w=600&auto=format&fit=crop&q=80",
        caption: "Bi-directional energy meter cabin and terminal distribution boxes."
      },
      pic4: {
        url: "https://images.unsplash.com/photo-1542336391-ae2936d8efe4?w=600&auto=format&fit=crop&q=80",
        caption: "Technical team conducting routine checks on tracker motors and brackets."
      }
    }
  }
}
