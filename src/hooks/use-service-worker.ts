"use client"

import { useEffect, useState } from "react"

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  isOnline: boolean
  updateAvailable: boolean
  registration: ServiceWorkerRegistration | null
  error: string | null
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOnline: true,
    updateAvailable: false,
    registration: null,
    error: null,
  })

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    // Check if service workers are supported
    if ("serviceWorker" in navigator) {
      setState((prev) => ({ ...prev, isSupported: true }))

      // Set initial online state
      setState((prev) => ({ ...prev, isOnline: navigator.onLine }))

      // Register service worker only in production or when explicitly enabled
      if (process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_SW_ENABLED === "true") {
        registerServiceWorker()
      } else {
        console.log("Service Worker registration skipped in development")
      }

      // Listen for online/offline events
      const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }))
      const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }))

      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    } else {
      setState((prev) => ({ ...prev, error: "Service Workers not supported" }))
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      // Check if the service worker file exists before registering
      const swResponse = await fetch("/sw.js", { method: "HEAD" })
      if (!swResponse.ok) {
        throw new Error("Service worker file not found")
      }

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none", // Always check for updates
      })

      setState((prev) => ({
        ...prev,
        isRegistered: true,
        registration,
        error: null,
      }))

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setState((prev) => ({ ...prev, updateAvailable: true }))
            }
          })
        }
      })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "SW_UPDATE_AVAILABLE") {
          setState((prev) => ({ ...prev, updateAvailable: true }))
        }
      })

      console.log("Service Worker registered successfully")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      console.warn("Service Worker registration failed:", errorMessage)
      setState((prev) => ({ ...prev, error: errorMessage }))
    }
  }

  const updateServiceWorker = async () => {
    if (state.registration) {
      try {
        await state.registration.update()
        window.location.reload()
      } catch (error) {
        console.error("Service Worker update failed:", error)
      }
    }
  }

  const unregisterServiceWorker = async () => {
    if (state.registration) {
      try {
        await state.registration.unregister()
        setState((prev) => ({
          ...prev,
          isRegistered: false,
          registration: null,
        }))
        console.log("Service Worker unregistered")
      } catch (error) {
        console.error("Service Worker unregistration failed:", error)
      }
    }
  }

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker,
  }
}
