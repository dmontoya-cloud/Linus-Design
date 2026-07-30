/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { extname } from 'node:path'

// Three build entries share one React + TypeScript source tree:
//   /web    - fluid responsive entry (mobile/tablet/desktop breakpoints, no device chrome)
//   /ios    - same app, rendered inside an iPhone 17 device-frame simulator
//   /android - same app, rendered inside a Galaxy S26 Ultra device-frame simulator
// See src/simulate/devices.ts for the device specs and README.md / docs/PROTOTYPE_README.md for how to run each.

const CLIENT_ROUTED_ENTRIES = ['web', 'ios', 'android']

/**
 * Each entry above is a client-routed SPA (see App.tsx's <Routes>), but Vite's dev server only
 * knows about the literal HTML files in vite.config's build.rollupOptions.input. Without this,
 * a fresh browser navigation to a deep link like /web/design-system 404s before React Router
 * ever gets a chance to render anything — it only works by clicking an in-app <Link> from a page
 * that already loaded correctly. This rewrites any extension-less request under /web, /ios, or
 * /android to that entry's index.html, mirroring standard SPA history-fallback behavior.
 */
function clientRoutedEntryFallback(): Plugin {
  return {
    name: 'client-routed-entry-fallback',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        const entry = CLIENT_ROUTED_ENTRIES.find((e) => url === `/${e}` || url.startsWith(`/${e}/`))
        if (entry && extname(url) === '') {
          req.url = `/${entry}/index.html`
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), clientRoutedEntryFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        landing: fileURLToPath(new URL('./index.html', import.meta.url)),
        web: fileURLToPath(new URL('./web/index.html', import.meta.url)),
        ios: fileURLToPath(new URL('./ios/index.html', import.meta.url)),
        android: fileURLToPath(new URL('./android/index.html', import.meta.url)),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: process.env.CI ? ['text', 'lcov'] : ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.tsx',
        'src/**/*.d.ts',
        'src/test/**',
        'src/mocks/**',
        'src/**/index.ts',
      ],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },
})
