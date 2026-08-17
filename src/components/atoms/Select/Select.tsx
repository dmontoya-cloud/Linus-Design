import { useId, type SelectHTMLAttributes, type ReactNode } from 'react'
import fieldStyles from '../Field/Field.module.css'
import styles from './Select.module.css'

export type SelectSize = 'lg' | 'md' | 'sm'

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string
  size?: SelectSize
  error?: boolean
  helperText?: string
  children: ReactNode
  /** Suppresses the required-asterisk on the label while `required` still gates HTML5
   * validation as normal — for a form where every field is mandatory, so the asterisk
   * would tell the visitor nothing they don't already know. */
  hideRequiredMark?: boolean
}

/**
 * Atom/Select — the same outlined `field` container as Field, a real
 * `<select>` (native keyboard/screen-reader behavior) plus a drawn chevron.
 * The label sits on its own line above the field, same as Field.
 */
export function Select({
  label,
  size = 'md',
  error,
  helperText,
  id,
  className,
  disabled,
  required,
  hideRequiredMark,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const helperId = helperText ? `${selectId}-helper` : undefined
  const classes = [
    fieldStyles.field,
    fieldStyles[size],
    styles.select,
    error && fieldStyles.error,
    disabled && fieldStyles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const labelClasses = [
    fieldStyles.label,
    error && fieldStyles.labelError,
    disabled && fieldStyles.labelDisabled,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={fieldStyles.wrapper}>
      <label htmlFor={selectId} className={labelClasses}>
        {label}
        {required && !hideRequiredMark ? '*' : ''}
      </label>
      <div className={classes}>
        <select
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          {...props}
        >
          {children}
        </select>
        <span className={styles.chevron} aria-hidden="true" />
      </div>
      {helperText ? (
        <p id={helperId} className={error ? fieldStyles.helperError : fieldStyles.helper}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
