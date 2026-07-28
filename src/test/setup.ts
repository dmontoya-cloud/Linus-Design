import '@testing-library/jest-dom/vitest'
// Note: vitest-axe's `toHaveNoViolations` matcher currently targets an older
// Vitest typing convention that doesn't merge cleanly with Vitest 4's
// `expect` types, so Button.test.tsx asserts on `results.violations` directly
// instead of registering the matcher here. Revisit when vitest-axe catches up.
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// jsdom doesn't implement matchMedia; several breakpoint-aware components
// will need it once PoD 3 (device simulators) and PoD 4 (funnel screens) land.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
