import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth } from '@/auth'
import { LanguageProvider } from '@/language'
import { GenderIdentityPage } from './GenderIdentityPage'

function LoadingProbe() {
  const { profile } = useAuth()
  return (
    <p>
      Profile:{' '}
      {profile
        ? `${profile.firstName} ${profile.lastName} ${profile.dateOfBirth} ${profile.educationLevel} ${profile.gender} ${profile.sexAssignedAtBirth}`
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
              state: {
                firstName: 'Ada',
                lastName: 'Lovelace',
                dateOfBirth: '1988-01-01',
                educationLevel: 'bachelors-degree',
              },
            },
          ]}
        >
          <Routes>
            <Route path="/gender-identity" element={<GenderIdentityPage />} />
            <Route path="/loading" element={<LoadingProbe />} />
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
        'These details help us understand your answers using the right reference information.',
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
    expect(screen.getByText('We filled this in based on your last answer.')).toBeInTheDocument()
    expect(screen.getByText(/We selected Male based on your gender response/)).toBeInTheDocument()
  })

  it('auto-fills sex assigned at birth and shows the pre-fill note when gender is Female', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'female')
    expect(screen.getByLabelText('Sex assigned at birth')).toHaveValue('female')
    expect(screen.getByText('We filled this in based on your last answer.')).toBeInTheDocument()
    expect(screen.getByText(/We selected Female based on your gender response/)).toBeInTheDocument()
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

  it('saves the combined profile (prior state + gender + sex) and navigates to /loading', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'non-binary')
    await user.selectOptions(screen.getByLabelText('Sex assigned at birth'), 'female')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Profile: Ada Lovelace 1988-01-01 bachelors-degree non-binary female'),
    ).toBeInTheDocument()
  })

  it('saves Intersex as sex assigned at birth', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'non-binary')
    await user.selectOptions(screen.getByLabelText('Sex assigned at birth'), 'intersex')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Profile: Ada Lovelace 1988-01-01 bachelors-degree non-binary intersex'),
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

  it('saves with an empty gender when left on "Choose one - Optional", as long as sex assigned at birth is answered', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Sex assigned at birth'), 'female')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Profile: Ada Lovelace 1988-01-01 bachelors-degree female'),
    ).toBeInTheDocument()
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
    expect(screen.queryByText('Profile:', { exact: false })).not.toBeInTheDocument()
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
