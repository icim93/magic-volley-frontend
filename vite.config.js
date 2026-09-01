import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Origine del backend in produzione: le chiamate API sono cross-origin
// (frontend su magicvolleyadelfia.it, backend su onrender.com), quindi le
// regex di runtimeCaching devono matchare l'URL assoluto, non solo il path.
const API_ORIGIN = 'https://magic-volley-backend.onrender.com'

// Solo le GET pubbliche di sola lettura, una regex per famiglia di endpoint.
// Niente pattern "cattura tutto" su /api/* — cache-are per sbaglio le
// risposte di admin/genitori (anche se non contengono cookie di sessione,
// meglio non fidarsi del matching di default) è il rischio da evitare qui.
function publicApiCache(name, pathPattern) {
  return {
    urlPattern: new RegExp(`^${API_ORIGIN.replace(/[.]/g, '\\.')}/api/${pathPattern}(\\?.*)?$`),
    handler: 'StaleWhileRevalidate',
    method: 'GET',
    options: {
      cacheName: `api-${name}`,
      expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 },
      cacheableResponse: { statuses: [0, 200] },
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'robots.txt'],
      workbox: {
        navigateFallbackDenylist: [/^\/admin/, /^\/area-riservata/],
        runtimeCaching: [
          publicApiCache('news', 'news(/[^/]+)?'),
          publicApiCache('matches', 'matches(/results)?'),
          publicApiCache('teams', 'teams(/\\d+)?'),
          publicApiCache('players', 'players(/\\d+)?'),
          publicApiCache('gallery', 'gallery'),
          publicApiCache('sponsors', 'sponsors'),
          publicApiCache('documents', 'documents'),
          publicApiCache('staff', 'staff'),
        ],
      },
      manifest: {
        name: 'Magic Volley Adelfia',
        short_name: 'Magic Volley',
        description: 'Sito ufficiale di Magic Volley Adelfia Associazione Sportiva Dilettantistica.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#FAF7F1',
        theme_color: '#14213D',
        lang: 'it',
        icons: [
          { src: '/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
})
