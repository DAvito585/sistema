"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react" // Removed Globe
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10 bg-transparent">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-600 dark:text-yellow-400 transition-all" />
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem] text-blue-600 dark:text-blue-400 transition-all" />
      default: // Fallback for initial render or if theme is 'system' before cycle
        return <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-600 dark:text-yellow-400 transition-all" />
    }
  }

  const getTooltip = () => {
    switch (theme) {
      case "light":
        return "Modo Claro"
      case "dark":
        return "Modo Oscuro"
      default:
        return "Cambiar tema"
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      title={getTooltip()}
      className="w-10 h-10 border-input hover:bg-accent dark:hover:bg-accent transition-all duration-200 bg-background shadow-lg"
    >
      {getIcon()}
      <span className="sr-only">{getTooltip()}</span>
    </Button>
  )
}
