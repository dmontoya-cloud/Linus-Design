import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Button } from '@/components/atoms/Button'
import { Field } from '@/components/atoms/Field'
import { LegalLayout } from '../LegalLayout'
import styles from './LegalIntroPage.module.css'

const DEFAULT_GREETING = "we're glad to have you"

/**
 * Legal Intro — a brief, conversational heads-up shown right after Verify
 * Account, before the two-step Terms of Use / Privacy Policy flow. Shares
 * LegalLayout's chrome with those two steps for visual continuity, at step
 * 0 — the progress bar previews the journey ahead empty rather than
 * counting this heads-up as a step of its own. The greeting starts generic
 * ("Hey, we're glad to have you") and swaps live to "Hey, <name>" the
 * moment the visitor types their own name into the field below — there's no
 * reliable way to derive a real human name from an email address, so this
 * just asks instead. The name lives in AuthContext (not local state), so
 * Registration's first name field can pre-fill from it later. There's no
 * separate Consent step: Privacy Policy's own checkbox covers
 * assessment-results consent, and the age-18+ attestation now lives on
 * Login instead (the very first gate in the funnel, not something to
 * re-confirm here). A second, smaller title — "How would you like to be
 * called?" — introduces the name field below it, which is required (its
 * required-asterisk hidden, same as Registration's all-required fields —
 * with nothing optional to contrast against, it wouldn't tell the visitor
 * anything) and gates "Continue". Its own text fades/rises in on a
 * stagger, the same subtle entrance Verify Account uses for its
 * logo/spinner/message.
 */
export function LegalIntroPage() {
  const navigate = useNavigate()
  const { preferredName, setPreferredName } = useAuth()
  const name = preferredName ?? ''

  return (
    <LegalLayout
      step={0}
      title={`Hey, ${name.trim() || DEFAULT_GREETING}`}
      subtitle="Before we get you set up. We need you to agree to our Terms of Use and Privacy Policy."
      titleClassName={styles.fadeTitle}
      subtitleClassName={styles.fadeSubtitle}
    >
      <p className={[styles.personalPromptTitle, styles.fadePersonalPrompt].join(' ')}>
        How would you like to be called?
      </p>
      <div className={styles.fadeField}>
        <Field
          label="Preferred name"
          required
          hideRequiredMark
          value={name}
          onChange={(event) => setPreferredName(event.target.value)}
        />
      </div>
      <Button
        type="button"
        size="lg"
        className={styles.fadeButton}
        disabled={!name.trim()}
        onClick={() => navigate('/terms')}
      >
        Continue
      </Button>
    </LegalLayout>
  )
}
