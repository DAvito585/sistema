import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle" // Import ThemeToggle

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EMI Postgrado",
  description: "Sistema de Gestión de Postgrado EMI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={true}>
          {children}
          <div className="fixed top-6 right-6 z-50">
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
