import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import styles from './ThanksPage.module.css'

/** Total time this screen stays up before handing off to /onboarding. */
const THANKS_DURATION_MS = 2000

/**
 * Thanks — a brief, non-interactive interstitial shown right after Setting
 * Up, before Registration ("Tell us about yourself"). Mirrors Setting Up's
 * own spinner pattern: no user action, just a beat that greets the visitor
 * by the preferred name they gave on Legal Intro before the registration
 * form appears.
 */
export function ThanksPage() {
  const { preferredName } = useAuth()
  const name = (preferredName ?? '').trim()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/onboarding', { replace: true })
    }, THANKS_DURATION_MS)
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
          {name ? `Thanks, ${name}!` : 'Thanks!'}
        </p>
      </div>
    </main>
  )
}
