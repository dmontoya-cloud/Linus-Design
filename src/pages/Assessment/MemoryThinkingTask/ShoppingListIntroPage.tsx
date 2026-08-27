import { Fragment, useEffect, useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { DashboardNavBar } from '../../DashboardNavBar'
import { cascadeDelay } from '../../cascade'
import { MicrophoneLevelBars } from '../../DeviceSetup/MicrophoneLevelBars'
import {
  WORDS,
  TITLE_TEXT,
  PARAGRAPH_1_TEXT,
  PARAGRAPH_2_TEXT,
  PARAGRAPH_3_TEXT,
  speak,
  cancelSpeech,
} from './shoppingListVoiceOver'
import {
  speak as speakItems,
  cancelSpeech as cancelItemsSpeech,
} from './shoppingListItemsVoiceOver'
import styles from './ShoppingListIntroPage.module.css'

/** Some browsers (notably Chrome) can silently drop a `speechSynthesis.speak()` call made the
 * instant a page mounts — the synthesis engine hasn't finished spinning up yet. A short delay
 * before the very first, autoplaying call is a commonly-used workaround. */
const AUTOPLAY_DELAY_MS = 250

const ACTIVITY_NAME = 'Memory & Thinking'
/** This is item 1 of the Memory & Thinking activity's 20 items — hardcoded rather than a prop,
 * since only this one item is built so far; items 2-20 don't exist yet to make this configurable
 * for. */
const CURRENT_ITEM = 1
const TOTAL_ITEMS = 20
/** How long "Now it's your turn" gives a visitor to recall the list out loud before moving on
 * automatically — a fixed countdown, not tied to anything they actually say (there's no attempt
 * to detect "they're done early" and cut it short). */
const RECALL_DURATION_SECONDS = 30

interface WordSegment {
  words: typeof WORDS
  /** This segment's first word's position in the single, continuous `WORDS` reading — not a
   * local index — so highlighting stays correct against one shared `readUpToIndex`. */
  startIndex: number
}

/** Splits the one continuous `WORDS` reading back into per-block segments matching what's shown
 * on screen (headline, then 3 paragraphs) — computed once at module load, from the same text
 * each block renders, so it can never drift out of sync with `INSTRUCTIONS_TEXT`. A module-level
 * cursor advanced by four explicit calls (rather than `.map()` over an array and destructuring
 * the result) sidesteps `noUncheckedIndexedAccess` treating each destructured element as
 * possibly `undefined` — these four calls are exhaustive, not an indexed lookup. */
let wordSegmentCursor = 0
function takeNextSegment(text: string): WordSegment {
  const wordCount = text.split(/\s+/).length
  const segment: WordSegment = {
    words: WORDS.slice(wordSegmentCursor, wordSegmentCursor + wordCount),
    startIndex: wordSegmentCursor,
  }
  wordSegmentCursor += wordCount
  return segment
}

const TITLE_SEGMENT = takeNextSegment(TITLE_TEXT)
const PARAGRAPH_1_SEGMENT = takeNextSegment(PARAGRAPH_1_TEXT)
const PARAGRAPH_2_SEGMENT = takeNextSegment(PARAGRAPH_2_TEXT)
const PARAGRAPH_3_SEGMENT = takeNextSegment(PARAGRAPH_3_TEXT)

/** Renders one text block's words as the same per-word "read so far" spans every voice-over
 * screen in this app uses — `readUpToIndex` and each word's `startIndex` within the shared
 * reading are what make the read/unread boundary line up correctly across blocks that render
 * separately but are one continuous read underneath. */
function renderSegment(
  segment: WordSegment,
  readUpToIndex: number | null,
  wordClassName: string | undefined,
  wordReadClassName: string | undefined,
) {
  return segment.words.map((word, localIndex) => {
    const globalIndex = segment.startIndex + localIndex
    const isRead = readUpToIndex !== null && globalIndex <= readUpToIndex
    return (
      <Fragment key={word.start}>
        <span className={isRead ? `${wordClassName} ${wordReadClassName}` : wordClassName}>
          {word.text}
        </span>
        {localIndex < segment.words.length - 1 ? ' ' : ''}
      </Fragment>
    )
  })
}

/** A small original illustration (an ear with sound waves arriving at it, same soft blob
 * background and hand-drawn line-art style as Device Setup's `SpeakerCompanion`/
 * `MicrophoneCompanion`) shown on the "Listen carefully" step — this one's about sound going
 * *into* the visitor, not a device, so the wave motif points at an ear rather than a speaker or
 * microphone. */
function ListeningCompanion({ className, style }: { className?: string; style?: CSSProperties }) {
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
      <path
        d="M118,32 C148,36 162,62 156,90 C152,110 134,120 122,112
           C132,100 132,84 122,74 C114,66 102,68 96,78
           C90,88 94,100 106,104"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M106,104 Q98,116 108,124"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M62,45 q-18,30 0,60"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M47,35 q-26,40 0,80"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M38,25 q-28,50 0,100"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** First step: the "pretend you're going shopping" instructions, read aloud on mount (see
 * `speak`, in `./shoppingListVoiceOver`) with the same progressive "read so far" highlight every
 * voice-over screen in this app uses — but here that one continuous reading spans four
 * separately-rendered blocks (the bold headline, then three paragraphs), not one `<p>`; see
 * `WORD_SEGMENTS`/`renderSegment` for how the highlight boundary still lines up correctly across
 * that split. "Start" stays hidden (reserved via `visibility: hidden`, not grown in — see
 * `AssessmentIntroPage` for why) until the reading finishes completely — unlike the earlier
 * device-check screens' buttons, which reveal at roughly the halfway point on request, this
 * wasn't asked to, so it defaults to waiting for the whole thing, matching "Press Start when you
 * are ready to begin." `onStart` swaps this step out for `ListeningStep` in place, on the same
 * page — not a route change — since hearing the actual list is the direct continuation of these
 * instructions, not a separate screen to navigate to. */
function InstructionsStep({ onStart }: { onStart: () => void }) {
  const [readUpToIndex, setReadUpToIndex] = useState<number | null>(null)
  const hasFinishedReading = readUpToIndex === WORDS.length - 1

  useEffect(() => {
    const timer = window.setTimeout(() => speak(setReadUpToIndex), AUTOPLAY_DELAY_MS)
    return () => {
      window.clearTimeout(timer)
      cancelSpeech()
    }
  }, [])

  return (
    <>
      <h1
        className={[styles.title, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(0) }}
      >
        {renderSegment(TITLE_SEGMENT, readUpToIndex, styles.titleWord, styles.wordRead)}
      </h1>
      <p
        className={[styles.paragraph, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(1) }}
      >
        {renderSegment(PARAGRAPH_1_SEGMENT, readUpToIndex, styles.word, styles.wordRead)}
      </p>
      <p
        className={[styles.paragraph, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(2) }}
      >
        {renderSegment(PARAGRAPH_2_SEGMENT, readUpToIndex, styles.word, styles.wordRead)}
      </p>
      <p
        className={[styles.paragraph, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(3) }}
      >
        {renderSegment(PARAGRAPH_3_SEGMENT, readUpToIndex, styles.word, styles.wordRead)}
      </p>
      <div
        className={[styles.actions, hasFinishedReading ? styles.actionsRevealed : ''].join(' ')}
        style={{ animationDelay: cascadeDelay(4) }}
        aria-hidden={!hasFinishedReading}
      >
        <Button variant="primary" size="lg" disabled={!hasFinishedReading} onClick={onStart}>
          Start
        </Button>
      </div>
    </>
  )
}

/** Second step: just a title and `ListeningCompanion`, on request — everything else from
 * `InstructionsStep` disappears rather than staying on screen alongside it, since this step is
 * meant to be listened to, not read. Deliberately doesn't also show the item list as text the
 * way every other voice-over screen in this app shows its spoken text on screen too (the usual
 * reasoning: never make voice-over the only way to get information, for visitors who are deaf or
 * hard of hearing or have their sound off) — flagged here rather than silently dropped, since a
 * real memory-recall task like this one is deliberately audio-only by design, the same way it
 * would be read aloud in person; captioning it would undercut the actual task. Reads the list
 * aloud on mount (see `speak`, in `./shoppingListItemsVoiceOver`) — its own separate script and
 * reading progress from `InstructionsStep`'s, the same "one script per step" pattern Device
 * Setup's hearing/microphone steps use. `onFinished` fires once that reading completes, moving
 * on to `RecallStep` — via `speak`'s dedicated `onFinished` callback (its real `onend`), not by
 * watching the word-index reach its last value: that index can come from an *estimated* fallback
 * timer for voices that never fire real `onboundary` events, and that estimate can race ahead of
 * the actual audio. Since this step doesn't render any highlighted text to begin with (see below
 * for why), the index itself is never used here — only genuine completion is, so the list is
 * never cut off partway through by an early "done" that then cancels the still-speaking
 * utterance. */
function ListeningStep({ onFinished }: { onFinished: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => speakItems(() => {}, onFinished), AUTOPLAY_DELAY_MS)
    return () => {
      window.clearTimeout(timer)
      cancelItemsSpeech()
    }
    // onFinished is `() => setStep('recall')` from the parent — stable across this step's
    // lifetime (the parent only ever re-renders because of *this* effect firing), so it's
    // deliberately left out of the dependency array rather than re-running the whole reading
    // (and re-requesting speech synthesis) every time the parent re-renders for an unrelated
    // reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ListeningCompanion className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }} />
      <h1
        className={[styles.listeningTitle, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(1) }}
      >
        Listen carefully
      </h1>
    </>
  )
}

