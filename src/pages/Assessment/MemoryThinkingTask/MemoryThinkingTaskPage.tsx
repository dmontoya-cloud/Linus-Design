import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { AnswerOption } from '@/components/atoms/AnswerOption'
import { ProgressStepper } from '@/components/atoms/ProgressStepper'
import {
  ArrowLeftBoldIcon,
  ArrowRightBoldIcon,
  SpeakerHighIcon,
  MicrophoneIcon,
  CheckCircleIcon,
  InfoIcon,
} from '@/components/atoms/Icon'
import { DashboardNavBar } from '../../DashboardNavBar'
import {
  IMMEDIATE_RECALL_TRIAL_COUNT,
  IMMEDIATE_RECALL_INSTRUCTIONS_BY_TRIAL,
  CATEGORY_FLUENCY_INSTRUCTIONS,
  CATEGORY_FLUENCY_CATEGORY,
  BACKWARD_DIGIT_SPAN_INSTRUCTIONS,
  BACKWARD_DIGIT_SPAN_EXAMPLE,
  BACKWARD_DIGIT_SPAN_PRACTICE_RESULT_DIGITS,
  BACKWARD_DIGIT_SPAN_TRIAL_COUNT,
  DELAYED_RECALL_INSTRUCTIONS,
  DELAYED_RECOGNITION_INSTRUCTIONS,
  DELAYED_RECOGNITION_TRIALS,
} from './memoryThinkingTaskData'
import flowStyles from '../QuestionFlowPage.module.css'
import styles from './MemoryThinkingTaskPage.module.css'

const ACTIVITY_NAME = 'Memory & Thinking'

/** One entry in the flat, fixed-order list of screens this page steps through, in the same
 * order Figma lays its own frames out top-to-bottom: Immediate Recall (run twice — see
 * `IMMEDIATE_RECALL_TRIAL_COUNT`'s own comment), Category Fluency, Backward Digit Span (a
 * worked example, one practice round, then three real trials), Delayed Recall, then Delayed
 * Recognition. Each task's own repeated sub-steps (a trial's listen/repeat/done, or one
 * recognition question) carry a `trial` index rather than being spelled out as separate kinds,
 * the same "loop a fixed-length sequence" approach `PrioritiesQuestionsPage`'s own
 * `rating-question` screen uses for its five ratings. */
type Screen =
  | { kind: 'ir-instructions'; trial: number }
  | { kind: 'ir-listen'; trial: number }
  | { kind: 'ir-recall'; trial: number }
  | { kind: 'cf-instructions' }
  | { kind: 'cf-prompt' }
  | { kind: 'cf-recording' }
  | { kind: 'cf-done' }
  | { kind: 'bds-instructions' }
  | { kind: 'bds-practice-listen' }
  | { kind: 'bds-practice-repeat' }
  | { kind: 'bds-practice-result' }
  | { kind: 'bds-trial-listen'; trial: number }
  | { kind: 'bds-trial-repeat'; trial: number }
  | { kind: 'bds-trial-done'; trial: number }
  | { kind: 'dr-instructions' }
  | { kind: 'dr-recall' }
  | { kind: 'dr-done' }
  | { kind: 'drec-instructions' }
  | { kind: 'drec-question'; trial: number }

const SCREENS: Screen[] = [
  ...Array.from({ length: IMMEDIATE_RECALL_TRIAL_COUNT }, (_, trial): Screen[] => [
    { kind: 'ir-instructions', trial },
    { kind: 'ir-listen', trial },
    { kind: 'ir-recall', trial },
  ]).flat(),
  { kind: 'cf-instructions' },
  { kind: 'cf-prompt' },
  { kind: 'cf-recording' },
  { kind: 'cf-done' },
  { kind: 'bds-instructions' },
  { kind: 'bds-practice-listen' },
  { kind: 'bds-practice-repeat' },
  { kind: 'bds-practice-result' },
  ...Array.from({ length: BACKWARD_DIGIT_SPAN_TRIAL_COUNT }, (_, trial): Screen[] => [
    { kind: 'bds-trial-listen', trial },
    { kind: 'bds-trial-repeat', trial },
    { kind: 'bds-trial-done', trial },
  ]).flat(),
  { kind: 'dr-instructions' },
  { kind: 'dr-recall' },
  { kind: 'dr-done' },
  { kind: 'drec-instructions' },
  ...DELAYED_RECOGNITION_TRIALS.map((_, trial): Screen => ({ kind: 'drec-question', trial })),
]

