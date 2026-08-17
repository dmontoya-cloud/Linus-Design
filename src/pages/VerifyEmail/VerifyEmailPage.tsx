import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Logo } from '@/components/atoms/Logo'
import styles from './VerifyEmailPage.module.css'

/** How long before the "Send new link" button appears — this repo is mock-data-only,
 * so there's no real email/link; this stands in for the real wait on an inbox. Clicking
 * the button once it appears mocks resending and immediately receiving/clicking that
 * link, handing off to /verify-account exactly like a real click would. */
const RESEND_WAIT_SECONDS = 15

/** Phosphor `envelope-simple` (regular weight), matching this system's other icons —
 * see docs/design.md's Icons section. */
function EnvelopeIcon() {
  return (
    <svg className={styles.envelopeIcon} viewBox="0 0 256 256" aria-hidden="true">
      <path
        d="M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <polyline
        points="224 56 128 144 32 56"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}

/**
 * Verify Email — second step of the magic-link mock flow, reached from
 * LoginPage's "Send magic link" form. Purely informational: confirms the
 * mock "send", explains the (mock) link's rules, and gives an escape hatch
 * back to Login if the address was wrong. There's no code to enter — a
 * resend hint sits next to where the "Send new link" button will appear;
 * the button itself only renders once the `RESEND_WAIT_SECONDS` countdown
 * reaches zero, and clicking it hands off to /verify-account. The hint text
 * stays on screen throughout, just changing wording once the button shows up.
 */
export function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email
  const [secondsLeft, setSecondsLeft] = useState(RESEND_WAIT_SECONDS)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  return (
    <main className={styles.page}>
      <div className={styles.formPanel}>
        <div className={styles.panel}>
          <Logo className={styles.logo} />
          <div className={styles.formContent}>
            <EnvelopeIcon />
            <h1 className={styles.title}>Check your email!</h1>
            <p className={styles.copy}>
              A magic link has been sent to <strong>{email || 'your email address'}</strong>, check
              your inbox.
              <span className={styles.spinner} aria-hidden="true" />
              <span className={styles.srOnly}>Waiting for confirmation</span>
            </p>
            <ul className={styles.rulesList}>
              <li>It expires after 24 hours for your protection</li>
              <li>If you do not see it, check your spam or junk folder</li>
            </ul>
            <div className={styles.linkRow}>
              <button type="button" className={styles.textLink} onClick={() => navigate('/login')}>
                Try a different email address
              </button>
              {/* Prototype-only shortcut — skips the mock wait entirely so a demo doesn't have
                  to sit through the countdown; nothing like this exists in the real product. */}
              <button
                type="button"
                className={styles.textLink}
                onClick={() => navigate('/verify-account')}
              >
                Continue
              </button>
            </div>
            <div className={styles.resendRow}>
              <p className={styles.resendHint} role="status" aria-live="polite">
                {secondsLeft > 0 ? `You can request a new link in ${secondsLeft}s` : "Didn't get it?"}
              </p>
              {secondsLeft <= 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate('/verify-account')}
                >
                  Send new link
                </Button>
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
