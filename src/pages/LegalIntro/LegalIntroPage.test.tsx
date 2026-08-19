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
  it('greets generically and prompts for a name before any is entered', () => {
    renderLegalIntroPage()
    expect(screen.getByRole('heading', { name: "Hey, we're glad to have you" })).toBeInTheDocument()
    expect(
      screen.getByText(
        "Before we go any further, let's confirm we can set you up in thrive. You must be over the age of eighteen.",
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText("Let's keep things casual. How would you like to be called?"),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Preferred name (optional)')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: "I'm over the age of eighteen" })).not.toBeChecked()
    expect(screen.getByRole('button', { name: "Let's go" })).toBeDisabled()
  })

  it('swaps the greeting to the typed name live, and back when cleared', async () => {
    const user = userEvent.setup()
    renderLegalIntroPage()
    const nameField = screen.getByLabelText('Preferred name (optional)')

    await user.type(nameField, 'Ada')
    expect(screen.getByRole('heading', { name: 'Hey, Ada' })).toBeInTheDocument()

    await user.clear(nameField)
    expect(screen.getByRole('heading', { name: "Hey, we're glad to have you" })).toBeInTheDocument()
  })

  it("keeps Let's go disabled until the age checkbox is checked, then sends to /terms whether or not a name was entered", async () => {
    const user = userEvent.setup()
    renderLegalIntroPage()
    await user.click(screen.getByRole('button', { name: "Let's go" }))
    expect(screen.queryByText('Terms screen')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: "I'm over the age of eighteen" }))
    expect(screen.getByRole('button', { name: "Let's go" })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: "Let's go" }))
    expect(screen.getByText('Terms screen')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderLegalIntroPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
