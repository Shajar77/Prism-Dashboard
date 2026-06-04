import * as React from "react"
import { type Project } from "@/utils/api"

export interface TopCapacityProject {
  name: string
  capacity: string
  pct: number
}

export interface DashboardStats {
  total: number
  active: number
  inactive: number
  solar: number
  wind: number
  capacityUtil: number
  activeCapacity: number
  totalCapacity: number
  valuation: number
  energyOutput: number
  performanceIndex: number
  // Growth percentages (derived from active portfolio health)
  energyGrowthPct: number
  valuationGrowthPct: number
  // Chart data
  portfolioChart: { v: number }[]
  valuationChart: { v: number }[]
  energyOutputChart: { m: string; v: number }[]
  // Top capacity list (live from projects)
  topCapacityProjects: TopCapacityProject[]
}

export function useDashboardStats(projects: Project[]): DashboardStats {
  return React.useMemo(() => {
    let active = 0
    let inactive = 0
    let solar = 0
    let wind = 0
    let valuation = 0
    let energyOutputRaw = 0
    let totalCapacity = 0
    let activeCapacity = 0

    for (const proj of projects) {
      const capacity = proj.capacity
      const subProjects = proj.subProjects
      // Valuation: capacity × sub-projects × $1.5M per MW (industry rough estimate)
      const projectValue = capacity * subProjects * 1.5

      totalCapacity += capacity

      if (proj.status === "Active") {
        active++
        activeCapacity += capacity
        valuation += projectValue
      } else {
        inactive++
      }

      if (proj.category === "Solar") {
        solar++
        energyOutputRaw += capacity * 150  // ~150 MWh/MW/yr for solar
      } else if (proj.category === "Wind") {
        wind++
        energyOutputRaw += capacity * 220  // ~220 MWh/MW/yr for wind
      }
    }

    const total = projects.length
    const capacityUtil = totalCapacity > 0 ? Math.round((activeCapacity / totalCapacity) * 100) : 0
    const energyOutput = Math.round(energyOutputRaw)
    const performanceIndex = total > 0 ? Math.round((active / total) * 100) : 0

    // Growth percentages: reflect active portfolio health relative to total
    // Energy growth = month-over-month estimate based on active proportion
    const energyGrowthPct = total > 0 ? Math.round((active / total) * 15) : 0
    // Valuation growth = capacity utilisation scaled to a realistic range (0–8%)
    const valuationGrowthPct = totalCapacity > 0
      ? Math.round((activeCapacity / totalCapacity) * 8)
      : 0

    // Chart data derived from project metrics
    const portfolioChart = [
      { v: Math.max(20, solar * 5) },
      { v: Math.max(30, wind * 8) },
      { v: Math.max(25, total * 3) },
      { v: Math.max(40, active * 4) },
      { v: Math.max(35, inactive * 10 || total * 2) },
      { v: Math.max(50, total * 5) },
      { v: Math.max(45, solar * 6) },
      { v: Math.max(60, wind * 7) },
    ]

    // Valuation chart: 8-quarter compounding growth curve ending at current valuation
    // Simulates portfolio appreciation from ~60% of today's value
    const valBase = valuation > 0 ? valuation * 0.60 : 100
    const valGrowthFactors = [1.00, 1.04, 1.09, 1.15, 1.22, 1.30, 1.38, 1.48, 1.55, 1.60]
    const valuationChart = valGrowthFactors.map(f => ({
      v: Math.round(valBase * f),
    }))

    // Seasonal energy multipliers: solar peaks Jun-Aug, wind peaks Nov-Feb
    // Blended multipliers reflect a mixed solar/wind portfolio
    const solarRatio = (solar + wind) > 0 ? solar / (solar + wind) : 0.5
    const windRatio  = 1 - solarRatio
    const solarSeasons = [0.72, 0.78, 0.88, 0.97, 1.05, 1.12, 1.15, 1.10, 1.00, 0.90, 0.80, 0.73]
    const windSeasons  = [1.12, 1.08, 1.00, 0.88, 0.80, 0.72, 0.70, 0.73, 0.85, 0.95, 1.05, 1.14]
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const energyOutputChart = months.map((m, i) => ({
      m,
      v: Math.round(energyOutput * (solarRatio * solarSeasons[i] + windRatio * windSeasons[i])),
    }))

    // Top 4 projects by capacity — sorted descending, live from store
    const getCap = (p: Project) => p.capacity
    const sorted = [...projects].sort((a, b) => getCap(b) - getCap(a))
    const topCapacityProjects: TopCapacityProject[] = sorted.slice(0, 4).map((p) => ({
      name: p.title,
      capacity: `${getCap(p)} MW`,
      pct: getCap(sorted[0]) ? Math.round((getCap(p) / getCap(sorted[0])) * 100) : 0,
    }))

    return {
      total,
      active,
      inactive,
      solar,
      wind,
      capacityUtil: Math.min(capacityUtil, 100),
      activeCapacity,
      totalCapacity,
      valuation,
      energyOutput,
      performanceIndex,
      energyGrowthPct,
      valuationGrowthPct,
      portfolioChart,
      valuationChart,
      energyOutputChart,
      topCapacityProjects,
    }
  }, [projects])
}
