import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { ProfilePage } from './ProfilePage'

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<p>Dashboard stub</p>} />
          <Route path="/terms" element={<p>Terms stub</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('ProfilePage', () => {
  it('shows the Profile title and a Back to Dashboard link', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to Dashboard' })).toHaveAttribute(
      'href',
      '/dashboard',
    )
  })

  it('shows the data-deletion email as a mailto link', () => {
    renderPage()
    const emailLink = screen.getByRole('link', { name: 'privacy@linus.health' })
    expect(emailLink).toHaveAttribute('href', 'mailto:privacy@linus.health')
  })

  it('shows a View link to the Terms of Use and Privacy Policy', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'View' })).toHaveAttribute('href', '/terms')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
