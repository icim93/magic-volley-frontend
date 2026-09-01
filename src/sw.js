// Service worker scritto a mano (strategia injectManifest) invece che
// generato interamente da vite-plugin-pwa: serve per aggiungere gli
// handler delle notifiche push, che generateSW non espone.
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { clientsClaim } from 'workbox-core'

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), {
    denylist: [/^\/admin/, /^\/area-riservata/],
  })
)

// --- Cache offline per le sole GET pubbliche di sola lettura ---
// Nessun pattern "cattura tutto" su /api/*: solo queste famiglie di
// endpoint, tutte senza autenticazione lato backend.
const API_ORIGIN = 'https://magic-volley-backend.onrender.com'

function publicApiRoute(pathPattern, cacheName) {
  registerRoute(
    new RegExp(`^${API_ORIGIN.replace(/[.]/g, '\\.')}/api/${pathPattern}(\\?.*)?$`),
    new StaleWhileRevalidate({
      cacheName: `api-${cacheName}`,
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 60 * 60 }),
      ],
    }),
    'GET'
  )
}

publicApiRoute('news(/[^/]+)?', 'news')
publicApiRoute('matches(/results)?', 'matches')
publicApiRoute('teams(/\\d+)?', 'teams')
publicApiRoute('players(/\\d+)?', 'players')
publicApiRoute('gallery', 'gallery')
publicApiRoute('sponsors', 'sponsors')
publicApiRoute('documents', 'documents')
publicApiRoute('staff', 'staff')

// --- Notifiche push ---
self.addEventListener('push', (event) => {
  if (!event.data) return
  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'Magic Volley Adelfia', body: event.data.text() }
  }
  const { title = 'Magic Volley Adelfia', body = '', url = '/' } = payload
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-64x64.png',
      data: { url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        const clientUrl = new URL(client.url)
        if (clientUrl.pathname === targetUrl && 'focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl)
    })
  )
})
