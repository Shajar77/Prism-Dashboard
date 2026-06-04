import * as React from "react"
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ReferenceLine,
  ResponsiveContainer,
} from "recharts"
import { type DashboardStats } from "@/hooks/useDashboardStats"

function useMounted() {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])
  return mounted
}

// ========================================
// Card 1: Plant Capacity Utilization
// ========================================
export function PlantCapacityUtilizationCard({ stats }: { stats: DashboardStats }) {
  const mounted = useMounted()
  return (
    <div className="rounded-3xl p-4 md:p-5 bg-white dark:bg-[#2A2B2F]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 flex items-center justify-between min-h-[100px]">
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {stats.capacityUtil}%
        </span>
        <span className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">Capacity Utilization</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
          {stats.activeCapacity} / {stats.totalCapacity} MW Active
        </span>
      </div>
      {/* Sparkline now uses live portfolioChart data from stats */}
      <div className="w-24 md:w-28 h-14 md:h-16 ml-3">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.portfolioChart} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#D3FF33" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#D3FF33" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#D3FF33" strokeWidth={2.5} fill="url(#utilGrad)" animationDuration={400} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

// ========================================
// Card 2: Portfolio Sites
// ========================================
export function PortfolioSitesCard({ stats }: { stats: DashboardStats }) {
  const mounted = useMounted()
  return (
    <div className="rounded-3xl p-4 md:p-5 bg-gradient-to-br from-[#D3FF33] to-[#b8e62c] backdrop-blur-md border border-[#D3FF33]/40 flex items-center justify-between min-h-[100px] shadow-lg shadow-[#D3FF33]/10">
      <div className="flex flex-col min-w-0">
        <span className="text-3xl md:text-4xl font-bold tracking-tight text-black">
          {stats.total}
        </span>
        <span className="text-[10px] font-medium text-black/60 uppercase tracking-wider mt-1">Portfolio Sites</span>
        <span className="text-[10px] text-black/50 mt-0.5">{stats.active} Active · {stats.inactive} Inactive</span>
      </div>
      <div className="w-24 md:w-28 h-14 md:h-16 ml-3">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.portfolioChart} margin={{ top: 5, right: 0, bottom: 2, left: 0 }} barCategoryGap="1%">
              <defs>
                <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#000000" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#000000" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <Bar dataKey="v" fill="url(#invGrad)" radius={[2, 2, 0, 0]} barSize={7} animationDuration={300} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

// ========================================
// Card 3: Energy Output (Power Generation)
// ========================================
export function EnergyOutputCard({ stats }: { stats: DashboardStats }) {
  const mounted = useMounted()
  // Show growth badge only when there's actual data; sign prefix included
  const growthLabel = stats.energyGrowthPct > 0 ? `+${stats.energyGrowthPct}%` : `${stats.energyGrowthPct}%`

  return (
    <div className="rounded-3xl p-4 md:p-6 bg-gradient-to-br from-[#1A66FF] to-[#0d52d9] backdrop-blur-md border border-white/20 flex flex-col min-h-[216px] h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-white/80">Renewable Energy Output</p>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-white/10 text-white/50">Est.</span>
          </div>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
              {stats.energyOutput.toLocaleString()} MWh
            </span>
            {stats.total > 0 && (
              <span className="text-xs text-[#D3FF33] bg-[#D3FF33]/10 px-2 py-0.5 rounded-full">
                {growthLabel}
              </span>
            )}
          </div>
        </div>
        {/* Status Donut — shows Performance Index % */}
        <div className="flex flex-col items-center justify-center ml-4">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ v: stats.performanceIndex }, { v: 100 - stats.performanceIndex }]}
                    dataKey="v"
                    innerRadius={28}
                    outerRadius={36}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    paddingAngle={2}
                  >
                    <Cell fill="#FFFFFF" />
                    <Cell fill="rgba(255,255,255,0.15)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm md:text-base font-semibold text-white">{stats.performanceIndex}%</span>
            </div>
          </div>
        </div>
      </div>
      {/* Area Chart — 12-month seasonal energy wave */}
      <div className="h-[100px] w-full mt-4">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.energyOutputChart} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#FFFFFF" stopOpacity={0.30} />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
                <filter id="energyGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <XAxis
                dataKey="m"
                tick={{ fontSize: 9, fill: "rgba(255,255,255,0.45)", fontFamily: "inherit" }}
                axisLine={false}
                tickLine={false}
                interval={1}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.7)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "#fff",
                  padding: "4px 10px",
                }}
                formatter={(v: unknown) => [typeof v === 'number' ? `${v.toLocaleString()} MWh` : `${v}`, "Output"]}
                itemStyle={{ color: "#D3FF33" }}
                cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
              />
              <ReferenceLine
                y={stats.energyOutput}
                stroke="rgba(211,255,51,0.35)"
                strokeDasharray="4 3"
                strokeWidth={1}
              />
              {/* Glow line on top */}
              <Area
                type="monotone"
                dataKey="v"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={4}
                fill="none"
                filter="url(#energyGlow)"
                animationDuration={600}
                dot={false}
              />
              {/* Main crisp line + fill */}
              <Area
                type="monotone"
                dataKey="v"
                stroke="#FFFFFF"
                strokeWidth={2}
                fill="url(#energyFill)"
                animationDuration={600}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

// ========================================
// Card 4: Portfolio Valuation
// ========================================
export function PortfolioValuationCard({ stats }: { stats: DashboardStats }) {
  const mounted = useMounted()
  const growthLabel = stats.valuationGrowthPct > 0 ? `+${stats.valuationGrowthPct}%` : `${stats.valuationGrowthPct}%`

  return (
    <div className="rounded-3xl p-4 md:p-5 bg-white dark:bg-[#2A2B2F]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 flex flex-col min-h-[200px] md:min-h-[250px]">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Portfolio Valuation</p>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500">Est.</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              ${stats.valuation.toLocaleString()}M
            </span>
            <span className="text-xs text-[#D3FF33]">USD</span>
          </div>
        </div>
        {stats.total > 0 && (
          <span className="text-xs text-[#D3FF33] bg-[#D3FF33]/10 px-2 py-1 rounded-full">
            {growthLabel}
          </span>
        )}
      </div>
      {/* Area Chart — compound portfolio growth curve */}
      <div className="h-[120px] w-full mt-4">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.valuationChart} margin={{ top: 5, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="valAreaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#D3FF33" stopOpacity={0.35} />
                  <stop offset="55%" stopColor="#1A66FF" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#1A66FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="valStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"  stopColor="#1A66FF" />
                  <stop offset="100%" stopColor="#D3FF33" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="v"
                hide
              />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "rgba(10,10,10,0.85)",
                  border: "1px solid rgba(211,255,51,0.2)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "#fff",
                  padding: "4px 10px",
                }}
                formatter={(v: unknown) => [typeof v === 'number' ? `$${v.toLocaleString()}M` : `${v}`, "Valuation"]}
                itemStyle={{ color: "#D3FF33" }}
                cursor={{ stroke: "rgba(211,255,51,0.25)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="url(#valStroke)"
                strokeWidth={2.5}
                fill="url(#valAreaFill)"
                animationDuration={600}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
