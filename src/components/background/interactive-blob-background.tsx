"use client"

import { useEffect, useRef, useCallback } from "react"

interface Blob {
  id: number
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
  baseSize: number
  vx: number
  vy: number
  color: string
  opacity: number
  baseOpacity: number
  hue: number
  saturation: number
  lightness: number
  pulsePhase: number
  mouseInfluence: number
}

export function InteractiveBlobBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const blobsRef = useRef<Blob[]>([])
  const animationRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false })
  const lastMouseMoveRef = useRef(0)

  // Optimized mouse tracking with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now()
    if (now - lastMouseMoveRef.current < 16) return // 60fps throttling

    mouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      isMoving: true,
    }
    lastMouseMoveRef.current = now

    // Reset moving state after delay
    setTimeout(() => {
      mouseRef.current.isMoving = false
    }, 100)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    // Enhanced color palettes for light and dark themes
    const lightColors = [
      { h: 350, s: 70, l: 75 }, // Soft pink
      { h: 10, s: 80, l: 70 }, // Coral
      { h: 25, s: 60, l: 80 }, // Peach
      { h: 340, s: 50, l: 85 }, // Light rose
      { h: 15, s: 70, l: 75 }, // Salmon
      { h: 5, s: 60, l: 80 }, // Light coral
    ]

    const darkColors = [
      { h: 350, s: 60, l: 35 }, // Deep pink
      { h: 10, s: 70, l: 40 }, // Deep coral
      { h: 25, s: 50, l: 45 }, // Deep peach
      { h: 340, s: 40, l: 50 }, // Deep rose
      { h: 15, s: 60, l: 35 }, // Deep salmon
      { h: 280, s: 40, l: 40 }, // Purple accent
    ]

    const isDark = document.documentElement.classList.contains("dark")
    const colorPalette = isDark ? darkColors : lightColors

    // Create more diverse blobs
    const createBlobs = () => {
      // Clear existing blobs
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
      blobsRef.current = []

      // More blobs for richer effect
      const numBlobs = Math.min(20, Math.max(12, Math.floor((width * height) / 150000)))

      for (let i = 0; i < numBlobs; i++) {
        const blob = document.createElement("div")
        blob.className = "interactive-blob"

        const baseSize = Math.random() * 350 + 150
        const size = baseSize
        const x = Math.random() * (width + size) - size / 2
        const y = Math.random() * (height + size) - size / 2

        const colorData = colorPalette[Math.floor(Math.random() * colorPalette.length)]
        const baseOpacity = Math.random() * 0.4 + 0.2
        const pulsePhase = Math.random() * Math.PI * 2

        // Enhanced styling with CSS custom properties
        blob.style.width = `${size}px`
        blob.style.height = `${size}px`
        blob.style.position = "absolute"
        blob.style.borderRadius = "50%"
        blob.style.filter = "blur(80px)"
        blob.style.transform = `translate3d(${x}px, ${y}px, 0)`
        blob.style.willChange = "transform, opacity"
        blob.style.pointerEvents = "none"
        blob.style.background = `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`
        blob.style.opacity = baseOpacity.toString()

        container.appendChild(blob)

        blobsRef.current.push({
          id: i,
          x,
          y,
          targetX: x,
          targetY: y,
          size,
          baseSize,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          color: `hsl(${colorData.h}, ${colorData.s}%, ${colorData.l}%)`,
          opacity: baseOpacity,
          baseOpacity,
          hue: colorData.h,
          saturation: colorData.s,
          lightness: colorData.l,
          pulsePhase,
          mouseInfluence: Math.random() * 0.5 + 0.3,
        })
      }
    }

    // Optimized animation loop with RAF
    const updateBlobs = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const mouse = mouseRef.current
      const time = Date.now() * 0.001

      blobsRef.current.forEach((blob, index) => {
        const element = container.children[index] as HTMLElement
        if (!element) return

        // Mouse interaction with distance-based influence
        if (mouse.isMoving) {
          const dx = mouse.x - blob.x
          const dy = mouse.y - blob.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 300

          if (distance < maxDistance) {
            const influence = (1 - distance / maxDistance) * blob.mouseInfluence
            blob.targetX = blob.x + dx * influence * 0.1
            blob.targetY = blob.y + dy * influence * 0.1

            // Size and opacity changes on mouse proximity
            const sizeMultiplier = 1 + influence * 0.3
            blob.size = blob.baseSize * sizeMultiplier
            blob.opacity = Math.min(blob.baseOpacity * (1 + influence * 0.5), 0.8)
          }
        } else {
          // Return to natural movement
          blob.targetX = blob.x + blob.vx
          blob.targetY = blob.y + blob.vy
          blob.size += (blob.baseSize - blob.size) * 0.02
          blob.opacity += (blob.baseOpacity - blob.opacity) * 0.02
        }

        // Smooth movement towards target
        blob.x += (blob.targetX - blob.x) * 0.05
        blob.y += (blob.targetY - blob.y) * 0.05

        // Natural floating movement
        blob.x += blob.vx
        blob.y += blob.vy

        // Pulse effect
        const pulse = Math.sin(time * 2 + blob.pulsePhase) * 0.1 + 1
        const currentSize = blob.size * pulse

        // Color shifting
        const hueShift = Math.sin(time * 0.5 + blob.id) * 10
        const currentHue = blob.hue + hueShift

        // Boundary collision with smooth bounce
        if (blob.x < -currentSize / 2) {
          blob.x = -currentSize / 2
          blob.vx = Math.abs(blob.vx) * 0.8
        } else if (blob.x > width + currentSize / 2) {
          blob.x = width + currentSize / 2
          blob.vx = -Math.abs(blob.vx) * 0.8
        }

        if (blob.y < -currentSize / 2) {
          blob.y = -currentSize / 2
          blob.vy = Math.abs(blob.vy) * 0.8
        } else if (blob.y > height + currentSize / 2) {
          blob.y = height + currentSize / 2
          blob.vy = -Math.abs(blob.vy) * 0.8
        }

        // Add subtle randomness
        blob.vx += (Math.random() - 0.5) * 0.01
        blob.vy += (Math.random() - 0.5) * 0.01

        // Limit velocity
        const maxVel = 1.2
        blob.vx = Math.max(-maxVel, Math.min(maxVel, blob.vx))
        blob.vy = Math.max(-maxVel, Math.min(maxVel, blob.vy))

        // Apply optimized transforms
        element.style.transform = `translate3d(${blob.x}px, ${blob.y}px, 0) scale(${pulse})`
        element.style.background = `hsl(${currentHue}, ${blob.saturation}%, ${blob.lightness}%)`
        element.style.opacity = blob.opacity.toString()
        element.style.width = `${currentSize}px`
        element.style.height = `${currentSize}px`
      })

      animationRef.current = requestAnimationFrame(updateBlobs)
    }

    // Handle resize with debouncing
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        createBlobs()
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        updateBlobs()
      }, 150)
    }

    // Event listeners
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    // Initialize
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      clearTimeout(resizeTimeout)
    }
  }, [handleMouseMove])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 interactive-blob-container"
    />
  )
}

// Named export for compatibility
export { InteractiveBlobBackground as default }
