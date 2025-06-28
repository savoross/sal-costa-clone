const CACHE_NAME = "sal-costa-v1.0.0"
const STATIC_CACHE = "sal-costa-static-v1.0.0"
const DYNAMIC_CACHE = "sal-costa-dynamic-v1.0.0"
const IMAGE_CACHE = "sal-costa-images-v1.0.0"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/about",
  "/work",
  "/contact",
  "/manifest.json",
  "/_next/static/css/app/layout.css",
  "/_next/static/css/app/globals.css",
]

// Network-first resources
const NETWORK_FIRST = ["/api/", "/_next/static/chunks/"]

// Cache-first resources
const CACHE_FIRST = ["/_next/static/", "/fonts/", "/icons/"]

// Image domains to cache
const IMAGE_DOMAINS = ["ext.same-assets.com", "ugc.same-assets.com", "images.unsplash.com", "source.unsplash.com"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("Service Worker: Static assets cached")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache static assets", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== IMAGE_CACHE
            ) {
              console.log("Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith("http")) {
    return
  }

  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request))
  } else if (isNetworkFirst(request)) {
    event.respondWith(handleNetworkFirst(request))
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request))
  } else {
    event.respondWith(handleDefault(request))
  }
})

// Image caching strategy - Cache first with fallback
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      // Return cached image and update in background
      updateImageInBackground(request, cache)
      return cachedResponse
    }

    // Fetch and cache new image
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log("Service Worker: Image request failed", error)
    return new Response("Image not available offline", { status: 404 })
  }
}

// Static asset caching - Cache first
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log("Service Worker: Static asset request failed", error)
    return caches.match(request)
  }
}

// Network first strategy for dynamic content
async function handleNetworkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log("Service Worker: Network request failed, trying cache", error)
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    return new Response("Content not available offline", { status: 503 })
  }
}

// Navigation request handling with offline fallback
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log("Service Worker: Navigation request failed", error)

    // Try to serve cached version
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Fallback to home page if available
    const homeResponse = await caches.match("/")
    if (homeResponse) {
      return homeResponse
    }

    // Ultimate fallback
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Sal Costa</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              background: #f7f4ed;
              color: #1a1612;
            }
            .offline-message { text-align: center; }
            .offline-message h1 { font-size: 2rem; margin-bottom: 1rem; }
            .offline-message p { font-size: 1.1rem; opacity: 0.8; }
          </style>
        </head>
        <body>
          <div class="offline-message">
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
          </div>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    )
  }
}

// Default caching strategy
async function handleDefault(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cachedResponse = await caches.match(request)
    return cachedResponse || new Response("Not available offline", { status: 503 })
  }
}

// Background image update
async function updateImageInBackground(request, cache) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
  } catch (error) {
    console.log("Service Worker: Background image update failed", error)
  }
}

// Helper functions
function isImageRequest(request) {
  const url = new URL(request.url)
  return (
    IMAGE_DOMAINS.some((domain) => url.hostname.includes(domain)) ||
    request.destination === "image" ||
    /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url.pathname)
  )
}

function isStaticAsset(request) {
  const url = new URL(request.url)
  return (
    CACHE_FIRST.some((path) => url.pathname.startsWith(path)) || /\.(js|css|woff|woff2|ttf|eot)$/i.test(url.pathname)
  )
}

function isNetworkFirst(request) {
  const url = new URL(request.url)
  return NETWORK_FIRST.some((path) => url.pathname.startsWith(path))
}

function isNavigationRequest(request) {
  return request.mode === "navigate"
}

// Background sync for failed requests
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  console.log("Service Worker: Performing background sync")
  // Implement background sync logic here
}

// Push notification handling
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey,
      },
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})
