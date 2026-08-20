import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Gender, SexAssignedAtBirth } from '@/auth'
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
 * Gender & Identity — step 2 of the onboarding flow, reached from Registration. A
 * subtitle right below the title explains why sex assigned at birth is asked for at all
 * ("Your results are compared with norms based on biology..."), before the two field
 * groups, each with its own section title matching Registration's pattern: "How do you
 * identify?" (a gender select) and "What sex were you assigned at birth?" (female, male,
 * or intersex — a distinct question from gender, not a duplicate of it). Choosing Male or
 * Female for gender auto-fills the matching value below (still editable) and shows a note
 * explaining why — Non-binary and Prefer not to say have no corresponding
 * sex-assigned-at-birth value, so neither auto-fills anything nor shows the note. Gender
 * itself is optional (its placeholder says so — "Choose one - Optional") and never gates
 * Continue or shows an error; sex assigned at birth is still required, since it's the value
 * results are actually compared against. Doesn't call `saveProfile` itself — these answers
 * ride along in router state to Education, which collects the last piece (education level)
 * and saves the whole Profile at once. The form has `noValidate`, and the sex-assigned
 * dropdown uses `Select`'s own documented `field-error` variant (border-danger border, red
 * helper text) if Continue is clicked while it's still on "Choose one" — rather than the
 * browser's native "Please select an item in the list." bubble. It sits in its own
 * `min-height` slot so that message doesn't push the rest of the form down when it appears.
 */
export function GenderIdentityPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const registration = (location.state as RegistrationState | null) ?? {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  }
  const [gender, setGender] = useState<Gender | ''>('')
  const [sexAssignedAtBirth, setSexAssignedAtBirth] = useState<SexAssignedAtBirth | ''>('')
  const [showValidation, setShowValidation] = useState(false)

  const sexInvalid = showValidation && !sexAssignedAtBirth

  /** Only Male and Female have a directly corresponding sex-assigned-at-birth value —
   * Non-binary and Prefer not to say don't imply one, so they leave the field as the
   * visitor's own separate choice instead of guessing at it. */
  function handleGenderChange(value: Gender) {
    setGender(value)
    if (value === 'male' || value === 'female') {
      setSexAssignedAtBirth(value)
    }
  }

  const prefilledSex = gender === 'male' || gender === 'female' ? gender : null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!sexAssignedAtBirth) {
      setShowValidation(true)
      return
    }
    navigate('/education', { state: { ...registration, gender, sexAssignedAtBirth } })
  }

  return (
    <OnboardingLayout
      step={2}
      title="A bit more about you"
      subtitle="Your results are compared with norms based on biology. This helps us use the right ones."
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
          <h2 className={styles.sectionTitle}>How do you identify?</h2>
          <Select
            label="Gender"
            value={gender}
            onChange={(e) => handleGenderChange(e.target.value as Gender)}
          >
            <option value="" hidden>
              Choose one - Optional
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
          <div className={styles.selectSlot}>
            <Select
              label="Sex assigned at birth"
              required
              hideRequiredMark
              error={sexInvalid}
              helperText={sexInvalid ? 'Please select a sex assigned at birth.' : undefined}
              value={sexAssignedAtBirth}
              onChange={(e) => setSexAssignedAtBirth(e.target.value as SexAssignedAtBirth)}
            >
              <option value="" hidden>
                Choose one
              </option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="intersex">Intersex</option>
            </Select>
          </div>
          {prefilledSex ? (
            <div className={styles.prefillNote}>
              <p className={styles.prefillNoteTitle}>We filled this in from your last answer</p>
              <p className={styles.prefillNoteBody}>
                We selected {prefilledSex === 'male' ? 'Male' : 'Female'} from your last answer.
                Please change it if that is not right. This places your results against the right
                biology-based norms. It does not change how we speak to you here.
              </p>
            </div>
          ) : null}
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
