import type { ReactNode } from 'react'
import styles from './LegalTextBox.module.css'

interface LegalTextBoxProps {
  paragraphs: ReactNode[]
}

/** Full legal text (Terms of Use, Privacy Policy) — plain flowing text in the same card look
 * as SummaryCard (radius, shadow, padding), growing to fit its content rather than being
 * height-constrained or scrollable. Replaces the earlier ScrollGatedLegalText, which required
 * scrolling to the end before the agree checkbox would enable — removed on request in favor of
 * a checkbox that's simply enabled from the start. */
export function LegalTextBox({ paragraphs }: LegalTextBoxProps) {
  return (
    <div className={styles.box}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}
