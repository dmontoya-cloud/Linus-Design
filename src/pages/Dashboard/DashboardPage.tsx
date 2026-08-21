import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Logo } from '@/components/atoms/Logo'
import { ActivityCard, type Activity } from './ActivityCard'
import { FullCheckInCard } from './FullCheckInCard'
import { ResourcesCard } from './ResourcesCard'
import { cascadeDelay } from '../cascade'
import styles from './DashboardPage.module.css'

const NAV_LINKS = [
  { to: '/assessment', label: 'Assessment' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
]

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
  },
  {
    id: 'speech-pattern',
    title: 'Lifestyle',
    status: 'not-started',
    duration: 'About 5–10 minutes',
    description: 'Fifteen short questions about sleep, movement, food, health and mood.',
  },
  {
    id: 'visual-attention',
    title: 'Priorities',
    status: 'not-started',
    duration: 'About 5–10 minutes',
    description:
      'Tell us in your own words what matters most to you. Your goals are then built around those things.',
  },
]

function initialsFor(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Dashboard — the post-onboarding home screen, reached once Login →
 * Onboarding → Gender & Identity all complete. Deliberately minimal: a quiet nav bar
 * (logo, centered primary links, user info) over a short welcome message. Below the
 * gradient full-check-in card and the three pending-activity cards sits `ResourcesCard`,
 * a fourth, plainer card pointing to the real Linus Health website for browsable content —
 * the one genuine external link in this prototype. Everything below the nav bar cascades in
 * on mount — the welcome title, the full-check-in card, the "Or just pick one" heading and
 * its subtext, each of the three activity cards in turn, then the resources card — the same
 * fade-rise-staggered-by-`cascadeDelay` rhythm the Terms of Use/Privacy Policy/Registration
 * flow already uses, so the whole app shares one entrance style rather than this page
 * appearing all at once while everything before it cascades. Assessment/History/Settings are
 * still PoD-4+ stubs, same as the other placeholders reachable from the prototype index.
 */
export function DashboardPage() {
  const { profile } = useAuth()
  const location = useLocation()
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'Account'

  return (
    <div className={styles.page}>
      <header className={styles.navBar}>
        <Link to="/" className={styles.logoLink} aria-label="Back to start">
          <Logo />
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((link) => {
            // Dashboard itself has no nav item of its own — landing here selects
            // Assessment by default, since that's the primary thing to do here.
            const isActive =
              location.pathname === link.to ||
              (link.to === '/assessment' && location.pathname === '/dashboard')
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                className={isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className={styles.userInfo}>
          <span className={styles.avatar} aria-hidden="true">
            {profile ? initialsFor(profile.firstName, profile.lastName) : '?'}
          </span>
          <span className={styles.userName}>{fullName}</span>
        </div>
      </header>

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
