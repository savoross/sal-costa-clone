"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="switch-wrapper" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
      </button>
    )
  }

  return (
    <button
      className="switch-wrapper"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      data-cursor-hover
    >
      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  )
}
