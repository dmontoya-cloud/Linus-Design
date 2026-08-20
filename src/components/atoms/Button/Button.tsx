import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonClassName, type ButtonVariant, type ButtonSize } from './buttonClassName'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner over the label — for mocked async actions (email sign-in/confirm) that
   * need a visible in-flight state. The label stays in the DOM (invisible, not removed) so the
   * button keeps its exact resting width/height instead of shrinking to fit just the spinner.
   * Deliberately does NOT imply `disabled` — a loading button still reads and looks enabled
   * (same fill color, no `:disabled` styling), it just shows a spinner in place of the label;
   * pass `disabled` explicitly if a loading action should also block re-clicks. */
  loading?: boolean
}

/**
 * Atom/Button — 4 variants (primary/secondary/tertiary/danger) x 3 sizes
 * (lg/md/sm), ported from docs/design.md. Meets WCAG 2.2 AA target size at
 * every size (40px min) and exposes a visible focus ring; disabled state is
 * conveyed via the native `disabled` attribute so it stays out of the tab
 * order and is announced correctly.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = [buttonClassName(variant, size), className].filter(Boolean).join(' ')
  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      <span className={loading ? styles.labelHidden : undefined}>{children as ReactNode}</span>
      {loading ? (
        <span className={styles.spinnerOverlay}>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.srOnly}>Loading</span>
        </span>
      ) : null}
    </button>
  )
}
