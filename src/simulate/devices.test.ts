import { describe, expect, it } from 'vitest'
import { DEVICE_SPECS } from './devices'

describe('DEVICE_SPECS', () => {
  it.each(Object.entries(DEVICE_SPECS))(
    '%s has positive viewport dimensions and DPR',
    (_id, spec) => {
      expect(spec.viewportWidth).toBeGreaterThan(0)
      expect(spec.viewportHeight).toBeGreaterThan(0)
      expect(spec.devicePixelRatio).toBeGreaterThan(0)
    },
  )

  it('iphone17 matches the documented iPhone 17 CSS viewport', () => {
    expect(DEVICE_SPECS.iphone17).toMatchObject({
      viewportWidth: 402,
      viewportHeight: 874,
      devicePixelRatio: 3,
      os: 'ios',
    })
  })

  it('galaxyS26Ultra matches the documented Galaxy S26 Ultra CSS viewport', () => {
    expect(DEVICE_SPECS.galaxyS26Ultra).toMatchObject({
      viewportWidth: 412,
      viewportHeight: 891,
      devicePixelRatio: 3.5,
      os: 'android',
    })
  })
})
