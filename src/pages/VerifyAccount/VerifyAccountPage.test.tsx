import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth } from '@/auth'
import { VerifyAccountPage } from './VerifyAccountPage'

function LegalIntroProbe() {
  const { isAuthenticated } = useAuth()
  return <p>Authenticated: {String(isAuthenticated)}</p>
}

function renderVerifyAccountPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/verify-account']}>
        <Routes>
          <Route path="/verify-account" element={<VerifyAccountPage />} />
          <Route path="/legal-intro" element={<LegalIntroProbe />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('VerifyAccountPage', () => {
  it('shows the logging-in message', () => {
    renderVerifyAccountPage()
    expect(screen.getByText('Logging you in')).toBeInTheDocument()
  })

  it('logs in and navigates to /legal-intro once the timer completes', async () => {
    renderVerifyAccountPage()
    await waitFor(() => expect(screen.getByText('Authenticated: true')).toBeInTheDocument(), {
      timeout: 4500,
    })
  }, 6000)

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderVerifyAccountPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
