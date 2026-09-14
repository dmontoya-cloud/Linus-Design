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
  it('renders the sex select and the Gender select with no section title or note above it', () => {
    renderGenderIdentityPage()
    expect(screen.queryByRole('heading', { name: /How do you identify/ })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Select your sex')).toBeInTheDocument()
    expect(screen.getByLabelText('Gender (Optional)')).toBeInTheDocument()
  })

  it('renders the biology-norms subtitle below the title', () => {
    renderGenderIdentityPage()
    expect(
      screen.getByText(
        'These details help us understand your answers using the right reference information.',
      ),
    ).toBeInTheDocument()
  })

  it('offers Female, Male, and Intersex for sex, and different options for gender', () => {
    renderGenderIdentityPage()
    const sexSelect = screen.getByLabelText('Select your sex') as HTMLSelectElement
    const sexOptionLabels = Array.from(sexSelect.options)
      .map((option) => option.textContent)
      .filter((text) => text !== 'Choose one')
    expect(sexOptionLabels).toEqual(['Female', 'Male', 'Intersex'])

    const genderSelect = screen.getByLabelText('Gender (Optional)') as HTMLSelectElement
    const genderOptionLabels = Array.from(genderSelect.options)
      .map((option) => option.textContent)
      .filter((text) => text !== 'Choose one')
    expect(genderOptionLabels).toEqual(['Female', 'Male', 'Non-binary', 'Prefer not to say'])
  })

  it('leaves the Gender placeholder as plain "Choose one" and the select enabled without an error', () => {
    renderGenderIdentityPage()
    const genderSelect = screen.getByLabelText('Gender (Optional)') as HTMLSelectElement
    expect(genderSelect.options.item(0)?.textContent).toBe('Choose one')
    expect(genderSelect).not.toHaveAttribute('required')
  })

  it('no longer auto-fills sex when gender is Male or Female — the two fields are independent', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender (Optional)'), 'male')
    expect(screen.getByLabelText('Select your sex')).toHaveValue('')

    await user.selectOptions(screen.getByLabelText('Gender (Optional)'), 'female')
    expect(screen.getByLabelText('Select your sex')).toHaveValue('')
  })

  it('lets sex and gender be set independently to different values', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender (Optional)'), 'male')
    await user.selectOptions(screen.getByLabelText('Select your sex'), 'intersex')
    expect(screen.getByLabelText('Select your sex')).toHaveValue('intersex')
    expect(screen.getByLabelText('Gender (Optional)')).toHaveValue('male')
  })

  it('saves the combined profile (prior state + gender + sex) and navigates to /loading', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender (Optional)'), 'non-binary')
    await user.selectOptions(screen.getByLabelText('Select your sex'), 'female')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Profile: Ada Lovelace 1988-01-01 bachelors-degree non-binary female'),
    ).toBeInTheDocument()
  })

  it('saves Intersex as sex', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender (Optional)'), 'non-binary')
    await user.selectOptions(screen.getByLabelText('Select your sex'), 'intersex')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Profile: Ada Lovelace 1988-01-01 bachelors-degree non-binary intersex'),
    ).toBeInTheDocument()
  })

  it('does not navigate when sex is left unselected, even though gender is optional', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender (Optional)'), 'non-binary')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('Select your sex')).toHaveValue('')
  })

  it('saves with an empty gender when left on "Choose one", as long as sex is answered', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Select your sex'), 'female')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Profile: Ada Lovelace 1988-01-01 bachelors-degree female'),
    ).toBeInTheDocument()
  })

  it('shows an error on sex when Continue is clicked unanswered, using the field-error variant rather than a native validation bubble, and never shows one for the optional Gender', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    const genderSelect = screen.getByLabelText('Gender (Optional)')
    const sexSelect = screen.getByLabelText('Select your sex')
    expect(screen.queryByText('Please select a sex.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(genderSelect).not.toHaveAttribute('aria-invalid', 'true')
    expect(sexSelect).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Please select a sex.')).toBeInTheDocument()
    expect(screen.queryByText('Profile:', { exact: false })).not.toBeInTheDocument()
  })

  it('clears the sex error once it is answered', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Please select a sex.')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Select your sex'), 'female')
    expect(screen.queryByText('Please select a sex.')).not.toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderGenderIdentityPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
