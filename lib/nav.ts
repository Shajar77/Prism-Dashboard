// lib/nav.ts
// Single source of truth for dashboard navigation items.
// Import this in both app-sidebar.tsx and TopNav.tsx to stay in sync.

import type React from "react"
import {
  LayoutDashboard,
  BarChart2,
  Briefcase,
  Users,
  Settings,
} from "lucide-react"

export interface NavItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  href: string
  label: string
  description: string
}

export const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    href: "/dashboard",
    label: "Overview",
    description: "Overview of your solar & wind energy projects",
  },
  {
    icon: BarChart2,
    href: "/dashboard/lifecycle",
    label: "Lifecycle",
    description: "Track planning, procurement and construction workflows",
  },
  {
    icon: Briefcase,
    href: "/dashboard/projects",
    label: "Projects",
    description: "Project-based energy grid allocations and site management",
  },
  {
    icon: Users,
    href: "/dashboard/team",
    label: "Team",
    description: "Team member responsibilities, roles, and permissions",
  },
  {
    icon: Settings,
    href: "/dashboard/settings",
    label: "Settings",
    description: "Application preferences, notifications, and account settings",
  },
]

/** Returns the nav item matching the current pathname, or undefined. */
export function getActiveNavItem(pathname: string): NavItem | undefined {
  // Exact match for /dashboard, prefix match for sub-routes
  return navItems.find((item) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href)
  )
}
