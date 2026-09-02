import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Logo } from '@/components/atoms/Logo'
import { buttonClassName, type ButtonVariant } from '@/components/atoms/Button/buttonClassName'
import { SignOutIcon, UserIcon } from '@/components/atoms/Icon'
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
  /** The Exit link's label. Defaults to "Exit"; Profile uses "Back to Dashboard" instead, on
   * request, since it's a settings-style screen rather than a step in a flow. */
  exitLabel?: string
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
  exitLabel = 'Exit',
}: DashboardNavBarProps = {}) {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'Account'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Closes on an outside click/tap or Escape — a menu with no way to dismiss it other than
  // picking an option would trap keyboard and pointer users alike.
  useEffect(() => {
    if (!menuOpen) {
      return
    }
    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  function handleSignOut() {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header className={styles.navBar}>
      <Link to="/" className={styles.logoLink} aria-label="Back to start">
        <Logo />
      </Link>
      {title ? <span className={styles.navTitle}>{title}</span> : null}
      {exitTo ? (
        <Link to={exitTo} className={`${buttonClassName(exitVariant, 'sm')} ${styles.exitLink}`}>
          {exitVariant === 'outline' ? <SignOutIcon className={styles.exitIcon} /> : null}
          {exitLabel}
        </Link>
      ) : (
        <div className={styles.userMenu} ref={menuRef}>
          <button
            type="button"
            className={styles.userInfo}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="account-menu"
          >
            <span className={styles.avatar} aria-hidden="true">
              {profile ? initialsFor(profile.firstName, profile.lastName) : '?'}
            </span>
            <span className={styles.userName}>{fullName}</span>
          </button>
          {menuOpen ? (
            <div className={styles.menu} id="account-menu">
              <Link to="/profile" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                <UserIcon className={styles.menuItemIcon} />
                Profile
              </Link>
              <hr className={styles.menuDivider} />
              <button type="button" className={styles.menuItem} onClick={handleSignOut}>
                <SignOutIcon className={styles.menuItemIcon} />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      )}
    </header>
  )
}
