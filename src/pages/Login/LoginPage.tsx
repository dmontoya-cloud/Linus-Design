import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field } from '@/components/atoms/Field'
import { Button } from '@/components/atoms/Button'
import { Logo } from '@/components/atoms/Logo'
import { Checkbox } from '@/components/atoms/Checkbox'
import { CheckboxCard } from '../CheckboxCard'
import styles from './LoginPage.module.css'

/** Fake network delay for the mocked email sign-in request, just long enough for the loading state to be visible. */
const MOCK_AUTH_DELAY_MS = 900

/** A simple shape check (something@something.something) — not full RFC 5322 validation,
 * just enough to catch an obviously malformed address in this mock-data prototype. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value)
}

/**
 * Login — email sign-in only. This repo is mock-data-only (no real
 * backend), so "logging in" is a mock, on a fake delay so the loading state
 * is visible. This doesn't call `login()` directly — it hands off to
 * /verify-email (a 4-digit code confirmation), then /verify-account, which
 * owns the actual `isAuthenticated` flip once its own verifying animation
 * finishes. Login is a gate before the onboarding process, not a step
 * within it, so it doesn't carry the shared OnboardingLayout/progress bar
 * the later screens do. The age-18+ attestation lives here too, right after
 * the email field — required before "Log in to thrive" will proceed, since
 * this is the very first gate in the funnel rather than something to
 * re-confirm later on Legal Intro. "Log in to thrive" stays enabled at all
 * times rather than being disabled while the form is incomplete — clicking
 * it with something missing reveals which field via its own error state
 * instead of the button just silently refusing to respond. The email field
 * uses `Field`'s documented `field-error` variant (border-danger border,
 * content-danger label, content-danger helper text), distinguishing its two
 * possible error causes with different copy — empty vs. not shaped like an
 * email address. The age checkbox uses a different, quieter treatment, on
 * request — its border and card stay neutral (never `border-danger` or a
 * danger-soft background); the only error cue is a `content-danger` message
 * below the checkbox. Both the email field and the checkbox card sit in
 * their own `min-height` slots, each sized to fit its content with its
 * error message showing — without that, the extra height either message
 * adds would grow `.formContent`'s total height and, since it's vertically
 * centered (`justify-content: center`), reflow-shift every element in it
 * (confirmed directly: the checkbox card's own height alone goes from 25px
 * to 43.5px with its message showing). Reserving each slot's height keeps
 * the whole form visually still regardless of which errors are showing.
 * The form has `noValidate` so the browser's own native validation bubble
 * never preempts either custom error state.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [overEighteen, setOverEighteen] = useState(false)
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  const trimmedEmail = email.trim()
  const emailMissing = showValidation && !trimmedEmail
  const emailMalformed = showValidation && !!trimmedEmail && !isValidEmail(trimmedEmail)
  const emailInvalid = emailMissing || emailMalformed
  const emailHelperText = emailMissing
    ? 'Enter your email address to continue.'
    : emailMalformed
      ? 'Please enter a valid email address.'
      : undefined
  const ageInvalid = showValidation && !overEighteen

  function handleMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!trimmedEmail || !isValidEmail(trimmedEmail) || !overEighteen) {
      setShowValidation(true)
      return
    }
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
                Enter your email address below so we can match you to our records.
              </p>
              <form className={styles.magicLinkForm} onSubmit={handleMagicLink} noValidate>
                <div className={styles.emailFieldSlot}>
                  <Field
                    label="Email address"
                    type="email"
                    required
                    error={emailInvalid}
                    helperText={emailHelperText}
                    disabled={magicLinkLoading}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className={styles.ageCheckboxSlot}>
                  <CheckboxCard className={styles.ageCheckboxCard}>
                    <Checkbox
                      label={
                        <>
                          I&apos;m over the age of eighteen. <strong>Required.</strong>
                        </>
                      }
                      checked={overEighteen}
                      disabled={magicLinkLoading}
                      aria-describedby={ageInvalid ? 'age-checkbox-error' : undefined}
                      onChange={(event) => setOverEighteen(event.target.checked)}
                    />
                    {ageInvalid ? (
                      <p id="age-checkbox-error" className={styles.ageCheckboxError}>
                        Please confirm you are over the age of eighteen.
                      </p>
                    ) : null}
                  </CheckboxCard>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className={styles.magicLinkSubmit}
                  loading={magicLinkLoading}
                >
                  Log in to thrive
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
