// app/dashboard/projects/[id]/reports/[reportId]/page.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useProjectStore } from "@/stores/projectStore"
import { 
  fetchForm2,
  fetchForm3,
  fetchForm4,
  type Form2Data,
  type Form3Data,
  type Form4Data
} from "@/utils/api"
import { 
  ArrowLeft, Calendar, FileText, Zap, Building2, Eye, ShieldCheck, 
  AlertTriangle, DollarSign, Activity, FileSpreadsheet, BarChart3, 
  Briefcase, CheckCircle2, XCircle
} from "lucide-react"
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts"

interface PageProps {
  params: Promise<{
    id: string
    reportId: string
  }>
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const YEARS = [2023, 2024, 2025, 2026]

export default function ReportDetailsPage({ params }: PageProps) {
  const paramsUnwrapped = React.use(params)
  const projectId = paramsUnwrapped.id
  const reportId = parseInt(paramsUnwrapped.reportId, 10)

  const projects = useProjectStore((s) => s.projects)
  const project = projects.find((p) => p._id === projectId)

  // Selector states
  const [selectedYear, setSelectedYear] = React.useState(2024)
  const [selectedMonth, setSelectedMonth] = React.useState(5) // May

  // Data states
  const [loading, setLoading] = React.useState(true)
  const [form2, setForm2] = React.useState<Form2Data | null>(null)
  const [form3, setForm3] = React.useState<Form3Data | null>(null)
  const [form4, setForm4] = React.useState<Form4Data | null>(null)

  React.useEffect(() => {
    let active = true
    setLoading(true)

    const loadData = async () => {
      try {
        // Most reports need Form 2, 3, and 4 to aggregate data
        const [f2, f3, f4] = await Promise.all([
          fetchForm2(projectId, selectedYear, selectedMonth),
          fetchForm3(projectId, selectedYear, selectedMonth),
          fetchForm4(projectId, selectedYear, selectedMonth)
        ])
        if (active) {
          setForm2(f2)
          setForm3(f3)
          setForm4(f4)
        }
      } catch (err) {
        console.error("Error loading report data sources:", err)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [projectId, selectedYear, selectedMonth])

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

  const reportNames = [
    "Monthly Internal Report",
    "Monthly Client Report",
    "Monthly Invoice Register",
    "Site Issues Register"
  ]

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-[#f8fafc] dark:bg-[#030303] min-h-screen text-gray-900 dark:text-gray-100">
      
      {/* Back & Selectors */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

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
      </div>

      {/* Basic info in one line */}
      <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D3FF33]">Executive Reports</span>
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
            Report: <span className="font-bold text-[#D3FF33]">{reportNames[reportId - 1] || `Report ${reportId}`}</span>
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
            <span className="text-xs font-semibold">Aggregating report data sources...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* REPORT 1: Monthly Internal Report */}
          {reportId === 1 && form2 && form3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Generation Summary */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <Activity className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Production Overview</h4>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Actual Energy Output</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.generationActualUnit.toLocaleString()} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target Budget Output</span>
                      <span className="font-semibold text-gray-500">{form2.generationBudgetUnit.toLocaleString()} kWh</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-50 dark:border-white/[0.02] pt-2">
                      <span className="text-gray-400">Combined Solar Tariff</span>
                      <span className="font-bold text-gray-800 dark:text-white">${form2.combineTariff}/kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Invoice</span>
                      <span className="font-bold text-emerald-500">${form2.invoiceActual.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Operations & Logging */}
                <div className="md:col-span-2 bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <FileText className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Operations & Technical Log</h4>
                  </div>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="font-bold text-gray-400 uppercase text-[9px] block">Technical Operations</span>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{form2.technicalActivities}</p>
                    </div>
                    <div className="border-t border-gray-50 dark:border-white/[0.02] pt-3">
                      <span className="font-bold text-gray-400 uppercase text-[9px] block">General Remarks & Comments</span>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed italic">"{form2.internalComment}"</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Internal Issues & HSE Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Active Issues Summary */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <AlertTriangle className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Logged Site Issues</h4>
                  </div>
                  <div className="space-y-3">
                    {form3.issues && form3.issues.length > 0 ? (
                      form3.issues.map((issue, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-white/[0.02] p-2.5 rounded-xl text-xs space-y-1 border border-gray-100 dark:border-white/5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-800 dark:text-white truncate max-w-[120px]">{issue.issue}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${issue.closedOn ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                              {issue.closedOn ? "Resolved" : "Open"}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 line-clamp-2">{issue.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500 text-xs">No active site issues recorded.</div>
                    )}
                  </div>
                </div>

                {/* Safety Log summary */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <ShieldCheck className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Safety & HSE metrics</h4>
                  </div>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Safety Observations</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.safetyObservations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Safety Inductions</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.safetyInductions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Near Miss Incidents</span>
                      <span className="font-bold text-gray-800 dark:text-white">{form2.nearMiss}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-50 dark:border-white/[0.02] pt-2">
                      <span className="text-gray-400">Safe Man-hours</span>
                      <span className="font-bold text-[#D3FF33]">{form2.safeMenHours.toLocaleString()} hrs</span>
                    </div>
                  </div>
                </div>

                {/* Client Meetings & Status */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                    <Briefcase className="w-4 h-4 text-[#D3FF33]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Client Liaison Summary</h4>
                  </div>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="font-bold text-gray-400 uppercase text-[9px] block">Meeting Notes</span>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{form3.discussion}</p>
                    </div>
                    <div className="border-t border-gray-50 dark:border-white/[0.02] pt-3">
                      <span className="font-bold text-gray-400 uppercase text-[9px] block">Accounts Ledger Remarks</span>
                      <p className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{form3.paymentRemarks}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* REPORT 2: Monthly Client Report */}
          {reportId === 2 && form2 && form4 && (
            <div className="space-y-6">
              
              {/* Top Row: General stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Generation Accomplishments */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Energy Output Summary</span>
                  <div className="space-y-1">
                    <span className="text-3xl font-black text-gray-900 dark:text-white block">
                      {form2.generationActualUnit.toLocaleString()} kWh
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 block">
                      Renewable Energy delivered to PPA grid client.
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Operations running at full grid stability.
                  </span>
                </div>

                {/* Eco & Environmental Savings */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Green Footprint Prevailed</span>
                  <div className="space-y-1.5 text-xs font-semibold">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Carbon Saved</span>
                      <span className="text-gray-800 dark:text-white">{form2.co2Tons} Tons CO2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Equivalent Trees</span>
                      <span className="text-gray-800 dark:text-white">{form2.trees.toLocaleString()} Trees</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Clean Energy Homes</span>
                      <span className="text-gray-800 dark:text-white">{form2.houses} Households</span>
                    </div>
                  </div>
                </div>

                {/* Safety & Man Hours */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">HSE Executive Summary</span>
                  <div className="space-y-1">
                    <span className="text-2xl font-black text-[#D3FF33] flex items-center gap-1.5">
                      <ShieldCheck className="w-6 h-6 text-[#D3FF33]" />
                      Zero Incidents
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 block">
                      Operations log recorded zero safety mishaps across {form2.safeMenHours.toLocaleString()} working hours.
                    </span>
                  </div>
                </div>

              </div>

              {/* Chart section */}
              <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                  <BarChart3 className="w-4 h-4 text-[#D3FF33]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Hourly Solar Generation Output curve</h4>
                </div>
                {(() => {
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
                        generation: Math.round(totalVal / (dayCount || 1))
                      }
                    })
                    .sort((a, b) => a.rawHour - b.rawHour)

                  return (
                    <div className="w-full h-72 pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorGenClient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D3FF33" stopOpacity={0.35}/>
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
                            formatter={(value) => [value ? `${value.toLocaleString()} kWh` : "—", "Delivered Power"]}
                          />
                          <Area type="monotone" dataKey="generation" stroke="#D3FF33" strokeWidth={2} fillOpacity={1} fill="url(#colorGenClient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* REPORT 3: Monthly Invoice Register */}
          {reportId === 3 && form2 && form3 && (
            <div className="space-y-6">
              
              {/* Invoice Summary grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Billing Summary */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Billing Performance</span>
                  <div className="space-y-1">
                    <span className="text-3xl font-black text-gray-900 dark:text-white block">
                      ${form2.invoiceActual.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 block">
                      Total Invoice Registered (Actual Combined solar billing).
                    </span>
                  </div>
                </div>

                {/* Budget variance */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Budgeted Billing Variance</span>
                  <div className="space-y-1">
                    <span className="text-3xl font-black text-gray-500 dark:text-gray-400 block">
                      ${form2.invoiceBudget.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-amber-500 block">
                      Variance: -${(form2.invoiceBudget - form2.invoiceActual).toLocaleString()} (Underbudget)
                    </span>
                  </div>
                </div>

                {/* Ledger status */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-3 shadow-sm flex flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Clearance Status</span>
                  <div className="flex items-center justify-between text-xs pt-1.5">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Payment status:</span>
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      Pending
                    </span>
                  </div>
                </div>

              </div>

              {/* Detailed Invoice Breakdown */}
              <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                  <FileSpreadsheet className="w-4 h-4 text-[#D3FF33]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Invoice Register Ledger Breakdown</h4>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/[0.04] text-gray-400">
                        <th className="py-2.5 font-semibold">Billing Item</th>
                        <th className="py-2.5 font-semibold">Invoice Register ($)</th>
                        <th className="py-2.5 font-semibold">Receipt Registered ($)</th>
                        <th className="py-2.5 font-semibold text-right">Balance Outstanding ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-50 dark:border-white/[0.01]">
                        <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">Sale of Equipment (SOE)</td>
                        <td className="py-3 font-bold">${(form2.invoiceSoe || 0).toLocaleString()}</td>
                        <td className="py-3 text-gray-500">${(form2.invoiceSoe || 0).toLocaleString()}</td>
                        <td className="py-3 text-right font-bold text-gray-500">$0</td>
                      </tr>
                      <tr className="border-b border-gray-50 dark:border-white/[0.01]">
                        <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">Operations & Management (O&M)</td>
                        <td className="py-3 font-bold">${(form2.invoiceOM || 0).toLocaleString()}</td>
                        <td className="py-3 text-gray-500">${(form2.invoiceOM || 0).toLocaleString()}</td>
                        <td className="py-3 text-right font-bold text-gray-500">$0</td>
                      </tr>
                      <tr className="border-b border-gray-50 dark:border-white/[0.01]">
                        <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">Deemed Generation / LD Bonus</td>
                        <td className="py-3 font-bold">${(form2.invoiceDeemed || 0).toLocaleString()}</td>
                        <td className="py-3 text-gray-500">${(form2.receiptDeemed || 0).toLocaleString()}</td>
                        <td className="py-3 text-right font-bold text-gray-500">${((form2.invoiceDeemed || 0) - (form2.receiptDeemed || 0)).toLocaleString()}</td>
                      </tr>
                      <tr className="border-b border-gray-50 dark:border-white/[0.01]">
                        <td className="py-3 font-semibold text-gray-700 dark:text-gray-300">Net Metering Billing Credit</td>
                        <td className="py-3 font-bold">${(form2.invoiceNetMet || 0).toLocaleString()}</td>
                        <td className="py-3 text-gray-500">${(form2.receiptNetMet || 0).toLocaleString()}</td>
                        <td className="py-3 text-right font-bold text-gray-500">${((form2.invoiceNetMet || 0) - (form2.receiptNetMet || 0)).toLocaleString()}</td>
                      </tr>
                      <tr className="border-b border-gray-50 dark:border-white/[0.01] bg-gray-50 dark:bg-white/[0.01] font-bold">
                        <td className="py-3 text-gray-800 dark:text-white">Total Ledger Sum</td>
                        <td className="py-3">${form2.invoiceActual.toLocaleString()}</td>
                        <td className="py-3 text-gray-500">${form2.invoiceActual.toLocaleString()}</td>
                        <td className="py-3 text-right text-emerald-500">$0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {form3.paymentRemarks && (
                  <div className="bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 p-3 rounded-xl mt-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Invoice Remarks</span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{form3.paymentRemarks}"</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* REPORT 4: Site Issues Register */}
          {reportId === 4 && form2 && form3 && (
            <div className="space-y-6">
              
              {/* Summary counters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Total issues */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Total Logged Issues</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">
                      {form3.issues?.length || 0}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">Logged cases</span>
                  </div>
                </div>

                {/* Resolved status */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Resolved Cases</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-500">
                      {form3.issues?.filter(i => i.closedOn).length || 0}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">Cleared cases</span>
                  </div>
                </div>

                {/* Unresolved / Open status */}
                <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block">Active Open Cases</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-red-500">
                      {form3.issues?.filter(i => !i.closedOn).length || 0}
                    </span>
                    <span className="text-xs font-semibold text-red-600">Requiring O&M dispatch</span>
                  </div>
                </div>

              </div>

              {/* Complete issues register */}
              <div className="bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/[0.04]">
                  <AlertTriangle className="w-4 h-4 text-[#D3FF33]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">Site Maintenance Issues Log</h4>
                </div>
                
                {form3.issues && form3.issues.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-white/[0.04] text-gray-400">
                          <th className="py-2.5 font-semibold">Serial</th>
                          <th className="py-2.5 font-semibold">Issue Logged</th>
                          <th className="py-2.5 font-semibold">Logged Since</th>
                          <th className="py-2.5 font-semibold">Description</th>
                          <th className="py-2.5 font-semibold">Action taken / Remarks</th>
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
                                {issue.closedOn ? `Resolved (${formatDate(issue.closedOn)})` : "Active"}
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

        </div>
      )}
    </div>
  )
}
