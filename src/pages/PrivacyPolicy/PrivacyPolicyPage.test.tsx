import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { LanguageProvider } from '@/language'
import { PrivacyPolicyPage } from './PrivacyPolicyPage'

function TermsProbe() {
  return <p>Terms screen</p>
}

function SettingUpProbe() {
  return <p>Setting up screen</p>
}

function renderPrivacyPolicyPage() {
  return render(
    <LanguageProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={['/privacy']}>
          <Routes>
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsProbe />} />
            <Route path="/setting-up" element={<SettingUpProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </LanguageProvider>,
  )
}

describe('PrivacyPolicyPage', () => {
  it('renders the summary sections, the scrollable full text, the optional and required checkboxes, and a disabled Continue', () => {
    renderPrivacyPolicyPage()
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByText('What we collect')).toBeInTheDocument()
    expect(screen.getByText(/1\. Information we collect\./)).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: /Send me free, actionable brain health tips/ }),
    ).not.toBeChecked()
    expect(
      screen.getByRole('checkbox', { name: /I have read and agree to the Privacy Policy/ }),
    ).not.toBeChecked()
    expect(
      screen.getByRole('checkbox', {
        name: /I consent to Linus Health using my assessment results/,
      }),
    ).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeDisabled()
  })

  it('keeps the Privacy Policy agreement checkbox disabled until scrolled to the end of the full text, then enables it', () => {
    // See TermsOfUsePage.test.tsx — jsdom reports scrollHeight/clientHeight as 0 for every
    // element, which would otherwise skip the disabled-until-scrolled behavior entirely.
    const scrollHeightSpy = vi
      .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
      .mockReturnValue(500)
    const clientHeightSpy = vi
      .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
      .mockReturnValue(100)

    try {
      renderPrivacyPolicyPage()
      const agreeCheckbox = screen.getByRole('checkbox', {
        name: /I have read and agree to the Privacy Policy/,
      })
      expect(agreeCheckbox).toBeDisabled()
      expect(screen.getByText('Scroll to the end above to enable.')).toBeInTheDocument()

      const scrollBox = screen.getByText(/1\. Information we collect\./).closest('div')
      expect(scrollBox).not.toBeNull()
      fireEvent.scroll(scrollBox as HTMLDivElement, { target: { scrollTop: 450 } })

      expect(agreeCheckbox).toBeEnabled()
      expect(screen.queryByText('Scroll to the end above to enable.')).not.toBeInTheDocument()
    } finally {
      scrollHeightSpy.mockRestore()
      clientHeightSpy.mockRestore()
    }
  })

  it('leaves Continue disabled from the optional checkbox alone, requires both the Privacy Policy agreement and the assessment-consent checkbox, then hands off to /setting-up', async () => {
    const user = userEvent.setup()
    renderPrivacyPolicyPage()
    await user.click(
      screen.getByRole('checkbox', { name: /Send me free, actionable brain health tips/ }),
    )
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeDisabled()

    await user.click(
      screen.getByRole('checkbox', { name: /I have read and agree to the Privacy Policy/ }),
    )
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeDisabled()

    await user.click(
      screen.getByRole('checkbox', {
        name: /I consent to Linus Health using my assessment results/,
      }),
    )
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Agree and continue' }))
    expect(screen.getByText('Setting up screen')).toBeInTheDocument()
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
