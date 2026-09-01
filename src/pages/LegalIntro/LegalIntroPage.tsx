import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { LegalLayout } from '../LegalLayout'
import styles from './LegalIntroPage.module.css'

/** Stands in for a real illustration above the title, on request — three attempts at an
 * original hand-wave SVG (a rotated-rounded-rectangle-per-finger version, a single hand-
 * drawn outline path, and a simple-primitives version) never read as clean, polished art,
 * so this keeps just the soft blob backdrop those attempts shared (same shape Device
 * Setup's `SpeakerCompanion`/`MicrophoneCompanion` and Assessment Intro's
 * `ReadingCompanion` sit on) with a small "Illustration placeholder" label marking the spot
 * for a real asset later, rather than shipping a doodle that doesn't actually look good. */
function IllustrationPlaceholder({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden="true">
      <path
        d="M40,90 C20,90 15,60 35,45 C30,20 65,10 85,25 C100,8 135,8 148,28
           C170,20 185,45 172,65 C190,80 185,110 165,118 C168,140 140,152 118,142
           C108,158 78,158 68,142 C45,148 22,130 30,108 C18,100 25,90 40,90 Z"
        fill="var(--color-primary-soft, #e6f2f7)"
      />
      <text
        x="100"
        y="85"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--color-text-secondary, #5b6b79)"
        fontFamily="var(--font-family, system-ui, sans-serif)"
        fontSize="11"
      >
        Illustration placeholder
      </text>
    </svg>
  )
}

/**
 * Legal Intro — a brief, conversational heads-up shown right after Verify
 * Account, before the two-step Terms of Use / Privacy Policy flow. Shares
 * LegalLayout's chrome with those two steps for visual continuity, at step
 * 0 — the progress bar previews the journey ahead empty rather than
 * counting this heads-up as a step of its own. The greeting is a fixed
 * "We're glad you're here" — this page used to also ask "How would you
 * like to be called?" and swap the greeting to "Hey, <name>" live as the
 * visitor typed, with that name carried into AuthContext to pre-fill
 * Registration's first name field later, but that whole prompt/field/swap
 * was removed on request. There's no separate Consent step: Privacy
 * Policy's own checkbox covers assessment-results consent, and the
 * age-18+ attestation now lives on Login instead (the very first gate in
 * the funnel, not something to re-confirm here). Its own text fades/rises
 * in on a stagger, the same subtle entrance Verify Account uses for its
 * logo/spinner/message.
 */
export function LegalIntroPage() {
  const navigate = useNavigate()

  return (
    <LegalLayout
      step={0}
      title="We're glad you're here"
      subtitle="Before you get started, we’ll ask you to review a few important details about using Linus Health."
      titleClassName={styles.fadeTitle}
      subtitleClassName={styles.fadeSubtitle}
      illustration={
        <IllustrationPlaceholder className={[styles.companion, styles.fadeCompanion].join(' ')} />
      }
    >
      <Button
        type="button"
        size="lg"
        className={styles.fadeButton}
        onClick={() => navigate('/terms')}
      >
        Continue
      </Button>
    </LegalLayout>
  )
}
