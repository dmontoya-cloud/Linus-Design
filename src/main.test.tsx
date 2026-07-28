import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mountApp } from './main'

describe('mountApp', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'root'
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it('throws a clear error when the target element is missing', () => {
    container.remove()
    expect(() => mountApp('root')).toThrow(/no element with id "root" found/)
  })

  it('mounts the app directly when no device is given', () => {
    act(() => {
      mountApp('root')
    })
    expect(container.querySelector('nav[aria-label="Phase 1 funnel"]')).not.toBeNull()
  })

  it('mounts a DeviceFrame with an iframe pointed at /web/ when a device is given', () => {
    act(() => {
      mountApp('root', { device: 'iphone17' })
    })
    const iframe = container.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe?.getAttribute('src')).toBe('/web/')
    expect(iframe?.getAttribute('title')).toContain('iphone17')
  })
})
