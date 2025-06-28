"use client"

import { ThemeProvider } from "next-themes"
import type React from "react"
import { OfflineIndicator } from "@/components/offline/offline-indicator"
import { SimpleCacheIndicator } from "@/components/cache/simple-cache-indicator"
import { NetworkStatus } from "@/components/offline/network-status"

export function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
      <OfflineIndicator />
      <SimpleCacheIndicator />
      <NetworkStatus />
    </ThemeProvider>
  )
}
