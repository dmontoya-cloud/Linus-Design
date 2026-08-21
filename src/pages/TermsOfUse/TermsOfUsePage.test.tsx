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
  it('renders the summary sections, the full text as plain content, and an always-enabled Continue button', () => {
    renderTermsOfUsePage()
    expect(screen.getByRole('heading', { name: 'Terms of Use' })).toBeInTheDocument()
    expect(screen.getByText('What Linus Health does')).toBeInTheDocument()
    expect(screen.getByText(/1\. Acceptance of these Terms\./)).toBeInTheDocument()
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    // The agree checkbox is enabled from the start — no scroll-to-read gate.
    expect(checkbox).toBeEnabled()
    // Continue stays enabled at all times — clicking it unchecked reveals an error instead.
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeEnabled()
  })

  it('shows an error below the checkbox when Continue is clicked unchecked, without turning the checkbox itself invalid', async () => {
    const user = userEvent.setup()
    renderTermsOfUsePage()
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toHaveAttribute('aria-invalid')
    expect(
      screen.queryByText('Please confirm you agree to the Terms of Use.'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Agree and continue' }))

    expect(checkbox).not.toHaveAttribute('aria-invalid')
    expect(checkbox).toHaveAttribute('aria-describedby', 'agree-checkbox-error')
    expect(screen.getByText('Please confirm you agree to the Terms of Use.')).toBeInTheDocument()
    expect(screen.queryByText('Privacy screen')).not.toBeInTheDocument()
  })

  it('checking the box clears the error, then Continue hands off to /privacy', async () => {
    const user = userEvent.setup()
    renderTermsOfUsePage()
    await user.click(screen.getByRole('button', { name: 'Agree and continue' }))
    expect(screen.getByText('Please confirm you agree to the Terms of Use.')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox'))
    expect(
      screen.queryByText('Please confirm you agree to the Terms of Use.'),
    ).not.toBeInTheDocument()

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
