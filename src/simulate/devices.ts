/**
 * Device specs used to simulate the /ios and /android prototype entries.
 *
 * These are CSS logical-pixel viewport sizes (what `window.innerWidth` /
 * `innerHeight` and CSS media queries see), not raw physical panel
 * resolution. Sourced July 2026:
 *  - iPhone 17: 402 x 874 CSS px, 3x device pixel ratio
 *    (physical 1206 x 2622 px @ ~460ppi)
 *  - Galaxy S26 Ultra: 412 x 891 CSS px, 3.5x device pixel ratio
 *    (physical 1440 x 3120 px @ ~500ppi; Samsung ships at a scaled default
 *    resolution rather than native, hence the non-integer ratio)
 *
 * If Apple/Samsung revise these before this prototype ships, update the two
 * entries below — nothing else in the app depends on device specifics.
 */
export interface DeviceSpec {
  id: 'iphone17' | 'galaxyS26Ultra'
  label: string
  os: 'ios' | 'android'
  viewportWidth: number
  viewportHeight: number
  devicePixelRatio: number
  cornerRadius: number
  safeAreaTop: number
  safeAreaBottom: number
}

export const DEVICE_SPECS: Record<DeviceSpec['id'], DeviceSpec> = {
  iphone17: {
    id: 'iphone17',
    label: 'iPhone 17',
    os: 'ios',
    viewportWidth: 402,
    viewportHeight: 874,
    devicePixelRatio: 3,
    cornerRadius: 55,
    safeAreaTop: 59,
    safeAreaBottom: 34,
  },
  galaxyS26Ultra: {
    id: 'galaxyS26Ultra',
    label: 'Galaxy S26 Ultra',
    os: 'android',
    viewportWidth: 412,
    viewportHeight: 891,
    devicePixelRatio: 3.5,
    cornerRadius: 40,
    safeAreaTop: 32,
    safeAreaBottom: 16,
  },
}

export type DeviceId = keyof typeof DEVICE_SPECS
