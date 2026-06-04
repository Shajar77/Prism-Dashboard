// app/dashboard/projects/[id]/forms/[formId]/page.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useProjectStore } from "@/stores/projectStore"
import { 
  fetchProjectDetails, // Form 1
  fetchForm2,
  fetchForm3,
  fetchForm4,
  fetchForm5,
  type ProjectDetails,
  type Form2Data,
  type Form3Data,
  type Form4Data,
  type Form5Data
} from "@/utils/api"
import { 
  ArrowLeft, Calendar, MapPin, ExternalLink, Zap, Layers, 
  Cpu, Maximize2, Building2, Globe2, User, Phone, Mail, 
  Copy, Check, FileText, AlertTriangle, ShieldCheck, Image, BarChart3
} from "lucide-react"
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts"

interface PageProps {
  params: Promise<{
    id: string
    formId: string
  }>
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const YEARS = [2023, 2024, 2025, 2026]

export default function FormDetailsPage({ params }: PageProps) {
  const paramsUnwrapped = React.use(params)
  const projectId = paramsUnwrapped.id
  const formId = parseInt(paramsUnwrapped.formId, 10)

  const projects = useProjectStore((s) => s.projects)
  const project = projects.find((p) => p._id === projectId)

  // Selection states for Forms 2-5
  const [selectedYear, setSelectedYear] = React.useState(2024)
  const [selectedMonth, setSelectedMonth] = React.useState(5) // May

  // Data states
  const [loading, setLoading] = React.useState(true)
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)
  
  const [form1, setForm1] = React.useState<ProjectDetails | null>(null)
  const [form2, setForm2] = React.useState<Form2Data | null>(null)
  const [form3, setForm3] = React.useState<Form3Data | null>(null)
  const [form4, setForm4] = React.useState<Form4Data | null>(null)
  const [form5, setForm5] = React.useState<Form5Data | null>(null)

