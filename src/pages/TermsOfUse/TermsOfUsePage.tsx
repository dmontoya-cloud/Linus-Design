import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Button } from '@/components/atoms/Button'
import { LegalLayout } from '../LegalLayout'
import { SummaryCard } from '../SummaryCard'
import { LegalTextBox } from '../LegalTextBox'
import { CheckboxCard } from '../CheckboxCard'
import { ScrollDownHint } from '../ScrollDownHint'
import { cascadeDelay } from '../cascade'
import styles from './TermsOfUsePage.module.css'

const SECTIONS = [
  {
    heading: 'What Linus Health does',
    body: 'Linus Health checks in on your memory, thinking, lifestyle and priorities. It turns your answers into one report. You can keep it or share it with your doctor.',
  },
  {
    heading: 'What it cannot do',
    body: 'Linus Health does not diagnose any condition. It does not replace your doctor. Please contact your doctor about anything urgent.',
  },
  {
    heading: 'Who it is for',
    body: 'Linus Health is for adults aged 18 and over in the US. Your account is for your own use. Your results are personal to you.',
  },
  {
    heading: 'What we ask of you',
    body: 'Please take the check-ins yourself. Please answer honestly. Please follow the steps on screen.',
  },
  {
    heading: 'What we promise',
    body: 'We keep Linus Health running. We tell you before anything important changes. We always show you your full result.',
  },
]

const FULL_TEXT = [
  <>
    <strong>1. Acceptance of these Terms.</strong> By creating an account or otherwise using Linus
    Health, you agree to be bound by these Terms of Use. If you do not agree to them, please do not
    use Linus Health. We may update these Terms from time to time, as described in Section 10 below;
    continuing to use Linus Health after an update means you accept the revised Terms.
  </>,
  <>
    <strong>2. Description of the service.</strong> Linus Health is a self-guided check-in tool that
    asks you questions about your memory, thinking, lifestyle, and priorities, and turns your
    answers into a single report. You can keep that report for your own records or choose to share
    it with a doctor or other care provider. Linus Health does not collect this information for any
    purpose other than producing your report.
  </>,
  <>
    <strong>3. Not medical advice.</strong> Linus Health does not diagnose, treat, cure, or prevent
    any disease or condition, and nothing in your report should be read as a medical diagnosis or
    recommendation. Linus Health is not a substitute for professional medical advice, and it does
    not replace your doctor. If you have an urgent health concern, please contact your doctor or
    emergency services directly rather than relying on Linus Health.
  </>,
  <>
    <strong>4. Eligibility and account use.</strong> Linus Health is intended for adults aged 18 and
    over residing in the United States. Your account is for your own personal use only, and you are
    responsible for keeping your login details confidential and for all activity that occurs under
    your account. Your results are personal to you, and we ask that you not create an account on
    someone else&apos;s behalf without their knowledge.
  </>,
  <>
    <strong>5. Your responsibilities.</strong> To get the most useful report, please complete each
    check-in yourself, answer as honestly as you can, and follow the steps presented on screen.
    Linus Health&apos;s report is only as accurate as the information you provide, and we are not
    responsible for a report that is inaccurate because the underlying answers were incomplete or
    not your own.
  </>,
  <>
    <strong>6. Our commitments to you.</strong> We work to keep Linus Health available and running
    smoothly, and we will tell you before we make any change that materially affects how Linus
    Health works or how your information is handled. We will always show you your own full result —
    we do not summarize, withhold, or otherwise soften your report on your behalf.
  </>,
  <>
    <strong>7. Intellectual property.</strong> Linus Health, its design, its questions, and the
    software behind it belong to Linus Health and are protected by applicable intellectual property
    laws. Your own answers and the report generated from them belong to you; using Linus Health does
    not give us any ownership over your personal results.
  </>,
  <>
    <strong>8. Termination.</strong> You may stop using Linus Health and close your account at any
    time. We may suspend or terminate access to Linus Health if we reasonably believe these Terms
    have been violated, or if we need to do so to protect the security or integrity of the service.
  </>,
  <>
    <strong>9. Limitation of liability.</strong> To the fullest extent permitted by law, Linus
    Health is not liable for indirect, incidental, or consequential damages arising from your use of
    the service. Nothing in this section limits any liability that cannot lawfully be limited, such
    as liability for gross negligence or willful misconduct.
  </>,
  <>
    <strong>10. Changes to these Terms.</strong> We may revise these Terms from time to time. If we
    make a material change, we will let you know before it takes effect, consistent with the
    commitment described in Section 6. The date these Terms were last updated will always be
    available alongside them.
  </>,
  <>
    <strong>11. Governing law.</strong> These Terms are governed by the laws of the United States
    and the state in which Linus Health is headquartered, without regard to conflict-of- law
    principles.
  </>,
  <>
    <strong>12. Contact us.</strong> If you have questions about these Terms, you can reach us
    through the contact details provided in the app or on the Linus Health website.
  </>,
]

/**
 * Terms of Use — step 1 of the pre-registration legal flow (Terms of Use,
 * then Privacy Policy), reached from the Legal Intro heads-up. The full
 * legal text — a longer, more formal version of the summary above — sits
 * inline as plain text (`LegalTextBox`) rather than behind a "Read full
 * text" link or Modal, so it's visible without an extra click. The
 * agreement checkbox is enabled from the start — it used to stay disabled
 * until scrolled to the end of the full text, but that scroll-gate was
 * removed on request. "Agree and continue" stays enabled at all times too —
 * clicking it without checking the box reveals a `content-danger` message
 * below the checkbox (same quiet treatment as Login's age checkbox: the
 * checkbox itself never turns red) rather than the button silently
 * refusing to respond. The checkbox card sits in its own `min-height` slot
 * sized to fit the card with its error message showing, so that message
 * never changes the card's height and pushes Back/Agree and continue down.
 */
export function TermsOfUsePage() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  const agreedInvalid = showValidation && !agreed

  function handleAgreeAndContinue() {
    if (!agreed) {
      setShowValidation(true)
      return
    }
    navigate('/privacy')
  }

  return (
    <LegalLayout
      step={1}
      title="Terms of Use"
      subtitle="Here is a plain summary of the terms. The full text is below."
    >
      <SummaryCard sections={SECTIONS} />

      <div className={styles.reveal} style={{ animationDelay: cascadeDelay(SECTIONS.length + 1) }}>
        <LegalTextBox paragraphs={FULL_TEXT} />
      </div>

      <div className={styles.reveal} style={{ animationDelay: cascadeDelay(SECTIONS.length + 2) }}>
        <div className={styles.agreeCheckboxSlot}>
          <CheckboxCard>
            <Checkbox
              label={
                <>
                  I have read and agree to the Terms of Use. <strong>Required.</strong>
                </>
              }
              checked={agreed}
              aria-describedby={agreedInvalid ? 'agree-checkbox-error' : undefined}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            {agreedInvalid ? (
              <p id="agree-checkbox-error" className={styles.agreeCheckboxError}>
                Please confirm you agree to the Terms of Use.
              </p>
            ) : null}
          </CheckboxCard>
        </div>
      </div>

      <div
        className={[styles.actions, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(SECTIONS.length + 3) }}
      >
        <Button type="button" variant="outline" size="lg" onClick={() => navigate('/legal-intro')}>
          Back
        </Button>
        <Button type="button" size="lg" onClick={handleAgreeAndContinue}>
          Agree and continue
        </Button>
      </div>
      <ScrollDownHint />
    </LegalLayout>
  )
}
