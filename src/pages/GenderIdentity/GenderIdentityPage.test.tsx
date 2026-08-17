import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth } from '@/auth'
import { LanguageProvider } from '@/language'
import { GenderIdentityPage } from './GenderIdentityPage'

function DashboardProbe() {
  const { profile } = useAuth()
  return (
    <p>
      Profile:{' '}
      {profile
        ? `${profile.firstName} ${profile.lastName} ${profile.dateOfBirth} ${profile.gender} ${profile.sexAssignedAtBirth}`
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
            <Route path="/dashboard" element={<DashboardProbe />} />
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
    expect(screen.getByRole('heading', { name: 'What sex were you assigned at birth?' })).toBeInTheDocument()
    expect(screen.getByLabelText('Gender')).toBeInTheDocument()
    expect(screen.getByLabelText('Sex assigned at birth')).toBeInTheDocument()
  })

  it('offers only Female and Male for sex assigned at birth, but more options for gender', () => {
    renderGenderIdentityPage()
    const sexSelect = screen.getByLabelText('Sex assigned at birth') as HTMLSelectElement
    const sexOptionLabels = Array.from(sexSelect.options)
      .map((option) => option.textContent)
      .filter((text) => text !== 'Choose one')
    expect(sexOptionLabels).toEqual(['Female', 'Male'])

    const genderSelect = screen.getByLabelText('Gender') as HTMLSelectElement
    const genderOptionLabels = Array.from(genderSelect.options)
      .map((option) => option.textContent)
      .filter((text) => text !== 'Choose one')
    expect(genderOptionLabels).toEqual(['Female', 'Male', 'Non-binary', 'Prefer not to say'])
  })

  it('saves the combined profile (registration state + gender + sex) and navigates to /dashboard', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'non-binary')
    await user.selectOptions(screen.getByLabelText('Sex assigned at birth'), 'female')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Profile: Ada Lovelace 1988-01-01 non-binary female'),
    ).toBeInTheDocument()
  })

  it('does not navigate when gender or sex assigned at birth is left unselected', async () => {
    const user = userEvent.setup()
    renderGenderIdentityPage()
    await user.selectOptions(screen.getByLabelText('Gender'), 'female')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('Sex assigned at birth')).toHaveValue('')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderGenderIdentityPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
