import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Button } from '@/components/atoms/Button'
import { Field } from '@/components/atoms/Field'
import { LegalLayout } from '../LegalLayout'
import styles from './LegalIntroPage.module.css'

const DEFAULT_GREETING = "we're glad to have you"

/**
 * Legal Intro — a brief, conversational heads-up shown right after Verify
 * Account, before the three-step Terms of Use / Privacy Policy / Consent
 * flow. Shares LegalLayout's chrome with those three steps for visual
 * continuity, at step 0 — the progress bar previews the journey ahead empty
 * rather than counting this heads-up as a step of its own. The greeting
 * starts generic ("Hey, we're glad to have you") and swaps live to "Hey,
 * <name>" the moment the visitor types their own name into the field below —
 * there's no reliable way to derive a real human name from an email address,
 * so this just asks instead. The name lives in AuthContext (not local state),
 * so Registration's first name field can pre-fill from it later. Its own
 * text fades/rises in on a stagger, the same subtle entrance Verify Account
 * uses for its logo/spinner/message.
 */
export function LegalIntroPage() {
  const navigate = useNavigate()
  const { preferredName, setPreferredName } = useAuth()
  const name = preferredName ?? ''

  return (
    <LegalLayout
      step={0}
      title={`Hey, ${name.trim() || DEFAULT_GREETING}`}
      subtitle="Before we start, we need you to agree to a few things."
      titleClassName={styles.fadeTitle}
      subtitleClassName={styles.fadeSubtitle}
    >
      <div className={styles.fadeField}>
        <Field
          label="How should we call you?"
          value={name}
          onChange={(event) => setPreferredName(event.target.value)}
        />
      </div>
      <Button
        type="button"
        size="lg"
        className={styles.fadeButton}
        onClick={() => navigate('/terms')}
      >
        Let&apos;s go
      </Button>
    </LegalLayout>
  )
}
