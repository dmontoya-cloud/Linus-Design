import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Logo } from '@/components/atoms/Logo'
import { Button } from '@/components/atoms/Button'
import { buttonClassName, type ButtonVariant } from '@/components/atoms/Button/buttonClassName'
import { Modal } from '@/components/atoms/Modal'
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
   * assessment-intro-through-task flow (`MemoryThinkingTaskPage`, the Lifestyle/Priorities
   * Details/question-flow pages) uses this, on request, so leaving looks the same at every step
   * of that flow; screens before it (Dashboard) keep the plain default. */
  exitVariant?: ButtonVariant
  /** The Exit link's label. Defaults to "Exit"; Profile uses "Back to Dashboard" instead, on
   * request, since it's a settings-style screen rather than a step in a flow. */
  exitLabel?: string
  /** When true, clicking the Exit link opens an "Exit activity?" confirmation modal instead of
   * navigating straight to `exitTo` — on request, for the three in-progress activity screens
   * (`MemoryThinkingTaskPage`, `LifestyleQuestionsPage`, `PrioritiesQuestionsPage`) where
   * leaving loses unsaved answers. Profile's own "Back to Dashboard" link has nothing to lose,
   * so it leaves this off and keeps the old direct-navigation behavior. */
  confirmExit?: boolean
  /** When true, renders neither the signed-in user info nor an `exitTo` link — just the logo and
   * `title` — for screens (like the activity Details pages) that put their own way back
   * elsewhere on the page instead of in this header, on request. */
  hideAccountMenu?: boolean
}

/**
 * DashboardNavBar — the same top bar (logo, an optional centered title, and by default the
 * signed-in user info) shown on Dashboard and reused on every screen reached from it. The
 * centered Assessment/History/Settings links this used to show on Dashboard were removed on
 * request; Dashboard's header center is simply empty now. Pass `title` for plain centered
 * static text on screens dedicated to one activity, and/or `exitTo` to swap the user info for
 * an "Exit" link (`exitVariant` for its button style) — both independent (see
 * `DashboardNavBarProps`). Pass `hideAccountMenu` instead of `exitTo` to render neither — for
 * screens (the activity Details pages) that put their own way back elsewhere on the page.
 */
export function DashboardNavBar({
  title,
  exitTo,
  exitVariant = 'tertiary',
  exitLabel = 'Exit',
  confirmExit = false,
  hideAccountMenu = false,
}: DashboardNavBarProps = {}) {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : 'Account'
  const [menuOpen, setMenuOpen] = useState(false)
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
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

  function handleExitClick(event: MouseEvent) {
    if (!confirmExit) return
    event.preventDefault()
    setExitConfirmOpen(true)
  }

  function handleConfirmedExit() {
    setExitConfirmOpen(false)
    if (exitTo) navigate(exitTo)
  }

  return (
    <>
      <header className={styles.navBar}>
        <Link to="/" className={styles.logoLink} aria-label="Back to start">
          <Logo />
        </Link>
        {title ? <span className={styles.navTitle}>{title}</span> : null}
        {exitTo ? (
          <Link
            to={exitTo}
            onClick={handleExitClick}
            className={`${buttonClassName(exitVariant, 'sm')} ${styles.exitLink}`}
          >
            {exitVariant === 'outline' ? <SignOutIcon className={styles.exitIcon} /> : null}
            {exitLabel}
          </Link>
        ) : hideAccountMenu ? null : (
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
      {confirmExit && exitTo ? (
        <Modal
          open={exitConfirmOpen}
          onClose={() => setExitConfirmOpen(false)}
          title="Are you sure you want to exit?"
          size="sm"
          footer={
            <>
              <Button type="button" variant="secondary" onClick={handleConfirmedExit}>
                Exit without saving
              </Button>
              <Button type="button" variant="primary" onClick={() => setExitConfirmOpen(false)}>
                Keep going
              </Button>
            </>
          }
        >
          <p>
            Your answers will not be saved. Because of how this activity is scored, starting again
            later means repeating it from the beginning.
          </p>
        </Modal>
      ) : null}
    </>
  )
}
