"use client"

import { useEffect, useRef, useCallback } from "react"

interface WebGLParticleBackgroundProps {
  maxParticles?: number
  maxBlobs?: number
}

export function WebGLParticleBackground({ maxParticles = 2000, maxBlobs = 15 }: WebGLParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGL2RenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const blobProgramRef = useRef<WebGLProgram | null>(null)
  const animationRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false })
  const lastMouseMoveRef = useRef(0)

  // WebGL state
  const particleBufferRef = useRef<WebGLBuffer | null>(null)
  const blobBufferRef = useRef<WebGLBuffer | null>(null)
  const particleVAORef = useRef<WebGLVertexArrayObject | null>(null)
  const blobVAORef = useRef<WebGLVertexArrayObject | null>(null)

  // Particle data arrays
  const particleDataRef = useRef<Float32Array>(new Float32Array(maxParticles * 8)) // x, y, vx, vy, life, maxLife, size, hue
  const blobDataRef = useRef<Float32Array>(new Float32Array(maxBlobs * 10)) // x, y, vx, vy, size, hue, saturation, lightness, opacity, pulsePhase
  const activeParticlesRef = useRef(0)
  const activeBlobsRef = useRef(0)

  // Vertex shader for particles
  const particleVertexShader = `#version 300 es
    precision highp float;
    
    layout(location = 0) in vec2 a_position;
    layout(location = 1) in vec2 a_particlePos;
    layout(location = 2) in vec2 a_velocity;
    layout(location = 3) in float a_life;
    layout(location = 4) in float a_maxLife;
    layout(location = 5) in float a_size;
    layout(location = 6) in float a_hue;
    
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform bool u_mouseActive;
    
    out float v_life;
    out float v_maxLife;
    out float v_hue;
    out vec2 v_center;
    
    void main() {
      float lifeRatio = a_life / a_maxLife;
      
      // Calculate opacity based on life cycle
      float opacity = 1.0;
      if (lifeRatio < 0.1) {
        opacity = lifeRatio / 0.1;
      } else if (lifeRatio > 0.8) {
        opacity = 1.0 - (lifeRatio - 0.8) / 0.2;
      }
      
      // Pulsing effect
      float pulse = 1.0 + sin(u_time * 3.0 + a_hue * 0.1) * 0.2;
      float size = a_size * pulse * opacity;
      
      // Convert to clip space
      vec2 clipSpace = ((a_particlePos + a_position * size) / u_resolution) * 2.0 - 1.0;
      clipSpace.y *= -1.0;
      
      gl_Position = vec4(clipSpace, 0.0, 1.0);
      
      v_life = a_life;
      v_maxLife = a_maxLife;
      v_hue = a_hue;
      v_center = a_position;
    }
  `

  // Fragment shader for particles
  const particleFragmentShader = `#version 300 es
    precision highp float;
    
    in float v_life;
    in float v_maxLife;
    in float v_hue;
    in vec2 v_center;
    
    uniform float u_time;
    uniform bool u_isDark;
    
    out vec4 fragColor;
    
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      float dist = length(v_center);
      if (dist > 1.0) discard;
      
      float lifeRatio = v_life / v_maxLife;
      
      // Calculate opacity
      float opacity = 1.0;
      if (lifeRatio < 0.1) {
        opacity = lifeRatio / 0.1;
      } else if (lifeRatio > 0.8) {
        opacity = 1.0 - (lifeRatio - 0.8) / 0.2;
      }
      
      // Soft circular gradient
      float alpha = (1.0 - dist) * opacity * 0.8;
      
      // Color based on theme
      float saturation = u_isDark ? 0.7 : 0.6;
      float lightness = u_isDark ? 0.4 : 0.7;
      
      // Slight hue variation over time
      float hue = (v_hue + u_time * 10.0) / 360.0;
      vec3 color = hsv2rgb(vec3(hue, saturation, lightness));
      
      // Add glow effect
      float glow = exp(-dist * 3.0) * 0.3;
      alpha += glow;
      
      fragColor = vec4(color, alpha);
    }
  `

  // Vertex shader for blobs
  const blobVertexShader = `#version 300 es
    precision highp float;
    
    layout(location = 0) in vec2 a_position;
    layout(location = 1) in vec2 a_blobPos;
    layout(location = 2) in float a_size;
    layout(location = 3) in float a_hue;
    layout(location = 4) in float a_saturation;
    layout(location = 5) in float a_lightness;
    layout(location = 6) in float a_opacity;
    layout(location = 7) in float a_pulsePhase;
    
    uniform vec2 u_resolution;
    uniform float u_time;
    
    out float v_hue;
    out float v_saturation;
    out float v_lightness;
    out float v_opacity;
    out vec2 v_center;
    
    void main() {
      // Pulsing effect
      float pulse = 1.0 + sin(u_time * 2.0 + a_pulsePhase) * 0.1;
      float size = a_size * pulse;
      
      // Convert to clip space
      vec2 clipSpace = ((a_blobPos + a_position * size) / u_resolution) * 2.0 - 1.0;
      clipSpace.y *= -1.0;
      
      gl_Position = vec4(clipSpace, 0.0, 1.0);
      
      v_hue = a_hue;
      v_saturation = a_saturation;
      v_lightness = a_lightness;
      v_opacity = a_opacity;
      v_center = a_position;
    }
  `

  // Fragment shader for blobs
  const blobFragmentShader = `#version 300 es
    precision highp float;
    
    in float v_hue;
    in float v_saturation;
    in float v_lightness;
    in float v_opacity;
    in vec2 v_center;
    
    uniform float u_time;
    
    out vec4 fragColor;
    
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    void main() {
      float dist = length(v_center);
      if (dist > 1.0) discard;
      
      // Soft blob with heavy blur effect simulation
      float alpha = exp(-dist * 1.5) * v_opacity;
      
      // Color shifting over time
      float hue = (v_hue + sin(u_time * 0.5) * 10.0) / 360.0;
      vec3 color = hsv2rgb(vec3(hue, v_saturation / 100.0, v_lightness / 100.0));
      
      fragColor = vec4(color, alpha);
    }
  `

  // Create shader
  const createShader = useCallback((gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type)
    if (!shader) return null

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }, [])

  // Create program
  const createProgram = useCallback(
    (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
      const program = gl.createProgram()
      if (!program) return null

      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking error:", gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }

      return program
    },
    [],
  )

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    })

    if (!gl) {
      console.warn("WebGL2 not supported, falling back to DOM particles")
      return false
    }

    glRef.current = gl

    // Enable blending for transparency
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Create shaders and programs
    const particleVertShader = createShader(gl, gl.VERTEX_SHADER, particleVertexShader)
    const particleFragShader = createShader(gl, gl.FRAGMENT_SHADER, particleFragmentShader)
    const blobVertShader = createShader(gl, gl.VERTEX_SHADER, blobVertexShader)
    const blobFragShader = createShader(gl, gl.FRAGMENT_SHADER, blobFragmentShader)

    if (!particleVertShader || !particleFragShader || !blobVertShader || !blobFragShader) {
      return false
    }

    const particleProgram = createProgram(gl, particleVertShader, particleFragShader)
    const blobProgram = createProgram(gl, blobVertShader, blobFragShader)

    if (!particleProgram || !blobProgram) {
      return false
    }

    programRef.current = particleProgram
    blobProgramRef.current = blobProgram

    // Create quad geometry for instancing
    const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1])

    // Create particle VAO
    const particleVAO = gl.createVertexArray()
    gl.bindVertexArray(particleVAO)

    const quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    // Create particle instance buffer
    const particleBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, particleDataRef.current, gl.DYNAMIC_DRAW)

    // Setup instance attributes
    for (let i = 0; i < 6; i++) {
      gl.enableVertexAttribArray(i + 1)
      gl.vertexAttribPointer(i + 1, i === 2 ? 2 : 1, gl.FLOAT, false, 8 * 4, i * 4)
      gl.vertexAttribDivisor(i + 1, 1)
    }

    particleBufferRef.current = particleBuffer
    particleVAORef.current = particleVAO

    // Create blob VAO
    const blobVAO = gl.createVertexArray()
    gl.bindVertexArray(blobVAO)

    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    // Create blob instance buffer
    const blobBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, blobBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, blobDataRef.current, gl.DYNAMIC_DRAW)

    // Setup blob instance attributes
    for (let i = 0; i < 8; i++) {
      gl.enableVertexAttribArray(i + 1)
      gl.vertexAttribPointer(i + 1, i === 0 ? 2 : 1, gl.FLOAT, false, 10 * 4, i * 4)
      gl.vertexAttribDivisor(i + 1, 1)
    }

    blobBufferRef.current = blobBuffer
    blobVAORef.current = blobVAO

    gl.bindVertexArray(null)

    return true
  }, [createShader, createProgram])

  // Initialize blobs
  const initBlobs = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight

    // Enhanced color palettes
    const lightColors = [
      { h: 350, s: 70, l: 75 },
      { h: 10, s: 80, l: 70 },
      { h: 25, s: 60, l: 80 },
      { h: 340, s: 50, l: 85 },
      { h: 15, s: 70, l: 75 },
      { h: 5, s: 60, l: 80 },
    ]

    const darkColors = [
      { h: 350, s: 60, l: 35 },
      { h: 10, s: 70, l: 40 },
      { h: 25, s: 50, l: 45 },
      { h: 340, s: 40, l: 50 },
      { h: 15, s: 60, l: 35 },
      { h: 280, s: 40, l: 40 },
    ]

    const isDark = document.documentElement.classList.contains("dark")
    const colorPalette = isDark ? darkColors : lightColors

    const numBlobs = Math.min(maxBlobs, Math.max(8, Math.floor((width * height) / 200000)))
    activeBlobsRef.current = numBlobs

    for (let i = 0; i < numBlobs; i++) {
      const colorData = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      const baseSize = Math.random() * 200 + 150
      const x = Math.random() * (width + baseSize) - baseSize / 2
      const y = Math.random() * (height + baseSize) - baseSize / 2

      const offset = i * 10
      blobDataRef.current[offset] = x // x
      blobDataRef.current[offset + 1] = y // y
      blobDataRef.current[offset + 2] = (Math.random() - 0.5) * 0.6 // vx
      blobDataRef.current[offset + 3] = (Math.random() - 0.5) * 0.6 // vy
      blobDataRef.current[offset + 4] = baseSize // size
      blobDataRef.current[offset + 5] = colorData.h // hue
      blobDataRef.current[offset + 6] = colorData.s // saturation
      blobDataRef.current[offset + 7] = colorData.l // lightness
      blobDataRef.current[offset + 8] = Math.random() * 0.4 + 0.2 // opacity
      blobDataRef.current[offset + 9] = Math.random() * Math.PI * 2 // pulsePhase
    }
  }, [maxBlobs])

  // Create particle
  const createParticle = useCallback(
    (blobIndex: number) => {
      if (activeParticlesRef.current >= maxParticles) return

      const blobOffset = blobIndex * 10
      const blobX = blobDataRef.current[blobOffset]
      const blobY = blobDataRef.current[blobOffset + 1]
      const blobSize = blobDataRef.current[blobOffset + 4]
      const blobHue = blobDataRef.current[blobOffset + 5]

      const angle = Math.random() * Math.PI * 2
      const distance = blobSize * 0.3 + Math.random() * blobSize * 0.2
      const speed = Math.random() * 1.2 + 0.3

      const particleIndex = activeParticlesRef.current
      const offset = particleIndex * 8

      particleDataRef.current[offset] = blobX + Math.cos(angle) * distance // x
      particleDataRef.current[offset + 1] = blobY + Math.sin(angle) * distance // y
      particleDataRef.current[offset + 2] = Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3 // vx
      particleDataRef.current[offset + 3] = Math.sin(angle) * speed + (Math.random() - 0.5) * 0.3 // vy
      particleDataRef.current[offset + 4] = 0 // life
      particleDataRef.current[offset + 5] = Math.random() * 3000 + 2000 // maxLife
      particleDataRef.current[offset + 6] = Math.random() * 8 + 4 // size
      particleDataRef.current[offset + 7] = blobHue + (Math.random() - 0.5) * 30 // hue

      activeParticlesRef.current++
    },
    [maxParticles],
  )

  // Update particles
  const updateParticles = useCallback((deltaTime: number) => {
    const mouse = mouseRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    // Update existing particles
    let writeIndex = 0
    for (let i = 0; i < activeParticlesRef.current; i++) {
      const offset = i * 8
      let x = particleDataRef.current[offset]
      let y = particleDataRef.current[offset + 1]
      let vx = particleDataRef.current[offset + 2]
      let vy = particleDataRef.current[offset + 3]
      let life = particleDataRef.current[offset + 4]
      const maxLife = particleDataRef.current[offset + 5]
      const size = particleDataRef.current[offset + 6]
      const hue = particleDataRef.current[offset + 7]

      life += deltaTime

      // Remove dead particles
      if (life >= maxLife) continue

      // Update physics
      x += vx
      y += vy

      // Add gravity and air resistance
      vy += 0.01
      vx *= 0.998
      vy *= 0.998

      // Mouse interaction
      if (mouse.isMoving) {
        const dx = mouse.x - x
        const dy = mouse.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 150

        if (distance < maxDistance && distance > 0) {
          const influence = (1 - distance / maxDistance) * 0.02
          vx += (dx / distance) * influence
          vy += (dy / distance) * influence
        }
      }

      // Boundary wrapping
      if (x < -size) x = width + size
      if (x > width + size) x = -size
      if (y < -size) y = height + size
      if (y > height + size) y = -size

      // Copy to new position
      const writeOffset = writeIndex * 8
      particleDataRef.current[writeOffset] = x
      particleDataRef.current[writeOffset + 1] = y
      particleDataRef.current[writeOffset + 2] = vx
      particleDataRef.current[writeOffset + 3] = vy
      particleDataRef.current[writeOffset + 4] = life
      particleDataRef.current[writeOffset + 5] = maxLife
      particleDataRef.current[writeOffset + 6] = size
      particleDataRef.current[writeOffset + 7] = hue

      writeIndex++
    }

    activeParticlesRef.current = writeIndex
  }, [])

  // Update blobs
  const updateBlobs = useCallback(
    (deltaTime: number) => {
      const mouse = mouseRef.current
      const width = window.innerWidth
      const height = window.innerHeight

      for (let i = 0; i < activeBlobsRef.current; i++) {
        const offset = i * 10
        let x = blobDataRef.current[offset]
        let y = blobDataRef.current[offset + 1]
        let vx = blobDataRef.current[offset + 2]
        let vy = blobDataRef.current[offset + 3]
        const size = blobDataRef.current[offset + 4]

        // Mouse interaction
        if (mouse.isMoving) {
          const dx = mouse.x - x
          const dy = mouse.y - y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 300

          if (distance < maxDistance && distance > 0) {
            const influence = (1 - distance / maxDistance) * 0.1
            vx += (dx / distance) * influence * 0.01
            vy += (dy / distance) * influence * 0.01

            // Create particles when mouse is near
            if (influence > 0.3 && Math.random() < 0.1) {
              createParticle(i)
            }
          }
        }

        // Natural movement
        x += vx
        y += vy

        // Add randomness
        vx += (Math.random() - 0.5) * 0.01
        vy += (Math.random() - 0.5) * 0.01

        // Limit velocity
        const maxVel = 1.2
        vx = Math.max(-maxVel, Math.min(maxVel, vx))
        vy = Math.max(-maxVel, Math.min(maxVel, vy))

        // Boundary collision
        if (x < -size / 2) {
          x = -size / 2
          vx = Math.abs(vx) * 0.8
        } else if (x > width + size / 2) {
          x = width + size / 2
          vx = -Math.abs(vx) * 0.8
        }

        if (y < -size / 2) {
          y = -size / 2
          vy = Math.abs(vy) * 0.8
        } else if (y > height + size / 2) {
          y = height + size / 2
          vy = -Math.abs(vy) * 0.8
        }

        // Random particle emission
        if (Math.random() < 0.002) {
          createParticle(i)
        }

        // Update blob data
        blobDataRef.current[offset] = x
        blobDataRef.current[offset + 1] = y
        blobDataRef.current[offset + 2] = vx
        blobDataRef.current[offset + 3] = vy
      }
    },
    [createParticle],
  )

  // Render frame
  const render = useCallback((currentTime: number) => {
    const gl = glRef.current
    const particleProgram = programRef.current
    const blobProgram = blobProgramRef.current
    const canvas = canvasRef.current

    if (!gl || !particleProgram || !blobProgram || !canvas) return

    // Update canvas size
    const width = window.innerWidth
    const height = window.innerHeight
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
    }

    // Clear canvas
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const time = currentTime * 0.001
    const isDark = document.documentElement.classList.contains("dark")

    // Render blobs
    gl.useProgram(blobProgram)
    gl.bindVertexArray(blobVAORef.current)

    // Update blob buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, blobBufferRef.current)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, blobDataRef.current.subarray(0, activeBlobsRef.current * 10))

    // Set blob uniforms
    const blobResolutionLoc = gl.getUniformLocation(blobProgram, "u_resolution")
    const blobTimeLoc = gl.getUniformLocation(blobProgram, "u_time")
    if (blobResolutionLoc) gl.uniform2f(blobResolutionLoc, width, height)
    if (blobTimeLoc) gl.uniform1f(blobTimeLoc, time)

    // Draw blobs
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, activeBlobsRef.current)

    // Render particles
    gl.useProgram(particleProgram)
    gl.bindVertexArray(particleVAORef.current)

    // Update particle buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, particleBufferRef.current)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, particleDataRef.current.subarray(0, activeParticlesRef.current * 8))

    // Set particle uniforms
    const particleResolutionLoc = gl.getUniformLocation(particleProgram, "u_resolution")
    const particleTimeLoc = gl.getUniformLocation(particleProgram, "u_time")
    const mouseLoc = gl.getUniformLocation(particleProgram, "u_mouse")
    const mouseActiveLoc = gl.getUniformLocation(particleProgram, "u_mouseActive")
    const isDarkLoc = gl.getUniformLocation(particleProgram, "u_isDark")

    if (particleResolutionLoc) gl.uniform2f(particleResolutionLoc, width, height)
    if (particleTimeLoc) gl.uniform1f(particleTimeLoc, time)
    if (mouseLoc) gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y)
    if (mouseActiveLoc) gl.uniform1i(mouseActiveLoc, mouseRef.current.isMoving ? 1 : 0)
    if (isDarkLoc) gl.uniform1i(isDarkLoc, isDark ? 1 : 0)

    // Draw particles
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, activeParticlesRef.current)

    gl.bindVertexArray(null)
  }, [])

  // Animation loop
  const animate = useCallback(
    (currentTime: number) => {
      const deltaTime = Math.min(currentTime - (animationRef.current || currentTime), 16.67) // Cap at 60fps

      updateBlobs(deltaTime)
      updateParticles(deltaTime)
      render(currentTime)

      animationRef.current = requestAnimationFrame(animate)
    },
    [updateBlobs, updateParticles, render],
  )

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now()
    if (now - lastMouseMoveRef.current < 16) return

    mouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      isMoving: true,
    }
    lastMouseMoveRef.current = now

    setTimeout(() => {
      mouseRef.current.isMoving = false
    }, 100)
  }, [])

  // Resize handler
  const handleResize = useCallback(() => {
    initBlobs()
  }, [initBlobs])

  useEffect(() => {
    if (!initWebGL()) {
      console.warn("WebGL initialization failed")
      return
    }

    initBlobs()

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("resize", handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)

      // Cleanup WebGL resources
      const gl = glRef.current
      if (gl) {
        if (particleVAORef.current) gl.deleteVertexArray(particleVAORef.current)
        if (blobVAORef.current) gl.deleteVertexArray(blobVAORef.current)
        if (particleBufferRef.current) gl.deleteBuffer(particleBufferRef.current)
        if (blobBufferRef.current) gl.deleteBuffer(blobBufferRef.current)
        if (programRef.current) gl.deleteProgram(programRef.current)
        if (blobProgramRef.current) gl.deleteProgram(blobProgramRef.current)
      }
    }
  }, [initWebGL, initBlobs, animate, handleMouseMove, handleResize])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 webgl-particle-canvas"
      style={{
        background: "linear-gradient(135deg, #faf8f3 0%, #f7f4ed 100%)",
      }}
    />
  )
}

// Named export for compatibility
export { WebGLParticleBackground as default }
