"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X, LogOut } from "lucide-react"
import { navItems, getActiveNavItem } from "@/lib/nav"
import { useAuthStore } from "@/stores/authStore"

export function TopNav() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const initials = React.useMemo(() => {
    if (!user?.name) return "US"
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [user])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  // Dynamic page title & description based on current route
  const activeItem = getActiveNavItem(pathname)
  const pageTitle = activeItem?.label ?? "Dashboard"
  const pageDescription = activeItem?.description ?? "Overview of your solar & wind energy projects"

  return (
    <header className="w-full flex items-center justify-between pb-4 pt-3 border-b border-gray-100 dark:border-white/[0.04] mb-6 gap-4">
      {/* Mobile: Logo only */}
      <div className="flex md:hidden items-center">
        <Image
          src="/Untitled design (8).png"
          alt="Prism Energy Logo"
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
          priority
        />
      </div>

      {/* Desktop: Dynamic page title */}
      <div className="hidden md:flex flex-col min-w-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{pageDescription}</p>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-gray-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}

        {/* Desktop Profile Info & Logout */}
        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10">
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A66FF] to-[#D3FF33] p-[2px] shadow-md shadow-[#1A66FF]/10 shrink-0"
            title={`${user?.name || "User"} (${user?.email || ""})`}
          >
            <div className="w-full h-full bg-white dark:bg-[#111111] rounded-full flex items-center justify-center text-[10px] font-bold text-gray-800 dark:text-gray-200 select-none">
              {initials}
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate max-w-[120px]">{user?.name || "User"}</span>
            <span className="text-[10px] text-gray-500 truncate max-w-[120px]">{user?.email || ""}</span>
          </div>

          <button
            onClick={() => logout()}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 hover:text-red-500 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Hamburger Menu — Mobile only */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Mobile Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-[min(280px,90vw)] bg-white dark:bg-[#111111] z-50 md:hidden shadow-2xl">
            <div className="flex flex-col h-full p-6">
              {/* Close button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Navigation Items — from shared navItems */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                        ? "bg-[#D3FF33] text-black font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                        }`}
                    >
                      <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* User Profile and Logout section in mobile menu */}
              <div className="mt-auto border-t border-gray-100 dark:border-white/[0.04] pt-4 space-y-3">
                {/* Theme Toggle */}
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-4 h-4" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                )}

                {/* Profile Card & LogOut */}
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A66FF] to-[#D3FF33] p-[2px] shadow-sm shrink-0 flex items-center justify-center">
                      <div className="w-full h-full bg-white dark:bg-[#111111] rounded-full flex items-center justify-center text-[10px] font-bold text-gray-800 dark:text-gray-200 select-none">
                        {initials}
                      </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">{user?.name || "User"}</span>
                      <span className="text-[10px] text-gray-500 truncate">{user?.email || ""}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors focus:outline-none shrink-0"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
