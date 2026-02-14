import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'pwa-192.png', 'pwa-512.png'],
      manifest: {
        name: 'Gestor Ventas Cliente',
        short_name: 'Cliente GT',
        description: 'Catalogo simple para clientes del gestor de accesorios de computo.',
        theme_color: '#7a45ff',
        background_color: '#09090e',
        display: 'standalone',
        scope: '/',
        start_url: '/cliente',
        lang: 'es-MX',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}']
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000',
      '/dashboard': 'http://localhost:4000'
    }
  }
});
