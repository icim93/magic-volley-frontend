import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Service worker scritto a mano (src/sw.js) invece che generato per
      // intero dal plugin: serve per gli handler delle notifiche push,
      // che la modalità generateSW non permette di aggiungere.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        // I file di app/dist superano il limite di precache di default
        // (2 MiB) una volta sommati; qui non serve nessuna soglia stretta,
        // il service worker precache-a comunque solo gli asset del build.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'robots.txt'],
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
