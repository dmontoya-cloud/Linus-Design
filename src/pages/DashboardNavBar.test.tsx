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
  it('renders the logo and the signed-in user, with no center nav links', () => {
    renderNavBar()
    expect(screen.getByRole('link', { name: 'Back to start' })).toHaveAttribute('href', '/')
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('AL')).toBeInTheDocument()
    // Removed on request — Dashboard's header center used to show Assessment/History/Settings
    // links, now it's empty.
    expect(screen.queryByRole('link', { name: 'Assessment' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'History' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('falls back to a generic label when no profile is present', () => {
    renderNavBar({ withProfile: false })
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('shows a centered title in place of the (removed) nav links when one is given', () => {
    renderNavBar({ title: 'Memory & Thinking' })
    expect(screen.getByText('Memory & Thinking')).toBeInTheDocument()
  })

  it('replaces the signed-in user info with a tertiary Exit link when exitTo is given', () => {
    renderNavBar({ exitTo: '/dashboard' })
    const exitLink = screen.getByRole('link', { name: 'Exit' })
    expect(exitLink).toHaveAttribute('href', '/dashboard')
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument()
    // The default (tertiary) Exit link is plain text — no SignOutIcon alongside it.
    expect(exitLink.querySelector('svg')).not.toBeInTheDocument()
  })

  it('shows an outline Exit link with a SignOutIcon when exitVariant is "outline"', () => {
    renderNavBar({ exitTo: '/dashboard', exitVariant: 'outline' })
    const exitLink = screen.getByRole('link', { name: 'Exit' })
    expect(exitLink).toHaveAttribute('href', '/dashboard')
    expect(exitLink.querySelector('svg')).toBeInTheDocument()
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

  it('has no automatically detectable accessibility violations with an outline Exit link', async () => {
    const { container } = renderNavBar({
      title: 'Memory & Thinking',
      exitTo: '/dashboard',
      exitVariant: 'outline',
    })
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
