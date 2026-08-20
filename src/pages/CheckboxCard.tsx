import type { ReactNode } from 'react'
import styles from './CheckboxCard.module.css'

interface CheckboxCardProps {
  children: ReactNode
  /** Extra class on the card, e.g. for a page that wants the same surface/radius but not the
   * shadow (see LoginPage). */
  className?: string
}

/** Full-width white card (same surface/radius/shadow recipe as SummaryCard) wrapping a single
 * checkbox — first used on Legal Intro's age-18+ checkbox, now shared by Terms of Use and
 * Privacy Policy's own checkboxes too, so a lone checkbox never reads as floating loose on the
 * page background. */
export function CheckboxCard({ children, className }: CheckboxCardProps) {
  return <div className={[styles.card, className].filter(Boolean).join(' ')}>{children}</div>
}
