import { Link } from 'react-router-dom'
import { useAuth } from '@/auth'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { CalendarIcon } from '@/components/atoms/Icon'
import { DashboardNavBar } from '../DashboardNavBar'
import { cascadeDelay } from '../cascade'
import { MemoryThinkingDetailsContent } from './MemoryThinkingDetailsContent'
import styles from './ActivityDetailsPage.module.css'

const ACTIVITY_NAME = 'Memory & Thinking'

/** A real minimum-wait-before-redoing rule, on request — unlike Lifestyle/Priorities, which can
 * be redone any time. This prototype has no real completion timestamp to count forward from
 * (just the boolean `completedActivityIds`), so the shown date is always this many months from
 * today, recomputed on every render — a stand-in for a real "redo eligible on" date once
 * completion timestamps exist. Display-only: nothing here actually blocks starting the activity
 * before that date, since there's no real date to check it against yet — on request, this is a
 * warning shown once someone's already completed it and lands back here, not a hard gate. */
const REDO_COOLDOWN_MONTHS = 3

function formatRedoDate(months: number): string {
  const redoDate = new Date()
  redoDate.setMonth(redoDate.getMonth() + months)
  return redoDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Memory & Thinking Details — the new step between Dashboard's "Start Activity"/"Start" and
 * the real task screens (`MemoryThinkingTaskPage`, at `/assessment`), on request: what to expect
 * before committing, not the "get ready" moment itself. Duration matches the "About 7–10
 * minutes" estimate shown everywhere else this activity appears (Dashboard's `ActivityCard`,
 * `PENDING_ACTIVITIES`), so this prototype never shows two different estimates for the same
 * activity, and now renders as plain text with no leading `ClockIcon`, matching Figma's
 * reference frame for this page (node 688:10322). "I'm ready" in the header (previously "Start
 * Activity", with a trailing arrow that grew in after a delay — both dropped, matching that same
 * reference) is the only way forward on this screen; it continues into the real intro flow at
 * `/assessment` unchanged, whether or not the redo notice below is showing — on request, the
 * card on Dashboard always lets you click through to here regardless of the cooldown, so this
 * page is where that choice is actually surfaced, not blocked. A dedicated "Back to dashboard"
 * button (`.backButton`, outline/sm) now sits above the title, on request, matching Figma —
 * `DashboardNavBar`'s own "Exit" link is dropped in favor of it, so the nav bar here shows just
 * the logo and title. `.redoNotice` (see `REDO_COOLDOWN_MONTHS`'s own doc comment for why the
 * date is always guessed, not real) only shows once `completedActivityIds` already has this
 * activity — on request, replacing the "Redo activity on {date}" label `ActivityCard` used to
 * show directly on Dashboard, which blocked seeing this page's own content without first reading
 * the date on that button.
 */
export function MemoryThinkingDetailsPage() {
  const { completedActivityIds } = useAuth()
  const isRedo = completedActivityIds.includes('memory-recall')

  return (
    <div className={styles.page}>
      <DashboardNavBar title={ACTIVITY_NAME} hideAccountMenu />
      <main className={styles.content}>
        <div className={styles.card}>
          <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
            <Link
              to="/dashboard"
              className={`${buttonClassName('outline', 'sm')} ${styles.backButton}`}
            >
              Back to dashboard
            </Link>
            {isRedo && (
              <p className={styles.redoNotice}>
                <CalendarIcon className={styles.redoNoticeIcon} />
                You already completed this activity. For the most accurate results, wait until{' '}
                {formatRedoDate(REDO_COOLDOWN_MONTHS)} before taking it again.
              </p>
            )}
            <div className={styles.header}>
              <h1 className={styles.title}>{ACTIVITY_NAME}</h1>
              <Link to="/assessment" className={buttonClassName('primary', 'lg')}>
                I&rsquo;m ready
              </Link>
            </div>
            <p className={styles.duration}>About 7–10 minutes</p>
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
