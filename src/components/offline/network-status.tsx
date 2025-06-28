"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Wifi, WifiOff } from "lucide-react"

interface NetworkInfo {
  isOnline: boolean
  connectionType: string
  effectiveType: string
  downlink: number
  rtt: number
}

export function NetworkStatus() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: true,
    connectionType: "unknown",
    effectiveType: "4g",
    downlink: 0,
    rtt: 0,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateNetworkInfo = () => {
      const connection =
        (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      setNetworkInfo({
        isOnline: navigator.onLine,
        connectionType: connection?.type || "unknown",
        effectiveType: connection?.effectiveType || "4g",
        downlink: connection?.downlink || 0,
        rtt: connection?.rtt || 0,
      })
    }

    // Initial check
    updateNetworkInfo()

    // Listen for network changes
    window.addEventListener("online", updateNetworkInfo)
    window.addEventListener("offline", updateNetworkInfo)

    // Listen for connection changes if supported
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener("change", updateNetworkInfo)
    }

    return () => {
      window.removeEventListener("online", updateNetworkInfo)
      window.removeEventListener("offline", updateNetworkInfo)
      if (connection) {
        connection.removeEventListener("change", updateNetworkInfo)
      }
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <motion.div
      className="fixed top-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        {networkInfo.isOnline ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        <div className="text-xs">
          <div className="font-medium">
            {networkInfo.isOnline ? "Online" : "Offline"}
            {networkInfo.isOnline && ` (${networkInfo.effectiveType.toUpperCase()})`}
          </div>
          {networkInfo.isOnline && networkInfo.downlink > 0 && (
            <div className="text-muted-foreground">
              {networkInfo.downlink.toFixed(1)} Mbps • {networkInfo.rtt}ms
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Named export for compatibility
export { NetworkStatus as default }
