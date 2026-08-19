import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoadingPage.module.css'

/** Total time this screen stays up before handing off to /dashboard. */
const LOADING_DURATION_MS = 2000

/**
 * Loading — a brief, non-interactive interstitial shown right after Education, the last
 * onboarding step, before Dashboard. Mirrors Setting Up's and Thanks's own spinner
 * pattern: no user action, just a beat while the mock Profile "finishes saving" before
 * Dashboard appears.
 */
export function LoadingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/dashboard', { replace: true })
    }, LOADING_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.spinnerWrap}>
          <div className={styles.spinnerPulse}>
            <div className={styles.spinnerRing} aria-hidden="true" />
          </div>
        </div>
        <p className={styles.message} role="status" aria-live="polite">
          Loading
        </p>
      </div>
    </main>
  )
}
