import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

/** Returns the visual class for a variant, so non-<button> elements (e.g. router Links used as CTAs) can share the same look. */
export function buttonClassName(variant: ButtonVariant = 'primary'): string {
  return `${styles.button} ${styles[variant]}`
}
