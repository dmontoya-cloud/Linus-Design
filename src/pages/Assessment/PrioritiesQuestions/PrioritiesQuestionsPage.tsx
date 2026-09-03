import { useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Field } from '@/components/atoms/Field'
import { AnswerOption } from '@/components/atoms/AnswerOption'
import { ProgressStepper } from '@/components/atoms/ProgressStepper'
import {
  ArrowLeftBoldIcon,
  ArrowRightBoldIcon,
  PlusCircleIcon,
  StarFillIcon,
  StarIcon,
} from '@/components/atoms/Icon'
import { DashboardNavBar } from '../../DashboardNavBar'
import {
  NAMED_TOPICS,
  OTHER_TOPIC,
  TOP_FIVE,
  RATING,
  ASSIST_QUESTION,
  TOTAL_STEPS,
} from './prioritiesTopics'
import flowStyles from '../QuestionFlowPage.module.css'
import styles from './PrioritiesQuestionsPage.module.css'

/** One entry in the flat, fixed-order list of screens this page steps through — see the
 * component's own doc comment for how these map to Figma's 13 numbered steps. Each named topic
 * contributes two screens (instructions, then its free-text answer); "Other" skips straight to
 * its answer (it has no instructions screen in Figma); "Top five" is an instructions screen
 * plus the ranking screen itself; Rating is one instructions screen plus one question per
 * chosen priority; the flow ends on a single closing yes/no question. */
type Screen =
  | { kind: 'topic-instructions'; topicIndex: number }
  | { kind: 'topic-answer'; topicIndex: number }
  | { kind: 'other-answer' }
  | { kind: 'topfive-instructions' }
  | { kind: 'topfive-select' }
  | { kind: 'rating-instructions' }
  | { kind: 'rating-question'; priorityIndex: number }
  | { kind: 'assist-question' }

const SCREENS: Screen[] = [
  ...NAMED_TOPICS.flatMap((_, topicIndex): Screen[] => [
    { kind: 'topic-instructions', topicIndex },
    { kind: 'topic-answer', topicIndex },
  ]),
  { kind: 'other-answer' },
  { kind: 'topfive-instructions' },
  { kind: 'topfive-select' },
  { kind: 'rating-instructions' },
  { kind: 'rating-question', priorityIndex: 0 },
  { kind: 'rating-question', priorityIndex: 1 },
  { kind: 'rating-question', priorityIndex: 2 },
  { kind: 'rating-question', priorityIndex: 3 },
  { kind: 'rating-question', priorityIndex: 4 },
  { kind: 'assist-question' },
]

const ALL_TOPIC_IDS = [...NAMED_TOPICS.map((topic) => topic.id), OTHER_TOPIC.id]

function stepNumberFor(screen: Screen): number {
  switch (screen.kind) {
    case 'topic-instructions':
    case 'topic-answer':
      return screen.topicIndex + 1
    case 'other-answer':
      return 6
    case 'topfive-instructions':
    case 'topfive-select':
      return 7
    case 'rating-instructions':
      return 8
    case 'rating-question':
      return 8 + screen.priorityIndex
    case 'assist-question':
      return TOTAL_STEPS
  }
}

function stepLabelFor(screen: Screen): string {
  switch (screen.kind) {
    case 'topic-instructions':
    case 'topic-answer':
      // `topicIndex` only ever comes from `NAMED_TOPICS.flatMap` above, so it's always in range —
      // the non-null assertion just satisfies noUncheckedIndexedAccess.
      return NAMED_TOPICS[screen.topicIndex]!.progressLabel
    case 'other-answer':
      return OTHER_TOPIC.progressLabel
    case 'topfive-instructions':
    case 'topfive-select':
      return TOP_FIVE.progressLabel
    default:
      return RATING.progressLabel
  }
}

