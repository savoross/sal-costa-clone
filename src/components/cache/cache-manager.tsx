"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trash2, HardDrive, Download } from "lucide-react"

interface CacheInfo {
  size: number
  count: number
  lastUpdated: Date | null
}

export function CacheManager() {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({
    size: 0,
    count: 0,
    lastUpdated: null,
  })
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    updateCacheInfo()
  }, [])

  const updateCacheInfo = async () => {
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys()
        let totalSize = 0
        let totalCount = 0

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()
          totalCount += requests.length

          // Estimate cache size (rough calculation)
          for (const request of requests) {
            const response = await cache.match(request)
            if (response) {
              const blob = await response.blob()
              totalSize += blob.size
            }
          }
        }

        setCacheInfo({
          size: totalSize,
          count: totalCount,
          lastUpdated: new Date(),
        })
      } catch (error) {
        console.error("Failed to get cache info:", error)
      }
    }
  }

  const clearCache = async () => {
    setIsClearing(true)
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((name) => caches.delete(name)))

        // Also clear localStorage and sessionStorage
        localStorage.clear()
        sessionStorage.clear()

        setCacheInfo({
          size: 0,
          count: 0,
          lastUpdated: new Date(),
        })

        // Reload to re-register service worker
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to clear cache:", error)
    } finally {
      setIsClearing(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <motion.div
      className="fixed bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg max-w-xs"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <HardDrive className="w-4 h-4 text-secondary" />
        <h3 className="text-sm font-medium">Cache Status</h3>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Size:</span>
          <span>{formatBytes(cacheInfo.size)}</span>
        </div>
        <div className="flex justify-between">
          <span>Items:</span>
          <span>{cacheInfo.count}</span>
        </div>
        {cacheInfo.lastUpdated && (
          <div className="flex justify-between">
            <span>Updated:</span>
            <span>{cacheInfo.lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={updateCacheInfo}
          className="flex-1 px-2 py-1 bg-secondary/10 hover:bg-secondary/20 rounded text-xs font-medium transition-colors"
          data-cursor-hover
        >
          <Download className="w-3 h-3 inline mr-1" />
          Refresh
        </button>
        <button
          onClick={clearCache}
          disabled={isClearing}
          className="flex-1 px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded text-xs font-medium transition-colors disabled:opacity-50"
          data-cursor-hover
        >
          <Trash2 className="w-3 h-3 inline mr-1" />
          {isClearing ? "Clearing..." : "Clear"}
        </button>
      </div>
    </motion.div>
  )
}
