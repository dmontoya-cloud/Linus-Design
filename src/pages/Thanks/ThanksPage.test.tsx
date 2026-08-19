import { useEffect } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider, useAuth } from '@/auth'
import { ThanksPage } from './ThanksPage'

function OnboardingProbe() {
  return <p>Onboarding screen</p>
}

/** Sets AuthContext's preferredName on mount, so ThanksPage renders as if the
 * visitor had already typed a name into Legal Intro's field. */
function WithPreferredName({ name }: { name: string }) {
  const { setPreferredName } = useAuth()
  useEffect(() => {
    setPreferredName(name)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only
  }, [])
  return <ThanksPage />
}

function renderThanksPage(name?: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/thanks']}>
        <Routes>
          <Route
            path="/thanks"
            element={name === undefined ? <ThanksPage /> : <WithPreferredName name={name} />}
          />
          <Route path="/onboarding" element={<OnboardingProbe />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('ThanksPage', () => {
  it('shows a generic thanks message when no preferred name was given', () => {
    renderThanksPage()
    expect(screen.getByText('Thanks!')).toBeInTheDocument()
  })

  it('greets the visitor by their preferred name', () => {
    renderThanksPage('Ada')
    expect(screen.getByText('Thanks, Ada!')).toBeInTheDocument()
  })

  it('navigates to /onboarding once the timer completes', async () => {
    renderThanksPage()
    await waitFor(() => expect(screen.getByText('Onboarding screen')).toBeInTheDocument(), {
      timeout: 3500,
    })
  }, 5000)

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderThanksPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
