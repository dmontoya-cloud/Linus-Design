import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostReportSurvey } from './PostReportSurvey'

/** Clicks the primary action button, whatever it's currently labeled (Next on questions 1-6,
 * Submit on the last one) — mirrors the same small helper this repo's other multi-step flows
 * use for their own walkthrough tests. */
async function clickPrimary(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /Next|Submit/ }))
}

describe('PostReportSurvey', () => {
  it('shows the first question with a 1-5 scale and no Back button yet, with no progress readout', () => {
    render(<PostReportSurvey onClose={vi.fn()} />)
    expect(
      screen.getByText('Overall, how satisfied were you with your assessment experience today?'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument()
    // No progress bar or "Question X of N" readout, on request — the card doesn't telegraph
    // how many questions are left.
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    expect(screen.queryByText(/Question \d of \d/)).not.toBeInTheDocument()
  })

  it('advances through every question in order via Next, and Back returns to the previous one', async () => {
    const user = userEvent.setup()
    render(<PostReportSurvey onClose={vi.fn()} />)

    await clickPrimary(user) // -> Q2 (0-10 recommend scale)
    expect(screen.getByText('Not likely at all')).toBeInTheDocument()
    expect(screen.getByText('Extremely likely')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(
      screen.getByText('Overall, how satisfied were you with your assessment experience today?'),
    ).toBeInTheDocument()

    await clickPrimary(user) // -> Q2
    await clickPrimary(user) // -> Q3 (clarity scale)
    expect(screen.getByText('How clear was the explanation of your results?')).toBeInTheDocument()

    await clickPrimary(user) // -> Q4 (choice)
    expect(
      screen.getByText("Based on today's results, what do you plan to do next?"),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Talk to my doctor' }))

    await clickPrimary(user) // -> Q5 (text)
    await user.type(screen.getByPlaceholderText('Type your answer here…'), 'Nothing in particular')

    await clickPrimary(user) // -> Q6 (checkbox)
    await user.click(screen.getByRole('checkbox', { name: "Yes, I'm interested." }))

    await clickPrimary(user) // -> Q7 (email)
    expect(
      screen.getByText("Please share your email address if you'd like us to follow up."),
    ).toBeInTheDocument()
    await user.type(screen.getByLabelText('Email address'), 'ada@example.com')

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('shows a thank-you message on Submit and calls onClose after the auto-close delay', () => {
    // `fireEvent` (not `userEvent`) alongside fake timers, matching this repo's own established
    // pattern for timer-driven components (see `VerifyEmailPage.test.tsx`) — `userEvent`'s own
    // internal delays don't mix cleanly with `vi.useFakeTimers()`.
    vi.useFakeTimers()
    const onClose = vi.fn()
    render(<PostReportSurvey onClose={onClose} />)

    for (let i = 0; i < 7; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Next|Submit/ }))
    }

    expect(screen.getByText('Thanks for your feedback!')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()

    vi.advanceTimersByTime(2500)
    expect(onClose).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })

  it('calls onClose immediately when the close (×) button is clicked, without submitting', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<PostReportSurvey onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Close feedback survey' }))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Thanks for your feedback!')).not.toBeInTheDocument()
  })
})
