import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Logo } from '@/components/atoms/Logo'
import { ActivityCard, type Activity } from './ActivityCard'
import styles from './DashboardPage.module.css'

const NAV_LINKS = [
  { to: '/assessment', label: 'Assessment' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
]

/** Mock pending activities — this repo has no real backend, so this list is
 * a fixed placeholder, not fetched or personalized. */
const PENDING_ACTIVITIES: Activity[] = [
  {
    id: 'memory-recall',
    title: 'Memory Recall',
    estimatedMinutes: 5,
    description: 'A short exercise to assess your short-term memory.',
    indication: 'Find a quiet space with no distractions.',
  },
  {
    id: 'speech-pattern',
    title: 'Speech Pattern Analysis',
    estimatedMinutes: 3,
    description: 'Speak a few prompted phrases to assess your speech fluency.',
    indication: 'Speak clearly into your microphone.',
  },
  {
    id: 'visual-attention',
    title: 'Visual Attention Test',
    estimatedMinutes: 7,
    description: 'Track and respond to visual and audio cues to measure attention span.',
    indication: 'Use headphones for the audio cues.',
  },
]

function initialsFor(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

/**
 * Dashboard — the post-onboarding home screen, reached once Login →
 * Onboarding → Consent all complete. Deliberately minimal: a quiet nav bar
 * (logo, centered primary links, user info) over a short welcome message.
 * Assessment/History/Settings are still PoD-4+ stubs, same as the other
 * placeholders reachable from the prototype index.
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
        <h1 className={styles.welcome}>Welcome back, {profile?.firstName ?? 'there'}</h1>
        <h2 className={styles.copy}>You have {PENDING_ACTIVITIES.length} activities pending.</h2>
        <ul className={styles.activityGrid}>
          {PENDING_ACTIVITIES.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </ul>
      </main>
    </div>
  )
}
