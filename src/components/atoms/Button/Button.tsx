import type { ButtonHTMLAttributes } from 'react'
import { buttonClassName, type ButtonVariant } from './buttonClassName'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

/**
 * Atom/Button — from the Linus Web Design System (Figma: Atom/Button).
 * Meets WCAG 2.2 AA 24x24 minimum target size (uses 44x44 here) and exposes
 * a visible focus ring; disabled state is conveyed via the native `disabled`
 * attribute so it stays out of the tab order and is announced correctly.
 */
export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const classes = [buttonClassName(variant), className].filter(Boolean).join(' ')
  return <button type="button" className={classes} {...props} />
}
