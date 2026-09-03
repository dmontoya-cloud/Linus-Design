import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { DashboardNavBar } from '../DashboardNavBar'
import { cascadeDelay } from '../cascade'
import styles from './ActivityDetailsPage.module.css'

const ACTIVITY_NAME = 'Lifestyle'

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
 * this prototype never shows two different estimates for the same activity, and now renders as
 * plain text with no leading `ClockIcon`, matching Figma's reference frame for this page (node
 * 657:948). "I'm ready" in the header (previously "Start Activity", with a trailing arrow that
 * grew in after a delay — both dropped, matching that same reference) is the only way forward on
 * this screen; it hands off to a not-yet-built placeholder for the actual question flow. A
 * dedicated "Back to dashboard" button (`.backButton`, outline/sm) now sits above the title, on
 * request, matching Figma — `DashboardNavBar`'s own "Exit" link is dropped in favor of it, so the
 * nav bar here shows just the logo and title.
 */
export function LifestyleDetailsPage() {
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
            <div className={styles.header}>
              <h1 className={styles.title}>{ACTIVITY_NAME}</h1>
              <Link
                to="/assessment/lifestyle/questions"
                className={buttonClassName('primary', 'lg')}
              >
                I&rsquo;m ready
              </Link>
            </div>
            <p className={styles.duration}>About 5 minutes</p>
          </div>
          <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
            <p className={styles.taskIntro}>
              Now, you will answer questions about your health and lifestyle.
            </p>
            <p className={styles.taskIntro}>
              Some questions only require a yes or no answer. If the question has multiple answers,
              tap all that apply to you.
            </p>
            <p className={styles.taskIntro}>
              You can change your answer anytime. Press the Next button to move forward or the Back
              button to return to a previous answer.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
