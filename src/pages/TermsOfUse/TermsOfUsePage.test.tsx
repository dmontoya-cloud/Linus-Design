import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { LanguageProvider } from '@/language'
import { TermsOfUsePage } from './TermsOfUsePage'

function LegalIntroProbe() {
  return <p>Legal intro screen</p>
}

function PrivacyProbe() {
  return <p>Privacy screen</p>
}

function renderTermsOfUsePage() {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={['/terms']}>
        <Routes>
          <Route path="/terms" element={<TermsOfUsePage />} />
          <Route path="/legal-intro" element={<LegalIntroProbe />} />
          <Route path="/privacy" element={<PrivacyProbe />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('TermsOfUsePage', () => {
  it('renders the summary sections and a disabled Continue button', () => {
    renderTermsOfUsePage()
    expect(screen.getByRole('heading', { name: 'Terms of Use' })).toBeInTheDocument()
    expect(screen.getByText('What Thrive does')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeDisabled()
  })

  it('opens and closes the full legal text modal', async () => {
    const user = userEvent.setup()
    renderTermsOfUsePage()
    expect(screen.queryByRole('heading', { name: 'Full Terms of Use' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Read full terms of use' }))
    expect(screen.getByRole('heading', { name: 'Full Terms of Use' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
  })

  it('enables Continue only once the agree checkbox is checked, then hands off to /privacy', async () => {
    const user = userEvent.setup()
    renderTermsOfUsePage()
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: 'Agree and continue' }))
    expect(screen.getByText('Privacy screen')).toBeInTheDocument()
  })

  it('sends Back to /legal-intro', async () => {
    const user = userEvent.setup()
    renderTermsOfUsePage()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('Legal intro screen')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderTermsOfUsePage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
