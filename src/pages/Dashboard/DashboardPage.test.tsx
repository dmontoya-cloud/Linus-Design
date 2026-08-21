import { useEffect, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth, type Profile } from '@/auth'
import { DashboardPage } from './DashboardPage'

const TEST_PROFILE: Profile = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  dateOfBirth: '1988-01-01',
  gender: 'female',
  sexAssignedAtBirth: 'female',
  educationLevel: 'bachelors-degree',
}

function WithProfile({ children }: { children: ReactNode }) {
  const { saveProfile } = useAuth()
  useEffect(() => {
    saveProfile(TEST_PROFILE)
  }, [saveProfile])
  return <>{children}</>
}

function renderDashboard({ withProfile = true } = {}) {
  const content = (
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assessment" element={<p>Assessment stub</p>} />
        <Route path="/history" element={<p>History stub</p>} />
        <Route path="/settings" element={<p>Settings stub</p>} />
      </Routes>
    </MemoryRouter>
  )
  return render(
    <AuthProvider>{withProfile ? <WithProfile>{content}</WithProfile> : content}</AuthProvider>,
  )
}

describe('DashboardPage', () => {
  it('renders the logo, primary nav links, and the signed-in user', () => {
    renderDashboard()
    expect(screen.getByRole('link', { name: 'Back to start' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Assessment' })).toHaveAttribute('href', '/assessment')
    expect(screen.getByRole('link', { name: 'History' })).toHaveAttribute('href', '/history')
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings')
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('AL')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Welcome, Ada' })).toBeInTheDocument()
  })

  it('selects Assessment as the current page by default', () => {
    renderDashboard()
    expect(screen.getByRole('link', { name: 'Assessment' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'History' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('aria-current')
  })

  it('shows three pending activity cards, each with a Start link to /assessment', () => {
    renderDashboard()
    expect(screen.getByText('Or just pick one')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Each check-in works on its own. Take them in any order. Your report updates each time.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Memory & Thinking' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lifestyle' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Priorities' })).toBeInTheDocument()
    expect(screen.getAllByText('Not started')).toHaveLength(3)
    expect(screen.getByText('About 15 minutes')).toBeInTheDocument()
    expect(screen.getAllByText('About 5–10 minutes')).toHaveLength(2)
    expect(screen.getByText('Needs quiet room')).toBeInTheDocument()
    const startLinks = screen.getAllByRole('link', { name: 'Start' })
    expect(startLinks).toHaveLength(3)
    startLinks.forEach((link) => expect(link).toHaveAttribute('href', '/assessment'))
  })

  it('shows the resources card with a real external link to the Linus Health website', () => {
    renderDashboard()
    expect(screen.getByRole('heading', { name: 'Brain health resources' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Exercises, articles and programmes from our clinical team. Free to browse, nothing to complete first.',
      ),
    ).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /Open resources on linushealth.com/ })
    expect(link).toHaveAttribute('href', 'https://www.linushealth.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('falls back to a generic label when no profile is present', () => {
    renderDashboard({ withProfile: false })
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Welcome, there' })).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderDashboard()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
