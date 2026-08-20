import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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
  it('renders the summary sections, the full text as plain content, the optional and required checkboxes (both enabled from the start), and an always-enabled Continue', () => {
    renderPrivacyPolicyPage()
    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByText('What we collect')).toBeInTheDocument()
    expect(screen.getByText(/1\. Information we collect\./)).toBeInTheDocument()

    const marketingCheckbox = screen.getByRole('checkbox', {
      name: /I agree to receive marketing communications from Linus Health/,
    })
    const agreeCheckbox = screen.getByRole('checkbox', {
      name: /I have read and agree to the Privacy Policy/,
    })
    expect(marketingCheckbox).not.toBeChecked()
    expect(agreeCheckbox).not.toBeChecked()
    // Neither checkbox is scroll-gated — both enabled from the start.
    expect(marketingCheckbox).toBeEnabled()
    expect(agreeCheckbox).toBeEnabled()
    // Continue stays enabled at all times — clicking it with the agreement box unchecked
    // reveals an error instead.
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeEnabled()
  })

  it('shows an error below the agreement checkbox when Continue is clicked unchecked, without turning the checkbox itself invalid', async () => {
    const user = userEvent.setup()
    renderPrivacyPolicyPage()
    const agreeCheckbox = screen.getByRole('checkbox', {
      name: /I have read and agree to the Privacy Policy/,
    })
    expect(
      screen.queryByText('Please confirm you agree to the Privacy Policy.'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Agree and continue' }))

    expect(agreeCheckbox).not.toHaveAttribute('aria-invalid')
    expect(agreeCheckbox).toHaveAttribute('aria-describedby', 'agree-checkbox-error')
    expect(screen.getByText('Please confirm you agree to the Privacy Policy.')).toBeInTheDocument()
    expect(screen.queryByText('Setting up screen')).not.toBeInTheDocument()
  })

  it('checking the agreement box clears the error, then Continue hands off to /setting-up, independently of the optional marketing checkbox', async () => {
    const user = userEvent.setup()
    renderPrivacyPolicyPage()
    await user.click(
      screen.getByRole('checkbox', { name: /I agree to receive marketing communications/ }),
    )
    await user.click(screen.getByRole('button', { name: 'Agree and continue' }))
    expect(screen.getByText('Please confirm you agree to the Privacy Policy.')).toBeInTheDocument()

    await user.click(
      screen.getByRole('checkbox', { name: /I have read and agree to the Privacy Policy/ }),
    )
    expect(
      screen.queryByText('Please confirm you agree to the Privacy Policy.'),
    ).not.toBeInTheDocument()

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
