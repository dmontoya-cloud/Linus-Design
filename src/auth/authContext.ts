import { createContext } from 'react'

export type Gender = 'female' | 'male' | 'non-binary' | 'prefer-not-to-say'

export type SexAssignedAtBirth = 'female' | 'male' | 'intersex'

export type EducationLevel =
  | 'none'
  | 'elementary-school'
  | 'middle-school'
  | 'high-school'
  | 'high-school-graduate'
  | 'some-college'
  | 'bachelors-degree'
  | 'some-graduate-education'
  | 'masters-degree'
  | 'doctoral-degree'

export interface Profile {
  firstName: string
  lastName: string
  /** ISO yyyy-mm-dd, built from the separate month/day/year fields on Registration. */
  dateOfBirth: string
  /** Optional — left `''` if the visitor didn't answer on Gender & Identity. Unlike sex
   * assigned at birth, gender isn't used to place results in a comparison group, so there's
   * nothing that requires an answer here. */
  gender: Gender | ''
  sexAssignedAtBirth: SexAssignedAtBirth
  educationLevel: EducationLevel
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
  /** Activity ids (matching `ActivityCard`'s `Activity.id`/`FullCheckInCard`'s `CATEGORIES`)
   * the visitor has finished — this mock-data prototype has no real assessment flow yet to
   * actually complete one, so the only way in today is `BuildingReportPage`'s "Go to Dashboard"
   * button standing in for "you just finished a real assessment." */
  completedActivityIds: string[]
  /** Whether the visitor has actually finished a report download since the last newly
   * completed activity — on request, distinct from `completedActivityIds`, so Dashboard's
   * `FullCheckInCard` can stop offering "Build my report" once they've already done so, and
   * only offer it again once there's fresh, not-yet-built progress. Set by `ReportPage`'s
   * Download button (the actual "build report AND download it" action); reset back to `false`
   * by `completeActivity` any time a genuinely new activity finishes, since a report already
   * downloaded no longer reflects the full picture once something new is done — including via
   * `ReportReadyPage`'s "Go to Dashboard", which is the one path this stays `false` on request. */
  hasBuiltReport: boolean
  login: () => void
  logout: () => void
  setPreferredName: (name: string) => void
  saveProfile: (profile: Profile) => void
  giveConsent: () => void
  completeActivity: (id: string) => void
  markReportBuilt: () => void
}

export const AuthContext = createContext<AuthState | undefined>(undefined)
