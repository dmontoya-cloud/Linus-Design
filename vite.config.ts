/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Three build entries share one React + TypeScript source tree:
//   /web    - fluid responsive entry (mobile/tablet/desktop breakpoints, no device chrome)
//   /ios    - same app, rendered inside an iPhone 17 device-frame simulator
//   /android - same app, rendered inside a Galaxy S26 Ultra device-frame simulator
// See src/simulate/devices.ts for the device specs and README.md / docs/PROTOTYPE_README.md for how to run each.
export default defineConfig({
  plugins: [react()],
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
