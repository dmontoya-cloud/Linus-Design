import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { buttonClassName, type ButtonVariant, type ButtonSize } from './buttonClassName'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner in place of the label and disables the button — for mocked async actions (magic-link send/confirm) that need a visible in-flight state. */
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
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.srOnly}>Loading</span>
        </>
      ) : (
        (children as ReactNode)
      )}
    </button>
  )
}
