import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Button } from '@/components/atoms/Button'
import { Modal } from '@/components/atoms/Modal'
import { LegalLayout } from '../LegalLayout'
import { SummaryCard } from '../SummaryCard'
import { cascadeDelay } from '../cascade'
import styles from './PrivacyPolicyPage.module.css'

const SECTIONS = [
  {
    heading: 'What we collect',
    body: 'We collect your name and email. We collect your date of birth, education and sex assigned at birth. Gender is optional. We also keep your check-in answers and results. Nothing else is collected.',
  },
  {
    heading: 'Why we need each piece',
    body: 'Your name and email make the report yours. Your date of birth, education and sex assigned at birth place your results in the right comparison group. Gender does not affect your results. We use it only for how we speak to you.',
  },
  {
    heading: 'We never sell your information',
    body: 'We do not sell your information to advertisers, insurers or employers. We never use your health information for advertising.',
  },
  {
    heading: 'Who sees it',
    body: 'Our team sees it only when needed. Trusted providers see it under contract. Anyone else sees it only if you ask us to share.',
  },
]

const FULL_TEXT = [
  <>
    <strong>1. Information we collect.</strong> We collect your name, email, date of birth,
    education level, and sex assigned at birth, plus the answers and results from every check-in you
    complete. Gender is the only optional field, and it is used solely to determine how we address
    you — it has no effect on your results. We do not collect any other personal information beyond
    what is described here.
  </>,
  <>
    <strong>2. Why we need each piece.</strong> Your name and email attach your identity to your
    report so it can be returned to you. Your date of birth, education level, and sex assigned at
    birth are used only to place your results in an appropriate comparison group, since brain health
    check-ins are read relative to people of similar age, background, and education.
  </>,
  <>
    <strong>3. How we use your information.</strong> Your information is used only to generate your
    report and to operate the Thrive service itself — for example, to remember your check-in history
    so your report can show change over time. We do not use your information to build an advertising
    profile, and we do not use it for any purpose you have not agreed to here.
  </>,
  <>
    <strong>4. We never sell your information.</strong> We do not sell your information to
    advertisers, insurers, or employers, under any circumstances, and we never use your health
    information for advertising purposes. This applies to all of the information described in
    Section 1, without exception.
  </>,
  <>
    <strong>5. Who sees it.</strong> Access to your information is limited to our team members who
    need it to operate Thrive, and to trusted service providers bound by contract to the same
    protections described in this policy. We disclose your information to anyone else — including a
    doctor or family member — only at your explicit request.
  </>,
  <>
    <strong>6. Data retention.</strong> We keep your information for as long as your account is
    active, so that your report can reflect your full check-in history. If you close your account,
    we delete your personal information within a reasonable period, except where we are required to
    retain it for a legal or regulatory reason.
  </>,
  <>
    <strong>7. Your rights and choices.</strong> You can review, correct, or request deletion of
    your information at any time by contacting us. If you opted in to marketing emails, you can
    unsubscribe at any time using the link in any email we send, with no effect on your ability to
    use Thrive.
  </>,
  <>
    <strong>8. Children&apos;s privacy.</strong> Thrive is intended for adults aged 18 and over and
    is not directed at children. We do not knowingly collect information from anyone under 18; if we
    learn that we have, we will delete it promptly.
  </>,
  <>
    <strong>9. Changes to this policy.</strong> If we make a material change to how we collect or
    use your information, we will let you know before it takes effect, the same way we would for a
    material change to our Terms of Use.
  </>,
  <>
    <strong>10. Contact us.</strong> If you have questions about this policy or want to exercise any
    of the rights described in Section 7, you can reach us through the contact details provided in
    the Thrive app or on the Linus Health website.
  </>,
]

/**
 * Privacy Policy — step 2 of the pre-registration legal flow (Terms of Use,
 * Privacy Policy, Consent), reached from Terms of Use. Agreement is required
 * to continue; the optional marketing checkbox does not gate Continue.
 */
export function PrivacyPolicyPage() {
  const navigate = useNavigate()
  const [agreed, setAgreed] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [fullTextOpen, setFullTextOpen] = useState(false)

  return (
    <LegalLayout
      step={2}
      title="Privacy Policy"
      subtitle="Here is a plain summary of how we handle your information. The full policy is below."
    >
      <SummaryCard
        sections={SECTIONS}
        footer={
          <button
            type="button"
            className={styles.fullTextLink}
            onClick={() => setFullTextOpen(true)}
          >
            Read full privacy policy
          </button>
        }
      />

      <div className={styles.reveal} style={{ animationDelay: cascadeDelay(SECTIONS.length + 1) }}>
        <Checkbox
          label={
            <>
              Send me free, actionable brain health tips by email.{' '}
              <em>Optional, unsubscribe any time</em>
            </>
          }
          checked={marketingOptIn}
          onChange={(event) => setMarketingOptIn(event.target.checked)}
        />
      </div>
      <div className={styles.reveal} style={{ animationDelay: cascadeDelay(SECTIONS.length + 2) }}>
        <Checkbox
          label={
            <>
              I have read and agree to the Privacy Policy. <strong>Required.</strong>
            </>
          }
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
        />
      </div>

      <div
        className={[styles.actions, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(SECTIONS.length + 3) }}
      >
        <Button type="button" variant="outline" size="lg" onClick={() => navigate('/terms')}>
          Back
        </Button>
        <Button type="button" size="lg" disabled={!agreed} onClick={() => navigate('/consent')}>
          Agree and continue
        </Button>
      </div>

      <Modal open={fullTextOpen} onClose={() => setFullTextOpen(false)} title="Full Privacy Policy">
        {FULL_TEXT.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </Modal>
    </LegalLayout>
  )
}
