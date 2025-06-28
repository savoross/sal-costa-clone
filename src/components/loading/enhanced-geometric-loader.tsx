"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedGeometricLoaderProps {
  onComplete?: () => void
  duration?: number
  showProgressBar?: boolean
  showPercentage?: boolean
}

export function EnhancedGeometricLoader({
  onComplete,
  duration = 3000,
  showProgressBar = true,
  showPercentage = true,
}: EnhancedGeometricLoaderProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    // Smooth progress animation with easing
    const startTime = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const rawProgress = Math.min((elapsed / duration) * 100, 100)

      // Easing function for smoother progress
      const easedProgress =
        rawProgress < 50 ? (2 * rawProgress * rawProgress) / 100 : 1 - Math.pow((-2 * rawProgress) / 100 + 2, 3) / 2

      setProgress(easedProgress * 100)

      if (rawProgress < 100) {
        requestAnimationFrame(updateProgress)
      } else {
        setProgress(100)
        setTimeout(() => {
          setIsVisible(false)
          setTimeout(() => {
            onComplete?.()
          }, 500)
        }, 300)
      }
    }

    requestAnimationFrame(updateProgress)
  }, [duration, onComplete])

  // Animate the displayed progress number
  useEffect(() => {
    const animate = () => {
      setDisplayProgress((prev) => {
        const diff = progress - prev
        if (Math.abs(diff) < 0.1) return progress
        return prev + diff * 0.1
      })
    }

    const interval = setInterval(animate, 16) // ~60fps
    return () => clearInterval(interval)
  }, [progress])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "#F5F2E8" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center">
            {/* Two black rectangles */}
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

            {/* Coral/red line underneath */}
            <motion.div
              className="h-1 rounded-full mb-8"
              style={{ backgroundColor: "#e85a4f" }}
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

            {/* Progress Section */}
            <div className="flex flex-col items-center space-y-4">
              {/* Progress Bar */}
              {showProgressBar && (
                <motion.div
                  className="w-32 h-1 bg-black/10 rounded-full overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: "#e85a4f" }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </motion.div>
              )}

              {/* Progress Percentage */}
              {showPercentage && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <motion.span
                    className="text-xl font-light text-black/70 tabular-nums tracking-wider"
                    animate={{
                      scale: progress === 100 ? [1, 1.1, 1] : 1,
                      color: progress === 100 ? "#e85a4f" : "#000000b3",
                    }}
                    transition={{
                      scale: { duration: 0.3 },
                      color: { duration: 0.3 },
                    }}
                  >
                    {Math.floor(displayProgress)}%
                  </motion.span>

                  {/* Loading text */}
                  <motion.div
                    className="text-xs text-black/50 mt-2 tracking-widest uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: progress < 100 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Loading
                  </motion.div>

                  {/* Complete text */}
                  <motion.div
                    className="text-xs text-black/70 mt-2 tracking-widest uppercase"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: progress === 100 ? 1 : 0,
                      scale: progress === 100 ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Complete
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
