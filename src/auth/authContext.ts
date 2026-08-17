import { createContext } from 'react'

export type Gender = 'female' | 'male' | 'non-binary' | 'prefer-not-to-say'

export type SexAssignedAtBirth = 'female' | 'male'

export interface Profile {
  firstName: string
  lastName: string
  /** ISO yyyy-mm-dd, built from the separate month/day/year fields on Registration. */
  dateOfBirth: string
  gender: Gender
  sexAssignedAtBirth: SexAssignedAtBirth
}

export interface ConsentRecord {
  /** ISO timestamp. */
  acceptedAt: string
}

export interface AuthState {
  isAuthenticated: boolean
  /** What the visitor asked to be called on Legal Intro's "How should we call you?" field —
   * carried forward to pre-fill Registration's first name, still fully editable there. */
  preferredName: string | null
  profile: Profile | null
  consent: ConsentRecord | null
  login: () => void
  logout: () => void
  setPreferredName: (name: string) => void
  saveProfile: (profile: Profile) => void
  giveConsent: () => void
}

export const AuthContext = createContext<AuthState | undefined>(undefined)
