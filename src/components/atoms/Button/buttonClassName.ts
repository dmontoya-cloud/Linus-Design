import styles from './Button.module.css'

/**
 * `primary`/`secondary`/`tertiary` match docs/design.md's button spec exactly.
 * `danger` is a 4th variant kept for real destructive actions (e.g. "Delete
 * assessment") — design.md's button spec never covered one, so this reuses
 * the existing `danger`/`danger-soft` semantic tokens rather than inventing
 * new ones. `outline` is a 5th variant for a quiet, bordered pill (the
 * Terms/Privacy flow's "Help" and "Back" actions) — reuses `border`/
 * `text-primary`, no new tokens either.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'outline'
export type ButtonSize = 'lg' | 'md' | 'sm'

/** Returns the visual class for a variant/size, so non-<button> elements (e.g. router Links used as CTAs) can share the same look. */
export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
): string {
  return `${styles.button} ${styles[variant]} ${styles[size]}`
}
