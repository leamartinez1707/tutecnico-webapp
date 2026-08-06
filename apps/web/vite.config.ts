import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const manifestIcons = [
  {
    src: '192_logo.webp',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: '512_logo.webp',
    sizes: '512x512',
    type: 'image/png',
  }
]

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 año
              },
            },
          },
        ],
      },
      manifest: {
        name: 'TuTecnico - Encuentra Técnicos Profesionales',
        short_name: 'ServyFix',
        description: 'Conecta con técnicos expertos cerca de ti. Servicios de reparación y mantenimiento confiables en Uruguay. Expandí tu negocio como técnico profesional.',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: manifestIcons,
        categories: ['business', 'productivity', 'utilities'],
        lang: 'es-UY',
        screenshots: [
          {
            src: '192_logo.webp',
            sizes: '192x192',
            type: 'image/webp',
            form_factor: 'narrow'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'query-vendor': ['@tanstack/react-query'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,                 // Asegúrate de esto
    strictPort: true,           // Evita que Vite cambie el puerto si está ocupado
    hmr: {
      protocol: 'ws',            // o 'wss' si usás HTTPS
      clientPort: 5173,          // Coincidir con el puerto HTTP
      overlay: true,
    },
  },
})
