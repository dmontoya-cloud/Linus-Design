import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { LanguageProvider } from '@/language'
import { PrivacyPolicyPage } from './PrivacyPolicyPage'

function TermsProbe() {
  return <p>Terms screen</p>
}

function ConsentProbe() {
  return <p>Consent screen</p>
}

function renderPrivacyPolicyPage() {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={['/privacy']}>
        <Routes>
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsProbe />} />
          <Route path="/consent" element={<ConsentProbe />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('PrivacyPolicyPage', () => {
  it('renders the summary sections, the optional and required checkboxes, and a disabled Continue', () => {
    renderPrivacyPolicyPage()
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByText('What we collect')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /Send me free, actionable brain health tips/ }),
    ).not.toBeChecked()
    expect(
      screen.getByRole('checkbox', { name: /I have read and agree to the Privacy Policy/ }),
    ).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeDisabled()
  })

  it('opens the full legal text modal', async () => {
    const user = userEvent.setup()
    renderPrivacyPolicyPage()
    await user.click(screen.getByRole('button', { name: 'Read full privacy policy' }))
    expect(screen.getByRole('heading', { name: 'Full Privacy Policy' })).toBeInTheDocument()
  })

  it('leaves Continue disabled from the optional checkbox alone, enables only via the required one, then hands off to /consent', async () => {
    const user = userEvent.setup()
    renderPrivacyPolicyPage()
    await user.click(
      screen.getByRole('checkbox', { name: /Send me free, actionable brain health tips/ }),
    )
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeDisabled()

    await user.click(
      screen.getByRole('checkbox', { name: /I have read and agree to the Privacy Policy/ }),
    )
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Agree and continue' }))
    expect(screen.getByText('Consent screen')).toBeInTheDocument()
  })

  it('sends Back to /terms', async () => {
    const user = userEvent.setup()
    renderPrivacyPolicyPage()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('Terms screen')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPrivacyPolicyPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