/** Third step: "Now it's your turn" — a fixed `RECALL_DURATION_SECONDS`-second window for the
 * visitor to say the list back out loud, with `MicrophoneLevelBars` (the same live bar
 * visualizer Device Setup's microphone check uses) showing that their voice is actually being
 * picked up. `detectionEnabled={false}` — unlike Device Setup's usage, this isn't confirming the
 * mic works (that already happened back in Device Setup); swapping the bars for a checkmark
 * mid-recall would read as "you're done" well before the visitor is, so that whole
 * confirm-and-swap behavior is turned off here and only the live bars are shown. The countdown
 * is a fixed timer, not tied to anything actually said — once it reaches zero it moves on
 * automatically, no button. */
function RecallStep() {
  const navigate = useNavigate()
  const [secondsRemaining, setSecondsRemaining] = useState(RECALL_DURATION_SECONDS)

  useEffect(() => {
    if (secondsRemaining <= 0) {
      navigate('/assessment/memory-and-thinking/task/next', { replace: true })
      return
    }
    const timer = window.setTimeout(() => setSecondsRemaining((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsRemaining, navigate])

  const displaySeconds = secondsRemaining.toString().padStart(2, '0')

  return (
    <>
      <h1
        className={[styles.listeningTitle, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(0) }}
      >
        Now it&apos;s your turn
      </h1>
      <p
        className={[styles.recallSubtitle, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(1) }}
      >
        Repeat as many words as you remember.
      </p>
      <p
        className={[styles.timer, styles.reveal].join(' ')}
        style={{ animationDelay: cascadeDelay(2) }}
        aria-label={`${secondsRemaining} seconds remaining`}
      >
        0:{displaySeconds}
      </p>
      <div className={[styles.micBarsWrapper, styles.reveal].join(' ')}>
        <MicrophoneLevelBars detectionEnabled={false} />
      </div>
    </>
  )
}

/**
 * Shopping List Intro — item 1 of 20 in the actual Memory & Thinking assessment, the screen
 * `DeviceReadyPage`'s "Continue to test" hands off to. Three steps, swapped in place on this one
 * page rather than separate routes (the same pattern `DeviceSetupPage` uses for its own steps):
 * `InstructionsStep` reads the "pretend you're going shopping" instructions aloud, then
 * `ListeningStep` replaces it with just a title and an ear illustration while reading the actual
 * list to remember, then once that reading finishes, `RecallStep` replaces that with "Now it's
 * your turn" — a fixed 30-second window (with live mic bars, so the visitor can see they're
 * being heard) to say the list back, ending in an automatic hand-off, no button. See each step's
 * own doc comment for why. Chrome (the `DashboardNavBar` + `ProgressBar` header) stays constant
 * across all three steps — only the content below it swaps — matching every other screen in this
 * flow: logo, centered title ("Memory & Thinking · 1 of 20" rather than just the activity name),
 * an "Exit" link using `exitVariant="outline"` (a bordered pill with a `SignOutIcon`, on request
 * — the same style `DeviceSetupPage` and `DeviceReadyPage` use, so the whole device-setup-
 * through-assessment-task flow looks consistent; screens before it keep the plain tertiary text
 * link), and a full-width
 * `ProgressBar` directly beneath it, on request, the same way `OnboardingLayout` places its own
 * progress bar right under its header. The content area vertically centers a `.card`, on
 * request, the same shifted-up `margin-top: -200px` offset Assessment Intro and Device Setup use
 * so this screen sits in the same visual position as the rest of the flow — its paragraph text
 * stays left-aligned, though, not centered like those pages', since `InstructionsStep` is a
 * longer multi-paragraph read. Nothing past `RecallStep` exists yet — its timer hands off to a
 * placeholder (`/assessment/memory-and-thinking/task/next`), since only this one item, not items
 * 2-20 or any real scoring of what the visitor actually said, was asked for.
 */
export function ShoppingListIntroPage() {
  const [step, setStep] = useState<'instructions' | 'listening' | 'recall'>('instructions')

  return (
    <div className={styles.page}>
      <DashboardNavBar
        title={`${ACTIVITY_NAME} · ${CURRENT_ITEM} of ${TOTAL_ITEMS}`}
        exitTo="/dashboard"
        exitVariant="outline"
      />
      <div className={styles.progressSection}>
        <ProgressBar
          value={CURRENT_ITEM}
          max={TOTAL_ITEMS}
          label={`${ACTIVITY_NAME}, item ${CURRENT_ITEM} of ${TOTAL_ITEMS}`}
        />
      </div>
      <main className={styles.content}>
        <div className={styles.card}>
          {step === 'instructions' ? (
            <InstructionsStep onStart={() => setStep('listening')} />
          ) : step === 'listening' ? (
            <ListeningStep onFinished={() => setStep('recall')} />
          ) : (
            <RecallStep />
          )}
        </div>
      </main>
    </div>
  )
}
