import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, type Gender, type SexAssignedAtBirth } from '@/auth'
import { Select } from '@/components/atoms/Select'
import { Button } from '@/components/atoms/Button'
import { OnboardingLayout } from '../OnboardingLayout'
import { cascadeDelay } from '../cascade'
import styles from './GenderIdentityPage.module.css'

const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

/** What Registration collected, carried forward in router state rather than saved to
 * AuthContext piecemeal — this page saves the whole Profile at once. */
interface RegistrationState {
  firstName: string
  lastName: string
  dateOfBirth: string
}

/**
 * Gender & Identity — step 2 of the onboarding flow, reached from Registration. Two
 * field groups, each with its own section title matching Registration's pattern: "How do
 * you identify?" (a gender select) and "What sex were you assigned at birth?" (female or
 * male only — a distinct question from gender, not a duplicate of it). This is the page
 * that actually calls `saveProfile`, combining these answers with the first
 * name/last name/date of birth Registration passed along in router state.
 */
export function GenderIdentityPage() {
  const { saveProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const registration = (location.state as RegistrationState | null) ?? {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  }
  const [gender, setGender] = useState<Gender | ''>('')
  const [sexAssignedAtBirth, setSexAssignedAtBirth] = useState<SexAssignedAtBirth | ''>('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!gender || !sexAssignedAtBirth) return
    saveProfile({ ...registration, gender, sexAssignedAtBirth })
    navigate('/dashboard')
  }

  return (
    <OnboardingLayout step={2} title="A bit more about you">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
          <h2 className={styles.sectionTitle}>How do you identify?</h2>
          <Select
            label="Gender"
            required
            hideRequiredMark
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            <option value="" hidden>
              Choose one
            </option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
          <h2 className={styles.sectionTitle}>What sex were you assigned at birth?</h2>
          <Select
            label="Sex assigned at birth"
            required
            hideRequiredMark
            value={sexAssignedAtBirth}
            onChange={(e) => setSexAssignedAtBirth(e.target.value as SexAssignedAtBirth)}
          >
            <option value="" hidden>
              Choose one
            </option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </Select>
        </div>

        <Button
          type="submit"
          size="lg"
          className={[styles.submit, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(2) }}
        >
          Continue
        </Button>
      </form>
    </OnboardingLayout>
  )
}
