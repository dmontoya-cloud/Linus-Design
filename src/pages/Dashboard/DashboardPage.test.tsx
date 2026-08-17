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
    expect(screen.getByRole('heading', { name: 'Welcome back, Ada' })).toBeInTheDocument()
  })

  it('selects Assessment as the current page by default', () => {
    renderDashboard()
    expect(screen.getByRole('link', { name: 'Assessment' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'History' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('aria-current')
  })

  it('shows three pending activity cards, each with a Start link to /assessment', () => {
    renderDashboard()
    expect(screen.getByText('You have 3 activities pending.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Memory Recall' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Speech Pattern Analysis' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Visual Attention Test' })).toBeInTheDocument()
    expect(screen.getByText('Speak clearly into your microphone.')).toBeInTheDocument()
    expect(screen.getByText('Use headphones for the audio cues.')).toBeInTheDocument()
    const startLinks = screen.getAllByRole('link', { name: 'Start' })
    expect(startLinks).toHaveLength(3)
    startLinks.forEach((link) => expect(link).toHaveAttribute('href', '/assessment'))
  })

  it('falls back to a generic label when no profile is present', () => {
    renderDashboard({ withProfile: false })
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Welcome back, there' })).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderDashboard()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
