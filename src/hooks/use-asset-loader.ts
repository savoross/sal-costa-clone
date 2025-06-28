"use client"

import { useEffect, useState, useCallback } from "react"

interface AssetLoadingState {
  total: number
  loaded: number
  progress: number
  currentAsset: string
  stage: string
  isComplete: boolean
}

interface UseAssetLoaderOptions {
  images?: string[]
  fonts?: string[]
  scripts?: string[]
  minLoadTime?: number
  onComplete?: () => void
}

export function useAssetLoader({
  images = [],
  fonts = [],
  scripts = [],
  minLoadTime = 2000,
  onComplete,
}: UseAssetLoaderOptions) {
  const [loadingState, setLoadingState] = useState<AssetLoadingState>({
    total: 0,
    loaded: 0,
    progress: 0,
    currentAsset: "Initializing...",
    stage: "Starting",
    isComplete: false,
  })

  const updateProgress = useCallback((loaded: number, total: number, currentAsset: string, stage: string) => {
    const progress = total > 0 ? (loaded / total) * 100 : 0
    setLoadingState({
      total,
      loaded,
      progress,
      currentAsset,
      stage,
      isComplete: false,
    })
  }, [])

  const loadFont = useCallback((fontFamily: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!document.fonts) {
        resolve()
        return
      }

      const font = new FontFace(fontFamily, `url(/fonts/${fontFamily}.woff2)`)

      font
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont)
          resolve()
        })
        .catch(() => {
          // Fallback: check if font is already available
          document.fonts.ready.then(() => {
            resolve()
          })
        })
    })
  }, [])

  const loadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve()
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
      img.src = src
    })
  }, [])

  const loadScript = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }

      const script = document.createElement("script")
      script.src = src
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      document.head.appendChild(script)
    })
  }, [])

  useEffect(() => {
    const loadAssets = async () => {
      const startTime = Date.now()
      const allAssets = [
        ...fonts.map((font) => ({ type: "font", src: font })),
        ...images.map((img) => ({ type: "image", src: img })),
        ...scripts.map((script) => ({ type: "script", src: script })),
      ]

      const total = allAssets.length
      let loaded = 0

      if (total === 0) {
        // No assets to load, just wait for minimum time
        updateProgress(0, 1, "Preparing interface...", "Initializing")

        setTimeout(() => {
          setLoadingState((prev) => ({ ...prev, isComplete: true }))
          onComplete?.()
        }, minLoadTime)
        return
      }

      // Load assets sequentially with progress updates
      for (const asset of allAssets) {
        try {
          const assetName = asset.src.split("/").pop() || asset.src
          updateProgress(loaded, total, `Loading ${assetName}...`, getStageForAssetType(asset.type))

          switch (asset.type) {
            case "font":
              await loadFont(asset.src)
              break
            case "image":
              await loadImage(asset.src)
              break
            case "script":
              await loadScript(asset.src)
              break
          }

          loaded++
          updateProgress(loaded, total, `Loaded ${assetName}`, getStageForAssetType(asset.type))

          // Small delay to show progress
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          console.warn(`Failed to load asset: ${asset.src}`, error)
          loaded++
          updateProgress(loaded, total, `Skipped ${asset.src}`, "Error")
        }
      }

      // Ensure minimum loading time
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minLoadTime - elapsed)

      if (remainingTime > 0) {
        updateProgress(total, total, "Finalizing...", "Complete")
        await new Promise((resolve) => setTimeout(resolve, remainingTime))
      }

      setLoadingState((prev) => ({ ...prev, isComplete: true, currentAsset: "Ready!", stage: "Complete" }))
      onComplete?.()
    }

    loadAssets()
  }, [fonts, images, scripts, minLoadTime, onComplete, updateProgress, loadFont, loadImage, loadScript])

  return loadingState
}

function getStageForAssetType(type: string): string {
  switch (type) {
    case "font":
      return "Loading Fonts"
    case "image":
      return "Loading Images"
    case "script":
      return "Loading Scripts"
    default:
      return "Loading Assets"
  }
}
