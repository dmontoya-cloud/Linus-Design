import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth } from '@/auth'
import { LanguageProvider } from '@/language'
import { EducationPage } from './EducationPage'

function LoadingProbe() {
  const { profile } = useAuth()
  return (
    <p>
      Profile:{' '}
      {profile
        ? `${profile.firstName} ${profile.lastName} ${profile.dateOfBirth} ${profile.gender} ${profile.sexAssignedAtBirth} ${profile.educationLevel}`
        : 'none'}
    </p>
  )
}

function renderEducationPage() {
  return render(
    <LanguageProvider>
      <AuthProvider>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/education',
              state: {
                firstName: 'Ada',
                lastName: 'Lovelace',
                dateOfBirth: '1988-01-01',
                gender: 'non-binary',
                sexAssignedAtBirth: 'female',
              },
            },
          ]}
        >
          <Routes>
            <Route path="/education" element={<EducationPage />} />
            <Route path="/loading" element={<LoadingProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </LanguageProvider>,
  )
}

describe('EducationPage', () => {
  it('renders the title, subtitle, and education select', () => {
    renderEducationPage()
    expect(
      screen.getByRole('heading', { name: 'Which best describes your educational background?' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Education gives helpful context for your results. It is part of how we choose the right norms.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Education background')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
  })

  it('offers every education level option', () => {
    renderEducationPage()
    const select = screen.getByLabelText('Education background') as HTMLSelectElement
    const optionLabels = Array.from(select.options)
      .map((option) => option.textContent)
      .filter((text) => text !== 'Please choose')
    expect(optionLabels).toEqual([
      'None / Not in school',
      'Elementary School (Grades 1–5)',
      'Middle School (Grades 6–8)',
      'High School (Grades 9-11)',
      'High School Graduate/GED',
      'Some College',
      "Bachelor's Degree",
      'Some Graduate Education',
      "Master's Degree",
      'Doctoral Degree',
    ])
  })

  it('saves the combined profile (prior state + education level) and navigates to /loading', async () => {
    const user = userEvent.setup()
    renderEducationPage()
    await user.selectOptions(screen.getByLabelText('Education background'), 'bachelors-degree')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Profile: Ada Lovelace 1988-01-01 non-binary female bachelors-degree'),
    ).toBeInTheDocument()
  })

  it('does not navigate when education level is left unselected', async () => {
    const user = userEvent.setup()
    renderEducationPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByLabelText('Education background')).toHaveValue('')
  })

  it('shows an error on the select, using the field-error variant rather than a native validation bubble, when Continue is clicked without a selection', async () => {
    const user = userEvent.setup()
    renderEducationPage()
    const select = screen.getByLabelText('Education background')
    expect(screen.queryByText('Please select an education background.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(select).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Please select an education background.')).toBeInTheDocument()
  })

  it('clears the error once an option is selected, then navigates', async () => {
    const user = userEvent.setup()
    renderEducationPage()
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByText('Please select an education background.')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Education background'), 'bachelors-degree')
    expect(screen.queryByText('Please select an education background.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(
      screen.getByText('Profile: Ada Lovelace 1988-01-01 non-binary female bachelors-degree'),
    ).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderEducationPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
