"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { HardDrive } from "lucide-react"

interface CacheStatus {
  isSupported: boolean
  hasCache: boolean
  estimatedSize: string
}

export function SimpleCacheIndicator() {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    isSupported: false,
    hasCache: false,
    estimatedSize: "0 KB",
  })

  useEffect(() => {
    checkCacheStatus()
  }, [])

  const checkCacheStatus = async () => {
    if (typeof window === "undefined") return

    const isSupported = "caches" in window
    setCacheStatus((prev) => ({ ...prev, isSupported }))

    if (isSupported) {
      try {
        const cacheNames = await caches.keys()
        const hasCache = cacheNames.length > 0

        let totalSize = 0
        if (hasCache) {
          // Rough estimation - just count cache names for simplicity
          totalSize = cacheNames.length * 100 // Rough estimate in KB
        }

        setCacheStatus({
          isSupported: true,
          hasCache,
          estimatedSize: `${totalSize} KB`,
        })
      } catch (error) {
        console.warn("Cache status check failed:", error)
      }
    }
  }

  // Only show in development
  if (process.env.NODE_ENV !== "development" || !cacheStatus.isSupported) {
    return null
  }

  return (
    <motion.div
      className="fixed bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <HardDrive className="w-4 h-4 text-secondary" />
        <div className="text-xs">
          <div className="font-medium">Cache: {cacheStatus.hasCache ? "Active" : "Inactive"}</div>
          {cacheStatus.hasCache && <div className="text-muted-foreground">~{cacheStatus.estimatedSize}</div>}
        </div>
      </div>
    </motion.div>
  )
}

// Named export for compatibility
export { SimpleCacheIndicator as default }
