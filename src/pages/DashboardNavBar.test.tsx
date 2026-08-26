import { useEffect, type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth, type Profile } from '@/auth'
import { DashboardNavBar, type DashboardNavBarProps } from './DashboardNavBar'

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

function renderNavBar({
  path = '/dashboard',
  withProfile = true,
  ...navBarProps
}: { path?: string; withProfile?: boolean } & DashboardNavBarProps = {}) {
  const content = (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={path} element={<DashboardNavBar {...navBarProps} />} />
      </Routes>
    </MemoryRouter>
  )
  return render(
    <AuthProvider>{withProfile ? <WithProfile>{content}</WithProfile> : content}</AuthProvider>,
  )
}

describe('DashboardNavBar', () => {
  it('renders the logo, primary nav links, and the signed-in user', () => {
    renderNavBar()
    expect(screen.getByRole('link', { name: 'Back to start' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Assessment' })).toHaveAttribute('href', '/assessment')
    expect(screen.getByRole('link', { name: 'History' })).toHaveAttribute('href', '/history')
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings')
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('AL')).toBeInTheDocument()
  })

  it('falls back to a generic label when no profile is present', () => {
    renderNavBar({ withProfile: false })
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('marks Assessment active on /dashboard, since Dashboard has no nav item of its own', () => {
    renderNavBar({ path: '/dashboard' })
    expect(screen.getByRole('link', { name: 'Assessment' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'History' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('aria-current')
  })

  it('marks Assessment active on /assessment too', () => {
    renderNavBar({ path: '/assessment' })
    expect(screen.getByRole('link', { name: 'Assessment' })).toHaveAttribute('aria-current', 'page')
  })

  it('replaces the nav links with plain text when a title is given', () => {
    renderNavBar({ title: 'Memory & Thinking' })
    expect(screen.getByText('Memory & Thinking')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Assessment' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'History' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('replaces the signed-in user info with a tertiary Exit link when exitTo is given', () => {
    renderNavBar({ exitTo: '/dashboard' })
    expect(screen.getByRole('link', { name: 'Exit' })).toHaveAttribute('href', '/dashboard')
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderNavBar()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })

  it('has no automatically detectable accessibility violations with title/exitTo set', async () => {
    const { container } = renderNavBar({ title: 'Memory & Thinking', exitTo: '/dashboard' })
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
