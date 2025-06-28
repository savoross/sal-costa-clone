"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useServiceWorker } from "@/hooks/use-service-worker"
import { Wifi, WifiOff, Download, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

export function OfflineIndicator() {
  const { isOnline, updateAvailable, updateServiceWorker, error, isSupported } = useServiceWorker()
  const [showOnlineIndicator, setShowOnlineIndicator] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
    } else if (wasOffline) {
      setShowOnlineIndicator(true)
      const timer = setTimeout(() => {
        setShowOnlineIndicator(false)
        setWasOffline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  return (
    <>
      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">You're offline</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Indicator */}
      <AnimatePresence>
        {showOnlineIndicator && (
          <motion.div
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Back online</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Worker Error Indicator (Development only) */}
      <AnimatePresence>
        {error && process.env.NODE_ENV === "development" && (
          <motion.div
            className="fixed top-16 right-4 z-50 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 max-w-sm"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium">Service Worker Issue</div>
              <div className="text-xs opacity-90">{error}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Available Indicator */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4" />
              <div>
                <p className="text-sm font-medium">Update available</p>
                <p className="text-xs opacity-90">Refresh to get the latest version</p>
              </div>
              <button
                onClick={updateServiceWorker}
                className="ml-2 px-3 py-1 bg-white/20 rounded text-xs font-medium hover:bg-white/30 transition-colors"
                data-cursor-hover
              >
                Update
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Named export for compatibility
export { OfflineIndicator as default }
