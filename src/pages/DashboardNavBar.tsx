import { Link } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Logo } from '@/components/atoms/Logo'
import { buttonClassName, type ButtonVariant } from '@/components/atoms/Button/buttonClassName'
import { SignOutIcon } from '@/components/atoms/Icon'
import styles from './DashboardNavBar.module.css'

function initialsFor(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export interface DashboardNavBarProps {
  /** Plain centered text, e.g. "Memory & Thinking" on Assessment Intro — for screens dedicated
   * to one specific activity. Dashboard itself passes nothing, so its header center is empty
   * (the Assessment/History/Settings links that used to live there were removed on request). */
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
 * DashboardNavBar — the same top bar (logo, an optional centered title, and by default the
 * signed-in user info) shown on Dashboard and reused on every screen reached from it. The
 * centered Assessment/History/Settings links this used to show on Dashboard were removed on
 * request; Dashboard's header center is simply empty now. Pass `title` for plain centered
 * static text on screens dedicated to one activity, and/or `exitTo` to swap the user info for
 * an "Exit" link (`exitVariant` for its button style) — both independent (see
 * `DashboardNavBarProps`).
 */
export function DashboardNavBar({
  title,
  exitTo,
  exitVariant = 'tertiary',
}: DashboardNavBarProps = {}) {
  const { profile } = useAuth()
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'Account'

  return (
    <header className={styles.navBar}>
      <Link to="/" className={styles.logoLink} aria-label="Back to start">
        <Logo />
      </Link>
      {title ? <span className={styles.navTitle}>{title}</span> : null}
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
