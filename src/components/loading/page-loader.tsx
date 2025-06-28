"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PageLoaderProps {
  onComplete?: () => void
  duration?: number
  showOnMount?: boolean
}

export function PageLoader({ onComplete, duration = 2500, showOnMount = true }: PageLoaderProps) {
  const [isVisible, setIsVisible] = useState(showOnMount)

  useEffect(() => {
    if (!showOnMount) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 600) // Wait for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onComplete, showOnMount])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center geometric-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center">
            {/* Two black rectangles with staggered animation */}
            <div className="flex gap-3 mb-6">
              <motion.div
                className="w-5 h-14 bg-black rounded-sm"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1.2, 1, 0.9, 1],
                  opacity: [0, 1, 1, 0.8, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
                style={{ transformOrigin: "bottom" }}
              />
              <motion.div
                className="w-5 h-14 bg-black rounded-sm"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1.2, 1, 0.9, 1],
                  opacity: [0, 1, 1, 0.8, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.4,
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
                style={{ transformOrigin: "bottom" }}
              />
            </div>

            {/* Coral/red line underneath with width animation */}
            <motion.div
              className="h-1 loader-accent rounded-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: ["0px", "70px", "70px", "35px", "70px"],
                opacity: [0, 1, 1, 0.7, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                times: [0, 0.3, 0.6, 0.8, 1],
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
