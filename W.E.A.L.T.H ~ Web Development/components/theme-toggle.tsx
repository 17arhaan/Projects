"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
    >
      <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400 transition-all dark:hidden" />
      <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400 transition-all hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

