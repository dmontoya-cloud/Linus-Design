import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { LandingPage } from './LandingPage'

function LoginProbe() {
  return <p>Login screen</p>
}

function renderLandingPage() {
  return render(
    <MemoryRouter initialEntries={['/landing']}>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginProbe />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('LandingPage', () => {
  it('renders the hero headline and lead copy', () => {
    renderLandingPage()
    expect(
      screen.getByRole('heading', { level: 1, name: /a more personal look at your brain health/i }),
    ).toBeInTheDocument()
  })

  it('sends the header "Begin" CTA to /login', async () => {
    const user = userEvent.setup()
    renderLandingPage()
    await user.click(screen.getByRole('link', { name: 'Begin' }))
    expect(screen.getByText('Login screen')).toBeInTheDocument()
  })

  it('toggles a FAQ answer open and closed', async () => {
    const user = userEvent.setup()
    renderLandingPage()
    const question = screen.getByRole('button', {
      name: /can i use my brain health report to track changes over time/i,
    })
    expect(question).toHaveAttribute('aria-expanded', 'false')
    await user.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByText(/designed to give you a view of your brain health at a point in time/i),
    ).toBeInTheDocument()
    await user.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'false')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderLandingPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
