"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/authStore"

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [validationError, setValidationError] = React.useState("")

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setValidationError("Please enter your email address.")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setValidationError("Please enter a valid email address.")
      return
    }
    if (!password) {
      setValidationError("Please enter your password.")
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const result = login(trimmedEmail, password)
    setIsSubmitting(false)

    if (result.success) {
      toast.success("Welcome back! Logging you in...", {
        duration: 2000,
      })
      router.replace("/dashboard")
    } else {
      setValidationError(result.error || "Authentication failed.")
      toast.error(result.error || "Authentication failed.")
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#030303] text-gray-900 dark:text-gray-100 font-sans select-none selection:bg-[#D3FF33]/30">
      
      {/* LEFT COLUMN: Brand Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#0a0a0c] border-r border-gray-100 dark:border-white/[0.04] p-12 flex-col justify-between relative overflow-hidden">
        {/* Showcase background image */}
        <Image
          src="/pexels-magic-k-24827758-6729421.jpg"
          alt="Showcase background"
          fill
          className="object-cover opacity-35 select-none pointer-events-none"
          priority
        />
        {/* Decorative Grid & Light Blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(211,255,51,0.06),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-[linear-gradient(to_top,rgba(26,102,255,0.04),transparent)]" />
        
        {/* Header Logo */}
        <div className="z-10 flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/Untitled design (8).png"
              alt="Prism Energy Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Prism Energy</span>
        </div>

        {/* Center Graphical Showcase */}
        <div className="z-10 space-y-8 my-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group shadow-2xl"
          >
            {/* SVG Glowing Wave to mimic renewable energy outputs */}
            <div className="h-32 w-full relative mb-4">
              <svg viewBox="0 0 400 120" className="w-full h-full">
                <path
                  d="M0 60 C 50 120, 100 0, 150 60 C 200 120, 250 0, 300 60 C 350 120, 400 60, 450 60"
                  fill="none"
                  stroke="rgba(211, 255, 51, 0.4)"
                  strokeWidth="3.5"
                  className="animate-pulse"
                />
                <path
                  d="M0 60 C 50 100, 100 20, 150 60 C 200 100, 250 20, 300 60 C 350 100, 400 60, 450 60"
                  fill="none"
                  stroke="#1A66FF"
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />
              </svg>
              {/* Overlay Stat details */}
              <div className="absolute bottom-2 left-4 flex gap-4 text-[10px] font-bold text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D3FF33]" /> SOLAR GRID</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1A66FF]" /> WIND FARM</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Plant Capacity Utilization</h3>
              <p className="text-2xl font-semibold text-[#D3FF33]">98.4% <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">Grid Efficiency</span></p>
            </div>
          </motion.div>
        </div>

        {/* Footer Taglines */}
        <div className="z-10 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Prism Energy. All rights reserved.</p>
          <p className="mt-1">Designed for state-of-the-art power monitoring & optimization.</p>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form (Responsive) */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 md:p-12 min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#030303]">
        {/* Small Screen Logo banner */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/Untitled design (8).png"
              alt="Prism Energy Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">Prism Energy</span>
        </div>

        {/* Form Wrap */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] flex flex-col gap-6"
        >
          {/* Headline */}
          <div className="space-y-1 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
              Welcome back
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sign in to manage and monitor your energy assets.
            </p>
          </div>

          {/* Form Box */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Custom Error Banner */}
            {validationError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs px-4 py-3 rounded-xl flex items-start gap-2"
              >
                <svg className="w-4.5 h-4.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{validationError}</span>
              </motion.div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider pl-0.5">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D3FF33] transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  disabled={isSubmitting}
                  className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-[#D3FF33]/50 focus:ring-1 focus:ring-[#D3FF33]/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-0.5">
                <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors">
                  Forgot Password?
                </span>
              </div>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D3FF33] transition-colors">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full bg-white dark:bg-[#0a0a0c] border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:border-[#D3FF33]/50 focus:ring-1 focus:ring-[#D3FF33]/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm dark:shadow-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#D3FF33] text-black hover:bg-[#b8e62c] hover:scale-[1.01] active:scale-[0.99] rounded-xl py-3.5 text-sm font-extrabold shadow-lg shadow-[#D3FF33]/10 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:bg-[#D3FF33] cursor-pointer"
            >
              {isSubmitting ? (
                <svg className="w-5 h-5 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Bottom link to Signup */}
          <p className="text-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#D3FF33] font-bold hover:underline hover:text-[#b8e62c] transition-colors"
            >
              Create an Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
