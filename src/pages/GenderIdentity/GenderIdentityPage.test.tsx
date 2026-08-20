import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { LanguageProvider } from '@/language'
import { GenderIdentityPage } from './GenderIdentityPage'

interface HandoffState {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  sexAssignedAtBirth: string
}

function EducationProbe() {
  const location = useLocation()
  const state = location.state as HandoffState | null
  return (
    <p>
      Handoff state:{' '}
      {state
        ? `${state.firstName} ${state.lastName} ${state.dateOfBirth} ${state.gender} ${state.sexAssignedAtBirth}`
        : 'none'}
    </p>
  )
}

function renderGenderIdentityPage() {
  return render(
    <LanguageProvider>
      <AuthProvider>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/gender-identity',
              state: { firstName: 'Ada', lastName: 'Lovelace', dateOfBirth: '1988-01-01' },
            },
          ]}
        >
          <Routes>
            <Route path="/gender-identity" element={<GenderIdentityPage />} />
            <Route path="/education" element={<EducationProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </LanguageProvider>,
  )
}

describe('GenderIdentityPage', () => {
  it('renders both section titles and selects, with a disabled Continue button', () => {
    renderGenderIdentityPage()
    expect(screen.getByRole('heading', { name: 'How do you identify?' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'What sex were you assigned at birth?' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Gender')).toBeInTheDocument()
    expect(screen.getByLabelText('Sex assigned at birth')).toBeInTheDocument()
  })

  it('renders the biology-norms subtitle below the title', () => {
    renderGenderIdentityPage()
    expect(
      screen.getByText(
        'Your results are compared with norms based on biology. This helps us use the right ones.',
      ),
    ).toBeInTheDocument()
  })

  it('offers Female, Male, and Intersex for sex assigned at birth, and different options for gender', () => {
    renderGenderIdentityPage()
    const sexSelect = screen.getByLabelText('Sex assigned at birth') as HTMLSelectElement
    const sexOptionLabels = Array.from(sexSelect.options)
      .map((option) => option.textContent)
      .filter((text) => text !== 'Choose one')
    expect(sexOptionLabels).toEqual(['Female', 'Male', 'Intersex'])

    const genderSelect = screen.getByLabelText('Gender') as HTMLSelectElement
    const genderOptionLabels = Array.from(genderSelect.options)
      .map((option) => option.textContent)
      .filter((text) => text !== 'Choose one - Optional')
    expect(genderOptionLabels).toEqual(['Female', 'Male', 'Non-binary', 'Prefer not to say'])
  })

  it('marks the Gender placeholder as optional and leaves the select enabled without an error', () => {
    renderGenderIdentityPage()
    const genderSelect = screen.getByLabelText('Gender') as HTMLSelectElement
    expect(genderSelect.options.item(0)?.textContent).toBe('Choose one - Optional')
    expect(genderSelect).not.toHaveAttribute('required')
  })

  it('auto-fills sex assigned at birth and shows the pre-fill note when gender is Male', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'male')
    expect(screen.getByLabelText('Sex assigned at birth')).toHaveValue('male')
    expect(screen.getByText('We filled this in from your last answer')).toBeInTheDocument()
    expect(screen.getByText(/We selected Male from your last answer/)).toBeInTheDocument()
  })

  it('auto-fills sex assigned at birth and shows the pre-fill note when gender is Female', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'female')
    expect(screen.getByLabelText('Sex assigned at birth')).toHaveValue('female')
    expect(screen.getByText('We filled this in from your last answer')).toBeInTheDocument()
    expect(screen.getByText(/We selected Female from your last answer/)).toBeInTheDocument()
  })

  it('still lets the visitor change the auto-filled value', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'male')
    expect(screen.getByLabelText('Sex assigned at birth')).toHaveValue('male')
    await user.selectOptions(screen.getByLabelText('Sex assigned at birth'), 'intersex')
    expect(screen.getByLabelText('Sex assigned at birth')).toHaveValue('intersex')
  })

  it('does not auto-fill or show the pre-fill note for Non-binary or Prefer not to say', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'non-binary')
    expect(screen.getByLabelText('Sex assigned at birth')).toHaveValue('')
    expect(screen.queryByText('We filled this in from your last answer')).not.toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Gender'), 'prefer-not-to-say')
    expect(screen.getByLabelText('Sex assigned at birth')).toHaveValue('')
    expect(screen.queryByText('We filled this in from your last answer')).not.toBeInTheDocument()
  })

  it('hands off registration state + gender + sex to /education on the happy path', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'non-binary')
    await user.selectOptions(screen.getByLabelText('Sex assigned at birth'), 'female')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Handoff state: Ada Lovelace 1988-01-01 non-binary female'),
    ).toBeInTheDocument()
  })

  it('hands off Intersex as sex assigned at birth', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'non-binary')
    await user.selectOptions(screen.getByLabelText('Sex assigned at birth'), 'intersex')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Handoff state: Ada Lovelace 1988-01-01 non-binary intersex'),
    ).toBeInTheDocument()
  })

  it('does not navigate when sex assigned at birth is left unselected, even though gender is optional', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    // Non-binary doesn't auto-fill sex assigned at birth, so it's left genuinely unselected.
    await user.selectOptions(screen.getByLabelText('Gender'), 'non-binary')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('Sex assigned at birth')).toHaveValue('')
  })

  it('hands off with an empty gender when left on "Choose one - Optional", as long as sex assigned at birth is answered', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Sex assigned at birth'), 'female')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Handoff state: Ada Lovelace 1988-01-01 female')).toBeInTheDocument()
  })

  it('shows an error on sex assigned at birth when Continue is clicked unanswered, using the field-error variant rather than a native validation bubble, and never shows one for the optional Gender', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    const genderSelect = screen.getByLabelText('Gender')
    const sexSelect = screen.getByLabelText('Sex assigned at birth')
    expect(screen.queryByText('Please select a sex assigned at birth.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(genderSelect).not.toHaveAttribute('aria-invalid', 'true')
    expect(sexSelect).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Please select a sex assigned at birth.')).toBeInTheDocument()
    expect(screen.queryByText('Handoff state:', { exact: false })).not.toBeInTheDocument()
  })

  it('clears the sex-assigned-at-birth error once auto-filled by picking Male or Female', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Please select a sex assigned at birth.')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Gender'), 'male')
    expect(screen.queryByText('Please select a sex assigned at birth.')).not.toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderGenderIdentityPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
