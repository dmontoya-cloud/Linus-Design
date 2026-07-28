import type { ReactNode } from 'react'
import { DEVICE_SPECS, type DeviceId } from './devices'
import styles from './DeviceFrame.module.css'

interface DeviceFrameProps {
  device: DeviceId
  children: ReactNode
}

/**
 * Renders `children` (typically an iframe pointing at /web/) pinned to a
 * real device's exact CSS-pixel viewport, inside a decorative bezel, so
 * responsive behavior and safe-area insets can be validated against real
 * iPhone 17 / Galaxy S26 Ultra dimensions rather than an approximation.
 *
 * The bezel is decorative only (aria-hidden) — the embedded content carries
 * its own accessible name and landmarks.
 */
export function DeviceFrame({ device, children }: DeviceFrameProps) {
  const spec = DEVICE_SPECS[device]

  return (
    <div className={styles.stage}>
      <p className={styles.label}>
        {spec.label} simulator — {spec.viewportWidth}×{spec.viewportHeight} CSS px @
        {spec.devicePixelRatio}x
      </p>
      <div
        className={styles.bezel}
        data-os={spec.os}
        style={{
          width: spec.viewportWidth + 24,
          height: spec.viewportHeight + 24,
          borderRadius: spec.cornerRadius + 12,
        }}
      >
        <div className={styles.notch} data-os={spec.os} aria-hidden="true" />
        <div
          className={styles.screen}
          style={{
            width: spec.viewportWidth,
            height: spec.viewportHeight,
            borderRadius: spec.cornerRadius,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
