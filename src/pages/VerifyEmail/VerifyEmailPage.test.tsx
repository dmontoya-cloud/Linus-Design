import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('VerifyEmailPage', () => {
  it('shows the email passed via route state', () => {
    renderVerifyEmailPage('david@pi.tech')
    expect(screen.getByText('david@pi.tech')).toBeInTheDocument()
  })

  it('falls back to generic copy when no email is present in route state', () => {
    renderVerifyEmailPage()
    expect(screen.getByText('your email address')).toBeInTheDocument()
  })

  it('clears the code and refocuses the first box when "Resend verification code" is clicked', async () => {
    const user = userEvent.setup()
    renderVerifyEmailPage('david@pi.tech')
    const [first, second, third, fourth] = codeInputs()

    await user.click(first)
    await user.keyboard('1234')
    expect(fourth).toHaveValue('4')

    await user.click(screen.getByRole('button', { name: 'Resend verification code' }))
    ;[first, second, third, fourth].forEach((input) => expect(input).toHaveValue(''))
    expect(first).toHaveFocus()
  })

  it('renders 4 empty digit boxes and an enabled (but inert) Confirm code button', () => {
    renderVerifyEmailPage('david@pi.tech')
    codeInputs().forEach((input) => expect(input).toHaveValue(''))
    expect(screen.getByRole('button', { name: 'Confirm code' })).toBeEnabled()
  })

  it('does not navigate when Confirm code is clicked with an incomplete code', async () => {
    const user = userEvent.setup()
    renderVerifyEmailPage('david@pi.tech')
    await user.click(screen.getByRole('button', { name: 'Confirm code' }))
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
    const confirmButton = screen.getByRole('button', { name: 'Confirm code' })

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
