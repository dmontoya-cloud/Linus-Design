import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { DeviceFrame } from '@/simulate/DeviceFrame'
import type { DeviceId } from '@/simulate/devices'

export interface MountOptions {
  /** When set, renders inside a device-frame simulator instead of mounting the app directly. */
  device?: DeviceId
}

/**
 * Single mount function shared by the three entries (web/ios/android — see
 * vite.config.ts). The web entry mounts <App/> directly; the ios/android
 * entries mount a DeviceFrame that iframes the web build pinned to that
 * device's exact CSS-pixel viewport, so responsive behavior is validated
 * against real device dimensions rather than an approximation.
 */
export function mountApp(rootId: string, options: MountOptions = {}) {
  const container = document.getElementById(rootId)
  if (!container) {
    throw new Error(`mountApp: no element with id "${rootId}" found`)
  }

  const root = createRoot(container)

  if (options.device) {
    root.render(
      <StrictMode>
        <DeviceFrame device={options.device}>
          <iframe title={`Linus prototype — ${options.device} simulator`} src="/web/" />
        </DeviceFrame>
      </StrictMode>,
    )
    return
  }

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
