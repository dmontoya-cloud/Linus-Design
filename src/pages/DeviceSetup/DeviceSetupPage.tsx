import { Fragment, useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { DashboardNavBar } from '../DashboardNavBar'
import { cascadeDelay } from '../cascade'
import { MicrophoneLevelBars } from './MicrophoneLevelBars'
import { TestSoundPlayer } from './TestSoundPlayer'
import {
  WORDS as HEARING_WORDS,
  speak as speakHearing,
  cancelSpeech as cancelHearing,
} from './deviceSetupVoiceOver'
import {
  WORDS as MIC_WORDS,
  speak as speakMic,
  cancelSpeech as cancelMic,
} from './microphoneCheckVoiceOver'
import styles from './DeviceSetupPage.module.css'

/** Some browsers (notably Chrome) can silently drop a `speechSynthesis.speak()` call made the
 * instant a step mounts — the synthesis engine hasn't finished spinning up yet. A short delay
 * before each step's autoplaying call is a commonly-used workaround; it doesn't apply to
 * "Replay instructions", which only ever fires well after mount, from a direct click. */
const AUTOPLAY_DELAY_MS = 250

/** Shown in the nav bar in place of the usual Assessment/History/Settings links — same
 * activity context as Assessment Intro, since this is the next step in that same flow. */
const ACTIVITY_NAME = 'Memory & Thinking'

/** A small original illustration (a speaker, mirroring Assessment Intro's `ReadingCompanion` —
 * same soft blob background, line-art in the same style) sitting above the hearing-check step's
 * instructions, built from plain SVG shapes using the design system's own color tokens rather
 * than any stock image — a speaker cabinet with sound waves emanating from it, since this step
 * is about audio coming *out* of the device, not the microphone step further below. */
function SpeakerCompanion({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={[styles.companion, className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M40,90 C20,90 15,60 35,45 C30,20 65,10 85,25 C100,8 135,8 148,28
           C170,20 185,45 172,65 C190,80 185,110 165,118 C168,140 140,152 118,142
           C108,158 78,158 68,142 C45,148 22,130 30,108 C18,100 25,90 40,90 Z"
        fill="var(--color-primary-soft, #e6f2f7)"
      />
      <rect
        x="56"
        y="24"
        width="60"
        height="92"
        rx="10"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
      />
      <circle
        cx="86"
        cy="54"
        r="13"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
      />
      <circle cx="86" cy="54" r="3" fill="var(--color-text-primary, #1f2a37)" />
      <circle
        cx="86"
        cy="90"
        r="19"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
      />
      <circle cx="86" cy="90" r="4" fill="var(--color-text-primary, #1f2a37)" />
      <path
        d="M138,45 q10,20 0,40"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M153,35 q18,30 0,60"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M168,25 q26,40 0,80"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** A small original illustration (a microphone, same soft blob background and line-art style as
 * `SpeakerCompanion` above) sitting above the microphone-check step's instructions — this step
 * is about audio coming *into* the device, via the microphone, not the speaker step above. */
function MicrophoneCompanion({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={[styles.companion, className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M40,90 C20,90 15,60 35,45 C30,20 65,10 85,25 C100,8 135,8 148,28
           C170,20 185,45 172,65 C190,80 185,110 165,118 C168,140 140,152 118,142
           C108,158 78,158 68,142 C45,148 22,130 30,108 C18,100 25,90 40,90 Z"
        fill="var(--color-primary-soft, #e6f2f7)"
      />
      <rect
        x="86"
        y="30"
        width="28"
        height="55"
        rx="14"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
      />
      <path
        d="M68,72 a32,32 0 0 0 64,0"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="104"
        x2="100"
        y2="122"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="82"
        y1="122"
        x2="118"
        y2="122"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M142,45 q10,20 0,40"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M157,35 q18,30 0,60"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** First step: confirms the visitor can hear audio from their device. Its own instructions
 * cascade in, read aloud (see `./deviceSetupVoiceOver`) with the progressive "read so far"
 * highlight, same as every other screen in this flow. A `TestSoundPlayer` sits right after the
 * paragraph — its own synthesized bird-chirp sound, so a visitor can actually confirm they can
 * hear, not just take the page's word for it — shown as soon as the paragraph mounts rather than
 * gated behind the reading finishing, since it's a self-contained check independent of whether
 * the voice-over has finished. `onConfirmed` swaps this step out for `MicrophoneCheckStep` in
 * place, on the same page — not a route change — since the two are one continuous device check. */
function HearingCheckStep({ onConfirmed }: { onConfirmed: () => void }) {
  const [readUpToIndex, setReadUpToIndex] = useState<number | null>(null)
  const hasFinishedReading = readUpToIndex === HEARING_WORDS.length - 1

  useEffect(() => {
    const timer = window.setTimeout(() => speakHearing(setReadUpToIndex), AUTOPLAY_DELAY_MS)
    return () => {
      window.clearTimeout(timer)
      cancelHearing()
    }
  }, [])

  return (
    <>
      <SpeakerCompanion className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }} />
      <h1
        className={[styles.title, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(1) }}
      >
        Set up your device
      </h1>
      <p
        className={[styles.instructions, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(2) }}
      >
        {HEARING_WORDS.map((word, index) => (
          <Fragment key={word.start}>
            <span
              className={
                readUpToIndex !== null && index <= readUpToIndex
                  ? `${styles.word} ${styles.wordRead}`
                  : styles.word
              }
            >
              {word.text}
            </span>
            {index < HEARING_WORDS.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </p>
      <div
        className={[styles.testSoundWrapper, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(3) }}
      >
        <TestSoundPlayer />
      </div>
      <div
        className={[
          styles.actionsWrapper,
          hasFinishedReading ? styles.actionsWrapperExpanded : '',
        ].join(' ')}
      >
        <div className={styles.actionsInner}>
          {hasFinishedReading ? (
            <div className={styles.actions}>
              <Button
                variant="primary"
                size="lg"
                className={styles.reveal}
                style={{ animationDelay: cascadeDelay(0) }}
                onClick={onConfirmed}
              >
                I confirm, I can hear
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

/** Second step: a real microphone check, not a canned animation — `MicrophoneLevelBars` asks
 * for actual mic access and visualizes live input level, since a fake bar animation couldn't
 * verify anything. Same voice-over/highlight/reveal treatment as the first step, with its own
 * separate script (see `./microphoneCheckVoiceOver`) and its own independent reading progress —
 * switching steps doesn't carry state between them. */
function MicrophoneCheckStep() {
  const [readUpToIndex, setReadUpToIndex] = useState<number | null>(null)
  const hasFinishedReading = readUpToIndex === MIC_WORDS.length - 1

  useEffect(() => {
    const timer = window.setTimeout(() => speakMic(setReadUpToIndex), AUTOPLAY_DELAY_MS)
    return () => {
      window.clearTimeout(timer)
      cancelMic()
    }
  }, [])

  return (
    <>
      <MicrophoneCompanion className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }} />
      <h1
        className={[styles.title, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(1) }}
      >
        Test your microphone
      </h1>
      <p
        className={[styles.instructions, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(2) }}
      >
        {MIC_WORDS.map((word, index) => (
          <Fragment key={word.start}>
            <span
              className={
                readUpToIndex !== null && index <= readUpToIndex
                  ? `${styles.word} ${styles.wordRead}`
                  : styles.word
              }
            >
              {word.text}
            </span>
            {index < MIC_WORDS.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </p>
      <div
        className={[styles.micBarsWrapper, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(3) }}
      >
        <MicrophoneLevelBars />
      </div>
      <div
        className={[
          styles.actionsWrapper,
          hasFinishedReading ? styles.actionsWrapperExpanded : '',
        ].join(' ')}
      >
        <div className={styles.actionsInner}>
          {hasFinishedReading ? (
            <div className={styles.actions}>
              <Link
                to="/assessment/memory-and-thinking/microphone-check"
                className={`${buttonClassName('primary', 'lg')} ${styles.reveal}`}
                style={{ animationDelay: cascadeDelay(0) }}
              >
                Continue
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

/**
 * Device Setup — the screen "I'm Ready to Begin" hands off to from Assessment Intro, before
 * the actual Memory & Thinking tasks (still a PoD-4 stub past this point — "Continue" leads to
 * a not-yet-built placeholder). Two steps, swapped in place on this one page rather than
 * separate routes, since they're one continuous device check: `HearingCheckStep` confirms the
 * visitor can hear audio — via its own `SpeakerCompanion` illustration and a `TestSoundPlayer`
 * they can actually press — then `MicrophoneCheckStep` replaces it with `MicrophoneCompanion`
 * and a real, live microphone level check. Both mirror Assessment Intro's full voice-over
 * interaction — cascading in on mount, reading their own instructions aloud with the same
 * progressive "read so far" highlight, and keeping their buttons hidden (via the same
 * `.actionsWrapper` grid-rows grow-in, so the upward shift is a graceful glide, not a jump) until
 * that reveal reaches the last word.
 */
export function DeviceSetupPage() {
  const [step, setStep] = useState<'hearing' | 'microphone'>('hearing')

  return (
    <div className={styles.page}>
      <DashboardNavBar title={ACTIVITY_NAME} exitTo="/dashboard" />
      <main className={styles.content}>
        <div className={styles.card}>
          {step === 'hearing' ? (
            <HearingCheckStep onConfirmed={() => setStep('microphone')} />
          ) : (
            <MicrophoneCheckStep />
          )}
        </div>
      </main>
    </div>
  )
}
