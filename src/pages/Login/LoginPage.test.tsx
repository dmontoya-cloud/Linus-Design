import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { LoginPage } from './LoginPage'

function VerifyEmailProbe() {
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email
  return <p>Verify email for: {email}</p>
}

function renderLoginPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmailProbe />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('LoginPage', () => {
  it('renders the Thrive logo and the magic-link form', () => {
    renderLoginPage()
    expect(screen.getByRole('img', { name: 'Thrive' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send magic link' })).toBeInTheDocument()
  })

  it('shows a loading state, then hands off to /verify-email with the entered email on the magic-link path', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByLabelText('Email address*'), 'david@pi.tech')
    await user.click(screen.getByRole('button', { name: 'Send magic link' }))
    expect(screen.getByRole('button', { name: 'Loading' })).toBeDisabled()
    await waitFor(
      () => expect(screen.getByText('Verify email for: david@pi.tech')).toBeInTheDocument(),
      { timeout: 2000 },
    )
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderLoginPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
