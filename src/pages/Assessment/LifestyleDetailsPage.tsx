import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { ArrowRightBoldIcon, ClockIcon } from '@/components/atoms/Icon'
import { DashboardNavBar } from '../DashboardNavBar'
import { cascadeDelay } from '../cascade'
import styles from './ActivityDetailsPage.module.css'

const ACTIVITY_NAME = 'Lifestyle'

/** The arrow affordance on "Start Activity" appears after this delay, on request — same
 * treatment as `MemoryThinkingDetailsPage`'s own Start button (see that file for why). */
const START_ICON_DELAY_MS = 2000

/**
 * Lifestyle Details — the new step between Dashboard's Lifestyle card and its (not yet built)
 * question flow, on request: the same "what to expect before committing" beat
 * `MemoryThinkingDetailsPage` gives Memory & Thinking, reusing that page's own
 * `ActivityDetailsPage.module.css` for the shared header/title/duration/paragraph styling.
 * Simpler than that page, on request — no icon-tip row or numbered task list, since Lifestyle
 * is one continuous set of questions rather than discrete named sub-tasks; just the header and
 * three paragraphs explaining how answering works (yes/no vs. multi-select, and that Back/Next
 * let you revisit or change any answer). Duration matches the "About 5 minutes" estimate shown
 * everywhere else this activity appears (Dashboard's `ActivityCard`, `PENDING_ACTIVITIES`), so
 * this prototype never shows two different estimates for the same activity. "Start Activity" in
 * the header — the only way forward on this screen, on request — hands off to a not-yet-built
 * placeholder for the actual question flow; leaving goes through `DashboardNavBar`'s own "Exit"
 * link instead of a dedicated Back button.
 */
export function LifestyleDetailsPage() {
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
                to="/assessment/lifestyle/questions"
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
              About 5 minutes
            </p>
          </div>
          <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
            <p className={styles.taskIntro}>
              Now, you will answer questions about your health and lifestyle.
            </p>
            <p className={styles.taskIntro}>
              Some questions only require a yes or no answer. If the question has multiple
              answers, tap all that apply to you.
            </p>
            <p className={styles.taskIntro}>
              You can change your answer anytime. Press the Next button to move forward or the
              Back button to return to a previous answer.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
