import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { ArrowRightBoldIcon, ClockIcon } from '@/components/atoms/Icon'
import { DashboardNavBar } from '../DashboardNavBar'
import { cascadeDelay } from '../cascade'
import styles from './ActivityDetailsPage.module.css'
import prioritiesStyles from './PrioritiesDetailsPage.module.css'

const ACTIVITY_NAME = 'Priorities'

/** The five topics the real Priorities activity will ask about, transcribed from Figma (node
 * 600:9441) in the order shown there. */
const TOPICS = [
  'Daily tasks',
  'Enjoying life',
  'Relationships and social connections',
  'Thinking skills',
  'Sense of who you are as a person',
]

/** The arrow affordance on "Start Activity" appears after this delay, on request — same
 * treatment as `MemoryThinkingDetailsPage`/`LifestyleDetailsPage`'s own Start button. */
const START_ICON_DELAY_MS = 2000

/**
 * Priorities Details — the new step between Dashboard's Priorities card and its (not yet
 * built) question flow, on request: the same "what to expect before committing" beat
 * `MemoryThinkingDetailsPage`/`LifestyleDetailsPage` give their own activities, reusing
 * `ActivityDetailsPage.module.css` for the shared header/title/duration/paragraph styling.
 * Body content is transcribed from Figma (node 600:9441) rather than drafted from scratch, on
 * request — a left-aligned "Learning what is important to you" sub-heading (its own one-off
 * size/color, `PrioritiesDetailsPage.module.css`, since it doesn't match an existing type-scale
 * step), two intro paragraphs, a bulleted list of the five topics the real activity covers, and
 * two closing paragraphs on there being no wrong answers. Duration matches the "About 7
 * minutes" estimate shown everywhere else this activity appears (Dashboard's `ActivityCard`,
 * `PENDING_ACTIVITIES`), so this prototype never shows two different estimates for the same
 * activity. "Start Activity" in the header — the only way forward on this screen, on request —
 * hands off to a not-yet-built placeholder for the actual question flow, the same pattern
 * `LifestyleDetailsPage` uses for its own; leaving goes through `DashboardNavBar`'s own "Exit"
 * link instead of a dedicated Back button.
 */
export function PrioritiesDetailsPage() {
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
                to="/assessment/priorities/questions"
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
              About 7 minutes
            </p>
          </div>
          <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
            <h2 className={prioritiesStyles.subheading}>Learning what is important to you</h2>
            <p className={styles.taskIntro}>
              Please think about all the things you use your brain for. What are some of the most
              important things that matter to you?
            </p>
            <p className={styles.taskIntro}>
              These are things you want to be able to continue doing even if your brain health got
              worse through conditions such as Alzheimer&rsquo;s disease.
            </p>
            <p className={prioritiesStyles.topicsLead}>We will show you five topics:</p>
            <ul className={prioritiesStyles.topicsList}>
              {TOPICS.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
            <p className={styles.taskIntro}>
              Please use your own words to tell us what matters to you in these topics.
            </p>
            <p className={styles.taskIntro}>
              There are no wrong answers. These are personally meaningful things to you. Feel free
              to name anything at all that is important for you to hold on to.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
