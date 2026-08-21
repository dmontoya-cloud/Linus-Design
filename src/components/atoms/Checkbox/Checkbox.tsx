import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** A plain string covers most cases; ReactNode is there for labels that need inline
   * emphasis — a bold "Required." or "Optional." clause, both styled the same way so
   * neither reads as more or less important than the other. */
  label: ReactNode
  error?: boolean
}

/**
 * Atom/Checkbox — ported from docs/design.md. `border-strong` at rest,
 * `primary` once checked, `border-danger` for a required-checkbox
 * validation failure. `rounded.sm` corners — soft, not sharp, consistent
 * with the rest of the system even at a 20px control size.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, className, disabled, ...props },
  ref,
) {
  const classes = [styles.item, error && styles.error, className].filter(Boolean).join(' ')
  return (
    <label className={classes}>
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        aria-invalid={error || undefined}
        {...props}
      />
      <span className={styles.label}>{label}</span>
    </label>
  )
})
