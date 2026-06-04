"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { navItems } from "@/lib/nav"

export function Logo() {
  return (
    <div className="fixed left-10 top-8 z-[51]">
      <Image
        src="/Untitled design (8).png"
        alt="Prism Energy Logo"
        width={48}
        height={48}
        className="w-12 h-12 object-contain"
        priority
      />
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 transform z-50 h-auto w-20 bg-white dark:bg-[#111111]/90 backdrop-blur-xl rounded-full shadow-2xl border border-gray-200 dark:border-white/10 py-6 flex-col items-center justify-center gap-4">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            className="relative flex items-center justify-center"
            title={item.label}
          >
            {isActive ? (
              <div className="bg-[#D3FF33] text-black w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(211,255,51,0.3)] transition-all duration-200">
                <item.icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                <item.icon className="w-5 h-5" strokeWidth={2} />
              </div>
            )}
          </Link>
        )
      })}
    </aside>
  )
}

