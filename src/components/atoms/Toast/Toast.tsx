import type { ReactNode } from 'react'
import styles from './Toast.module.css'

export type ToastVariant = 'success' | 'warning' | 'info' | 'error' | 'neutral'

export interface ToastProps {
  variant?: ToastVariant
  title: string
  message: string
  /** Optional so Toast still renders standalone (e.g. in a design-system reference page)
   * without real dismiss state wired up — the close (×) button always renders regardless. */
  onClose?: () => void
}

/** Phosphor "regular" weight (phosphor-icons/core, MIT) — same sourcing convention as
 * docs/design.md's Icons section, pulled directly from the library rather than redrawn. */
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
    </svg>
  )
}

function WarningCircleIcon() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  )
}

const VARIANT_ICONS: Partial<Record<ToastVariant, () => ReactNode>> = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  info: InfoIcon,
  error: WarningCircleIcon,
}

/**
 * Atom/Toast — five variants (success/warning/info/error/neutral), a solid left accent bar
 * plus a soft-tinted background, both driven entirely by this system's existing semantic
 * color tokens (never a raw hex or primitive): success uses `border-success`/`success-soft`,
 * warning uses `content-warning`/`warning-soft` (no dedicated `border-warning` token exists
 * yet), info uses `border-info`/`info-soft`, error uses `border-danger`/`danger-soft`.
 * Neutral has no matching pair in the token set either (no "neutral-soft" background token
 * exists), so it composes two already-established tokens instead: `border-subtle` for the
 * background and `text-secondary` for the bar — and it's also the one variant with no icon,
 * matching the reference. Title and message always use the plain `text-primary`/
 * `text-secondary` tokens regardless of variant — only the icon, bar, and close button pick
 * up the accent color, so the tint never bleeds into the copy itself. `error` renders with
 * `role="alert"` (assertive) since it's the one variant representing something going wrong;
 * every other variant is `role="status"` (polite). The close (×) button always renders —
 * `onClose` is optional so Toast still renders standalone (e.g. a design-system reference
 * page showing all five variants at once) without real dismiss state wired up.
 */
export function Toast({ variant = 'neutral', title, message, onClose }: ToastProps) {
  const Icon = VARIANT_ICONS[variant]
  return (
    <div
      className={[styles.toast, styles[variant]].join(' ')}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {Icon ? (
        <span className={styles.icon}>
          <Icon />
        </span>
      ) : null}
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
      </div>
      <button
        type="button"
        className={styles.closeButton}
        aria-label="Dismiss notification"
        onClick={onClose}
      >
        <CloseIcon />
      </button>
    </div>
  )
}
