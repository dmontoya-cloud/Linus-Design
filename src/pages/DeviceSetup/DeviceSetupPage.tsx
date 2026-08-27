import { Fragment, useEffect, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
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

/** "I can hear the sound" reveals once the reading is about halfway through, on request — see
 * `HALFWAY_INDEX` on `AssessmentIntroPage`, the same idea applied here. Rounds down, so
 * "halfway" never waits for one word more than it has to. */
const HEARING_HALFWAY_INDEX = Math.floor((HEARING_WORDS.length - 1) / 2)

/** First step: confirms the visitor can hear audio from their device. Its own instructions
 * cascade in, read aloud (see `./deviceSetupVoiceOver`) with the progressive "read so far"
 * highlight, same as every other screen in this flow. A `TestSoundPlayer` sits right after the
 * paragraph — its own synthesized bird-chirp sound, so a visitor can actually confirm they can
 * hear, not just take the page's word for it — shown as soon as the paragraph mounts rather than
 * gated behind the reading finishing, since it's a self-contained check independent of whether
 * the voice-over has finished. "I can hear the sound" reveals once the reading is about halfway
 * through (`HEARING_HALFWAY_INDEX`), on request, rather than waiting for the whole paragraph —
 * clicking it before the voice-over finishes still cancels the reading in progress, the same way
 * unmounting always does (see the cleanup below). `onConfirmed` swaps this step out for
 * `MicrophoneCheckStep` in place, on the same page — not a route change — since the two are one
 * continuous device check. */
function HearingCheckStep({ onConfirmed }: { onConfirmed: () => void }) {
  const [readUpToIndex, setReadUpToIndex] = useState<number | null>(null)
  const hasReachedHalfway = readUpToIndex !== null && readUpToIndex >= HEARING_HALFWAY_INDEX

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
        className={[styles.actions, hasReachedHalfway ? styles.actionsRevealed : ''].join(' ')}
        style={{ animationDelay: cascadeDelay(0) }}
        aria-hidden={!hasReachedHalfway}
      >
        <Button variant="primary" size="lg" disabled={!hasReachedHalfway} onClick={onConfirmed}>
          I can hear the sound
        </Button>
      </div>
    </>
  )
}

/** Once the mic is confirmed, how long to hold on `MicrophoneLevelBars`' own "Microphone is
 * working" checkmark before swapping to the spinner — long enough to actually register as a
 * confirmation, not just flash past. */
const CONFIRMED_HOLD_MS = 1200
/** How long the spinner shows before navigating on to `DeviceReadyPage` — this is a fixed hold,
 * not tied to any real loading work (there's nothing left to check by this point), purely so the
 * transition doesn't feel instant/jarring. */
const SPINNER_HOLD_MS = 900

type MicrophoneHandoffPhase = 'checking' | 'confirmed' | 'navigating'

/** Second step: a real microphone check, not a canned animation — `MicrophoneLevelBars` asks
 * for actual mic access and visualizes live input level, since a fake bar animation couldn't
 * verify anything. It also decides for itself whether the mic is working: as soon as it detects
 * roughly 3-4 words' worth of continuous speech (matched by level and timing only — no words
 * transcribed, no audio leaves the device), it swaps the bars for a checkmark right away, rather
 * than waiting for several separate pause-and-repeat bursts. That detection is only armed once
 * `hasFinishedReading` is true (`detectionEnabled`) — while this step's own instructions are
 * still being read aloud, the mic could pick up that voice-over audio right back out of the
 * device's speakers and mistake it for the visitor speaking. Same voice-over/highlight/reveal
 * treatment as the first step, with its own separate script (see `./microphoneCheckVoiceOver`)
 * and its own independent reading progress — switching steps doesn't carry state between them.
 *
 * There's no manual "Continue" here — on request, the hand-off is automatic:
 * `MicrophoneLevelBars`' own `onConfirmed` callback moves `handoffPhase` from `'checking'` to
 * `'confirmed'` (its checkmark is already showing at this point, unchanged); after
 * `CONFIRMED_HOLD_MS`, `handoffPhase` moves to `'navigating'`, which swaps that same spot to a
 * `Spinner`; after `SPINNER_HOLD_MS` more, it navigates to `DeviceReadyPage`. Three separate
 * timers rather than one combined one, each keyed off the phase that started it, so the
 * component doesn't need to reason about one single elapsed duration covering two different
 * visual states. */
function MicrophoneCheckStep() {
  const [readUpToIndex, setReadUpToIndex] = useState<number | null>(null)
  const hasFinishedReading = readUpToIndex === MIC_WORDS.length - 1
  const [handoffPhase, setHandoffPhase] = useState<MicrophoneHandoffPhase>('checking')
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => speakMic(setReadUpToIndex), AUTOPLAY_DELAY_MS)
    return () => {
      window.clearTimeout(timer)
      cancelMic()
    }
  }, [])

  useEffect(() => {
    if (handoffPhase !== 'confirmed') return
    const timer = window.setTimeout(() => setHandoffPhase('navigating'), CONFIRMED_HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [handoffPhase])

  useEffect(() => {
    if (handoffPhase !== 'navigating') return
    const timer = window.setTimeout(() => {
      navigate('/assessment/memory-and-thinking/microphone-check', { replace: true })
    }, SPINNER_HOLD_MS)
    return () => window.clearTimeout(timer)
  }, [handoffPhase, navigate])

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
      {handoffPhase === 'navigating' ? (
        <div
          className={[styles.spinnerWrapper, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(3) }}
        >
          <Spinner />
          <p className={styles.spinnerMessage} role="status" aria-live="polite">
            Getting things ready
          </p>
        </div>
      ) : (
        <div
          className={[styles.micBarsWrapper, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(3) }}
        >
          <MicrophoneLevelBars
            detectionEnabled={hasFinishedReading}
            onConfirmed={() => setHandoffPhase('confirmed')}
          />
        </div>
      )}
    </>
  )
}

/**
 * Device Setup — the screen "I'm Ready to Begin" hands off to from Assessment Intro. Two steps,
 * swapped in place on this one page rather than separate routes, since they're one continuous
 * device check: `HearingCheckStep` confirms the visitor can hear audio — via its own
 * `SpeakerCompanion` illustration and a `TestSoundPlayer` they can actually press — then
 * `MicrophoneCheckStep` replaces it with `MicrophoneCompanion` and a real, live microphone level
 * check. Both mirror Assessment Intro's full voice-over interaction — cascading in on mount,
 * reading their own instructions aloud with the same progressive "read so far" highlight.
 * `HearingCheckStep`'s button row (`.actions`) is reserved but `visibility: hidden` from the
 * start, so revealing it partway through the reading is a clean fade+rise in place rather than a
 * clipped/masked reveal or a jump elsewhere on the page — but `MicrophoneCheckStep` has no button
 * at all: once the mic is confirmed working, it hands off automatically (checkmark, then a
 * spinner, then `DeviceReadyPage`), since by that point there's nothing left to click "Continue"
 * for the visitor to decide about. Its `DashboardNavBar` uses `exitVariant="outline"` — a
 * bordered pill with a `SignOutIcon` — the same Exit style `DeviceReadyPage` and
 * `ShoppingListIntroPage` use, on request, so the whole device-setup-through-assessment-task
 * flow looks consistent.
 */
export function DeviceSetupPage() {
  const [step, setStep] = useState<'hearing' | 'microphone'>('hearing')

  return (
    <div className={styles.page}>
      <DashboardNavBar title={ACTIVITY_NAME} exitTo="/dashboard" exitVariant="outline" />
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
