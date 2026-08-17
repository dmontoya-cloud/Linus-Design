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

function LoginProbe() {
  return <p>Login screen</p>
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
          <Route path="/login" element={<LoginProbe />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('VerifyEmailPage', () => {
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

  it('sends "Try a different email address" back to Login', async () => {
    const user = userEvent.setup()
    renderVerifyEmailPage('david@pi.tech')
    await user.click(screen.getByRole('button', { name: 'Try a different email address' }))
    expect(screen.getByText('Login screen')).toBeInTheDocument()
  })

  it('lets the prototype-only "Continue" link skip straight to /verify-account without waiting', async () => {
    const user = userEvent.setup()
    renderVerifyEmailPage('david@pi.tech')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Verifying account')).toBeInTheDocument()
  })

  it('shows "Send new link" only once the 15s countdown reaches zero, then hands off to /verify-account', () => {
    vi.useFakeTimers()
    renderVerifyEmailPage('david@pi.tech')

    expect(screen.getByText('You can request a new link in 15s')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Send new link' })).not.toBeInTheDocument()

    // Advance one second at a time so React commits the state update and re-schedules
    // the next tick between each — advancing the full 15000ms in one shot only fires
    // the first timer, since later ticks aren't queued until the effect re-runs.
    for (let i = 0; i < 15; i += 1) {
      act(() => {
        vi.advanceTimersByTime(1000)
      })
    }

    // The hint stays on screen — its text just changes, it doesn't disappear.
    expect(screen.queryByText(/You can request a new link/)).not.toBeInTheDocument()
    expect(screen.getByText("Didn't get it?")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send new link' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Send new link' }))
    expect(screen.getByText('Verifying account')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderVerifyEmailPage('david@pi.tech')
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
