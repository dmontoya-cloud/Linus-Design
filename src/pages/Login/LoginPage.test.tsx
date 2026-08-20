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
  it('renders the Thrive logo, the email sign-in form, and an always-enabled Log in button', () => {
    renderLoginPage()
    expect(screen.getByRole('img', { name: 'Thrive' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /I'm over the age of eighteen/ })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Log in to thrive' })).toBeEnabled()
  })

  it('shows an error state on the email field and the age checkbox card when clicked with the form empty', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    const emailField = screen.getByLabelText('Email address*')
    const ageCheckbox = screen.getByRole('checkbox', { name: /I'm over the age of eighteen/ })
    expect(emailField).not.toHaveAttribute('aria-invalid', 'true')
    // The checkbox itself never gets a red border/aria-invalid — the card around it does
    // instead (a light danger-soft background), per explicit direction not to redden the
    // checkbox control itself.
    expect(ageCheckbox).not.toHaveAttribute('aria-invalid')
    expect(
      screen.queryByText('Please confirm you are over the age of eighteen.'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Log in to thrive' }))

    expect(emailField).toHaveAttribute('aria-invalid', 'true')
    expect(ageCheckbox).not.toHaveAttribute('aria-invalid')
    expect(ageCheckbox).toHaveAttribute('aria-describedby', 'age-checkbox-error')
    expect(screen.getByText('Enter your email address to continue.')).toBeInTheDocument()
    expect(screen.getByText('Please confirm you are over the age of eighteen.')).toBeInTheDocument()
  })

  it('clears the email error once a valid value is typed, independently of the still-unchecked age checkbox', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    await user.click(screen.getByRole('button', { name: 'Log in to thrive' }))
    const emailField = screen.getByLabelText('Email address*')
    expect(emailField).toHaveAttribute('aria-invalid', 'true')

    await user.type(emailField, 'david@pi.tech')
    expect(emailField).not.toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Please confirm you are over the age of eighteen.')).toBeInTheDocument()
  })

  it('shows a different error message for a malformed email than for a missing one', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    const emailField = screen.getByLabelText('Email address*')

    await user.type(emailField, 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Log in to thrive' }))

    expect(emailField).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
    expect(screen.queryByText('Enter your email address to continue.')).not.toBeInTheDocument()
  })

  it('hands off to /verify-email with the entered email once both the email and age checkbox are filled in', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByLabelText('Email address*'), 'david@pi.tech')
    await user.click(screen.getByRole('checkbox', { name: /I'm over the age of eighteen/ }))

    await user.click(screen.getByRole('button', { name: 'Log in to thrive' }))
    // Loading alone doesn't disable the button — it stays enabled-looking with a spinner.
    expect(screen.getByRole('button', { name: 'Loading' })).toBeEnabled()
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
