import type { ReactNode } from 'react'
import styles from './CheckboxCard.module.css'

interface CheckboxCardProps {
  children: ReactNode
}

/** Full-width white card (same surface/radius/shadow recipe as SummaryCard) wrapping a single
 * checkbox — first used on Legal Intro's age-18+ checkbox, now shared by Terms of Use and
 * Privacy Policy's own checkboxes too, so a lone checkbox never reads as floating loose on the
 * page background. */
export function CheckboxCard({ children }: CheckboxCardProps) {
  return <div className={styles.card}>{children}</div>
}
