import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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
      screen.getByText('Before we start, we need you to agree to a few things.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('How should we call you?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Let's go" })).toBeInTheDocument()
  })

  it('lists the three things being agreed to', () => {
    renderLegalIntroPage()
    // "listitem" doesn't support name-from-content in the ARIA spec, so <li> items have no
    // computed accessible name — assert on text content within the list instead.
    const list = screen.getByRole('list')
    expect(within(list).getByText('Terms of Use')).toBeInTheDocument()
    expect(within(list).getByText('Privacy Policy')).toBeInTheDocument()
    expect(within(list).getByText('Consent')).toBeInTheDocument()
    expect(list.children).toHaveLength(3)
  })

  it('swaps the greeting to the typed name live, and back when cleared', async () => {
    const user = userEvent.setup()
    renderLegalIntroPage()
    const nameField = screen.getByLabelText('How should we call you?')

    await user.type(nameField, 'Ada')
    expect(screen.getByRole('heading', { name: 'Hey, Ada' })).toBeInTheDocument()

    await user.clear(nameField)
    expect(screen.getByRole('heading', { name: "Hey, we're glad to have you" })).toBeInTheDocument()
  })

  it("sends Let's go to /terms whether or not a name was entered", async () => {
    const user = userEvent.setup()
    renderLegalIntroPage()
    await user.click(screen.getByRole('button', { name: "Let's go" }))
    expect(screen.getByText('Terms screen')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderLegalIntroPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
