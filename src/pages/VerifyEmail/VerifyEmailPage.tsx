import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Logo } from '@/components/atoms/Logo'
import styles from './VerifyEmailPage.module.css'

/** Number of digits in the mock one-time code. */
const CODE_LENGTH = 4

/**
 * Verify Email — second step of the email sign-in mock flow, reached from
 * LoginPage's "Log in to thrive" form. Confirms the mock "send" and offers
 * a "Resend verification code" escape hatch below the code entry (clears
 * the boxes and refocuses the first one — there's no real backend to
 * re-issue a code from). The confirmation mechanism is a 4-digit one-time
 * code: 4 separate boxes, auto-advancing focus as each digit is typed,
 * backspace-to-previous when a box is empty.
 * Since this repo is mock-data-only, **any** complete 4-digit code confirms
 * — there's no real code issued anywhere for a real one to be checked
 * against. Confirming hands off to /verify-account, which owns the actual
 * `login()` call and its own mock-verification delay. "Confirm code" stays
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
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const isComplete = digits.every((digit) => digit !== '')
  const codeInvalid = showCodeValidation && !isComplete

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
   * clears the boxes and refocuses the first one, as if a fresh code were on its way. */
  function handleResend() {
    setDigits(Array(CODE_LENGTH).fill(''))
    setShowCodeValidation(false)
    inputRefs.current[0]?.focus()
  }

  return (
    <main className={styles.page}>
      <div className={styles.formPanel}>
        <div className={styles.panel}>
          <Logo className={styles.logo} />
          <div className={styles.formContent}>
            <h1 className={styles.title}>Check your email!</h1>
            <p className={styles.copy}>
              We emailed you a four-digit code to <strong>{email || 'your email address'}</strong>.
              Enter the code below to confirm your email address.
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
                  Confirm code
                </Button>
              </div>
              <div className={styles.codeErrorSlot}>
                {codeInvalid ? (
                  <p id="verify-email-code-error" className={styles.codeError}>
                    Please enter a valid four-digit code.
                  </p>
                ) : null}
              </div>
              <button type="button" className={styles.textLink} onClick={handleResend}>
                Resend verification code
              </button>
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
