import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { LanguageProvider } from '@/language'
import { LegalIntroPage } from './LegalIntroPage'

function TermsProbe() {
  return <p>Terms screen</p>
}

function renderLegalIntroPage() {
  return render(
    <AuthProvider>
      <LanguageProvider>
        <MemoryRouter initialEntries={['/legal-intro']}>
          <Routes>
            <Route path="/legal-intro" element={<LegalIntroPage />} />
            <Route path="/terms" element={<TermsProbe />} />
          </Routes>
        </MemoryRouter>
      </LanguageProvider>
    </AuthProvider>,
  )
}

describe('LegalIntroPage', () => {
  it('greets generically and prompts for a required name before any is entered', () => {
    renderLegalIntroPage()
    expect(screen.getByRole('heading', { name: "Hey, we're glad to have you" })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Before we get you set up. We need you to agree to our Terms of Use and Privacy Policy.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('How would you like to be called?')).toBeInTheDocument()
    expect(screen.getByLabelText('Preferred name')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
  })

  it('swaps the greeting to the typed name live, and back when cleared', async () => {
    const user = userEvent.setup()
    renderLegalIntroPage()
    const nameField = screen.getByLabelText('Preferred name')

    await user.type(nameField, 'Ada')
    expect(screen.getByRole('heading', { name: 'Hey, Ada' })).toBeInTheDocument()

    await user.clear(nameField)
    expect(screen.getByRole('heading', { name: "Hey, we're glad to have you" })).toBeInTheDocument()
  })

  it('keeps Continue disabled until a name is entered, then sends to /terms', async () => {
    const user = userEvent.setup()
    renderLegalIntroPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.queryByText('Terms screen')).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('Preferred name'), 'Ada')
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Terms screen')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderLegalIntroPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
