"use client"

import { useEffect, useState } from "react"
import { ParticleBlobBackground } from "./particle-blob-background"
import { WebGLParticleBackground } from "./webgl-particle-background"

export function WebGLFallbackBackground() {
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null)

  useEffect(() => {
    // Check WebGL2 support
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2")

    if (gl) {
      // Check for required extensions and features
      const hasInstancedArrays = gl.getExtension("ANGLE_instanced_arrays") !== null
      const hasVertexArrayObject = gl.getExtension("OES_vertex_array_object") !== null

      setSupportsWebGL(true)
    } else {
      console.warn("WebGL2 not supported, falling back to DOM-based particles")
      setSupportsWebGL(false)
    }
  }, [])

  // Show nothing while checking support
  if (supportsWebGL === null) {
    return null
  }

  // Use WebGL version if supported, otherwise fallback to DOM version
  return supportsWebGL ? <WebGLParticleBackground maxParticles={2000} maxBlobs={15} /> : <ParticleBlobBackground />
}

// Named export for compatibility
export { WebGLFallbackBackground as default }
