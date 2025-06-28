"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

interface Blob {
  element: HTMLDivElement
  x: number
  y: number
  size: number
  vx: number
  vy: number
}

export function BlobBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const blobsRef = useRef<Blob[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    // Create blobs
    const createBlobs = () => {
      // Clear existing blobs
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
      blobsRef.current = []

      // Number of blobs based on screen size
      const numBlobs = Math.min(10, Math.max(5, Math.floor((width * height) / 300000)))

      for (let i = 0; i < numBlobs; i++) {
        const blob = document.createElement("div")
        blob.className = "blob"

        const size = Math.random() * 300 + 100
        const x = Math.random() * width
        const y = Math.random() * height

        gsap.set(blob, {
          width: size,
          height: size,
          x: x,
          y: y,
        })

        container.appendChild(blob)

        blobsRef.current.push({
          element: blob,
          x,
          y,
          size,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        })
      }
    }

    // Update blob positions
    const updateBlobs = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      blobsRef.current.forEach((blob) => {
        // Update position
        blob.x += blob.vx
        blob.y += blob.vy

        // Bounce off edges
        if (blob.x < -blob.size / 2) {
          blob.x = -blob.size / 2
          blob.vx *= -1
        } else if (blob.x > width + blob.size / 2) {
          blob.x = width + blob.size / 2
          blob.vx *= -1
        }

        if (blob.y < -blob.size / 2) {
          blob.y = -blob.size / 2
          blob.vy *= -1
        } else if (blob.y > height + blob.size / 2) {
          blob.y = height + blob.size / 2
          blob.vy *= -1
        }

        // Apply position
        gsap.set(blob.element, {
          x: blob.x,
          y: blob.y,
        })
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

  return <div ref={containerRef} className="blob-container"></div>
}

// Named export for compatibility
export { BlobBackground as default }
