"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GeometricLoaderProps {
  onComplete?: () => void
  duration?: number
}

export function GeometricLoader({ onComplete, duration = 3000 }: GeometricLoaderProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (duration / 50) // Update every 50ms
        const newProgress = prev + increment

        if (newProgress >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return newProgress
      })
    }, 50)

    // Complete loading
    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onComplete?.()
        }, 500) // Wait for exit animation
      }, 200) // Small delay after reaching 100%
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [duration, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "#F5F2E8" }} // Cream background to match original
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center">
            {/* Two black rectangles */}
            <div className="flex gap-2 mb-4">
              <motion.div
                className="w-6 h-12 bg-black"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1, 1, 0.8, 1],
                  opacity: [0, 1, 1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.7, 1],
                }}
                style={{ originY: 1 }}
              />
              <motion.div
                className="w-6 h-12 bg-black"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1, 1, 0.8, 1],
                  opacity: [0, 1, 1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.3,
                  times: [0, 0.2, 0.5, 0.7, 1],
                }}
                style={{ originY: 1 }}
              />
            </div>

            {/* Coral/red line underneath */}
            <motion.div
              className="h-1 bg-red-400 mb-8"
              initial={{ width: 0 }}
              animate={{
                width: ["0%", "100%", "100%", "50%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                times: [0, 0.3, 0.6, 0.8, 1],
              }}
              style={{ width: "60px" }}
            />

            {/* Progress percentage */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.span
                className="text-2xl font-light text-black/80 tabular-nums"
                key={Math.floor(progress)} // Re-animate when progress changes significantly
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
              >
                {Math.floor(progress)}%
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
