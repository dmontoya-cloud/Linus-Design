import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { DeviceReadyPage } from './DeviceReadyPage'

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/assessment/memory-and-thinking/microphone-check']}>
        <Routes>
          <Route
            path="/assessment/memory-and-thinking/microphone-check"
            element={<DeviceReadyPage />}
          />
          <Route path="/dashboard" element={<p>Dashboard stub</p>} />
          <Route path="/assessment/memory-and-thinking/task" element={<p>Task stub</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('DeviceReadyPage', () => {
  it('shows the nav bar with the activity name in place of the usual nav links', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Back to start' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Exit' })).toHaveAttribute('href', '/dashboard')
  })

  it('shows the Exit link as an outline button with a sign-out icon, not the usual plain text link', () => {
    renderPage()
    const exitLink = screen.getByRole('link', { name: 'Exit' })
    expect(exitLink.querySelector('svg')).toBeInTheDocument()
  })

  it('shows the "Your device is working properly." confirmation and the ready message on screen', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Your device is working properly.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('You are ready. Find a comfortable position. We will begin now.'),
    ).toBeInTheDocument()
  })

  it('moves on to the task placeholder from "Continue to test"', async () => {
    const user = userEvent.setup()
    renderPage()
    const continueLink = screen.getByRole('link', { name: 'Continue to test' })
    expect(continueLink).toHaveAttribute('href', '/assessment/memory-and-thinking/task')
    await user.click(continueLink)
    expect(screen.getByText('Task stub')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
