import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  // App is always served under /web/ in real usage (see vite.config.ts) and its BrowserRouter
  // is configured with basename="/web" to match. jsdom defaults to path "/", so tests must
  // start navigation at /web/ too, or every route silently fails to match.
  beforeEach(() => {
    window.history.pushState({}, '', '/web/')
  })

  it('renders the prototype index with a link per funnel step', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /prototype/i })).toBeInTheDocument()
    ;[
      'Login',
      'Onboarding',
      'Consent / Privacy',
      'Paywall / Subscription',
      'Assessment Intro',
      'In-App Report',
    ].forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    })
  })

  it('navigates to a placeholder screen and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Login' }))
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /back to prototype index/i }))
    expect(screen.getByRole('heading', { name: /prototype/i })).toBeInTheDocument()
  })
})
