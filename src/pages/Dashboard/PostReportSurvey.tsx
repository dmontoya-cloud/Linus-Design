import { useId, useRef, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Field } from '@/components/atoms/Field'
import styles from './PostReportSurvey.module.css'

type ScaleQuestion = {
  id: string
  kind: 'scale'
  prompt: string
  min: number
  max: number
  lowLabel?: string
  highLabel?: string
}
type ChoiceQuestion = { id: string; kind: 'choice'; prompt: string; options: string[] }
type TextQuestion = { id: string; kind: 'text'; prompt: string }
type CheckboxQuestion = { id: string; kind: 'checkbox'; prompt: string; checkboxLabel: string }
type EmailQuestion = { id: string; kind: 'email'; prompt: string }
type Question = ScaleQuestion | ChoiceQuestion | TextQuestion | CheckboxQuestion | EmailQuestion

/** Every question this feedback survey asks, on request — reproduced from the reference
 * question set given for this survey. All seven are optional (the app has no real backend to
 * enforce a required answer against anyway), so "Next"/"Submit" are never disabled on an
 * unanswered question — skipping one just leaves it out of `answers`. */
const QUESTIONS: Question[] = [
  {
    id: 'satisfaction',
    kind: 'scale',
    prompt: 'Overall, how satisfied were you with your assessment experience today?',
    min: 1,
    max: 5,
  },
  {
    id: 'recommend',
    kind: 'scale',
    prompt:
      'How likely are you to recommend this brain health assessment to a friend or family member?',
    min: 0,
    max: 10,
    lowLabel: 'Not likely at all',
    highLabel: 'Extremely likely',
  },
  {
    id: 'clarity',
    kind: 'scale',
    prompt: 'How clear was the explanation of your results?',
    min: 1,
    max: 5,
    lowLabel: 'Very confusing',
    highLabel: 'Very clear',
  },
  {
    id: 'nextStep',
    kind: 'choice',
    prompt: "Based on today's results, what do you plan to do next?",
    options: [
      'Talk to my doctor',
      'Schedule a follow-up appointment',
      'Look for more information online',
      'Share results with a family member',
      'Nothing for now',
      'Other',
    ],
  },
  {
    id: 'moreHelp',
    kind: 'text',
    prompt:
      "Is there anything about the assessment or your results you'd want more help understanding?",
  },
  {
    id: 'productTeam',
    kind: 'checkbox',
    prompt:
      'Would you be interested in a short conversation with our product team about your experience using this tool?',
    checkboxLabel: "Yes, I'm interested.",
  },
  {
    id: 'email',
    kind: 'email',
    prompt: "Please share your email address if you'd like us to follow up.",
  },
]

/** How long the "Thanks for your feedback!" confirmation shows before the survey closes
 * itself, on request-adjacent default (no real submission endpoint exists in this prototype,
 * so this just stands in for one, same guessed-timer pattern as the report-building flow). */
const THANKS_AUTO_CLOSE_MS = 2500

type AnswerValue = number | string | boolean

function CloseIcon() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  )
}

/** One question's own control — a scale renders as a row of number buttons (5-wide for the
 * two 1-5 questions, 11-wide for the 0-10 recommend question), a choice renders as a list of
 * `AnswerOption`-style rows the same size, a checkbox reuses the shared `Checkbox` atom, and
 * text/email reuse `Field` (email) or a plain `<textarea>` (no dedicated Textarea atom exists
 * yet in this system, so this one stays local rather than introducing one for a single use). */
function QuestionControl({
  question,
  value,
  onChange,
}: {
  question: Question
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}) {
  const textareaId = useId()
  switch (question.kind) {
    case 'scale': {
      const steps = Array.from(
        { length: question.max - question.min + 1 },
        (_, i) => question.min + i,
      )
      return (
        <div>
          <div className={styles.scaleRow}>
            {steps.map((step) => (
              <button
                key={step}
                type="button"
                className={[styles.scaleButton, value === step && styles.scaleButtonSelected]
                  .filter(Boolean)
                  .join(' ')}
                aria-pressed={value === step}
                onClick={() => onChange(step)}
              >
                {step}
              </button>
            ))}
          </div>
          {question.lowLabel && question.highLabel ? (
            <div className={styles.scaleLabels}>
              <span>{question.lowLabel}</span>
              <span>{question.highLabel}</span>
            </div>
          ) : null}
        </div>
      )
    }
    case 'choice':
      return (
        <ul className={styles.choiceList}>
          {question.options.map((option) => (
            <li key={option}>
              <label
                className={[styles.choiceOption, value === option && styles.choiceOptionSelected]
                  .filter(Boolean)
                  .join(' ')}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={() => onChange(option)}
                  className={styles.choiceInput}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      )
    case 'text':
      return (
        <textarea
          id={textareaId}
          className={styles.textarea}
          placeholder="Type your answer here…"
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
        />
      )
    case 'checkbox':
      return (
        <Checkbox
          label={question.checkboxLabel}
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
        />
      )
    case 'email':
      return (
        <Field
          label="Email address"
          type="email"
          size="sm"
          placeholder="name@example.com"
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
        />
      )
  }
}

/**
 * PostReportSurvey — a short feedback survey shown as a fixed card in the bottom-right corner
 * once a report has actually been downloaded (`ReportPage`'s Download button hands off to
 * Dashboard with `location.state.showSurvey`, on request), rather than every visit. One
 * question at a time (matching the reference question set's own one-per-screen presentation),
 * Back/Next between them, and "Submit" on the last one — no progress bar or "Question X of N"
 * readout, on request, so the card doesn't telegraph how many questions are left. All seven
 * questions are optional, so navigation is never blocked on an answer. The
 * close (×) button dismisses at any point without submitting anything — this prototype has no
 * real endpoint to send answers to regardless, so "Submit" just shows a brief thank-you state
 * that closes itself after `THANKS_AUTO_CLOSE_MS`. That thank-you state keeps the last
 * question's own body height (captured into `frozenBodyHeight` right before switching to it, on
 * request) rather than shrinking to hug one short line, and centers the message vertically
 * within that held-open height instead.
 */
export function PostReportSurvey({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [submitted, setSubmitted] = useState(false)
  const [frozenBodyHeight, setFrozenBodyHeight] = useState<number | null>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const question = QUESTIONS[step]!
  const isLastStep = step === QUESTIONS.length - 1

  function handleNext() {
    if (isLastStep) {
      setFrozenBodyHeight(bodyRef.current?.getBoundingClientRect().height ?? null)
      setSubmitted(true)
      window.setTimeout(onClose, THANKS_AUTO_CLOSE_MS)
      return
    }
    setStep((s) => s + 1)
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1))
  }

  return (
    <div className={styles.card} role="dialog" aria-label="Feedback survey">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Quick feedback</p>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close feedback survey"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      {submitted ? (
        <div className={styles.thanksWrap} style={{ minHeight: frozenBodyHeight ?? undefined }}>
          <p className={styles.thanks}>Thanks for your feedback!</p>
        </div>
      ) : (
        <div ref={bodyRef}>
          <p className={styles.prompt}>{question.prompt}</p>
          <div className={styles.controlWrap}>
            <QuestionControl
              question={question}
              value={answers[question.id]}
              onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
            />
          </div>
          <div className={styles.actions}>
            {step > 0 ? (
              <Button type="button" variant="tertiary" size="sm" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button type="button" size="sm" onClick={handleNext}>
              {isLastStep ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
