import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Logo } from '@/components/atoms/Logo'
import { buttonClassName, type ButtonVariant } from '@/components/atoms/Button/buttonClassName'
import { SignOutIcon } from '@/components/atoms/Icon'
import styles from './DashboardNavBar.module.css'

const NAV_LINKS = [
  { to: '/assessment', label: 'Assessment' },
  { to: '/history', label: 'History' },
  { to: '/settings', label: 'Settings' },
]

function initialsFor(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export interface DashboardNavBarProps {
  /** When set, replaces the centered Assessment/History/Settings nav with this plain text
   * instead — for screens dedicated to one specific activity (e.g. "Memory & Thinking" on
   * Assessment Intro), where those nav links would be a distraction, not a real choice. */
  title?: string
  /** When set, replaces the signed-in user info on the right with an "Exit" link to this path
   * instead — for screens (like Assessment Intro) where leaving is the one thing that matters
   * here, not who's signed in. */
  exitTo?: string
  /** The Exit link's button style. Defaults to a plain tertiary text link; pass `'outline'` for
   * a bordered pill with a `SignOutIcon` alongside the label instead — every screen in the
   * assessment-intro-through-task flow (`AssessmentIntroPage`, `DeviceSetupPage`,
   * `DeviceReadyPage`, `ShoppingListIntroPage`) uses this, on request, so leaving looks the same
   * at every step of that flow; screens before it (Dashboard) keep the plain default. */
  exitVariant?: ButtonVariant
}

/**
 * DashboardNavBar — the same top bar (logo, and by default a centered primary nav plus
 * signed-in user info) shown on Dashboard and reused on every screen reached from it.
 * Assessment reads as active both on its own route and on /dashboard, since Dashboard has no
 * nav item of its own — landing there selects Assessment by default, as the primary thing to
 * do. Pass `title` to swap the center nav for plain static text, and/or `exitTo` to swap the
 * user info for an "Exit" link (`exitVariant` for its button style) — both independent (see
 * `DashboardNavBarProps`).
 */
export function DashboardNavBar({
  title,
  exitTo,
  exitVariant = 'tertiary',
}: DashboardNavBarProps = {}) {
  const { profile } = useAuth()
  const location = useLocation()
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'Account'

  return (
    <header className={styles.navBar}>
      <Link to="/" className={styles.logoLink} aria-label="Back to start">
        <Logo />
      </Link>
      {title ? (
        <span className={styles.navTitle}>{title}</span>
      ) : (
        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((link) => {
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
      )}
      {exitTo ? (
        <Link to={exitTo} className={`${buttonClassName(exitVariant, 'sm')} ${styles.exitLink}`}>
          {exitVariant === 'outline' ? <SignOutIcon className={styles.exitIcon} /> : null}
          Exit
        </Link>
      ) : (
        <div className={styles.userInfo}>
          <span className={styles.avatar} aria-hidden="true">
            {profile ? initialsFor(profile.firstName, profile.lastName) : '?'}
          </span>
          <span className={styles.userName}>{fullName}</span>
        </div>
      )}
    </header>
  )
}
