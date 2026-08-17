import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Button } from '@/components/atoms/Button'
import { LegalLayout } from '../LegalLayout'
import { cascadeDelay } from '../cascade'
import styles from './ConsentPage.module.css'

const LONG_TEXT = [
  <>
    <strong>1. How your results are used.</strong> Each check-in you complete adds to your
    report, which is built to show your own trends over time — how your memory, thinking, and
    lifestyle answers today compare to your own baseline, not to a pass/fail standard. Nothing
    about how your results are used changes once you consent here; this just makes that use
    explicit and on the record.
  </>,
  <>
    <strong>2. Storage and security.</strong> Your assessment results are encrypted and stored
    for as long as your account stays active, so your report can keep reflecting your full
    history rather than resetting with every check-in.
  </>,
  <>
    <strong>3. Who can access your results.</strong> Only you can see your full results by
    default. Linus Health will never share your individual results with anyone else — including
    a doctor, family member, or employer — without your permission, and any sharing you choose is
    always initiated by you.
  </>,
  <>
    <strong>4. This is not a diagnosis.</strong> As covered in the Terms of Use, Thrive does not
    diagnose, treat, or rule out any condition. Consenting here means you understand your report
    is a personal insight tool, not a medical result, and that you should bring any health
    concerns to your doctor directly.
  </>,
  <>
    <strong>5. Withdrawing consent.</strong> You can withdraw this consent at any time from your
    account settings. Withdrawing does not delete your past results, but it does stop future
    check-ins from being added to your report until you consent again.
  </>,
  <>
    <strong>6. Contact us.</strong> If you have questions about how your assessment results are
    used, you can reach us through the contact details provided in the Thrive app or on the Linus
    Health website.
  </>,
]

/** Consent — step 3 of the pre-registration legal flow (Terms of Use, Privacy Policy,
 * Consent), reached from Privacy Policy and coming right before registration. Continue stays
 * disabled until both the results-use consent and the age checkbox are checked, so neither
 * can be skipped by accident. Hands off to /setting-up, a brief spinner, rather than jumping
 * straight to the registration form. */
export function ConsentPage() {
  const { giveConsent } = useAuth()
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)
  const [overEighteen, setOverEighteen] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!agreed || !overEighteen) return
    giveConsent()
    navigate('/setting-up')
  }

  return (
    <LegalLayout
      step={3}
      title="Consent"
      subtitle="Your assessment results are used to give you personalized insight into your mental sharpness over time. Linus Health will never share your individual results with anyone else without your permission."
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
          <div className={styles.legalText}>
            {LONG_TEXT.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
          <Checkbox
            label="I consent to Linus Health using my assessment results as described above"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
          />
        </div>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(2) }}>
          <Checkbox
            label="I'm over the age of eighteen"
            checked={overEighteen}
            onChange={(event) => setOverEighteen(event.target.checked)}
          />
        </div>

        <div
          className={[styles.actions, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(3) }}
        >
          <Button type="button" variant="outline" size="lg" onClick={() => navigate('/privacy')}>
            Back
          </Button>
          <Button type="submit" size="lg" disabled={!agreed || !overEighteen}>
            Continue
          </Button>
        </div>
      </form>
    </LegalLayout>
  )
}
