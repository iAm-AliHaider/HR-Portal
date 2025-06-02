const CACHE_NAME = "hr-portal-v1.2.0";
const STATIC_CACHE = "hr-portal-static-v1.2.0";
const DYNAMIC_CACHE = "hr-portal-dynamic-v1.2.0";
const API_CACHE = "hr-portal-api-v1.2.0";

const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/people",
  "/leave",
  "/jobs",
  "/training",
  "/ai-insights",
  "/offline",
  "/manifest.json",
  // Add critical CSS and JS files here
  "/_next/static/css/app.css",
  "/_next/static/js/app.js",
];

const API_ENDPOINTS = [
  "/api/employees",
  "/api/leave-requests",
  "/api/jobs",
  "/api/training-courses",
  "/api/ai-insights",
  "/api/dashboard-analytics",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE).then((cache) => {
        console.log("Service Worker: Initializing API cache");
        return Promise.resolve();
      }),
    ]).then(() => {
      console.log("Service Worker: Installation complete");
      return self.skipWaiting();
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Activation complete");
        return self.clients.claim();
      }),
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (
    STATIC_ASSETS.some(
      (asset) => url.pathname === asset || url.pathname.endsWith(asset),
    )
  ) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Handle navigation requests with network-first, fallback to cache
  if (request.mode === "navigate") {
    event.respondWith(navigationStrategy(request));
    return;
  }

  // Handle other requests with stale-while-revalidate
  event.respondWith(staleWhileRevalidateStrategy(request));
});

// Network-first strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("Service Worker: Network failed, trying cache");
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline API response
    return new Response(
      JSON.stringify({
        error: "Offline",
        message: "This feature is not available offline",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("Service Worker: Failed to fetch:", request.url);
    throw error;
  }
}

// Navigation strategy (for page requests)
async function navigationStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("Service Worker: Navigation offline, serving cached page");
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to offline page
    const offlinePage = await caches.match("/offline");
    if (offlinePage) {
      return offlinePage;
    }

    // Final fallback
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>HR Portal - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 400px; margin: 50px auto; text-align: center; padding: 20px; }
            .icon { font-size: 64px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📱</div>
            <h1>You're Offline</h1>
            <p>The HR Portal is currently unavailable. Please check your connection and try again.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      },
    );
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => {
      console.log("Service Worker: Network failed for:", request.url);
    });

  return cachedResponse || (await fetchPromise);
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  try {
    // Process offline queue
    const offlineActions = await getOfflineActions();
    for (const action of offlineActions) {
      await processOfflineAction(action);
    }
    await clearOfflineActions();
    console.log("Service Worker: Background sync completed");
  } catch (error) {
    console.error("Service Worker: Background sync failed:", error);
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received");

  const options = {
    body: event.data ? event.data.text() : "New HR notification",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "2",
    },
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/icons/view-24.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/close-24.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("HR Portal", options));
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification clicked");

  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(clients.openWindow("/dashboard"));
  }
});

// Utility functions for offline storage
async function getOfflineActions() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function processOfflineAction(action) {
  // Process the offline action when back online
  console.log("Processing offline action:", action);
}

async function clearOfflineActions() {
  // Clear processed offline actions
  console.log("Clearing offline actions");
}

// Periodic background sync
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "hr-data-sync") {
    event.waitUntil(syncHRData());
  }
});

async function syncHRData() {
  try {
    // Sync critical HR data in background
    console.log("Service Worker: Syncing HR data in background");

    const criticalEndpoints = [
      "/api/employees",
      "/api/leave-requests",
      "/api/notifications",
    ];

    for (const endpoint of criticalEndpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const cache = await caches.open(API_CACHE);
          await cache.put(endpoint, response.clone());
        }
      } catch (error) {
        console.log(`Failed to sync ${endpoint}:`, error);
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}
