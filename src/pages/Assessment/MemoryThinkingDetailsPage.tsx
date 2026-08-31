import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { ArrowRightBoldIcon, ClockIcon } from '@/components/atoms/Icon'
import { DashboardNavBar } from '../DashboardNavBar'
import { cascadeDelay } from '../cascade'
import { MemoryThinkingDetailsContent } from './MemoryThinkingDetailsContent'
import styles from './MemoryThinkingDetailsPage.module.css'

const ACTIVITY_NAME = 'Memory & Thinking'

/** The arrow affordance on "Start Activity" appears after this delay, on request — plain
 * text-only at first, then a trailing arrow grows and fades in to hint the button is
 * clickable. The icon is always mounted (see `.startIcon`/`.startIconVisible`) and animated
 * via CSS width/opacity/margin transitions, rather than conditionally rendered — a mount/
 * unmount swap can't be smoothly transitioned the way toggling a class can. */
const START_ICON_DELAY_MS = 2000

/**
 * Memory & Thinking Details — the new step between Dashboard's "Start Activity"/"Start" and
 * the existing voice-over intro screen (`AssessmentIntroPage`), on request: what to expect
 * before committing, not the "get ready" moment itself. Duration matches the "About 15
 * minutes" estimate shown everywhere else this activity appears (Dashboard's `ActivityCard`,
 * `PENDING_ACTIVITIES`) rather than the reference mock's own "5–10 minutes", so this prototype
 * never shows two different estimates for the same activity. "Start Activity" in the header —
 * the only way forward on this screen, on request — continues into the real intro flow at
 * `/assessment` unchanged; leaving goes through `DashboardNavBar`'s own "Exit" link instead of
 * a dedicated Back button.
 */
export function MemoryThinkingDetailsPage() {
  const [showStartIcon, setShowStartIcon] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowStartIcon(true), START_ICON_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className={styles.page}>
      <DashboardNavBar title={ACTIVITY_NAME} exitTo="/dashboard" exitVariant="outline" />
      <main className={styles.content}>
        <div className={styles.card}>
          <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
            <div className={styles.header}>
              <h1 className={styles.title}>{ACTIVITY_NAME}</h1>
              <Link
                to="/assessment"
                className={`${buttonClassName('primary', 'md')} ${styles.startButton}`}
              >
                Start Activity
                <ArrowRightBoldIcon
                  className={[styles.startIcon, showStartIcon ? styles.startIconVisible : '']
                    .filter(Boolean)
                    .join(' ')}
                />
              </Link>
            </div>
            <p className={styles.duration}>
              <ClockIcon className={styles.durationIcon} />
              About 15 minutes
            </p>
            <hr className={styles.divider} />
          </div>
          <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
            <MemoryThinkingDetailsContent />
          </div>
        </div>
      </main>
    </div>
  )
}