/**
 * Priorities Questions — the real, interactive 13-step flow `PrioritiesDetailsPage`'s "Start
 * Activity" hands off to, on request: Figma's "Priorities" section (node 599:6497) rebuilt
 * with this app's own design-system tokens/components, in the same shared layout
 * `LifestyleQuestionsPage` uses (`QuestionFlowPage.module.css` — one nav bar, one progress
 * stepper, one white question-card holding everything), on request, so the two questionnaires
 * read as the same product rather than two different UIs. Much more varied than Lifestyle's
 * fixed yes/no-or-checkbox questions, so it drives its steps from a flat, fixed-order `SCREENS`
 * list (see that type's own comment) rather than one question shape repeated: six topics
 * (`NAMED_TOPICS`' five, plus `OTHER_TOPIC`) each collect one or more free-text answers — an
 * "Add another" button appends more `Field`s, never removes one, matching Figma; every
 * non-empty answer written across those six topics then becomes an option on "Top five"
 * (`TOP_FIVE`), a plain-row list (not `AnswerOption`'s bordered cards, on request — Figma's own
 * treatment) where a star toggles a pick, capped at five — reaching the cap disables every
 * still-unpicked row until one is undone, the interaction Figma's own "selectedall 6" frame
 * demonstrates without this page needing to guess at it. The five chosen answers then each get
 * their own confidence-rating question (`RATING`, an ordinary `AnswerOption` radio group,
 * reusing the same shared code Lifestyle's yes/no questions use) before a closing yes/no
 * question (`ASSIST_QUESTION`) ends the flow — Figma's own mock shows "Done" a step early, on
 * the last rating question, which this page treats as a copy/paste artifact from duplicating
 * that screen to build the closing question, not a real second ending: the relabeled button
 * (now "Finish", on request, matching `LifestyleQuestionsPage`'s own closing button — previously
 * "Done") only appears on the actual last screen here. "Back" on the very first screen exits to
 * `PrioritiesDetailsPage`
 * instead of decrementing below it; "Next" is disabled until the current screen has whatever it
 * needs (a non-empty answer, an exact five picks, a rating, a yes/no) — "Other" and every
 * instructions-only screen have nothing to require, so they're always enabled. Nothing here is
 * persisted beyond this component's own state, the same as `LifestyleQuestionsPage`, and on the
 * closing question it hands off to `ReportReadyPage` (`/report/ready`) with
 * `state: { completedActivityId: 'visual-attention' }` rather than marking Priorities complete
 * itself, for the same reason that page's own doc comment gives.
 */
