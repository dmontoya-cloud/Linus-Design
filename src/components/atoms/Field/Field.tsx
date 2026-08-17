import { useId, type InputHTMLAttributes } from 'react'
import styles from './Field.module.css'

export type FieldSize = 'lg' | 'md' | 'sm'

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  size?: FieldSize
  error?: boolean
  helperText?: string
  /** Suppresses the required-asterisk on the label while `required` still gates HTML5
   * validation as normal — for a form where every field is mandatory, so the asterisk
   * would tell the visitor nothing they don't already know. */
  hideRequiredMark?: boolean
}

/**
 * Atom/Field — an outlined text field with its label displayed as its own
 * line above the field, always present regardless of focus/value (no
 * notching into the border, no floating/placeholder-becomes-label
 * transition). A real `placeholder`, if given, renders as an actual
 * placeholder inside the field — entirely optional.
 */
export function Field({
  label,
  size = 'md',
  error,
  helperText,
  id,
  className,
  disabled,
  placeholder,
  required,
  hideRequiredMark,
  ...props
}: FieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const helperId = helperText ? `${inputId}-helper` : undefined
  const classes = [
    styles.field,
    styles[size],
    error && styles.error,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const labelClasses = [styles.label, error && styles.labelError, disabled && styles.labelDisabled]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.wrapper}>
      <label htmlFor={inputId} className={labelClasses}>
        {label}
        {required && !hideRequiredMark ? '*' : ''}
      </label>
      <div className={classes}>
        <input
          id={inputId}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          {...props}
        />
      </div>
      {helperText ? (
        <p id={helperId} className={error ? styles.helperError : styles.helper}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
