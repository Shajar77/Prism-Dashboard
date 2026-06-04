// components/ComingSoonPage.tsx
import Link from "next/link"
import { ArrowLeft, type LucideIcon } from "lucide-react"

interface ComingSoonPageProps {
  title: string
  description: string
  icon: LucideIcon
}

export function ComingSoonPage({ title, description, icon: Icon }: ComingSoonPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:py-6 px-4 lg:px-6">
      <div className="bg-white dark:bg-[#1c1c1e]/80 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-[#D3FF33]/10 border border-[#D3FF33]/20 flex items-center justify-center mb-8">
          <Icon className="w-10 h-10 text-[#D3FF33]" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">{description}</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D3FF33] text-black font-semibold rounded-xl hover:bg-[#b8e62c] transition-all duration-200 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </Link>
      </div>
    </div>
  )
}
