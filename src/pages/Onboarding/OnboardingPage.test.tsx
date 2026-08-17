import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth } from '@/auth'
import { LanguageProvider } from '@/language'
import { OnboardingPage } from './OnboardingPage'

function DashboardProbe() {
  const { profile } = useAuth()
  return (
    <p>
      Profile name: {profile ? `${profile.firstName} ${profile.lastName}` : 'none'}
    </p>
  )
}

/** Test-only harness — sets AuthContext's `preferredName` and offers a link onward, standing
 * in for Legal Intro's "How should we call you?" field. Setting the name and mounting
 * OnboardingPage must happen in two separate steps (set here, then navigate), not both in the
 * same render pass — OnboardingPage's first-mount state needs `preferredName` already in
 * context by the time it mounts, exactly like the real Legal Intro → ... → Onboarding flow,
 * where Legal Intro has long since unmounted by the time Onboarding appears. */
function LegalIntroStub({ name }: { name: string }) {
  const { setPreferredName } = useAuth()
  useEffect(() => {
    setPreferredName(name)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run exactly once, like a real earlier step
  }, [])
  return <Link to="/onboarding">Continue to onboarding</Link>
}

function renderOnboardingPage({ preferredName }: { preferredName?: string } = {}) {
  const utils = render(
    <LanguageProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[preferredName ? '/legal-intro-stub' : '/onboarding']}>
          <Routes>
            <Route path="/legal-intro-stub" element={<LegalIntroStub name={preferredName ?? ''} />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard" element={<DashboardProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </LanguageProvider>,
  )
  return utils
}

async function fillHappyPath(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('First name'), 'Ada')
  await user.type(screen.getByLabelText('Last name'), 'Lovelace')
  await user.selectOptions(screen.getByLabelText('Month'), '01')
  await user.type(screen.getByLabelText('Day'), '1')
  await user.type(screen.getByLabelText('Year'), '1988')
}

describe('OnboardingPage', () => {
  it('renders exactly the three specified fields, with no required-asterisk since all are mandatory', () => {
    renderOnboardingPage()
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last name')).toBeInTheDocument()
    expect(screen.getByLabelText('Month')).toBeInTheDocument()
    expect(screen.getByLabelText('Day')).toBeInTheDocument()
    expect(screen.getByLabelText('Year')).toBeInTheDocument()
    expect(screen.queryByLabelText('Sex')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Age')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Education level')).not.toBeInTheDocument()
  })

  it('renders a smaller section title above each field group', () => {
    renderOnboardingPage()
    expect(screen.getByRole('heading', { name: "What's your name?" })).toBeInTheDocument()
    expect(screen.getByText('When were you born?')).toBeInTheDocument()
  })

  it('pre-fills First name from the preferred name given on Legal Intro, still editable', async () => {
    const user = userEvent.setup()
    renderOnboardingPage({ preferredName: 'Grace' })
    await user.click(screen.getByRole('link', { name: 'Continue to onboarding' }))
    const firstNameField = screen.getByLabelText('First name')
    expect(firstNameField).toHaveValue('Grace')

    await user.clear(firstNameField)
    await user.type(firstNameField, 'Ada')
    expect(firstNameField).toHaveValue('Ada')
  })

  it('saves the profile and navigates to /dashboard on the happy path', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await fillHappyPath(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Profile name: Ada Lovelace')).toBeInTheDocument()
  })

  it('does not navigate when required fields are left empty', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderOnboardingPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