  const handleCopyEmail = (email: string, index: number) => {
    navigator.clipboard.writeText(email)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  React.useEffect(() => {
    let active = true
    setLoading(true)

    const loadData = async () => {
      try {
        if (formId === 1) {
          const res = await fetchProjectDetails(projectId)
          if (active) setForm1(res)
        } else if (formId === 2) {
          const res = await fetchForm2(projectId, selectedYear, selectedMonth)
          if (active) setForm2(res)
        } else if (formId === 3) {
          const res = await fetchForm3(projectId, selectedYear, selectedMonth)
          if (active) setForm3(res)
        } else if (formId === 4) {
          const res = await fetchForm4(projectId, selectedYear, selectedMonth)
          if (active) setForm4(res)
        } else if (formId === 5) {
          const res = await fetchForm5(projectId, selectedYear, selectedMonth)
          if (active) setForm5(res)
        }
      } catch (err) {
        console.error("Error loading form data:", err)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [projectId, formId, selectedYear, selectedMonth])

  // Helper to format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—"
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    } catch {
      return dateStr
    }
  }

  // Basic project info row items
  const projectTitle = project?.title || "Project Specs"
  const projectCapacity = project?.capacity ? `${project.capacity.toFixed(1)} MW` : "N/A"
  const projectTech = project?.category || "Solar"
  const projectStatus = project?.status || "Active"

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-[#f8fafc] dark:bg-[#030303] min-h-screen text-gray-900 dark:text-gray-100">
      
      {/* Back to dashboard */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {formId > 1 && (
          <div className="flex items-center gap-3 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/5 px-3 py-1.5 rounded-xl shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer text-gray-700 dark:text-gray-300"
            >
              {MONTHS.map((m, idx) => (
                <option key={idx} value={idx + 1} className="dark:bg-[#18181b]">{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer text-gray-700 dark:text-gray-300"
            >
              {YEARS.map((y) => (
                <option key={y} value={y} className="dark:bg-[#18181b]">{y}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Basic info in one line */}
      <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D3FF33]">Project Details</span>
          <span className="text-gray-300 dark:text-white/10">|</span>
          <h2 className="text-sm font-bold text-gray-800 dark:text-white">{projectTitle}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-gray-400" />
            Capacity: <span className="font-bold text-gray-800 dark:text-white">{projectCapacity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-gray-400" />
            Tech: <span className="font-bold text-gray-800 dark:text-white">{projectTech}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${projectStatus === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
            Status: <span className="font-bold text-gray-800 dark:text-white">{projectStatus}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            Viewing: <span className="font-bold text-[#D3FF33]">Form {formId}</span>
          </div>
        </div>
      </div>

      {/* Main loading state */}
      {loading ? (
        <div className="h-96 flex items-center justify-center bg-white dark:bg-[#111113]/50 border border-gray-200 dark:border-white/5 rounded-3xl">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <svg className="w-8 h-8 animate-spin text-[#D3FF33]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs font-semibold">Fetching data from API...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Form 1: Project Introduction */}
          {formId === 1 && form1 && (
            <div className="space-y-6">
              {/* Specs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Identity & Timeline */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <Building2 className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Identity & Timeline</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Client Business</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{form1.clientBusiness || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Start Date</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{formatDate(form1.startDate)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Commercial Operation Date</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{formatDate(form1.cod)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Offtake Agreement</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{formatDate(form1.offTakeAgreement)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-gray-400">Net Metering Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        form1.netMetering?.toLowerCase() === 'yes' || form1.netMetering?.toLowerCase() === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5'
                      }`}>{form1.netMetering || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <Cpu className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Technical details</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">PV Panels</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]" title={form1.panel}>{form1.panel || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Panel Quantity</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{form1.panelQt?.toLocaleString() || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Inverters</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{form1.inverter || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Mounting Structure</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300 truncate max-w-[150px]">{form1.structure || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-gray-400">Sub-project Phase</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{form1.subProject || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Site Location */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200/50 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <MapPin className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Site Location</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Address</span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">{form1.address || "—"}</span>
                    </div>
                    <div className="space-y-0.5 border-t border-gray-50 dark:border-white/[0.02] pt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">City</span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">{form1.city || "—"}</span>
                    </div>
                    {form1.lat !== undefined && form1.lng !== undefined && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-white/[0.02]">
                        <span className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">
                          {form1.lat.toFixed(5)}°N, {form1.lng.toFixed(5)}°E
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${form1.lat},${form1.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#D3FF33] hover:opacity-90 active:scale-95 text-black font-extrabold text-[10px] uppercase rounded-xl transition duration-200"
                        >
                          <MapPin className="w-3 h-3" />
                          Maps
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Stakeholders & Contacts */}
              {form1.contacts && form1.contacts.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D3FF33]" />
                    Project Stakeholders & Key Contacts
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {form1.contacts.map((contact, index) => {
                      const initials = contact.name ? contact.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) : "PM"
                      return (
                        <div key={index} className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D3FF33] to-[#a3cc20] text-black font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {initials}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <h5 className="text-sm font-bold text-gray-900 dark:text-white truncate">{contact.name}</h5>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">{contact.type}</span>
                              {contact.info && <p className="text-xs text-gray-500 pt-1 leading-normal">{contact.info}</p>}
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-100 dark:border-white/[0.04] space-y-2 text-xs">
                            {contact.email && (
                              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                                <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-[#D3FF33] truncate pr-2">
                                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span className="truncate">{contact.email}</span>
                                </a>
                                <button onClick={() => handleCopyEmail(contact.email, index)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md">
                                  {copiedIndex === index ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            )}
                            {contact.cell?.map((phone, pidx) => (
                              <a key={pidx} href={`tel:${phone}`} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-[#D3FF33] font-mono">
                                <Phone className="w-3.5 h-3.5" />
                                {phone}
                              </a>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form 2: Operations Log */}
          {formId === 2 && form2 && (
            <div className="space-y-6">
              {/* Operations Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Generation Actual vs Budget */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Generation (kWh)</span>
                  <div className="space-y-1">
                    <span className="text-2xl font-black text-gray-900 dark:text-white block">
                      {form2.generationActualUnit.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 block">
                      Target: {form2.generationBudgetUnit.toLocaleString()} kWh
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#D3FF33] h-full" 
                      style={{ width: `${Math.min(100, (form2.generationActualUnit / form2.generationBudgetUnit) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-[#D3FF33] block">
                    {((form2.generationActualUnit / form2.generationBudgetUnit) * 100).toFixed(1)}% of Budget Met
                  </span>
                </div>

                {/* Financials */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Financial Performance</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Actual Revenue</span>
                      <span className="font-bold text-emerald-500">${form2.invoiceActual.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Budgeted Revenue</span>
                      <span className="font-semibold text-gray-500 dark:text-gray-400">${form2.invoiceBudget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Solar Tariff</span>
                      <span className="font-bold text-gray-800 dark:text-white">${form2.combineTariff}/kWh</span>
                    </div>
                  </div>
                </div>

                {/* Environmental Benefits */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Eco Metrics</span>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">CO2 Emissions Saved</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.co2Tons} Tons</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Equivalent Coal Saved</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.coalTons} Tons</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Equivalent Trees Planted</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.trees.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Safety Log */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Safety & HSE Record</span>
                  <div className="space-y-1">
                    <span className="text-2xl font-black text-[#D3FF33] flex items-center gap-1.5">
                      <ShieldCheck className="w-6 h-6 text-[#D3FF33]" />
                      {form2.daysOfOMWithoutAnyIncident} Days
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                      Without Incident ({form2.safeMenHours.toLocaleString()} Safe Man-hours)
                    </span>
                  </div>
                </div>

              </div>

              {/* HSE Breakdown & Logs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* HSE Observations & Trainings */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <ShieldCheck className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">HSE Breakdown</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Safety Observations</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.safetyObservations}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Safety Inductions</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.safetyInductions}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">HSE Trainings Conducted</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.hseTrainings}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Job Safety Analysis (JSA)</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.jobSafetyAnalysis}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 dark:border-white/[0.02]">
                      <span className="text-gray-400">Toolbox Talks</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.toolBoxTalks}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-gray-400">Near Miss Incidents</span>
                      <span className={`font-bold ${form2.nearMiss > 0 ? "text-amber-500" : "text-gray-500"}`}>{form2.nearMiss}</span>
                    </div>
                  </div>
                </div>

                {/* Log Text Boxes */}
                <div className="md:col-span-2 bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-5 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <FileText className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Daily Log Summary</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {form2.technicalActivities && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Technical Activities</span>
                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{form2.technicalActivities}</p>
                      </div>
                    )}
                    {form2.oAndMBox && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">O&M Activities</span>
                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{form2.oAndMBox}</p>
                      </div>
                    )}
                    {form2.revenueBox && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">Billing & Revenue Notes</span>
                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{form2.revenueBox}</p>
                      </div>
                    )}
                    {form2.generalBox && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase block">General Operations</span>
                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{form2.generalBox}</p>
                      </div>
                    )}
                  </div>
                  {form2.internalComment && (
                    <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-3 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Internal Comments</span>
                      <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{form2.internalComment}"</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Form 3: Clients & Site Issues */}
          {formId === 3 && form3 && (
            <div className="space-y-6">
              {/* Context Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Background & Remarks */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <Building2 className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Client Info & Discussion</h4>
                  </div>
                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Background Details</span>
                      <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{form3.background}</p>
                    </div>
                    <div className="space-y-1 border-t border-gray-50 dark:border-white/[0.02] pt-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Discussion Summary</span>
                      <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-300">{form3.discussion}</p>
                    </div>
                  </div>
                </div>

                {/* Financial Status */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                      <FileText className="w-4 h-4 text-[#D3FF33]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Payment Schedule Ledger</h4>
                    </div>
                    {/* Month badges */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {form3.paymentStatus.map((status, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl p-2 text-center space-y-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block">{MONTHS[idx].slice(0, 3)}</span>
                          <span className={`inline-block px-1.5 py-0.5 text-[8px] font-black uppercase rounded-md ${
                            status === "Paid" 
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : status === "Pending"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-gray-100 dark:bg-white/5 text-gray-400"
                          }`}>
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {form3.paymentRemarks && (
                    <div className="mt-4 pt-3 border-t border-gray-50 dark:border-white/[0.02] space-y-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Payment Remarks</span>
                      <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{form3.paymentRemarks}"</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Site Issues Register */}
              <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                  <AlertTriangle className="w-4 h-4 text-[#D3FF33]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Active & Resolved Site Issues</h4>
                </div>
                {form3.issues && form3.issues.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-white/[0.04] text-gray-400">
                          <th className="py-2.5 font-semibold">Serial</th>
                          <th className="py-2.5 font-semibold">Issue</th>
                          <th className="py-2.5 font-semibold">Since</th>
                          <th className="py-2.5 font-semibold">Description</th>
                          <th className="py-2.5 font-semibold">Remarks</th>
                          <th className="py-2.5 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {form3.issues.map((issue, idx) => (
                          <tr key={idx} className="border-b border-gray-50 dark:border-white/[0.01] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                            <td className="py-3 font-mono font-bold text-gray-500">{issue.serial}</td>
                            <td className="py-3 font-bold text-gray-800 dark:text-white">{issue.issue}</td>
                            <td className="py-3 text-gray-500">{formatDate(issue.since)}</td>
                            <td className="py-3 text-gray-600 dark:text-gray-300 max-w-[200px] truncate" title={issue.description}>
                              {issue.description}
                            </td>
                            <td className="py-3 text-gray-600 dark:text-gray-300 max-w-[200px] truncate" title={issue.remarks}>
                              {issue.remarks || "—"}
                            </td>
                            <td className="py-3 text-right">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                issue.closedOn 
                                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                                  : "bg-red-500/10 text-red-500 border border-red-500/20"
                              }`}>
                                {issue.closedOn ? `Resolved (${formatDate(issue.closedOn)})` : "Open"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 text-xs">No recorded site issues for this cycle.</div>
                )}
              </div>
            </div>
          )}

          {/* Form 4: Daily Generation Chart */}
          {formId === 4 && form4 && (
            <div className="space-y-6">
              
              {/* Daily Energy Curve */}
              <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                  <BarChart3 className="w-4 h-4 text-[#D3FF33]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Daily Generation Curve (Average Hourly Energy Distribution)</h4>
                </div>
                {/* Aggregate Hourly data for charting */}
                {(() => {
                  // Sum hourly values across all days in the month to show an average curve
                  const hourlyAgg: Record<string, number> = {}
                  let dayCount = 0
                  form4.generationData.forEach((dayData) => {
                    dayCount++
                    Object.entries(dayData.data).forEach(([hour, val]) => {
                      hourlyAgg[hour] = (hourlyAgg[hour] || 0) + val
                    })
                  })

                  const chartData = Object.entries(hourlyAgg)
                    .map(([hourStr, totalVal]) => {
                      const hourNum = parseInt(hourStr.slice(0, 2), 10)
                      const label = String(hourNum > 12 ? hourNum - 12 : hourNum) + (hourNum >= 12 ? " PM" : " AM")
                      return {
                        hour: label,
                        rawHour: hourNum,
                        generation: Math.round(totalVal / (dayCount || 1)) // average in kWh
                      }
                    })
                    .sort((a, b) => a.rawHour - b.rawHour)

                  return (
                    <div className="w-full h-80 pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D3FF33" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#D3FF33" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.15} vertical={false} />
                          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#888888' }} stroke="transparent" />
                          <YAxis tick={{ fontSize: 10, fill: '#888888' }} stroke="transparent" />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
                            labelStyle={{ color: '#888888', fontSize: 10, fontWeight: 'bold' }}
                            itemStyle={{ color: '#fff', fontSize: 12 }}
                            formatter={(value) => [value ? `${value.toLocaleString()} kWh` : "—", "Average Output"]}
                          />
                          <Area type="monotone" dataKey="generation" stroke="#D3FF33" strokeWidth={2} fillOpacity={1} fill="url(#colorGen)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )
                })()}
              </div>

              {/* Day-by-Day Table breakdown */}
              <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                  <FileText className="w-4 h-4 text-[#D3FF33]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Daily Generation Summary List</h4>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/[0.04] text-gray-400">
                        <th className="py-2.5 font-semibold">Day</th>
                        <th className="py-2.5 font-semibold">Total Day Output</th>
                        <th className="py-2.5 font-semibold">Peak Capacity Reached</th>
                        <th className="py-2.5 font-semibold text-right">Inverter/System Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {form4.generationData.map((dayData, idx) => {
                        const dayVals = Object.values(dayData.data)
                        const totalOutput = dayVals.reduce((acc, curr) => acc + curr, 0)
                        const maxOutput = dayVals.length > 0 ? Math.max(...dayVals) : 0
                        
                        // Check if system went offline during day from statusData
                        const dayStatus = form4.statusData.find(s => s.day === dayData.day)
                        const hasOutage = dayStatus ? Object.values(dayStatus.data).includes(0) : false

                        return (
                          <tr key={idx} className="border-b border-gray-50 dark:border-white/[0.01] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.01]">
                            <td className="py-3 font-semibold text-gray-500">Day {dayData.day}</td>
                            <td className="py-3 font-bold text-gray-800 dark:text-white">{totalOutput.toLocaleString()} kWh</td>
                            <td className="py-3 text-gray-600 dark:text-gray-300">{maxOutput.toLocaleString()} kW/hr</td>
                            <td className="py-3 text-right">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                !hasOutage 
                                  ? "bg-emerald-500/10 text-emerald-500" 
                                  : "bg-amber-500/10 text-amber-500"
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${!hasOutage ? "bg-emerald-500" : "bg-amber-500"}`} />
                                {!hasOutage ? "100% Online" : "Degraded / Outage"}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* Form 5: Project Photos */}
          {formId === 5 && form5 && (
            <div className="space-y-6">
              
              {/* Photo grid gallery */}
              <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                  <Image className="w-4 h-4 text-[#D3FF33]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Site Status & Progress Photo Register</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[form5.pic1, form5.pic2, form5.pic3, form5.pic4].map((pic, idx) => {
                    if (!pic || !pic.url) return null
                    return (
                      <div key={idx} className="group overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.01] shadow-sm hover:shadow-md transition duration-300">
                        <div className="relative overflow-hidden aspect-video">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={pic.url} 
                            alt={pic.caption || `Site Photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-[9px] text-[#D3FF33] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                            Photo {idx + 1}
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                            {pic.caption || "No caption provided for this photo."}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  )
}
