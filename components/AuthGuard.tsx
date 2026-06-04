"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/login")
    }
  }, [mounted, isAuthenticated, router])

  // Prevent flashing during server-side rendering or before Zustand hydrates
  if (!mounted || !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#030303]">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-10 h-10 animate-spin text-[#D3FF33]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Verifying session...</span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
