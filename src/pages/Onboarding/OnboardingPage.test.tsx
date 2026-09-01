import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth } from '@/auth'
import { LanguageProvider } from '@/language'
import { OnboardingPage } from './OnboardingPage'

interface RegistrationState {
  firstName: string
  lastName: string
  dateOfBirth: string
}

function EducationProbe() {
  const location = useLocation()
  const state = location.state as RegistrationState | null
  return (
    <p>
      Registration state:{' '}
      {state ? `${state.firstName} ${state.lastName} ${state.dateOfBirth}` : 'none'}
    </p>
  )
}

/** Test-only harness — sets AuthContext's `preferredName` and offers a link onward, standing
 * in for Legal Intro's "Preferred name" field. Setting the name and mounting
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
            <Route
              path="/legal-intro-stub"
              element={<LegalIntroStub name={preferredName ?? ''} />}
            />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/education" element={<EducationProbe />} />
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

  it('strips digits and symbols from First name and Last name as they are typed', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    const firstNameField = screen.getByLabelText('First name')
    const lastNameField = screen.getByLabelText('Last name')

    await user.type(firstNameField, 'Ada121!')
    expect(firstNameField).toHaveValue('Ada')

    await user.type(lastNameField, "O'Brien-Smith #2")
    expect(lastNameField).toHaveValue("O'Brien-Smith ")
  })

  it('hands off first name, last name, and date of birth to /education on the happy path', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await fillHappyPath(user)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Registration state: Ada Lovelace 1988-01-01')).toBeInTheDocument()
  })

  it('does not navigate when required fields are left empty', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
  })

  it('shows a respective error below every field when Continue is clicked with the whole form empty', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    const firstNameField = screen.getByLabelText('First name')
    const lastNameField = screen.getByLabelText('Last name')
    const monthSelect = screen.getByLabelText('Month')
    const dayField = screen.getByLabelText('Day')
    const yearField = screen.getByLabelText('Year')
    ;[firstNameField, lastNameField, monthSelect, dayField, yearField].forEach((field) =>
      expect(field).not.toHaveAttribute('aria-invalid', 'true'),
    )

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(firstNameField).toHaveAttribute('aria-invalid', 'true')
    expect(lastNameField).toHaveAttribute('aria-invalid', 'true')
    expect(monthSelect).toHaveAttribute('aria-invalid', 'true')
    expect(dayField).toHaveAttribute('aria-invalid', 'true')
    expect(yearField).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Please enter a first name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a last name.')).toBeInTheDocument()
    expect(screen.getByText('Please select a month.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a day.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a year.')).toBeInTheDocument()
  })

  it('clears each field-empty error independently as that field is filled in', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Please enter a first name.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('First name'), 'Ada')
    expect(screen.queryByText('Please enter a first name.')).not.toBeInTheDocument()
    // The rest are untouched, so they're still showing.
    expect(screen.getByText('Please enter a last name.')).toBeInTheDocument()
    expect(screen.getByText('Please select a month.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a day.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a year.')).toBeInTheDocument()
  })

  it('shows an error on Month, using the field-error variant rather than a native validation bubble, when Continue is clicked without selecting one', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    const monthSelect = screen.getByLabelText('Month')
    expect(screen.queryByText('Please select a month.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(monthSelect).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Please select a month.')).toBeInTheDocument()
  })

  it('clears the Month error once one is selected', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Please select a month.')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Month'), '01')
    expect(screen.queryByText('Please select a month.')).not.toBeInTheDocument()
  })

  it('shows an error and does not navigate when the date of birth is under eighteen years old', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.selectOptions(screen.getByLabelText('Month'), '01')
    await user.type(screen.getByLabelText('Day'), '1')
    const underageYear = String(new Date().getFullYear() - 10)
    await user.type(screen.getByLabelText('Year'), underageYear)

    expect(
      screen.queryByText('You must be over eighteen years old to use Linus Health.'),
    ).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(
      screen.getByText('You must be over eighteen years old to use Linus Health.'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
  })

  it('clears the under-18 error once a valid date of birth is entered, then navigates', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.selectOptions(screen.getByLabelText('Month'), '01')
    await user.type(screen.getByLabelText('Day'), '1')
    const yearField = screen.getByLabelText('Year')
    await user.type(yearField, String(new Date().getFullYear() - 10))
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('You must be over eighteen years old to use Linus Health.'),
    ).toBeInTheDocument()

    await user.clear(yearField)
    await user.type(yearField, '1988')
    expect(
      screen.queryByText('You must be over eighteen years old to use Linus Health.'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Registration state: Ada Lovelace 1988-01-01')).toBeInTheDocument()
  })

  it('shows an error live (before any submit attempt) when Day is above 31, and clears once corrected', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    const dayField = screen.getByLabelText('Day')
    expect(screen.queryByText('Value must be equal or less than 31.')).not.toBeInTheDocument()

    await user.type(dayField, '1112')
    expect(screen.getByText('Value must be equal or less than 31.')).toBeInTheDocument()
    expect(dayField).toHaveAttribute('aria-invalid', 'true')

    await user.clear(dayField)
    await user.type(dayField, '11')
    expect(screen.queryByText('Value must be equal or less than 31.')).not.toBeInTheDocument()
    expect(dayField).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('does not navigate while Day is above 31, even once every other field is filled in', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.selectOptions(screen.getByLabelText('Month'), '01')
    await user.type(screen.getByLabelText('Day'), '32')
    await user.type(screen.getByLabelText('Year'), '1988')

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
  })

  it('does not show the Year error while fewer than four digits have been typed, even if the digits so far read as 1910 or below', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    const yearField = screen.getByLabelText('Year')

    await user.type(yearField, '1')
    expect(screen.queryByText('Value must be higher than 1910.')).not.toBeInTheDocument()
    await user.type(yearField, '9')
    expect(screen.queryByText('Value must be higher than 1910.')).not.toBeInTheDocument()
    await user.type(yearField, '9')
    expect(screen.queryByText('Value must be higher than 1910.')).not.toBeInTheDocument()
    // The fourth digit completes "1995" — a fine year, so still no error.
    await user.type(yearField, '5')
    expect(screen.queryByText('Value must be higher than 1910.')).not.toBeInTheDocument()
  })

  it('shows an error live (before any submit attempt) when Year is 1910 or below, and clears once corrected', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    const yearField = screen.getByLabelText('Year')
    expect(screen.queryByText('Value must be higher than 1910.')).not.toBeInTheDocument()

    await user.type(yearField, '1910')
    expect(screen.getByText('Value must be higher than 1910.')).toBeInTheDocument()
    expect(yearField).toHaveAttribute('aria-invalid', 'true')

    await user.clear(yearField)
    await user.type(yearField, '1911')
    expect(screen.queryByText('Value must be higher than 1910.')).not.toBeInTheDocument()
    expect(yearField).not.toHaveAttribute('aria-invalid', 'true')
  })

  it('does not navigate while Year is 1910 or below, even once every other field is filled in', async () => {
    const user = userEvent.setup()
    renderOnboardingPage()
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.selectOptions(screen.getByLabelText('Month'), '01')
    await user.type(screen.getByLabelText('Day'), '1')
    await user.type(screen.getByLabelText('Year'), '1900')

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderOnboardingPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
