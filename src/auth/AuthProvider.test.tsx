import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from './AuthProvider'
import { useAuth } from './useAuth'
import type { Profile } from './authContext'

const testProfile: Profile = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  dateOfBirth: '1988-01-01',
}

function Consumer() {
  const { isAuthenticated, profile, consent, login, logout, saveProfile, giveConsent } = useAuth()
  return (
    <div>
      <p>Authenticated: {String(isAuthenticated)}</p>
      <p>Profile: {profile ? `${profile.firstName} ${profile.lastName}` : 'none'}</p>
      <p>Consent: {consent ? 'given' : 'none'}</p>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => saveProfile(testProfile)}>Save profile</button>
      <button onClick={giveConsent}>Give consent</button>
    </div>
  )
}

describe('AuthContext', () => {
  it('throws when useAuth is used outside a provider', () => {
    // Swallow the expected console.error React logs for the thrown-during-render case.
    const Broken = () => {
      useAuth()
      return null
    }
    expect(() => render(<Broken />)).toThrow('useAuth must be used within an AuthProvider')
  })

  it('starts logged out with no profile or consent', () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    expect(screen.getByText('Authenticated: false')).toBeInTheDocument()
    expect(screen.getByText('Profile: none')).toBeInTheDocument()
    expect(screen.getByText('Consent: none')).toBeInTheDocument()
  })

  it('logs in, saves a profile, and gives consent', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await user.click(screen.getByText('Login'))
    expect(screen.getByText('Authenticated: true')).toBeInTheDocument()

    await user.click(screen.getByText('Save profile'))
    expect(screen.getByText('Profile: Ada Lovelace')).toBeInTheDocument()

    await user.click(screen.getByText('Give consent'))
    expect(screen.getByText('Consent: given')).toBeInTheDocument()
  })

  it('clears everything on logout', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await user.click(screen.getByText('Login'))
    await user.click(screen.getByText('Save profile'))
    await user.click(screen.getByText('Give consent'))
    await user.click(screen.getByText('Logout'))
    expect(screen.getByText('Authenticated: false')).toBeInTheDocument()
    expect(screen.getByText('Profile: none')).toBeInTheDocument()
    expect(screen.getByText('Consent: none')).toBeInTheDocument()
  })
})