/** The five real tasks this flow walks through, in order — drives the header's own
 * `ProgressStepper` ("Backward Digit Span (3 of 5)"), same "task N of 5" framing
 * `LifestyleQuestionsPage`/`PrioritiesQuestionsPage` give their own questions/screens. */
const TASK_LABELS = [
  'Immediate Recall',
  'Category Fluency',
  'Backward Digit Span',
  'Delayed Recall',
  'Delayed Recognition',
] as const

function taskIndexFor(screen: Screen): number {
  switch (screen.kind) {
    case 'ir-instructions':
    case 'ir-listen':
    case 'ir-recall':
      return 0
    case 'cf-instructions':
    case 'cf-prompt':
    case 'cf-recording':
    case 'cf-done':
      return 1
    case 'bds-instructions':
    case 'bds-practice-listen':
    case 'bds-practice-repeat':
    case 'bds-practice-result':
    case 'bds-trial-listen':
    case 'bds-trial-repeat':
    case 'bds-trial-done':
      return 2
    case 'dr-instructions':
    case 'dr-recall':
    case 'dr-done':
      return 3
    case 'drec-instructions':
    case 'drec-question':
      return 4
  }
}

/** The illustrative "please listen"/"say it back" circle shown on every audio-only step —
 * `active` swaps the idle gray ring for Figma's green "recording" ring and recolors the glyph
 * to match, both static (no real pulse/animation — see this page's own doc comment for why);
 * `done` overlays a small checkmark badge instead, Figma's own compound "task complete" icon. */
function StepIcon({
  glyph: Glyph,
  active,
  done,
}: {
  glyph: typeof SpeakerHighIcon
  active?: boolean
  done?: boolean
}) {
  return (
    <div
      className={[styles.iconCircle, active && styles.iconCircleActive].filter(Boolean).join(' ')}
    >
      <Glyph
        className={[styles.iconGlyph, active && styles.iconGlyphActive].filter(Boolean).join(' ')}
      />
      {done && <CheckCircleIcon className={styles.doneBadge} />}
    </div>
  )
}

/** The "Press Done when you are finished"/"Keep going..." info callout shown under a live
 * recall/recording step — same info-soft treatment `MemoryThinkingDetailsPage`'s own
 * `.redoNotice` uses for its inline hint. */
function HintBox({ children }: { children: string }) {
  return (
    <div className={styles.hintBox}>
      <InfoIcon className={styles.hintIcon} />
      <p>{children}</p>
    </div>
  )
}

/**
 * Memory & Thinking — a click-through-only recreation of the real Memory & Thinking assessment
 * task screens (Immediate Recall, Category Fluency, Backward Digit Span, Delayed Recall,
 * Delayed Recognition), reached from `MemoryThinkingDetailsPage`'s "I'm ready" at `/assessment`:
 * Figma's "Memory and Thinking" section (node 756:11410, file `uajF7CIU6kCyd2epbvlNNl`) rebuilt
 * with this app's own design-system tokens/components, in the same shared
 * `QuestionFlowPage.module.css` layout `LifestyleQuestionsPage`/`PrioritiesQuestionsPage` already
 * use (one nav bar, one progress stepper, one white question-card), and the same "one step shown
 * at a time via local `useState`, no persistence" approach those two pages use — not a route per
 * screen. Replaces an earlier flow (`AssessmentIntroPage` → `DeviceSetupPage` →
 * `DeviceReadyPage` → `ShoppingListIntroPage`) that spoke its instructions aloud via the
 * browser's own speech synthesis and ran a real live microphone level check but only ever
 * covered item 1 of 20 — archived rather than deleted outright (git branch
 * `archive/memory-thinking-device-setup-voiceover`), on request, and replaced with this page
 * instead of kept alongside it: every real task type from Figma, but no real microphone/audio
 * capture, no voice grading, and no real timers anywhere — every step, including ones Figma
 * shows mid-"recording"/"listening" with a pulse animation, advances on an ordinary
 * Next/Continue/Done click (see `StepIcon`'s own comment). Figma duplicates each task's own
 * trial (three Backward Digit Span trials, three Delayed Recognition word groups, two Immediate
 * Recall passes) as separate near-identical frames; this page loops those as data (`SCREENS`'
 * own comment) instead of hand-building one component per frame. Category Fluency's own frames
 * ("Instruction Page 2"/"Example Question" in Figma, both mislabeled leftovers from
 * copy-pasting a different screen — the same kind of artifact `PrioritiesQuestionsPage`'s own
 * doc comment already flags in this file) are included as a fifth real task, on request, since
 * they're a genuine, fully-designed step between Immediate Recall and Backward Digit Span, not
 * a stray variant. Delayed Recall's own instructions frame is one more such leftover —
 * copy-pasted from Delayed Recognition's ("select which word..."), even though the screens
 * after it are a free-recall prompt, not a word-choice one — so this page writes that one
 * screen's copy fresh (`DELAYED_RECALL_INSTRUCTIONS`) to match what it actually asks for,
 * rather than reproducing the mismatched copy verbatim. "Back" on the very first screen exits to
 * `/assessment/start` (`MemoryThinkingDetailsPage`), the same "first question exits to the
 * Details screen" pattern `LifestyleQuestionsPage`/`PrioritiesQuestionsPage` use for their own
 * first question. Delayed Recognition's last question relabels to "Finish" (see
 * `primaryLabel`) and hands off to `ReportReadyPage` with `state: { completedActivityId:
 * 'memory-recall' }` (see `handleFinish`) instead of advancing to one more screen of its own —
 * on request, the exact same "Finish" pattern `LifestyleQuestionsPage`/`PrioritiesQuestionsPage`
 * already use, rather than a local "you're done" screen with no real report-completion effect.
 */
