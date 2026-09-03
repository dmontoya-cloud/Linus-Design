import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from '@/auth'
import { MemoryThinkingTaskPage } from './MemoryThinkingTaskPage'
import { DELAYED_RECOGNITION_TRIALS } from './memoryThinkingTaskData'

/** Stands in for `ReportReadyPage` at `/report/ready` — asserts on the router `state` the real
 * page reads its `completedActivityId` from, the same stub pattern
 * `LifestyleQuestionsPage.test.tsx`/`PrioritiesQuestionsPage.test.tsx` use for their own
 * "Finish" hand-off. */
function ReportReadyStub() {
  const location = useLocation()
  const state = location.state as { completedActivityId?: string } | null
  return <p>Report ready stub: {state?.completedActivityId ?? 'none'}</p>
}

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/assessment']}>
        <Routes>
          <Route path="/assessment" element={<MemoryThinkingTaskPage />} />
          <Route path="/assessment/start" element={<p>Memory &amp; Thinking Details stub</p>} />
          <Route path="/report/ready" element={<ReportReadyStub />} />
          <Route path="/dashboard" element={<p>Dashboard stub</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

/** Clicks whatever the current screen's primary action button is labeled (Start/Continue/Done/
 * Next/Practice) — a small helper since walking the full flow means clicking a differently-
 * labeled button dozens of times in a row. */
async function clickPrimary(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /Start|Continue|Done|Next|Practice/ }))
}

describe('MemoryThinkingTaskPage', () => {
  it('shows Immediate Recall (1 of 5) first', () => {
    renderPage()
    expect(screen.getByText('Immediate Recall (1 of 5)')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Immediate Recall' })).toBeInTheDocument()
  })

  it('Back on the very first screen exits to Memory & Thinking Details', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /Back/ }))
    expect(screen.getByText('Memory & Thinking Details stub')).toBeInTheDocument()
  })

  it('Start advances from instructions to the Please listen step', async () => {
    const user = userEvent.setup()
    renderPage()
    await clickPrimary(user)
    expect(screen.getByRole('heading', { name: 'Please listen' })).toBeInTheDocument()
  })

  it('walks through every task and reaches the closing screen', async () => {
    const user = userEvent.setup()
    renderPage()

    // Immediate Recall x2 trials (instructions, listen, recall = 3 clicks each).
    for (let i = 0; i < 2 * 3; i++) await clickPrimary(user)
    expect(screen.getByText('Category Fluency (2 of 5)')).toBeInTheDocument()

    // Category Fluency: instructions, prompt, recording, done.
    for (let i = 0; i < 4; i++) await clickPrimary(user)
    expect(screen.getByText('Backward Digit Span (3 of 5)')).toBeInTheDocument()

    // Backward Digit Span: instructions, practice listen/repeat, practice result (Start),
    // then 3 trials x (listen, repeat, done).
    await clickPrimary(user) // instructions -> practice listen
    await clickPrimary(user) // practice listen -> practice repeat
    await clickPrimary(user) // practice repeat -> practice result
    await user.click(screen.getByRole('button', { name: 'Start' })) // practice result -> trial 1
    for (let i = 0; i < 3 * 3; i++) await clickPrimary(user)
    expect(screen.getByText('Delayed Recall (4 of 5)')).toBeInTheDocument()

    // Delayed Recall: instructions, recall, done.
    for (let i = 0; i < 3; i++) await clickPrimary(user)
    expect(screen.getByText('Delayed Recognition (5 of 5)')).toBeInTheDocument()

    // Delayed Recognition: instructions, then one radio pick + Next/Finish per trial.
    await clickPrimary(user)
    for (const trial of DELAYED_RECOGNITION_TRIALS) {
      const finishButton = screen.getByRole('button', { name: /Next|Finish/ })
      expect(finishButton).toBeDisabled()
      // `trial.options[0]` always exists — every trial is seeded with three fixed options.
      await user.click(screen.getByRole('radio', { name: trial.options[0] }))
      await user.click(finishButton)
    }

    expect(screen.getByText('Report ready stub: memory-recall')).toBeInTheDocument()
  })

  it('Backward Digit Span practice "Retry" goes back to the practice listen step', async () => {
    const user = userEvent.setup()
    renderPage()
    for (let i = 0; i < 2 * 3; i++) await clickPrimary(user) // Immediate Recall
    for (let i = 0; i < 4; i++) await clickPrimary(user) // Category Fluency
    await clickPrimary(user) // BDS instructions -> practice listen
    await clickPrimary(user) // practice listen -> practice repeat
    await clickPrimary(user) // practice repeat -> practice result

    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(screen.getByRole('heading', { name: 'Please listen' })).toBeInTheDocument()
  })
})
