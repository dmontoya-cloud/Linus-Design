import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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
      'Verify Email (magic link)',
      'Legal Intro',
      'Terms of Use',
      'Privacy Policy',
      'Setting Up',
      'Thanks',
      'Onboarding',
      'Gender & Identity',
      'Education',
      'Loading',
      'Dashboard',
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
    await user.click(screen.getByRole('link', { name: 'Paywall / Subscription' }))
    expect(screen.getByRole('heading', { name: 'Paywall / Subscription' })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /back to prototype index/i }))
    expect(screen.getByRole('heading', { name: /prototype/i })).toBeInTheDocument()
  })

  it('scrolls back to the top on every route change', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const user = userEvent.setup()
    render(<App />)
    scrollToSpy.mockClear() // drop the initial-mount call, only care about navigation

    await user.click(screen.getByRole('link', { name: 'Paywall / Subscription' }))
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0)

    scrollToSpy.mockRestore()
  })

  it('navigates to the real Login screen, not a placeholder', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Login' }))
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send magic link' })).toBeInTheDocument()
  })

  it('redirects /onboarding to /login when not authenticated', () => {
    window.history.pushState({}, '', '/web/onboarding')
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
  })

  it('walks the Login → Verify Email → Verify Account → Legal Intro → Terms → Privacy → Setting Up → Thanks → Onboarding → Gender & Identity → Education → Loading → Dashboard happy path', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Login' }))
    await user.type(screen.getByLabelText('Email address*'), 'ada@example.com')
    await user.click(screen.getByRole('button', { name: 'Send magic link' }))

    await waitFor(
      () => expect(screen.getByRole('heading', { name: 'Check your email!' })).toBeInTheDocument(),
      { timeout: 2000 },
    )

    // No code to enter — "Send new link" only appears once the resend countdown
    // reaches zero, then hands off to Verify Account.
    expect(screen.queryByRole('button', { name: 'Send new link' })).not.toBeInTheDocument()
    await waitFor(
      () => expect(screen.getByRole('button', { name: 'Send new link' })).toBeInTheDocument(),
      { timeout: 20000 },
    )
    await user.click(screen.getByRole('button', { name: 'Send new link' }))
    await waitFor(() => expect(screen.getByText('Logging you in')).toBeInTheDocument(), {
      timeout: 4500,
    })

    await waitFor(
      () =>
        expect(
          screen.getByRole('heading', { name: "Hey, we're glad to have you" }),
        ).toBeInTheDocument(),
      { timeout: 4500 },
    )
    await user.click(screen.getByRole('checkbox', { name: "I'm over the age of eighteen" }))
    await user.click(screen.getByRole('button', { name: "Let's go" }))

    expect(screen.getByRole('heading', { name: 'Terms of Use' })).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Agree and continue' }))

    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
    await user.click(
      screen.getByRole('checkbox', { name: /I have read and agree to the Privacy Policy/ }),
    )
    await user.click(
      screen.getByRole('checkbox', {
        name: /I consent to Linus Health using my assessment results/,
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Agree and continue' }))

    await waitFor(() => expect(screen.getByText('Setting up your account')).toBeInTheDocument(), {
      timeout: 1000,
    })

    await waitFor(() => expect(screen.getByText('Thanks!')).toBeInTheDocument(), {
      timeout: 3000,
    })

    await waitFor(
      () =>
        expect(screen.getByRole('heading', { name: 'Tell us about yourself' })).toBeInTheDocument(),
      { timeout: 3000 },
    )
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.selectOptions(screen.getByLabelText('Month'), '01')
    await user.type(screen.getByLabelText('Day'), '1')
    await user.type(screen.getByLabelText('Year'), '1988')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByRole('heading', { name: 'A bit more about you' })).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Gender'), 'female')
    await user.selectOptions(screen.getByLabelText('Sex assigned at birth'), 'female')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(
      screen.getByRole('heading', { name: 'Which best describes your educational background?' }),
    ).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Education background'), 'bachelors-degree')
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(screen.getByText('Loading')).toBeInTheDocument(), {
      timeout: 1000,
    })

    await waitFor(
      () => expect(screen.getByRole('heading', { name: 'Welcome back, Ada' })).toBeInTheDocument(),
      { timeout: 3000 },
    )
    expect(screen.getByRole('link', { name: 'Assessment' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'History' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument()
  }, 45000)
})
