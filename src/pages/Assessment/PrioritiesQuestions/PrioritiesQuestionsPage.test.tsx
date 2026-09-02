import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { PrioritiesQuestionsPage } from './PrioritiesQuestionsPage'

/** Stands in for `BuildingReportPage` at `/report/building` — asserts on the router `state` the
 * real page reads its `completedActivityId` from, without pulling that whole page's Lottie/timer
 * machinery into this test. */
function BuildingReportStub() {
  const location = useLocation()
  const state = location.state as { completedActivityId?: string } | null
  return <p>Building report stub: {state?.completedActivityId ?? 'none'}</p>
}

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/assessment/priorities/questions']}>
        <Routes>
          <Route path="/assessment/priorities/questions" element={<PrioritiesQuestionsPage />} />
          <Route path="/assessment/priorities" element={<p>Priorities Details stub</p>} />
          <Route path="/report/building" element={<BuildingReportStub />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

/** Answers the current "Daily tasks" (or any single-answer topic) screen with one line of text
 * and advances — a small helper since almost every test needs to get past at least this one
 * topic before reaching whatever it's actually testing. */
async function answerAndAdvance(user: ReturnType<typeof userEvent.setup>, text: string) {
  const input = screen.getByLabelText('Answer 1:')
  await user.type(input, text)
  await user.click(screen.getByRole('button', { name: /Next/ }))
}

describe('PrioritiesQuestionsPage', () => {
  it('shows the first topic instructions with Next enabled (nothing to answer yet)', () => {
    renderPage()
    expect(screen.getByText('Daily tasks (1 of 13)')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Daily tasks' })).toBeInTheDocument()
    expect(screen.getByText(/An example could be .My ability to drive my car\./)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled()
  })

  it('disables Next on a topic answer screen until text is entered', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /Next/ }))
    expect(
      screen.getByRole('heading', { name: 'What matters most to me about my daily tasks is:' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled()
    await user.type(screen.getByLabelText('Answer 1:'), 'Drive my car')
    expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled()
  })

  it('"Add another" appends a new answer field', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /Next/ }))
    await user.click(screen.getByRole('button', { name: /Add another/ }))
    expect(screen.getByLabelText('Answer 1:')).toBeInTheDocument()
    expect(screen.getByLabelText('Answer 2:')).toBeInTheDocument()
  })

  it('Back on the very first screen exits to the Priorities details screen', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /Back/ }))
    expect(screen.getByText('Priorities Details stub')).toBeInTheDocument()
  })

  it('"Other" is optional — Next stays enabled with no answer written', async () => {
    const user = userEvent.setup()
    renderPage()
    // Walk through the 5 named topics' instructions+answer pairs to reach Other.
    for (const text of ['A', 'B', 'C', 'D', 'E']) {
      await user.click(screen.getByRole('button', { name: /Next/ })) // instructions -> answer
      await answerAndAdvance(user, text) // answer -> next topic's instructions
    }
    expect(screen.getByText('Other (6 of 13)')).toBeInTheDocument()
    expect(screen.getByLabelText('Answer 1 (Optional):')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled()
  })

  it('walks the full flow: five answers, top-five ranking (capped at 5), five ratings, and the closing question', async () => {
    const user = userEvent.setup()
    renderPage()

    const topicAnswers = [
      'Drive my car',
      'Play golf',
      'Chat with friends',
      "Understand a movie's storyline",
      'Give advice to family',
    ]
    for (const text of topicAnswers) {
      await user.click(screen.getByRole('button', { name: /Next/ })) // instructions -> answer
      await answerAndAdvance(user, text) // answer -> next
    }
    // Now on Other's answer screen (6 of 13) — leave it blank, Next is enabled since optional.
    await user.click(screen.getByRole('button', { name: /Next/ }))

    // Top five: instructions, then the selection screen.
    expect(screen.getByText('Top five (7 of 13)')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Next/ }))
    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled()

    for (const text of topicAnswers) {
      await user.click(screen.getByRole('button', { name: text }))
    }
    expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled()
    // A 6th (unselected) option would be disabled here, but only 5 answers exist in this test.

    await user.click(screen.getByRole('button', { name: /Next/ })) // -> Rating instructions
    expect(screen.getByText('Rating (8 of 13)')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Next/ })) // -> first rating question

    for (let i = 0; i < topicAnswers.length; i++) {
      expect(screen.getByRole('button', { name: /Next|Finish/ })).toBeDisabled()
      await user.click(screen.getByRole('radio', { name: 'Completely' }))
      await user.click(screen.getByRole('button', { name: /Next|Finish/ }))
    }

    // Closing question (13 of 13), button now reads "Finish".
    expect(screen.getByText('Rating (13 of 13)')).toBeInTheDocument()
    expect(
      screen.getByText('Did someone assist you in completing these questions today?'),
    ).toBeInTheDocument()
    const finishButton = screen.getByRole('button', { name: /Finish/ })
    expect(finishButton).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: 'No' }))
    expect(finishButton).toBeEnabled()
    await user.click(finishButton)
    expect(screen.getByText('Building report stub: visual-attention')).toBeInTheDocument()
  })

  it('caps Top five at five selections, disabling the rest until one is deselected', async () => {
    const user = userEvent.setup()
    renderPage()

    const sixAnswers = ['One', 'Two', 'Three', 'Four', 'Five']
    for (const text of sixAnswers) {
      await user.click(screen.getByRole('button', { name: /Next/ }))
      await answerAndAdvance(user, text)
    }
    // Give "Other" two answers so there are 6 options to choose from on Top five.
    await user.click(screen.getByRole('button', { name: /Add another/ }))
    await user.type(screen.getByLabelText('Answer 1 (Optional):'), 'Six')
    await user.type(screen.getByLabelText('Answer 2 (Optional):'), 'Seven')
    await user.click(screen.getByRole('button', { name: /Next/ })) // Other -> Top five instructions
    await user.click(screen.getByRole('button', { name: /Next/ })) // -> Top five select

    for (const text of ['One', 'Two', 'Three', 'Four', 'Five']) {
      await user.click(screen.getByRole('button', { name: text }))
    }
    const sixthOption = screen.getByRole('button', { name: 'Six' })
    expect(sixthOption).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'One' })) // deselect
    expect(sixthOption).toBeEnabled()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
