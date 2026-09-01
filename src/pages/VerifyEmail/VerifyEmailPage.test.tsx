import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { VerifyEmailPage } from './VerifyEmailPage'

function VerifyAccountProbe() {
  return <p>Verifying account</p>
}

function renderVerifyEmailPage(email?: string) {
  return render(
    <AuthProvider>
      <MemoryRouter
        initialEntries={[{ pathname: '/verify-email', state: email ? { email } : undefined }]}
      >
        <Routes>
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/verify-account" element={<VerifyAccountProbe />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

function codeInputs(): [HTMLInputElement, HTMLInputElement, HTMLInputElement, HTMLInputElement] {
  return [
    screen.getByLabelText('Digit 1 of 4') as HTMLInputElement,
    screen.getByLabelText('Digit 2 of 4') as HTMLInputElement,
    screen.getByLabelText('Digit 3 of 4') as HTMLInputElement,
    screen.getByLabelText('Digit 4 of 4') as HTMLInputElement,
  ]
}

/** Advances vitest's fake clock one second at a time, `act`-wrapped per tick, rather than
 * one `vi.advanceTimersByTime(n * 1000)` call — the resend countdown reschedules its own
 * next `setTimeout` from inside a `useEffect` that only reruns once React commits the
 * previous tick's state update, so firing all `n` seconds' worth of timers inside a single
 * `act` call only ever runs the one timer that existed when it was called. */
function advanceSeconds(seconds: number) {
  for (let i = 0; i < seconds; i += 1) {
    act(() => {
      vi.advanceTimersByTime(1000)
    })
  }
}

describe('VerifyEmailPage', () => {
  // A no-op when a test never engaged fake timers (only the resend-countdown tests below
  // do), so this is safe to run unconditionally after every test in this file.
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the email passed via route state', () => {
    renderVerifyEmailPage('david@pi.tech')
    expect(screen.getByText('david@pi.tech')).toBeInTheDocument()
  })

  it('falls back to generic copy when no email is present in route state', () => {
    renderVerifyEmailPage()
    expect(screen.getByText('your email address')).toBeInTheDocument()
  })

  it('shows a countdown instead of the resend link at first', () => {
    renderVerifyEmailPage('david@pi.tech')
    expect(screen.getByText('Resend code in 0:30')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Send a new code' })).not.toBeInTheDocument()
  })

  it('counts the resend timer down by one every second, then reveals the link at zero', () => {
    vi.useFakeTimers()
    renderVerifyEmailPage('david@pi.tech')

    advanceSeconds(1)
    expect(screen.getByText('Resend code in 0:29')).toBeInTheDocument()

    advanceSeconds(29)
    expect(screen.getByRole('button', { name: 'Send a new code' })).toBeInTheDocument()
    expect(screen.queryByText(/Resend code in/)).not.toBeInTheDocument()
  })

  it('clears the code, refocuses the first box, and restarts the countdown when "Send a new code" is clicked', () => {
    vi.useFakeTimers()
    renderVerifyEmailPage('david@pi.tech')
    const [first, second, third, fourth] = codeInputs()

    fireEvent.change(first, { target: { value: '1' } })
    fireEvent.change(second, { target: { value: '2' } })
    fireEvent.change(third, { target: { value: '3' } })
    fireEvent.change(fourth, { target: { value: '4' } })
    expect(fourth).toHaveValue('4')

    advanceSeconds(30)

    fireEvent.click(screen.getByRole('button', { name: 'Send a new code' }))
    ;[first, second, third, fourth].forEach((input) => expect(input).toHaveValue(''))
    expect(first).toHaveFocus()
    expect(screen.getByText('Resend code in 0:30')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Send a new code' })).not.toBeInTheDocument()
  })

  it('renders 4 empty digit boxes and an enabled (but inert) Sign in button', () => {
    renderVerifyEmailPage('david@pi.tech')
    codeInputs().forEach((input) => expect(input).toHaveValue(''))
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled()
  })

  it('does not navigate when Sign in is clicked with an incomplete code', async () => {
    const user = userEvent.setup()
    renderVerifyEmailPage('david@pi.tech')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(screen.queryByText('Verifying account')).not.toBeInTheDocument()
  })

  it('auto-advances focus as each digit is typed', async () => {
    const user = userEvent.setup()
    renderVerifyEmailPage('david@pi.tech')
    const [first, second, third, fourth] = codeInputs()

    await user.click(first)
    await user.keyboard('1')
    expect(second).toHaveFocus()
    await user.keyboard('2')
    expect(third).toHaveFocus()
    await user.keyboard('3')
    expect(fourth).toHaveFocus()
    await user.keyboard('4')
    expect(fourth).toHaveValue('4')
  })

  it('moves focus to the previous box on backspace when the current box is empty', async () => {
    const user = userEvent.setup()
    renderVerifyEmailPage('david@pi.tech')
    const [first, second] = codeInputs()

    await user.click(first)
    await user.keyboard('1')
    expect(second).toHaveFocus()
    await user.keyboard('{Backspace}')
    expect(first).toHaveFocus()
  })

  it('ignores non-numeric characters', async () => {
    const user = userEvent.setup()
    renderVerifyEmailPage('david@pi.tech')
    const [first] = codeInputs()

    await user.click(first)
    await user.keyboard('a')
    expect(first).toHaveValue('')
  })

  it('only confirms once all 4 digits are filled, and any complete code succeeds', async () => {
    const user = userEvent.setup()
    renderVerifyEmailPage('david@pi.tech')
    const [first, second, third, fourth] = codeInputs()
    const confirmButton = screen.getByRole('button', { name: 'Sign in' })

    await user.click(first)
    await user.keyboard('123')
    await user.click(confirmButton)
    expect(screen.queryByText('Verifying account')).not.toBeInTheDocument()

    await user.click(fourth)
    await user.keyboard('7')
    await user.click(confirmButton)
    expect(screen.getByText('Verifying account')).toBeInTheDocument()
    // Sanity check the values actually typed, not just the count.
    expect([first, second, third, fourth].map((input) => input.value)).toEqual(['1', '2', '3', '7'])
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderVerifyEmailPage('david@pi.tech')
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
