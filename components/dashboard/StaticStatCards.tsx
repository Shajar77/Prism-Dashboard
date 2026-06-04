"use client"

import * as React from "react"
import { type DashboardStats } from "@/hooks/useDashboardStats"

// ========================================
// Card 5: Performance Index Card
// ========================================
export function PerformanceIndexCard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="rounded-3xl p-4 md:p-5 bg-white dark:bg-white/95 backdrop-blur-md border border-gray-200 dark:border-white/30 flex flex-col min-h-[200px] md:min-h-[250px]">
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-500 mb-1">Performance Index</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-black">
            {stats.performanceIndex}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-400">/100</span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-auto pt-4">
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
          <span>Index Score</span>
          <span>
            {stats.performanceIndex >= 90
              ? "Excellent"
              : stats.performanceIndex >= 70
              ? "Good"
              : "Needs Attention"}
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D3FF33] to-[#a8cc29] rounded-full transition-all duration-1000"
            style={{ width: `${stats.performanceIndex}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          {stats.inactive} {stats.inactive === 1 ? "project" : "projects"} offline or need attention
        </p>
      </div>
    </div>
  )
}

// ========================================
// Card 6: Top Capacity Projects — now driven by live stats data
// ========================================
export function TopCapacityProjectsCard({ stats }: { stats: DashboardStats }) {
  const items = stats.topCapacityProjects

  return (
    <div className="rounded-3xl p-4 md:p-5 bg-white dark:bg-[#2A2B2F]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 flex flex-col min-h-[200px] md:min-h-[250px]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#D3FF33] flex items-center justify-center">
          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-900 dark:text-white font-medium">Top Capacity Projects</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Plant MW capacity</p>
        </div>
      </div>

      {/* Mini horizontal bar chart — live data */}
      <div className="flex-1 flex flex-col justify-center gap-2">
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
            No projects yet
          </p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{item.name}</span>
                <span className="text-[#D3FF33] font-medium">{item.capacity}</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D3FF33] to-[#1A66FF] rounded-full transition-all duration-700"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
