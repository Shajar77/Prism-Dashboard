import type { ReactNode } from "react"
import { AppSidebar, Logo } from "@/components/app-sidebar"
import { TopNav } from "@/components/TopNav"
import { AuthGuard } from "@/components/AuthGuard"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        {/* Logo hidden on mobile (shown in TopNav instead) */}
        <div className="hidden md:block">
          <Logo />
        </div>
        <AppSidebar />

        {/* TopNav aligned with content */}
        <div className="ml-0 md:ml-32 pt-4 px-4 lg:px-6">
          <TopNav />
        </div>

        <main className="ml-0 md:ml-32 min-h-screen">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
