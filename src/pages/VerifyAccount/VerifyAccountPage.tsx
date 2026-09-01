import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import styles from './VerifyAccountPage.module.css'

/** Total time this screen stays up before handing off to /legal-intro. */
const VERIFY_DURATION_MS = 3000

/**
 * Verify Account — a brief, non-interactive interstitial shown after Verify
 * Email's own mock wait completes. `login()` is deliberately deferred until
 * this screen's timer finishes rather than fired by the caller, so
 * `isAuthenticated` flips at the same moment the user actually lands on
 * /legal-intro, not a few seconds earlier while they're still watching a
 * spinner.
 */
export function VerifyAccountPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      login()
      navigate('/legal-intro', { replace: true })
    }, VERIFY_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [login, navigate])

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.spinnerWrap}>
          <div className={styles.spinnerPulse}>
            <div className={styles.spinnerRing} aria-hidden="true" />
          </div>
        </div>
        <p className={styles.message} role="status" aria-live="polite">
          Welcome to Linus Health
        </p>
      </div>
    </main>
  )
}
