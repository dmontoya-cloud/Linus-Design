import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Logo } from '@/components/atoms/Logo'
import styles from './VerifyEmailPage.module.css'

/** Number of digits in the mock one-time code. */
const CODE_LENGTH = 4

/** How long "Send a new code" stays hidden behind a countdown before it's
 * clickable, on request — brought back from an earlier iteration of this screen. Resets
 * back to this on every resend, mimicking a fresh code cooldown rather than a one-time
 * wait. */
const RESEND_COOLDOWN_SECONDS = 30

/**
 * Verify Email — second step of the email sign-in mock flow, reached from
 * LoginPage's "Send code" form. Confirms the mock "send" and offers
 * a "Send a new code" escape hatch below the code entry (clears
 * the boxes and refocuses the first one — there's no real backend to
 * re-issue a code from), gated behind a `RESEND_COOLDOWN_SECONDS`-second
 * countdown — brought back on request from an earlier iteration of this
 * screen. While counting down, a plain "Resend code in 0:ss" line sits in
 * that spot instead of the link; once it reaches zero the link takes over,
 * and clicking it restarts the same countdown (a fresh mock code, a fresh
 * wait), rather than staying permanently unlocked after the first resend.
 * The confirmation mechanism is a 4-digit one-time
 * code: 4 separate boxes, auto-advancing focus as each digit is typed,
 * backspace-to-previous when a box is empty.
 * Since this repo is mock-data-only, **any** complete 4-digit code confirms
 * — there's no real code issued anywhere for a real one to be checked
 * against. Confirming hands off to /verify-account, which owns the actual
 * `login()` call and its own mock-verification delay. "Sign in" stays
 * enabled even before all 4 digits are filled, on request — clicking it
 * early is a no-op (guarded in `handleConfirm`) rather than truly disabled;
 * only the cursor still shows `not-allowed` while incomplete, as a hint.
 * Clicking with an incomplete code also reveals a validation error: all 4
 * boxes turn border-danger (the same red used everywhere else in this
 * system) and a content-danger message appears below, mirroring `Field`'s
 * own error variant. There's no real "wrong code" case to detect — this
 * repo is mock-data-only and any complete 4-digit code confirms — so the
 * only condition this error can ever reflect is "incomplete", despite the
 * message covering both by name. Its own row sits in a `min-height` slot
 * (same technique as LoginPage's error slots) so `.formContent`'s vertical
 * centering doesn't reflow-shift the rest of the page depending on whether
 * that message is currently showing.
 */
export function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [showCodeValidation, setShowCodeValidation] = useState(false)
  const [secondsUntilResend, setSecondsUntilResend] = useState(RESEND_COOLDOWN_SECONDS)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const isComplete = digits.every((digit) => digit !== '')
  const codeInvalid = showCodeValidation && !isComplete

  useEffect(() => {
    if (secondsUntilResend <= 0) return
    const timer = window.setTimeout(() => setSecondsUntilResend((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsUntilResend])

  function setDigitAt(index: number, value: string) {
    setDigits((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  function handleDigitChange(index: number, rawValue: string) {
    const value = rawValue.replace(/\D/g, '').slice(-1)
    setDigitAt(index, value)
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  /** Lets a visitor paste the whole code at once instead of typing digit by digit. */
  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    event.preventDefault()
    setDigits((prev) => {
      const next = [...prev]
      for (let i = 0; i < pasted.length; i += 1) {
        next[i] = pasted.charAt(i)
      }
      return next
    })
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  function handleConfirm() {
    if (!isComplete) {
      setShowCodeValidation(true)
      return
    }
    navigate('/verify-account')
  }

  /** Mock resend — this repo has no real backend to re-issue a code from, so this just
   * clears the boxes and refocuses the first one, as if a fresh code were on its way — and
   * restarts the cooldown, so the link hides behind the countdown again. */
  function handleResend() {
    setDigits(Array(CODE_LENGTH).fill(''))
    setShowCodeValidation(false)
    setSecondsUntilResend(RESEND_COOLDOWN_SECONDS)
    inputRefs.current[0]?.focus()
  }

  const resendMinutes = Math.floor(secondsUntilResend / 60)
  const resendSeconds = (secondsUntilResend % 60).toString().padStart(2, '0')

  return (
    <main className={styles.page}>
      <div className={styles.formPanel}>
        <div className={styles.panel}>
          <Logo className={styles.logo} />
          <div className={styles.formContent}>
            <h1 className={styles.title}>We emailed you a code</h1>
            <p className={styles.copy}>
              We sent a 4-digit code to <strong>{email || 'your email address'}</strong>. Enter the
              code below to continue.
            </p>
            <div className={styles.codeSection}>
              <p id="verify-email-code-label" className={styles.codeLabel}>
                Enter the 4-digit code
              </p>
              <div className={styles.codeRow}>
                <div
                  className={styles.codeBoxes}
                  role="group"
                  aria-labelledby="verify-email-code-label"
                  aria-describedby={codeInvalid ? 'verify-email-code-error' : undefined}
                  onPaste={handlePaste}
                >
                  {digits.map((digit, index) => (
                    <input
                      key={index}
                      id={`verify-email-code-${index}`}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      className={[styles.codeBox, codeInvalid && styles.codeBoxError]
                        .filter(Boolean)
                        .join(' ')}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
                      aria-invalid={codeInvalid || undefined}
                      onChange={(event) => handleDigitChange(index, event.target.value)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  size="lg"
                  className={!isComplete ? styles.confirmCodeIncomplete : undefined}
                  onClick={handleConfirm}
                >
                  Sign in
                </Button>
              </div>
              <div className={styles.codeErrorSlot}>
                {codeInvalid ? (
                  <p id="verify-email-code-error" className={styles.codeError}>
                    Please enter a valid four-digit code.
                  </p>
                ) : null}
              </div>
              {secondsUntilResend > 0 ? (
                <p className={styles.resendTimer} role="status">
                  Resend code in {resendMinutes}:{resendSeconds}
                </p>
              ) : (
                <button type="button" className={styles.textLink} onClick={handleResend}>
                  Send a new code
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reserved for a real photo/illustration — matches LoginPage's placeholder panel
          so the two screens in this flow read as one continuous experience. */}
      <div className={styles.imagePanel} aria-hidden="true" />
    </main>
  )
}
