import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth } from '@/auth'
import { LanguageProvider } from '@/language'
import { ConsentPage } from './ConsentPage'

function SettingUpProbe() {
  const { consent } = useAuth()
  return <p>Consent given: {String(consent !== null)}</p>
}

function renderConsentPage() {
  return render(
    <LanguageProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={['/consent']}>
          <Routes>
            <Route path="/consent" element={<ConsentPage />} />
            <Route path="/setting-up" element={<SettingUpProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </LanguageProvider>,
  )
}

describe('ConsentPage', () => {
  it('renders the longer consent text, both checkboxes, and a disabled Continue button', () => {
    renderConsentPage()
    expect(screen.getByText(/How your results are used/)).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'I consent to Linus Health using my assessment results as described above',
      }),
    ).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: "I'm over the age of eighteen" })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('leaves Continue disabled until both checkboxes are checked', async () => {
    const user = userEvent.setup()
    renderConsentPage()
    const consentCheckbox = screen.getByRole('checkbox', {
      name: 'I consent to Linus Health using my assessment results as described above',
    })
    const ageCheckbox = screen.getByRole('checkbox', { name: "I'm over the age of eighteen" })

    await user.click(consentCheckbox)
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()

    await user.click(ageCheckbox)
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
  })

  it('records consent and navigates to /setting-up on the happy path', async () => {
    const user = userEvent.setup()
    renderConsentPage()
    await user.click(
      screen.getByRole('checkbox', {
        name: 'I consent to Linus Health using my assessment results as described above',
      }),
    )
    await user.click(screen.getByRole('checkbox', { name: "I'm over the age of eighteen" }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Consent given: true')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderConsentPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
