import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/auth'
import { DashboardNavBar } from '../DashboardNavBar'
import { ActivityCard, type Activity } from './ActivityCard'
import { FullCheckInCard } from './FullCheckInCard'
import { PostReportSurvey } from './PostReportSurvey'
import { ResourcesCard } from './ResourcesCard'
import { cascadeDelay } from '../cascade'
import styles from './DashboardPage.module.css'

/** Mock pending activities — this repo has no real backend, so this list is a fixed
 * placeholder, not fetched or personalized. `status` here is just each activity's default —
 * DashboardPage overrides it per-render from `useAuth().completedActivityIds`, the one piece of
 * real (if entirely client-side) completion state this prototype has. */
const PENDING_ACTIVITIES: Activity[] = [
  {
    id: 'memory-recall',
    title: 'Memory & Thinking',
    status: 'not-started',
    duration: 'About 7–10 minutes',
    requirement: 'Needs quiet room',
    description:
      'Tasks that look at your brain abilities: memory, attention, language and thinking.',
    startPath: '/assessment/start',
  },
  {
    id: 'speech-pattern',
    title: 'Lifestyle',
    status: 'not-started',
    duration: 'About 5 minutes',
    description: 'Tell us about your lifestyle, health, and everyday habits.',
    startPath: '/assessment/lifestyle',
  },
  {
    id: 'visual-attention',
    title: 'Priorities',
    status: 'not-started',
    duration: 'About 7 minutes',
    description: 'Share what matters most to you and what you want to keep doing in daily life.',
    startPath: '/assessment/priorities',
  },
]

/** How long Dashboard waits after mount before showing `PostReportSurvey`, on request — the
 * page loads and settles first, then the survey pushes in a beat later, rather than both
 * appearing at once. */
const SURVEY_DELAY_MS = 1000

/**
 * Dashboard — the post-onboarding home screen, reached once Login →
 * Onboarding → Gender & Identity all complete. Deliberately minimal: `DashboardNavBar`'s quiet
 * nav bar (logo, user info, empty center — the Assessment/History/Settings links that used to
 * sit there were removed on request) — shared with Assessment Intro and every other screen
 * reached from here — over a short welcome message (name plus a friendly subline, on request).
 * Below the gradient full-check-in card and the three pending-activity
 * cards sits its own "Learn more about brain health" heading, then `ResourcesCard`, a fourth,
 * plainer card pointing to the real Linus Health website for browsable content — the one
 * genuine external link in this prototype. Everything below the nav bar cascades in on mount —
 * the welcome title, the full-check-in card, the "Explore one area" heading and its subtext,
 * each of the three activity cards in turn, then the resources heading and card — the same
 * fade-rise-staggered-by-`cascadeDelay` rhythm the Terms of Use/Privacy Policy/Registration
 * flow already uses, so the whole app shares one entrance style rather than this page
 * appearing all at once while everything before it cascades. The full check-in button and
 * Memory & Thinking's Start both hand off to the real Assessment Intro screen (`/assessment`);
 * Lifestyle/Priorities' Start buttons and History/Settings are still PoD-4+ stubs, same as the
 * other placeholders reachable from the prototype index.
 *
 * `PostReportSurvey` renders as a fixed bottom-right card once `location.state.showSurvey` is
 * set, on request — only `ReportPage`'s Download button hands off with that flag, so the survey
 * shows once an actual download happens, not on every Dashboard visit. Delayed by
 * `SURVEY_DELAY_MS` after mount, on request, so Dashboard itself loads and settles first rather
 * than the survey pushing in at the same instant as everything else's own cascade-in.
 */
export function DashboardPage() {
  const { profile, completedActivityIds } = useAuth()
  const location = useLocation()
  const [showSurvey, setShowSurvey] = useState(false)

  useEffect(() => {
    const wasReportDownloaded =
      (location.state as { showSurvey?: boolean } | null)?.showSurvey === true
    if (!wasReportDownloaded) return
    const timer = window.setTimeout(() => setShowSurvey(true), SURVEY_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [location.state])

  return (
    <div className={styles.page}>
      <DashboardNavBar />

      <main className={styles.content}>
        <h1
          className={[styles.welcome, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(0) }}
        >
          Welcome, {profile?.firstName ?? 'there'}!{' '}
          <span className={styles.welcomeSubtext}>We&rsquo;re so glad you&rsquo;re here.</span>
        </h1>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
          <FullCheckInCard />
        </div>
        <h2
          className={[styles.copy, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(2) }}
        >
          Explore one area
        </h2>
        <p
          className={[styles.copySubtext, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(3) }}
        >
          You can complete each activity one at a time. Each adds more information to your brain
          health report.
        </p>
        <ul className={styles.activityGrid}>
          {PENDING_ACTIVITIES.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={{
                ...activity,
                status: completedActivityIds.includes(activity.id) ? 'completed' : 'not-started',
              }}
              style={{ animationDelay: cascadeDelay(4 + index) }}
            />
          ))}
        </ul>
        <h2
          className={[styles.copy, styles.copyNoSubtext, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(4 + PENDING_ACTIVITIES.length) }}
        >
          Learn more about brain health
        </h2>
        <div
          className={styles.reveal}
          style={{ animationDelay: cascadeDelay(5 + PENDING_ACTIVITIES.length) }}
        >
          <ResourcesCard />
        </div>
      </main>
      {showSurvey ? <PostReportSurvey onClose={() => setShowSurvey(false)} /> : null}
    </div>
  )
}
