import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SettingUpPage.module.css'

/** Total time this screen stays up before handing off to /onboarding. */
const SETTING_UP_DURATION_MS = 2000

/**
 * Setting Up — a brief, non-interactive interstitial shown right after
 * Consent, before Registration ("Tell us about yourself"). Mirrors Verify
 * Account's spinner pattern: no user action, just a beat to mark that
 * consent was recorded before the registration form appears.
 */
export function SettingUpPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/onboarding', { replace: true })
    }, SETTING_UP_DURATION_MS)
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
          Setting up your account
        </p>
      </div>
    </main>
  )
}