export function MemoryThinkingTaskPage() {
  const navigate = useNavigate()
  const [screenIndex, setScreenIndex] = useState(0)
  const [recognitionAnswers, setRecognitionAnswers] = useState<Record<number, string>>({})

  // `screenIndex` is always kept in `[0, SCREENS.length)` by `handleBack`/`handleNext`/
  // `handleRetryPractice` below, so this index is never out of bounds — the non-null assertion
  // just satisfies noUncheckedIndexedAccess.
  const screen = SCREENS[screenIndex]!
  const taskIndex = taskIndexFor(screen)
  const taskLabel = TASK_LABELS[taskIndex]
  // The very last screen in the whole flow (Delayed Recognition's last trial) — its primary
  // button already reads "Finish" (see `primaryLabel`) and hands off to `ReportReadyPage`
  // instead of advancing `screenIndex` any further.
  const isLastScreen = screenIndex === SCREENS.length - 1

  function isAnswered(): boolean {
    if (screen.kind === 'drec-question') {
      return recognitionAnswers[screen.trial] !== undefined
    }
    return true
  }

  function handleBack() {
    if (screenIndex === 0) {
      navigate('/assessment/start')
      return
    }
    setScreenIndex((index) => index - 1)
  }

  function handleNext() {
    setScreenIndex((index) => Math.min(index + 1, SCREENS.length - 1))
  }

  /** Delayed Recognition's last question hands off to `ReportReadyPage`, on request, the same
   * way `LifestyleQuestionsPage`/`PrioritiesQuestionsPage`'s own last question does — marking
   * Memory & Thinking complete once this page is actually finished rather than a fake local
   * "complete" screen with no real report-completion effect. */
  function handleFinish() {
    navigate('/report/ready', { state: { completedActivityId: 'memory-recall' } })
  }

  /** Backward Digit Span's practice-result screen offers "Retry the practice" — restarting from
   * the practice round's own first step (`bds-practice-listen`, two screens before this one:
   * listen, then repeat, then this result), not just stepping back one screen the way `Back`
   * does everywhere else. */
  function handleRetryPractice() {
    setScreenIndex((index) => index - 2)
  }

  function primaryLabel(): string {
    switch (screen.kind) {
      case 'ir-instructions':
      case 'cf-instructions':
      case 'dr-instructions':
      case 'drec-instructions':
        return 'Start'
      case 'bds-instructions':
        return 'Practice'
      case 'ir-listen':
      case 'cf-prompt':
      case 'bds-practice-listen':
      case 'bds-trial-listen':
        return 'Continue'
      case 'ir-recall':
      case 'cf-recording':
      case 'bds-practice-repeat':
      case 'bds-trial-repeat':
      case 'dr-recall':
        return 'Done'
      case 'cf-done':
      case 'bds-trial-done':
      case 'dr-done':
        return 'Continue'
      case 'drec-question':
        return screen.trial === DELAYED_RECOGNITION_TRIALS.length - 1 ? 'Finish' : 'Next'
      // Rendered with its own bespoke action row (see the component's return below) instead of
      // the shared Back/primary pair — this branch is never actually read.
      case 'bds-practice-result':
        return ''
    }
  }

  function renderScreenContent() {
    switch (screen.kind) {
      case 'ir-instructions':
        return (
          <>
            <h1 className={flowStyles.question}>
              {screen.trial > 0
                ? `Immediate Recall — Trial ${screen.trial + 1}`
                : 'Immediate Recall'}
            </h1>
            {IMMEDIATE_RECALL_INSTRUCTIONS_BY_TRIAL[screen.trial]!.map((paragraph) => (
              <p key={paragraph} className={flowStyles.paragraph}>
                {paragraph}
              </p>
            ))}
          </>
        )
      case 'ir-listen':
        return (
          <>
            <StepIcon glyph={SpeakerHighIcon} />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>Please listen</h1>
          </>
        )
      case 'ir-recall':
        return (
          <>
            <StepIcon glyph={MicrophoneIcon} active />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              Say the words back to me now in any order.
            </h1>
            <HintBox>Press Done when you are finished.</HintBox>
          </>
        )
      case 'cf-instructions':
        return (
          <>
            <h1 className={flowStyles.question}>Category Fluency</h1>
            {CATEGORY_FLUENCY_INSTRUCTIONS.map((paragraph) => (
              <p key={paragraph} className={flowStyles.paragraph}>
                {paragraph}
              </p>
            ))}
            <p className={[flowStyles.paragraph, styles.paragraphStrong].join(' ')}>
              Be sure to say them out loud.
            </p>
          </>
        )
      case 'cf-prompt':
        return (
          <>
            <StepIcon glyph={MicrophoneIcon} />
            <p className={[flowStyles.paragraph, styles.centerParagraph].join(' ')}>
              The category is:
            </p>
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              {CATEGORY_FLUENCY_CATEGORY}
            </h1>
          </>
        )
      case 'cf-recording':
        return (
          <>
            <StepIcon glyph={MicrophoneIcon} active />
            <p className={[flowStyles.paragraph, styles.centerParagraph].join(' ')}>
              The category is:
            </p>
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              {CATEGORY_FLUENCY_CATEGORY}
            </h1>
            <HintBox>{`Keep going. Try to think of other ${CATEGORY_FLUENCY_CATEGORY.toLowerCase()}.`}</HintBox>
          </>
        )
      case 'cf-done':
        return (
          <>
            <StepIcon glyph={MicrophoneIcon} done />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              Your 1 minute is up.
            </h1>
            <p className={[flowStyles.paragraph, styles.centerParagraph].join(' ')}>
              You have completed this task.
            </p>
          </>
        )
      case 'bds-instructions':
        return (
          <>
            <h1 className={flowStyles.question}>Backward Digit Span</h1>
            {BACKWARD_DIGIT_SPAN_INSTRUCTIONS.map((paragraph) => (
              <p key={paragraph} className={flowStyles.paragraph}>
                {paragraph}
              </p>
            ))}
            <div className={styles.exampleBox}>
              <p className={styles.exampleLabel}>Example</p>
              <p className={flowStyles.paragraph}>If you hear:</p>
              <p className={styles.exampleDigits}>{BACKWARD_DIGIT_SPAN_EXAMPLE.heard}</p>
              <p className={flowStyles.paragraph}>You would say:</p>
              <p className={styles.exampleDigits}>{BACKWARD_DIGIT_SPAN_EXAMPLE.said}</p>
            </div>
            <p className={flowStyles.paragraph}>Let&rsquo;s begin with a practice.</p>
          </>
        )
      case 'bds-practice-listen':
        return (
          <>
            <p className={styles.practiceBadge}>Practice</p>
            <StepIcon glyph={SpeakerHighIcon} />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>Please listen</h1>
          </>
        )
      case 'bds-practice-repeat':
        return (
          <>
            <p className={styles.practiceBadge}>Practice</p>
            <StepIcon glyph={MicrophoneIcon} active />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              Repeat backwards now
            </h1>
            <HintBox>Press Done when you are finished.</HintBox>
          </>
        )
      case 'bds-practice-result':
        return (
          <>
            <div className={styles.exampleBox}>
              <p className={styles.exampleLabel}>Practice</p>
              <p className={flowStyles.paragraph}>If you said:</p>
              <p className={styles.exampleDigits}>{BACKWARD_DIGIT_SPAN_PRACTICE_RESULT_DIGITS}</p>
              <p className={flowStyles.paragraph}>You are correct!</p>
            </div>
            <p className={flowStyles.paragraph}>
              You will do this {BACKWARD_DIGIT_SPAN_TRIAL_COUNT} times.
            </p>
            <p className={flowStyles.paragraph}>
              You can retry the practice or tap &ldquo;Start&rdquo; to begin.
            </p>
          </>
        )
      case 'bds-trial-listen':
        return (
          <>
            <p className={[flowStyles.paragraph, styles.centerParagraph].join(' ')}>
              Trial {screen.trial + 1} of {BACKWARD_DIGIT_SPAN_TRIAL_COUNT}
            </p>
            <StepIcon glyph={SpeakerHighIcon} />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>Please listen</h1>
          </>
        )
      case 'bds-trial-repeat':
        return (
          <>
            <p className={[flowStyles.paragraph, styles.centerParagraph].join(' ')}>
              Trial {screen.trial + 1} of {BACKWARD_DIGIT_SPAN_TRIAL_COUNT}
            </p>
            <StepIcon glyph={MicrophoneIcon} active />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              Repeat backwards now
            </h1>
            <HintBox>Press Done when you are finished.</HintBox>
          </>
        )
      case 'bds-trial-done':
        return (
          <>
            <StepIcon glyph={MicrophoneIcon} done />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              {screen.trial + 1}/{BACKWARD_DIGIT_SPAN_TRIAL_COUNT} tasks complete
            </h1>
          </>
        )
      case 'dr-instructions':
        return (
          <>
            <h1 className={flowStyles.question}>Delayed Recall</h1>
            {DELAYED_RECALL_INSTRUCTIONS.map((paragraph) => (
              <p key={paragraph} className={flowStyles.paragraph}>
                {paragraph}
              </p>
            ))}
          </>
        )
      case 'dr-recall':
        return (
          <>
            <StepIcon glyph={MicrophoneIcon} active />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              Say the words back to me now in any order.
            </h1>
            <HintBox>Press Done when you are finished.</HintBox>
          </>
        )
      case 'dr-done':
        return (
          <>
            <StepIcon glyph={MicrophoneIcon} done />
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>All done!</h1>
          </>
        )
      case 'drec-instructions':
        return (
          <>
            <h1 className={flowStyles.question}>Delayed Recognition</h1>
            {DELAYED_RECOGNITION_INSTRUCTIONS.map((paragraph) => (
              <p key={paragraph} className={flowStyles.paragraph}>
                {paragraph}
              </p>
            ))}
          </>
        )
      case 'drec-question': {
        // `screen.trial` only ever comes from `DELAYED_RECOGNITION_TRIALS.map` above, so it's
        // always in range — the non-null assertion just satisfies noUncheckedIndexedAccess.
        const trialData = DELAYED_RECOGNITION_TRIALS[screen.trial]!
        return (
          <fieldset className={flowStyles.fieldset}>
            <legend className={flowStyles.question}>{trialData.question}</legend>
            <div className={flowStyles.options}>
              {trialData.options.map((option) => (
                <AnswerOption
                  key={option}
                  type="radio"
                  name={`drec-${screen.trial}`}
                  value={option}
                  label={option}
                  checked={recognitionAnswers[screen.trial] === option}
                  onChange={() =>
                    setRecognitionAnswers((prev) => ({ ...prev, [screen.trial]: option }))
                  }
                />
              ))}
            </div>
          </fieldset>
        )
      }
    }
  }

  return (
    <div className={flowStyles.page}>
      <DashboardNavBar title={ACTIVITY_NAME} exitTo="/dashboard" exitVariant="outline" />
      <main className={flowStyles.content}>
        <div className={flowStyles.card}>
          <div className={flowStyles.progressSection}>
            <p className={flowStyles.progressLabel}>
              {taskLabel} ({taskIndex + 1} of {TASK_LABELS.length})
            </p>
            <ProgressStepper
              value={taskIndex + 1}
              max={TASK_LABELS.length}
              label={`${taskLabel}, task ${taskIndex + 1} of ${TASK_LABELS.length}`}
            />
          </div>
          {renderScreenContent()}
          {screen.kind === 'bds-practice-result' ? (
            <div className={styles.resultActions}>
              <Button variant="outline" size="lg" onClick={handleRetryPractice}>
                Retry
              </Button>
              <Button variant="primary" size="lg" onClick={handleNext}>
                Start
                <ArrowRightBoldIcon className={flowStyles.nextIcon} />
              </Button>
            </div>
          ) : (
            <div className={flowStyles.actions}>
              <Button variant="outline" size="lg" onClick={handleBack}>
                <ArrowLeftBoldIcon className={flowStyles.backIcon} />
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                disabled={!isAnswered()}
                onClick={isLastScreen ? handleFinish : handleNext}
              >
                {primaryLabel()}
                <ArrowRightBoldIcon className={flowStyles.nextIcon} />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
