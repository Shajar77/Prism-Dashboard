import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Prism Energy',
  description: 'Premium Solar & Wind Energy Project Management Dashboard',
  icons: {
    icon: '/Untitled design (8).png',
    shortcut: '/Untitled design (8).png',
    apple: '/Untitled design (8).png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${plusJakartaSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' && <Analytics />}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
