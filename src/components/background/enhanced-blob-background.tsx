"use client"

import { useEffect, useRef } from "react"

interface Blob {
  id: number
  x: number
  y: number
  size: number
  vx: number
  vy: number
  color: string
  opacity: number
}

export function EnhancedBlobBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const blobsRef = useRef<Blob[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    // Coral/pink color variations for the blobs
    const colors = [
      "rgba(255, 182, 193, 0.4)", // Light pink
      "rgba(255, 160, 160, 0.5)", // Coral pink
      "rgba(255, 192, 203, 0.3)", // Pink
      "rgba(255, 218, 185, 0.4)", // Peach
      "rgba(255, 228, 225, 0.3)", // Misty rose
    ]

    // Create more blobs for a livelier effect
    const createBlobs = () => {
      // Clear existing blobs
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
      blobsRef.current = []

      // More blobs for a livelier effect
      const numBlobs = Math.min(15, Math.max(8, Math.floor((width * height) / 200000)))

      for (let i = 0; i < numBlobs; i++) {
        const blob = document.createElement("div")
        blob.className = "enhanced-blob"

        const size = Math.random() * 400 + 200 // Larger blobs
        const x = Math.random() * (width + size) - size / 2
        const y = Math.random() * (height + size) - size / 2
        const color = colors[Math.floor(Math.random() * colors.length)]
        const opacity = Math.random() * 0.3 + 0.2

        blob.style.width = `${size}px`
        blob.style.height = `${size}px`
        blob.style.background = color
        blob.style.opacity = opacity.toString()
        blob.style.position = "absolute"
        blob.style.borderRadius = "50%"
        blob.style.filter = "blur(60px)"
        blob.style.transform = `translate3d(${x}px, ${y}px, 0)`
        blob.style.willChange = "transform"

        container.appendChild(blob)

        blobsRef.current.push({
          id: i,
          x,
          y,
          size,
          vx: (Math.random() - 0.5) * 0.8, // Slightly faster movement
          vy: (Math.random() - 0.5) * 0.8,
          color,
          opacity,
        })
      }
    }

    // Animate blobs with smoother movement
    const updateBlobs = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      blobsRef.current.forEach((blob, index) => {
        // Update position
        blob.x += blob.vx
        blob.y += blob.vy

        // Smooth bounce off edges
        if (blob.x < -blob.size / 2) {
          blob.x = -blob.size / 2
          blob.vx = Math.abs(blob.vx) * 0.8
        } else if (blob.x > width + blob.size / 2) {
          blob.x = width + blob.size / 2
          blob.vx = -Math.abs(blob.vx) * 0.8
        }

        if (blob.y < -blob.size / 2) {
          blob.y = -blob.size / 2
          blob.vy = Math.abs(blob.vy) * 0.8
        } else if (blob.y > height + blob.size / 2) {
          blob.y = height + blob.size / 2
          blob.vy = -Math.abs(blob.vy) * 0.8
        }

        // Add some randomness to movement
        blob.vx += (Math.random() - 0.5) * 0.02
        blob.vy += (Math.random() - 0.5) * 0.02

        // Limit velocity
        const maxVel = 1
        blob.vx = Math.max(-maxVel, Math.min(maxVel, blob.vx))
        blob.vy = Math.max(-maxVel, Math.min(maxVel, blob.vy))

        // Apply position to DOM element
        const element = container.children[index] as HTMLElement
        if (element) {
          element.style.transform = `translate3d(${blob.x}px, ${blob.y}px, 0)`
        }
      })

      animationRef.current = requestAnimationFrame(updateBlobs)
    }

    // Handle resize
    const handleResize = () => {
      createBlobs()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      updateBlobs()
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ background: "linear-gradient(135deg, #faf8f3 0%, #f7f4ed 100%)" }}
    />
  )
}

// Named export for compatibility
export { EnhancedBlobBackground as default }
