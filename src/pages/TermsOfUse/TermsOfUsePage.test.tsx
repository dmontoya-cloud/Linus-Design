import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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
  it('renders the summary sections, the scrollable full text, and a disabled Continue button', () => {
    renderTermsOfUsePage()
    expect(screen.getByRole('heading', { name: 'Terms of Use' })).toBeInTheDocument()
    expect(screen.getByText('What Thrive does')).toBeInTheDocument()
    expect(screen.getByText(/1\. Acceptance of these Terms\./)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Agree and continue' })).toBeDisabled()
  })

  it('keeps the agree checkbox disabled until scrolled to the end of the full text, then enables it', () => {
    // jsdom reports every element's scrollHeight/clientHeight as 0, which would otherwise make
    // the "already at the end" mount check fire immediately — mock real overflow dimensions so
    // the disabled-until-scrolled behavior is actually exercised, not skipped.
    const scrollHeightSpy = vi
      .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
      .mockReturnValue(500)
    const clientHeightSpy = vi
      .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
      .mockReturnValue(100)

    try {
      renderTermsOfUsePage()
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
      expect(screen.getByText('Scroll to the end above to enable.')).toBeInTheDocument()

      const scrollBox = screen.getByText(/1\. Acceptance of these Terms\./).closest('div')
      expect(scrollBox).not.toBeNull()
      fireEvent.scroll(scrollBox as HTMLDivElement, { target: { scrollTop: 450 } })

      expect(checkbox).toBeEnabled()
      expect(screen.queryByText('Scroll to the end above to enable.')).not.toBeInTheDocument()
    } finally {
      scrollHeightSpy.mockRestore()
      clientHeightSpy.mockRestore()
    }
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
