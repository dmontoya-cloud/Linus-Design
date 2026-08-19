import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { LoadingPage } from './LoadingPage'

function DashboardProbe() {
  return <p>Dashboard screen</p>
}

function renderLoadingPage() {
  return render(
    <MemoryRouter initialEntries={['/loading']}>
      <Routes>
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/dashboard" element={<DashboardProbe />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LoadingPage', () => {
  it('shows the loading message', () => {
    renderLoadingPage()
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('navigates to /dashboard once the timer completes', async () => {
    renderLoadingPage()
    await waitFor(() => expect(screen.getByText('Dashboard screen')).toBeInTheDocument(), {
      timeout: 3500,
    })
  }, 5000)

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderLoadingPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
