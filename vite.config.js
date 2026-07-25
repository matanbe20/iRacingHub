import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const projectRoot = new URL('./', import.meta.url);

export default defineConfig({
  build: {
    rollupOptions: {
      // Two pages: the app, and the component gallery served at /storybook/.
      input: {
        main: fileURLToPath(new URL('index.html', projectRoot)),
        storybook: fileURLToPath(new URL('storybook/index.html', projectRoot)),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // Navigations fall back to the app shell, which would otherwise answer
        // /storybook with the app. Let that page serve its own document — both
        // with and without the trailing slash, since the worker answers before
        // the server gets a chance to redirect.
        navigateFallbackDenylist: [/^\/storybook(\/|$)/],
      },
    }),
  ],
  base: process.env.VITE_BASE || '/',
});
