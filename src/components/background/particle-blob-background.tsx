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
  lastParticleTime: number
  particleEmissionRate: number
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  maxOpacity: number
  life: number
  maxLife: number
  hue: number
  saturation: number
  lightness: number
  parentBlobId: number
  rotationSpeed: number
  rotation: number
  trail: { x: number; y: number; opacity: number }[]
}

export function ParticleBlobBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const blobsRef = useRef<Blob[]>([])
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false })
  const lastMouseMoveRef = useRef(0)
  const particleIdCounter = useRef(0)

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

  // Create particle from blob
  const createParticle = useCallback((blob: Blob): Particle => {
    const angle = Math.random() * Math.PI * 2
    const distance = blob.baseSize * 0.3 + Math.random() * blob.baseSize * 0.2
    const speed = Math.random() * 0.8 + 0.2

    return {
      id: particleIdCounter.current++,
      x: blob.x + Math.cos(angle) * distance,
      y: blob.y + Math.sin(angle) * distance,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3,
      vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.3,
      size: Math.random() * 8 + 4,
      opacity: 0,
      maxOpacity: Math.random() * 0.6 + 0.2,
      life: 0,
      maxLife: Math.random() * 3000 + 2000, // 2-5 seconds
      hue: blob.hue + (Math.random() - 0.5) * 30,
      saturation: blob.saturation + (Math.random() - 0.5) * 20,
      lightness: blob.lightness + (Math.random() - 0.5) * 15,
      parentBlobId: blob.id,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      rotation: 0,
      trail: [],
    }
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

    // Create blobs and particle containers
    const createBlobs = () => {
      // Clear existing elements
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
      blobsRef.current = []
      particlesRef.current = []

      // Create blob container
      const blobContainer = document.createElement("div")
      blobContainer.className = "blob-container"
      blobContainer.style.position = "absolute"
      blobContainer.style.inset = "0"
      blobContainer.style.pointerEvents = "none"
      container.appendChild(blobContainer)

      // Create particle container
      const particleContainer = document.createElement("div")
      particleContainer.className = "particle-container"
      particleContainer.style.position = "absolute"
      particleContainer.style.inset = "0"
      particleContainer.style.pointerEvents = "none"
      container.appendChild(particleContainer)

      // Create blobs
      const numBlobs = Math.min(15, Math.max(8, Math.floor((width * height) / 200000)))

      for (let i = 0; i < numBlobs; i++) {
        const blob = document.createElement("div")
        blob.className = "particle-blob"

        const baseSize = Math.random() * 350 + 200
        const size = baseSize
        const x = Math.random() * (width + size) - size / 2
        const y = Math.random() * (height + size) - size / 2

        const colorData = colorPalette[Math.floor(Math.random() * colorPalette.length)]
        const baseOpacity = Math.random() * 0.4 + 0.2
        const pulsePhase = Math.random() * Math.PI * 2

        // Enhanced styling
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

        blobContainer.appendChild(blob)

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
          lastParticleTime: 0,
          particleEmissionRate: Math.random() * 2000 + 1000, // 1-3 seconds between particles
        })
      }
    }

    // Update particles
    const updateParticles = (deltaTime: number) => {
      const particleContainer = container.querySelector(".particle-container") as HTMLElement
      if (!particleContainer) return

      const mouse = mouseRef.current
      const time = Date.now()

      // Update existing particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life += deltaTime

        // Life cycle management
        const lifeRatio = particle.life / particle.maxLife
        if (lifeRatio >= 1) {
          // Remove particle element
          const element = particleContainer.querySelector(`[data-particle-id="${particle.id}"]`)
          if (element) {
            particleContainer.removeChild(element)
          }
          return false
        }

        // Update particle physics
        particle.x += particle.vx
        particle.y += particle.vy

        // Add some gravity and air resistance
        particle.vy += 0.01 // subtle gravity
        particle.vx *= 0.998 // air resistance
        particle.vy *= 0.998

        // Mouse interaction
        if (mouse.isMoving) {
          const dx = mouse.x - particle.x
          const dy = mouse.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            const influence = (1 - distance / maxDistance) * 0.02
            particle.vx += dx * influence
            particle.vy += dy * influence
          }
        }

        // Update opacity based on life cycle
        if (lifeRatio < 0.1) {
          // Fade in
          particle.opacity = (lifeRatio / 0.1) * particle.maxOpacity
        } else if (lifeRatio > 0.8) {
          // Fade out
          particle.opacity = particle.maxOpacity * (1 - (lifeRatio - 0.8) / 0.2)
        } else {
          particle.opacity = particle.maxOpacity
        }

        // Update rotation
        particle.rotation += particle.rotationSpeed

        // Update trail
        particle.trail.unshift({ x: particle.x, y: particle.y, opacity: particle.opacity })
        if (particle.trail.length > 5) {
          particle.trail.pop()
        }

        // Update particle element
        let element = particleContainer.querySelector(`[data-particle-id="${particle.id}"]`) as HTMLElement
        if (!element) {
          element = document.createElement("div")
          element.className = "particle"
          element.setAttribute("data-particle-id", particle.id.toString())
          element.style.position = "absolute"
          element.style.borderRadius = "50%"
          element.style.pointerEvents = "none"
          element.style.willChange = "transform, opacity"
          element.style.filter = "blur(2px)"
          particleContainer.appendChild(element)
        }

        // Apply particle styling
        const currentHue = particle.hue + Math.sin(time * 0.001 + particle.id) * 10
        element.style.width = `${particle.size}px`
        element.style.height = `${particle.size}px`
        element.style.background = `hsl(${currentHue}, ${particle.saturation}%, ${particle.lightness}%)`
        element.style.opacity = particle.opacity.toString()
        element.style.transform = `translate3d(${particle.x - particle.size / 2}px, ${particle.y - particle.size / 2}px, 0) rotate(${particle.rotation}rad)`

        return true
      })
    }

    // Create particles from blobs
    const createParticlesFromBlobs = (currentTime: number) => {
      blobsRef.current.forEach((blob) => {
        if (currentTime - blob.lastParticleTime > blob.particleEmissionRate) {
          // Create 1-3 particles
          const numParticles = Math.floor(Math.random() * 3) + 1
          for (let i = 0; i < numParticles; i++) {
            particlesRef.current.push(createParticle(blob))
          }
          blob.lastParticleTime = currentTime

          // Vary emission rate
          blob.particleEmissionRate = Math.random() * 3000 + 1000
        }
      })

      // Limit total particles for performance
      const maxParticles = 50
      if (particlesRef.current.length > maxParticles) {
        const excess = particlesRef.current.length - maxParticles
        const particleContainer = container.querySelector(".particle-container") as HTMLElement

        // Remove oldest particles
        for (let i = 0; i < excess; i++) {
          const particle = particlesRef.current[i]
          const element = particleContainer?.querySelector(`[data-particle-id="${particle.id}"]`)
          if (element) {
            particleContainer.removeChild(element)
          }
        }
        particlesRef.current = particlesRef.current.slice(excess)
      }
    }

    // Main animation loop
    let lastTime = 0
    const updateBlobs = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      const width = window.innerWidth
      const height = window.innerHeight
      const mouse = mouseRef.current
      const time = currentTime * 0.001

      const blobContainer = container.querySelector(".blob-container") as HTMLElement
      if (!blobContainer) return

      // Update blobs
      blobsRef.current.forEach((blob, index) => {
        const element = blobContainer.children[index] as HTMLElement
        if (!element) return

        // Mouse interaction
        if (mouse.isMoving) {
          const dx = mouse.x - blob.x
          const dy = mouse.y - blob.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 300

          if (distance < maxDistance) {
            const influence = (1 - distance / maxDistance) * blob.mouseInfluence
            blob.targetX = blob.x + dx * influence * 0.1
            blob.targetY = blob.y + dy * influence * 0.1

            // Size and opacity changes
            const sizeMultiplier = 1 + influence * 0.3
            blob.size = blob.baseSize * sizeMultiplier
            blob.opacity = Math.min(blob.baseOpacity * (1 + influence * 0.5), 0.8)

            // Increase particle emission when mouse is near
            if (influence > 0.3 && currentTime - blob.lastParticleTime > 200) {
              particlesRef.current.push(createParticle(blob))
              blob.lastParticleTime = currentTime
            }
          }
        } else {
          // Return to natural movement
          blob.targetX = blob.x + blob.vx
          blob.targetY = blob.y + blob.vy
          blob.size += (blob.baseSize - blob.size) * 0.02
          blob.opacity += (blob.baseOpacity - blob.opacity) * 0.02
        }

        // Smooth movement
        blob.x += (blob.targetX - blob.x) * 0.05
        blob.y += (blob.targetY - blob.y) * 0.05

        // Natural floating
        blob.x += blob.vx
        blob.y += blob.vy

        // Pulse effect
        const pulse = Math.sin(time * 2 + blob.pulsePhase) * 0.1 + 1
        const currentSize = blob.size * pulse

        // Color shifting
        const hueShift = Math.sin(time * 0.5 + blob.id) * 10
        const currentHue = blob.hue + hueShift

        // Boundary collision
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

        // Add randomness
        blob.vx += (Math.random() - 0.5) * 0.01
        blob.vy += (Math.random() - 0.5) * 0.01

        // Limit velocity
        const maxVel = 1.2
        blob.vx = Math.max(-maxVel, Math.min(maxVel, blob.vx))
        blob.vy = Math.max(-maxVel, Math.min(maxVel, blob.vy))

        // Apply transforms
        element.style.transform = `translate3d(${blob.x}px, ${blob.y}px, 0) scale(${pulse})`
        element.style.background = `hsl(${currentHue}, ${blob.saturation}%, ${blob.lightness}%)`
        element.style.opacity = blob.opacity.toString()
        element.style.width = `${currentSize}px`
        element.style.height = `${currentSize}px`
      })

      // Update particles
      updateParticles(deltaTime)

      // Create new particles
      createParticlesFromBlobs(currentTime)

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
        lastTime = 0
        updateBlobs(performance.now())
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
  }, [handleMouseMove, createParticle])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0 particle-blob-container" />
  )
}

// Named export for compatibility
export { ParticleBlobBackground as default }
