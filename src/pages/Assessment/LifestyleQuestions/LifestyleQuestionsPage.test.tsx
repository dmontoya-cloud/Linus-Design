import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { LifestyleQuestionsPage } from './LifestyleQuestionsPage'
import { LIFESTYLE_QUESTIONS } from './lifestyleQuestions'

/** Stands in for `ReportReadyPage` at `/report/ready` — asserts on the router `state` the real
 * page reads its `completedActivityId` from, without pulling that whole page's Lottie/next-
 * activity machinery into this test. */
function ReportReadyStub() {
  const location = useLocation()
  const state = location.state as { completedActivityId?: string } | null
  return <p>Report ready stub: {state?.completedActivityId ?? 'none'}</p>
}

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/assessment/lifestyle/questions']}>
        <Routes>
          <Route path="/assessment/lifestyle/questions" element={<LifestyleQuestionsPage />} />
          <Route path="/assessment/lifestyle" element={<p>Lifestyle Details stub</p>} />
          <Route path="/report/ready" element={<ReportReadyStub />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('LifestyleQuestionsPage', () => {
  it('shows the first question with Next disabled until an option is picked', () => {
    renderPage()
    expect(screen.getByText('Question 1 of 15')).toBeInTheDocument()
    expect(
      screen.getByText('I am concerned about changes in my memory or thinking abilities.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next/ })).toBeDisabled()
  })

  it('enables Next once an option is selected, and advances to the next question', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('radio', { name: 'Yes' }))
    expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: /Next/ }))
    expect(screen.getByText('Question 2 of 15')).toBeInTheDocument()
    expect(
      screen.getByText('Please select the foods and drinks you have everyday or on most days.'),
    ).toBeInTheDocument()
  })

  it('allows multiple checkboxes to be selected on a multi-select question', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('radio', { name: 'Yes' }))
    await user.click(screen.getByRole('button', { name: /Next/ }))

    await user.click(screen.getByRole('checkbox', { name: 'Fruit' }))
    await user.click(screen.getByRole('checkbox', { name: 'Vegetables' }))
    expect(screen.getByRole('checkbox', { name: 'Fruit' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Vegetables' })).toBeChecked()
  })

  it('selecting "None of the above" clears every other selection on that question', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('radio', { name: 'Yes' }))
    await user.click(screen.getByRole('button', { name: /Next/ }))

    await user.click(screen.getByRole('checkbox', { name: 'Fruit' }))
    await user.click(screen.getByRole('checkbox', { name: 'Vegetables' }))
    await user.click(screen.getByRole('checkbox', { name: 'None of the above' }))

    expect(screen.getByRole('checkbox', { name: 'None of the above' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Fruit' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Vegetables' })).not.toBeChecked()
  })

  it('selecting a regular option clears a previously-selected "None of the above"', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('radio', { name: 'Yes' }))
    await user.click(screen.getByRole('button', { name: /Next/ }))

    await user.click(screen.getByRole('checkbox', { name: 'None of the above' }))
    await user.click(screen.getByRole('checkbox', { name: 'Fruit' }))

    expect(screen.getByRole('checkbox', { name: 'Fruit' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'None of the above' })).not.toBeChecked()
  })

  it('Back on the first question exits to the Lifestyle details screen', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /Back/ }))
    expect(screen.getByText('Lifestyle Details stub')).toBeInTheDocument()
  })

  it('Back after advancing returns to the previous question with its answer preserved', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('radio', { name: 'No' }))
    await user.click(screen.getByRole('button', { name: /Next/ }))
    expect(screen.getByText('Question 2 of 15')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Back/ }))
    expect(screen.getByText('Question 1 of 15')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'No' })).toBeChecked()
  })

  it('hands off to Building your report, marking Lifestyle as the just-completed activity, after the last question', async () => {
    const user = userEvent.setup()
    renderPage()

    for (const question of LIFESTYLE_QUESTIONS) {
      const firstOption = question.options[0]
      const role = question.type === 'single' ? 'radio' : 'checkbox'
      await user.click(screen.getByRole(role, { name: firstOption }))
      await user.click(screen.getByRole('button', { name: /Next|Finish/ }))
    }

    expect(screen.getByText('Report ready stub: speech-pattern')).toBeInTheDocument()
  })

  it('relabels the last question\'s button to "Finish" instead of "Next"', async () => {
    const user = userEvent.setup()
    renderPage()

    for (const question of LIFESTYLE_QUESTIONS.slice(0, -1)) {
      const firstOption = question.options[0]
      const role = question.type === 'single' ? 'radio' : 'checkbox'
      await user.click(screen.getByRole(role, { name: firstOption }))
      await user.click(screen.getByRole('button', { name: /Next/ }))
    }

    expect(screen.getByText(`Question ${LIFESTYLE_QUESTIONS.length} of 15`)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
