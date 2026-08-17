import type { ReactNode } from 'react'
import { cascadeDelay } from './cascade'
import styles from './SummaryCard.module.css'

export interface SummarySection {
  heading: string
  body: ReactNode
}

interface SummaryCardProps {
  sections: SummarySection[]
  /** Rendered after the sections, inside the same card — e.g. a "Read full legal text" link. */
  footer?: ReactNode
}

/** Shared white card (Terms of Use, Privacy Policy) — a short plain-language summary broken
 * into named sections, each divided by a thin rule. Sections cascade in one at a time rather
 * than appearing all at once — each is a CSS grid row animating from `0fr` to `1fr` (so the
 * card visibly grows as every section reveals, without guessing a fixed max-height) plus a
 * fade/rise, staggered by `cascadeDelay`; the footer continues the same rhythm one step after
 * the last section. */
export function SummaryCard({ sections, footer }: SummaryCardProps) {
  return (
    <div className={styles.card}>
      {sections.map((section, index) => (
        <div
          key={section.heading}
          className={styles.section}
          style={{ animationDelay: cascadeDelay(index) }}
        >
          <div className={styles.sectionInner}>
            <h2 className={styles.heading}>{section.heading}</h2>
            <p className={styles.body}>{section.body}</p>
          </div>
        </div>
      ))}
      {footer ? (
        <div className={styles.footer} style={{ animationDelay: cascadeDelay(sections.length) }}>
          {footer}
        </div>
      ) : null}
    </div>
  )
}
