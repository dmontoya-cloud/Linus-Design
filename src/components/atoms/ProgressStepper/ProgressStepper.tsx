import styles from './ProgressStepper.module.css'

export interface ProgressStepperProps {
  /** Current step, 1-indexed. */
  value: number
  /** Total number of steps. */
  max: number
  /** Accessible label, e.g. "Question 3 of 15". */
  label: string
}

function toPercent(value: number, max: number): number {
  return max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
}

/**
 * Atom/ProgressStepper — `docs/design.md`'s `progress-stepper`/`progress-stepper-active`, a
 * pill-shaped track+fill distinct from `ProgressBar` (that component's own flat, 0-radius
 * corners are a deliberate one-off for the pre-registration funnel — see that file's own
 * comment) — used instead for an assessment's own "N of M" questions, per design.md's own
 * example. `border` for the track, `primary` for the fill; unlike `ProgressBar`, this
 * component's own instance stays mounted across steps (one question flow, not a fresh
 * route per step), so its width transition can rely on the ordinary CSS `transition` below
 * rather than needing `ProgressBar`'s "mount one step behind and animate forward a frame
 * later" workaround for a value that would otherwise never visibly change.
 */
export function ProgressStepper({ value, max, label }: ProgressStepperProps) {
  const percent = toPercent(value, max)

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  )
}
