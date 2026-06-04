"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  React.useEffect(() => {
    // Log to console in development; swap for a monitoring service (e.g. Sentry) in production
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Error Card */}
        <div className="bg-white dark:bg-[#1c1c1e]/80 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-8 md:p-10 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h1>

          {/* Message */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            An unexpected error occurred. Your data is safe.
          </p>

          {/* Error detail (dev-friendly) */}
          {error.message && (
            <p className="text-xs font-mono text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-2 mb-8 break-all">
              {error.message}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D3FF33] text-black font-semibold text-sm rounded-xl hover:bg-[#b8e62c] transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
            >
              <LayoutDashboard className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Digest for support */}
        {error.digest && (
          <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
