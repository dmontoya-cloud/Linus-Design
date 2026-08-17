import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthState, type Profile, type ConsentRecord } from './authContext'

/**
 * Mock authentication + onboarding state, held in memory only — this repo
 * is mock-data-only (no real backend), so "logging in" just flips a
 * flag and "consenting" just records a timestamp. Nothing persists across
 * a reload.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [preferredName, setPreferredName] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [consent, setConsent] = useState<ConsentRecord | null>(null)

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated,
      preferredName,
      profile,
      consent,
      login: () => setIsAuthenticated(true),
      logout: () => {
        setIsAuthenticated(false)
        setPreferredName(null)
        setProfile(null)
        setConsent(null)
      },
      setPreferredName: (name: string) => setPreferredName(name),
      saveProfile: (nextProfile: Profile) => setProfile(nextProfile),
      giveConsent: () => setConsent({ acceptedAt: new Date().toISOString() }),
    }),
    [isAuthenticated, preferredName, profile, consent],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
