import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field } from '@/components/atoms/Field'
import { Button } from '@/components/atoms/Button'
import { Logo } from '@/components/atoms/Logo'
import styles from './LoginPage.module.css'

/** Fake network delay for the mocked magic-link request, just long enough for the loading state to be visible. */
const MOCK_AUTH_DELAY_MS = 900

/**
 * Login — magic-link only. This repo is mock-data-only (no real backend),
 * so "logging in" is a mock, on a fake delay so the loading state is
 * visible. This doesn't call `login()` directly — it hands off to
 * /verify-email, then /verify-account, which owns the actual
 * `isAuthenticated` flip once its own verifying animation finishes.
 * Login is a gate before the onboarding process, not a step within it, so
 * it doesn't carry the shared OnboardingLayout/progress bar the later
 * screens do.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)

  function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMagicLinkLoading(true)
    window.setTimeout(() => {
      navigate('/verify-email', { state: { email } })
    }, MOCK_AUTH_DELAY_MS)
  }

  return (
    <main className={styles.page}>
      <div className={styles.formPanel}>
        <div className={styles.panel}>
          <Logo className={styles.logo} />
          <div className={styles.formContent}>
            <h1 className={styles.title}>Welcome</h1>

            <div className={styles.magicLink}>
              <p className={styles.magicLinkCopy}>
                Enter your email address below so we can match you to our records. We&apos;ll send
                you a link to log in.
              </p>
              <form className={styles.magicLinkForm} onSubmit={handleMagicLink}>
                <Field
                  label="Email address"
                  type="email"
                  required
                  disabled={magicLinkLoading}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Button
                  type="submit"
                  size="lg"
                  className={styles.magicLinkSubmit}
                  loading={magicLinkLoading}
                >
                  Send magic link
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Reserved for a real photo/illustration — no asset exists yet, so this is a
          placeholder panel, not a broken image. Hidden below `desktop` (see
          LoginPage.module.css); decorative only, so it carries no alt text. */}
      <div className={styles.imagePanel} aria-hidden="true" />
    </main>
  )
}