export function PrioritiesQuestionsPage() {
  const navigate = useNavigate()
  const [screenIndex, setScreenIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(ALL_TOPIC_IDS.map((id) => [id, ['']])),
  )
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [ratings, setRatings] = useState<Record<string, string>>({})
  const [assistAnswer, setAssistAnswer] = useState<string | null>(null)

  // `screenIndex` is always kept in `[0, SCREENS.length)` by `handleBack`/`handleNext` below, so
  // this index is never out of bounds — the non-null assertion just satisfies
  // noUncheckedIndexedAccess.
  const screen = SCREENS[screenIndex]!
  const stepNumber = stepNumberFor(screen)
  const stepLabel = stepLabelFor(screen)
  const isFinalScreen = screenIndex === SCREENS.length - 1

  const allEntries = useMemo(() => {
    const entries: { key: string; text: string }[] = []
    for (const id of ALL_TOPIC_IDS) {
      // `answers` is seeded from `ALL_TOPIC_IDS` on init and never loses a key, so every id from
      // that same list always has an entry — the assertion just satisfies noUncheckedIndexedAccess.
      answers[id]!.forEach((text, index) => {
        const trimmed = text.trim()
        if (trimmed) entries.push({ key: `${id}-${index}`, text: trimmed })
      })
    }
    return entries
  }, [answers])

  const selectedEntries = selectedKeys
    .map((key) => allEntries.find((entry) => entry.key === key))
    .filter((entry): entry is { key: string; text: string } => Boolean(entry))

  // Both functions below are only ever called with a `topicId` from `ALL_TOPIC_IDS` (see
  // `renderAnswerFields`'s own callers), which `answers` is seeded from and never drops a key
  // for — the non-null assertions just satisfy noUncheckedIndexedAccess.
  function updateAnswer(topicId: string, index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev[topicId]!]
      next[index] = value
      return { ...prev, [topicId]: next }
    })
  }

  function addAnotherAnswer(topicId: string) {
    setAnswers((prev) => ({ ...prev, [topicId]: [...prev[topicId]!, ''] }))
  }

  function toggleRankingEntry(key: string) {
    setSelectedKeys((prev) => {
      if (prev.includes(key)) return prev.filter((existing) => existing !== key)
      if (prev.length >= TOP_FIVE.maxSelections) return prev
      return [...prev, key]
    })
  }

  function isAnswered(): boolean {
    switch (screen.kind) {
      case 'topic-instructions':
      case 'other-answer':
      case 'topfive-instructions':
      case 'rating-instructions':
        return true
      case 'topic-answer':
        // Same in-range/always-seeded guarantees as `stepLabelFor` and `allEntries` above.
        return answers[NAMED_TOPICS[screen.topicIndex]!.id]!.some((value) => value.trim())
      case 'topfive-select':
        return selectedKeys.length === TOP_FIVE.maxSelections
      case 'rating-question':
        return Boolean(ratings[selectedEntries[screen.priorityIndex]?.key ?? ''])
      case 'assist-question':
        return assistAnswer !== null
    }
  }

  function handleBack() {
    if (screenIndex === 0) {
      navigate('/assessment/priorities')
      return
    }
    setScreenIndex((index) => index - 1)
  }

  function handleNext() {
    if (isFinalScreen) {
      navigate('/report/ready', { state: { completedActivityId: 'visual-attention' } })
      return
    }
    setScreenIndex((index) => index + 1)
  }

  function renderAnswerFields(topicId: string, leadIn: string, optional: boolean) {
    // Same always-seeded guarantee as `updateAnswer`/`addAnotherAnswer` above.
    const values = answers[topicId]!
    return (
      <>
        <h1 className={flowStyles.question}>{leadIn}</h1>
        <div className={styles.answerFields}>
          {values.map((value, index) => (
            <Field
              key={index}
              label={`Answer ${index + 1}${optional ? ' (Optional)' : ''}:`}
              placeholder="Tap here to enter text"
              value={value}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateAnswer(topicId, index, event.target.value)
              }
            />
          ))}
        </div>
        <Button variant="outline" size="md" onClick={() => addAnotherAnswer(topicId)}>
          <PlusCircleIcon className={styles.addAnotherIcon} />
          Add another
        </Button>
      </>
    )
  }

  function renderScreenContent() {
    switch (screen.kind) {
      case 'topic-instructions': {
        // Same in-range guarantee as `stepLabelFor` above.
        const topic = NAMED_TOPICS[screen.topicIndex]!
        return (
          <>
            <h1 className={flowStyles.question}>{topic.title}</h1>
            {topic.instructions.map((paragraph) => (
              <p key={paragraph} className={flowStyles.paragraph}>
                {paragraph}
              </p>
            ))}
            <p className={styles.exampleBox}>An example could be &ldquo;{topic.example}&rdquo;</p>
            <p className={flowStyles.paragraph}>
              Please write in your own words at least one thing.
            </p>
          </>
        )
      }
      case 'topic-answer': {
        // Same in-range guarantee as `stepLabelFor` above.
        const topic = NAMED_TOPICS[screen.topicIndex]!
        return renderAnswerFields(topic.id, topic.answerLeadIn, false)
      }
      case 'other-answer':
        return renderAnswerFields(OTHER_TOPIC.id, OTHER_TOPIC.answerLeadIn, true)
      case 'topfive-instructions':
        return (
          <>
            <h1 className={flowStyles.question}>{TOP_FIVE.instructionsTitle}</h1>
            <p className={flowStyles.paragraph}>{TOP_FIVE.instructionsBody}</p>
          </>
        )
      case 'topfive-select':
        return (
          <>
            <h1 className={flowStyles.question}>{TOP_FIVE.selectTitle}</h1>
            <p className={flowStyles.paragraph}>{TOP_FIVE.selectSubtitle}</p>
            <div className={styles.rankingList} role="group" aria-label={TOP_FIVE.selectTitle}>
              {allEntries.map((entry) => {
                const isSelected = selectedKeys.includes(entry.key)
                const isDisabled = !isSelected && selectedKeys.length >= TOP_FIVE.maxSelections
                return (
                  <button
                    key={entry.key}
                    type="button"
                    className={[
                      styles.rankingRow,
                      isSelected && styles.rankingRowSelected,
                      isDisabled && styles.rankingRowDisabled,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={isDisabled}
                    aria-pressed={isSelected}
                    onClick={() => toggleRankingEntry(entry.key)}
                  >
                    {isSelected ? (
                      <StarFillIcon className={styles.rankingIcon} />
                    ) : (
                      <StarIcon className={styles.rankingIcon} />
                    )}
                    {entry.text}
                  </button>
                )
              })}
            </div>
          </>
        )
      case 'rating-instructions':
        return (
          <>
            <h1 className={flowStyles.question}>{RATING.instructionsTitle}</h1>
            <p className={flowStyles.paragraph}>{RATING.instructionsBody}</p>
            <p className={styles.exampleBox}>{RATING.instructionsExample}</p>
          </>
        )
      case 'rating-question': {
        const entry = selectedEntries[screen.priorityIndex]
        if (!entry) return null
        return (
          <fieldset className={flowStyles.fieldset}>
            <legend className={flowStyles.question}>
              <span className={styles.ratingLead}>{RATING.questionLead}</span>
              {entry.text}
            </legend>
            <div className={flowStyles.options}>
              {RATING.options.map((option) => (
                <AnswerOption
                  key={option}
                  type="radio"
                  name={`rating-${entry.key}`}
                  value={option}
                  label={option}
                  checked={ratings[entry.key] === option}
                  onChange={() => setRatings((prev) => ({ ...prev, [entry.key]: option }))}
                />
              ))}
            </div>
          </fieldset>
        )
      }
      case 'assist-question':
        return (
          <fieldset className={flowStyles.fieldset}>
            <legend className={flowStyles.question}>{ASSIST_QUESTION.text}</legend>
            <div className={flowStyles.options}>
              {ASSIST_QUESTION.options.map((option) => (
                <AnswerOption
                  key={option}
                  type="radio"
                  name="assist"
                  value={option}
                  label={option}
                  checked={assistAnswer === option}
                  onChange={() => setAssistAnswer(option)}
                />
              ))}
            </div>
          </fieldset>
        )
    }
  }

  return (
    <div className={flowStyles.page}>
      <DashboardNavBar title="Priorities" exitTo="/dashboard" exitVariant="outline" />
      <main className={flowStyles.content}>
        <div className={flowStyles.card}>
          <div className={flowStyles.progressSection}>
            <p className={flowStyles.progressLabel}>
              {stepLabel} ({stepNumber} of {TOTAL_STEPS})
            </p>
            <ProgressStepper
              value={stepNumber}
              max={TOTAL_STEPS}
              label={`${stepLabel}, step ${stepNumber} of ${TOTAL_STEPS}`}
            />
          </div>
          {renderScreenContent()}
          <div className={flowStyles.actions}>
            <Button variant="outline" size="lg" onClick={handleBack}>
              <ArrowLeftBoldIcon className={flowStyles.backIcon} />
              Back
            </Button>
            <Button variant="primary" size="lg" disabled={!isAnswered()} onClick={handleNext}>
              {isFinalScreen ? 'Finish' : 'Next'}
              <ArrowRightBoldIcon className={flowStyles.nextIcon} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
