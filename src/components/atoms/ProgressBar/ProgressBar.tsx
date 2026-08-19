import { useEffect, useState } from 'react'
import styles from './ProgressBar.module.css'

export interface ProgressBarProps {
  /** Current step, 1-indexed. */
  value: number
  /** Total number of steps. */
  max: number
  /** Accessible label, e.g. "Step 1 of 4: Registration". */
  label: string
  success?: boolean
}

function toPercent(value: number, max: number): number {
  return max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
}

/**
 * Atom/ProgressBar — a plain track + fill, ported from docs/design.md, with
 * straight (unrounded) edges rather than the pill corners used elsewhere in
 * the system. `border` for the track, `primary` for the fill, with a
 * `success`-filled variant for a completed state. Exposed as a native
 * `progressbar` role so screen readers announce the step and percentage.
 *
 * Each step of a funnel (Terms of Use, Privacy Policy, ...) is its
 * own page/route, so a fresh `ProgressBar` mounts on every step rather than
 * one instance living across navigation — a plain CSS `transition` on width
 * never fires in that case, since there's no prior on-screen value to
 * transition from. To still get a "growing" animation rather than the fill
 * just appearing at its final width, the bar mounts one step behind its
 * target and animates forward a frame later.
 */
export function ProgressBar({ value, max, label, success }: ProgressBarProps) {
  const targetPercent = toPercent(value, max)
  const [percent, setPercent] = useState(() => toPercent(value - 1, max))

  useEffect(() => {
    const frame = requestAnimationFrame(() => setPercent(targetPercent))
    return () => cancelAnimationFrame(frame)
  }, [targetPercent])

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div
        className={[styles.fill, success && styles.success].filter(Boolean).join(' ')}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
