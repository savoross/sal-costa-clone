"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useAssetLoader } from "@/hooks/use-asset-loader"

interface RealProgressLoaderProps {
  onComplete?: () => void
  images?: string[]
  fonts?: string[]
  scripts?: string[]
  minLoadTime?: number
}

export function RealProgressLoader({
  onComplete,
  images = [],
  fonts = [],
  scripts = [],
  minLoadTime = 2000,
}: RealProgressLoaderProps) {
  const loadingState = useAssetLoader({
    images,
    fonts,
    scripts,
    minLoadTime,
    onComplete,
  })

  return (
    <AnimatePresence>
      {!loadingState.isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "var(--warm-cream)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center">
            {/* Two refined black rectangles */}
            <div className="flex gap-2 mb-8">
              <motion.div
                className="w-4 h-12 rounded-sm"
                style={{ backgroundColor: "var(--deep-black)" }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: loadingState.progress > 0 ? [0.7, 1.1, 1] : 0,
                  opacity: loadingState.progress > 0 ? [0.8, 1, 0.9] : 0,
                }}
                transition={{
                  duration: 1.8,
                  repeat: loadingState.progress < 100 ? Number.POSITIVE_INFINITY : 0,
                  ease: "easeInOut",
                }}
                style={{ transformOrigin: "bottom" }}
              />
              <motion.div
                className="w-4 h-12 rounded-sm"
                style={{ backgroundColor: "var(--deep-black)" }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: loadingState.progress > 20 ? [0.7, 1.1, 1] : 0,
                  opacity: loadingState.progress > 20 ? [0.8, 1, 0.9] : 0,
                }}
                transition={{
                  duration: 1.8,
                  repeat: loadingState.progress < 100 ? Number.POSITIVE_INFINITY : 0,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                style={{ transformOrigin: "bottom" }}
              />
            </div>

            {/* Refined coral accent line */}
            <motion.div
              className="h-0.5 rounded-full mb-12"
              style={{ backgroundColor: "var(--coral-accent)" }}
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: `${Math.max(16, (loadingState.progress / 100) * 64)}px`,
                opacity: loadingState.progress > 0 ? 0.8 : 0,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />

            {/* Refined progress information */}
            <div className="flex flex-col items-center space-y-4 max-w-xs text-center">
              {/* Minimal progress bar */}
              <motion.div
                className="w-32 h-0.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(26, 22, 18, 0.1)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: "var(--coral-accent)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingState.progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.div>

              {/* Refined percentage display */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.span
                  className="text-lg font-light tabular-nums tracking-wider"
                  style={{
                    color: loadingState.progress === 100 ? "var(--coral-accent)" : "var(--deep-black)",
                    opacity: 0.8,
                  }}
                  animate={{
                    scale: loadingState.progress === 100 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    scale: { duration: 0.3 },
                  }}
                >
                  {Math.floor(loadingState.progress)}%
                </motion.span>
              </motion.div>

              {/* Minimal status text */}
              <motion.div
                className="text-xs tracking-widest uppercase min-h-[1rem]"
                style={{ color: "var(--deep-black)", opacity: 0.5 }}
                key={loadingState.stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                {loadingState.stage}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Named export for compatibility
export { RealProgressLoader as default }
