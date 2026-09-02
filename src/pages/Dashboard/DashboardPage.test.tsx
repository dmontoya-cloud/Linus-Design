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
        <Route path="/assessment/start" element={<p>Assessment start stub</p>} />
        <Route path="/assessment" element={<p>Assessment stub</p>} />
        <Route path="/assessment/lifestyle" element={<p>Lifestyle stub</p>} />
        <Route path="/assessment/priorities" element={<p>Priorities stub</p>} />
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
  it('renders the logo and the signed-in user', () => {
    renderDashboard()
    expect(screen.getByRole('link', { name: 'Back to start' })).toHaveAttribute('href', '/')
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('AL')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^Welcome, Ada!/ })).toBeInTheDocument()
    // Removed on request — the header's center used to show Assessment/History/Settings links.
    expect(screen.queryByRole('link', { name: 'Assessment' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'History' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('shows three pending activity cards, each Start link routed to its own destination', () => {
    renderDashboard()
    expect(screen.getByText('Explore one area')).toBeInTheDocument()
    expect(
      screen.getByText(
        'You can complete each activity one at a time. Each adds more information to your brain health report.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Memory & Thinking' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lifestyle' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Priorities' })).toBeInTheDocument()
    expect(screen.getAllByText('Not started')).toHaveLength(3)
    expect(screen.getByText('About 20 minutes')).toBeInTheDocument()
    expect(screen.getByText('About 7–10 minutes')).toBeInTheDocument()
    expect(screen.getByText('About 5 minutes')).toBeInTheDocument()
    expect(screen.getByText('About 7 minutes')).toBeInTheDocument()
    expect(screen.getByText('Needs quiet room')).toBeInTheDocument()
    // Only Memory & Thinking's Start reaches the real Assessment Intro screen (with its
    // instructions voice-over) — Lifestyle/Priorities route to their own not-yet-built stubs.
    const startLinks = screen.getAllByRole('link', { name: 'Start' })
    expect(startLinks).toHaveLength(3)
    expect(startLinks[0]).toHaveAttribute('href', '/assessment/start')
    expect(startLinks[1]).toHaveAttribute('href', '/assessment/lifestyle')
    expect(startLinks[2]).toHaveAttribute('href', '/assessment/priorities')
  })

  it('shows the resources card with a real external link to the Linus Health website', () => {
    renderDashboard()
    expect(
      screen.getByRole('heading', { name: 'Learn more about brain health' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Explore trusted information, tips, and tools to help you learn more about brain health and support your wellbeing.',
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
    expect(screen.getByRole('heading', { name: /^Welcome, there!/ })).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderDashboard()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
