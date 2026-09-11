import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { AnswerOption } from '@/components/atoms/AnswerOption'
import { DashboardNavBar } from '../../DashboardNavBar'
import { LIFESTYLE_QUESTIONS } from './lifestyleQuestions'
import styles from '../QuestionFlowPage.module.css'

/** The literal text of every `multi` question's own "none of these" option — selecting it
 * clears every other selection on that question, and selecting anything else clears it back
 * out, the same mutual-exclusivity a real questionnaire needs even though Figma's static mock
 * only shows one answered state and can't demonstrate the interaction itself. */
const NONE_OF_THE_ABOVE = 'None of the above'

/**
 * Lifestyle Questions — the real, interactive 15-question flow Dashboard's "Start" now hands off
 * to directly, on request (there's no Lifestyle Details screen between them any more): Figma's
 * "Lifestyle" section (node 575:5665, LHQ Segment Screens 16-30) rebuilt with this app's own
 * design-system tokens/components rather than pixel-cloned, per that request. Two question
 * shapes, both driven by the same `LIFESTYLE_QUESTIONS` data (`./lifestyleQuestions`): `single`
 * renders centered, glyph-less `AnswerOption`s (Figma's Yes/No treatment — "medication" reuses
 * it for a third, non-yes/no option) as a real radio group; `multi` renders left-aligned
 * checkbox `AnswerOption`s letting more than one be picked. One question is shown at a time,
 * swapped in place (not a route per question — 15 routes for one linear flow would be its own
 * kind of over-engineering); "Back" on the very first question exits to `/dashboard` instead of
 * decrementing below it.
 * "Next" is disabled until the current question has at least one answer, and relabels to
 * "Finish" on the last question, on request, matching `PrioritiesQuestionsPage`'s own closing
 * button. Answering it there hands off to `ReportReadyPage` (`/report/ready`) with
 * `state: { completedActivityId: 'speech-pattern' }`, on request — there's no real scoring for
 * this activity yet, so that page's own "Go to Dashboard"/"Generate report" is what actually
 * marks Lifestyle complete (see its `completedActivityId`), same deferred-until-you-leave
 * pattern Memory & Thinking's "Skip to report" shortcut already uses; this page itself never
 * touches `AuthProvider`. Answers live only in this component's own state, on request — nothing is
 * persisted to `AuthProvider` or anywhere else, so navigating away and back starts over, the
 * same as this prototype's other unsaved forms before their own final "submit" step. Keeps
 * `DashboardNavBar`'s chrome (logo, Exit link)
 * outside the question itself — the same `exitVariant="outline"` pattern the rest of the
 * assessment-task flow uses — but everything belonging to the question proper (the
 * "Question N of 15" label, the question text, its options, and the Back/Next buttons) lives
 * inside one `.card` white box, on request, for every question this page renders — not just the
 * label and options, with Back/Next left to float in the page's own background below it. The
 * `<legend>` stays the `<fieldset>`'s first child (browsers only associate a legend correctly
 * when it's the very first child) — the progress label reads as sitting above the question
 * visually, but structurally it's a sibling section before the fieldset, not inside it, so the
 * fieldset's own accessible name is still just the question text, not the progress label too.
 * The visual progress bar itself (`ProgressStepper`) is gone on request — this page keeps just
 * the text label; `PrioritiesQuestionsPage` keeps its own bar, on request, so the two flows are
 * no longer identical here.
 */
export function LifestyleQuestionsPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})

  const total = LIFESTYLE_QUESTIONS.length
  // `currentIndex` is always kept in `[0, total)` by `handleBack`/`handleNext` below, so this
  // index is never out of bounds — the non-null assertion just satisfies noUncheckedIndexedAccess.
  const question = LIFESTYLE_QUESTIONS[currentIndex]!
  const selected = answers[question.id] ?? []
  const isAnswered = selected.length > 0

  function selectSingle(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: [value] }))
  }

  function toggleMultiOption(value: string) {
    setAnswers((prev) => {
      const current = prev[question.id] ?? []
      let next: string[]
      if (value === NONE_OF_THE_ABOVE) {
        next = current.includes(value) ? [] : [NONE_OF_THE_ABOVE]
      } else if (current.includes(value)) {
        next = current.filter((v) => v !== value)
      } else {
        next = [...current.filter((v) => v !== NONE_OF_THE_ABOVE), value]
      }
      return { ...prev, [question.id]: next }
    })
  }

  function handleBack() {
    if (currentIndex === 0) {
      navigate('/dashboard')
      return
    }
    setCurrentIndex((index) => index - 1)
  }

  function handleNext() {
    if (currentIndex === total - 1) {
      navigate('/report/ready', { state: { completedActivityId: 'speech-pattern' } })
      return
    }
    setCurrentIndex((index) => index + 1)
  }

  return (
    <div className={styles.page}>
      <DashboardNavBar
        title="Lifestyle & Health"
        exitTo="/dashboard"
        exitVariant="outline"
        confirmExit
      />
      <main className={styles.content}>
        <div className={styles.card}>
          <div className={styles.progressSection}>
            <p className={styles.progressLabel}>
              Question {currentIndex + 1} of {total}
            </p>
          </div>
          <fieldset className={styles.fieldset}>
            <legend className={styles.question}>{question.text}</legend>
            <div className={styles.options}>
              {question.options.map((option) =>
                question.type === 'single' ? (
                  <AnswerOption
                    key={option}
                    type="radio"
                    name={question.id}
                    value={option}
                    label={option}
                    checked={selected.includes(option)}
                    onChange={() => selectSingle(option)}
                  />
                ) : (
                  <AnswerOption
                    key={option}
                    type="checkbox"
                    name={`${question.id}-${option}`}
                    value={option}
                    label={option}
                    checked={selected.includes(option)}
                    onChange={() => toggleMultiOption(option)}
                  />
                ),
              )}
            </div>
          </fieldset>
          <div className={styles.actions}>
            <Button variant="outline" size="lg" onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" size="lg" disabled={!isAnswered} onClick={handleNext}>
              {currentIndex === total - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
