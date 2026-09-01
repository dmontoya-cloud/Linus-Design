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
  it('greets with a fixed title and subtitle, and no name field', () => {
    renderLegalIntroPage()
    expect(screen.getByRole('heading', { name: "We're glad you're here" })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Before you get started, we’ll ask you to review a few important details about using Linus Health.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText('How would you like to be called?')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Preferred name/)).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
  })

  it('sends to /terms on Continue', async () => {
    const user = userEvent.setup()
    renderLegalIntroPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Terms screen')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderLegalIntroPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
