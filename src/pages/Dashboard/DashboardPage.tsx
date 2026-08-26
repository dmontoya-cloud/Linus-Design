import { useAuth } from '@/auth'
import { DashboardNavBar } from '../DashboardNavBar'
import { ActivityCard, type Activity } from './ActivityCard'
import { FullCheckInCard } from './FullCheckInCard'
import { ResourcesCard } from './ResourcesCard'
import { cascadeDelay } from '../cascade'
import styles from './DashboardPage.module.css'

/** Mock pending activities — this repo has no real backend, so this list is a fixed
 * placeholder, not fetched or personalized. Every activity here is `'not-started'` since
 * there's no real assessment flow yet to actually progress or complete one. */
const PENDING_ACTIVITIES: Activity[] = [
  {
    id: 'memory-recall',
    title: 'Memory & Thinking',
    status: 'not-started',
    duration: 'About 15 minutes',
    requirement: 'Needs quiet room',
    description:
      'Listening, speaking and recall tasks. They measure memory, attention, language and thinking.',
    startPath: '/assessment',
  },
  {
    id: 'speech-pattern',
    title: 'Lifestyle',
    status: 'not-started',
    duration: 'About 5–10 minutes',
    description: 'Fifteen short questions about sleep, movement, food, health and mood.',
    startPath: '/assessment/lifestyle',
  },
  {
    id: 'visual-attention',
    title: 'Priorities',
    status: 'not-started',
    duration: 'About 5–10 minutes',
    description:
      'Tell us in your own words what matters most to you. Your goals are then built around those things.',
    startPath: '/assessment/priorities',
  },
]

/**
 * Dashboard — the post-onboarding home screen, reached once Login →
 * Onboarding → Gender & Identity all complete. Deliberately minimal: `DashboardNavBar`'s quiet
 * nav bar (logo, centered primary links, user info) — shared with Assessment Intro and every
 * other screen reached from here — over a short welcome message. Below the gradient
 * full-check-in card and the three pending-activity cards sits `ResourcesCard`, a fourth,
 * plainer card pointing to the real Linus Health website for browsable content — the one
 * genuine external link in this prototype. Everything below the nav bar cascades in on mount —
 * the welcome title, the full-check-in card, the "Or just pick one" heading and its subtext,
 * each of the three activity cards in turn, then the resources card — the same
 * fade-rise-staggered-by-`cascadeDelay` rhythm the Terms of Use/Privacy Policy/Registration
 * flow already uses, so the whole app shares one entrance style rather than this page
 * appearing all at once while everything before it cascades. The full check-in button and
 * Memory & Thinking's Start both hand off to the real Assessment Intro screen (`/assessment`);
 * Lifestyle/Priorities' Start buttons and History/Settings are still PoD-4+ stubs, same as the
 * other placeholders reachable from the prototype index.
 */
export function DashboardPage() {
  const { profile } = useAuth()

  return (
    <div className={styles.page}>
      <DashboardNavBar />

      <main className={styles.content}>
        <h1
          className={[styles.welcome, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(0) }}
        >
          Welcome, {profile?.firstName ?? 'there'}
        </h1>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
          <FullCheckInCard />
        </div>
        <h2
          className={[styles.copy, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(2) }}
        >
          Or just pick one
        </h2>
        <p
          className={[styles.copySubtext, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(3) }}
        >
          Each check-in works on its own. Take them in any order. Your report updates each time.
        </p>
        <ul className={styles.activityGrid}>
          {PENDING_ACTIVITIES.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              style={{ animationDelay: cascadeDelay(4 + index) }}
            />
          ))}
        </ul>
        <div
          className={styles.reveal}
          style={{ animationDelay: cascadeDelay(4 + PENDING_ACTIVITIES.length) }}
        >
          <ResourcesCard />
        </div>
      </main>
    </div>
  )
}
