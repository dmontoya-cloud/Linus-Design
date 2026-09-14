import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, type EducationLevel, type Gender, type SexAssignedAtBirth } from '@/auth'
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

/** Everything Registration and Education collected together, carried forward in router
 * state rather than saved to AuthContext piecemeal — this page saves the whole Profile at
 * once. */
interface PriorState {
  firstName: string
  lastName: string
  dateOfBirth: string
  educationLevel: EducationLevel
}

/**
 * Gender & Identity — step 3 of the onboarding flow, reached from Education, the last
 * form before Loading hands off to Dashboard. Sex now leads (on request, flipping the
 * previous Gender-then-Sex order) since it's the required, results-determining field —
 * just a single labeled `Select` ("Select your sex", no separate section title above it,
 * matching the reference), followed by the Gender select — no section heading or
 * explanatory note above it either, on request, just the `Select`'s own "Gender" label and
 * plain "Choose one" placeholder. The two fields no longer interact at all, on request —
 * selecting a gender used to auto-fill the matching sex value and show a note explaining
 * why; that auto-fill is gone, and the note itself was later removed too, on request, once
 * dropping the section heading and note left only the plain `Select` behind. Gender stays
 * optional and never gates Continue; sex is still required, since it's the value results are
 * actually compared against. This is the page that actually calls `saveProfile`,
 * combining these answers with everything Registration and Education passed along in
 * router state. The form has `noValidate`, and the sex dropdown uses `Select`'s own
 * documented `field-error` variant (border-danger border, red helper text) if Continue is
 * clicked while it's still on "Choose one" — rather than the browser's native "Please
 * select an item in the list." bubble. It sits in its own `min-height` slot so that
 * message doesn't push the rest of the form down when it appears.
 */
export function GenderIdentityPage() {
  const { saveProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const prior = location.state as PriorState | null
  const [gender, setGender] = useState<Gender | ''>('')
  const [sexAssignedAtBirth, setSexAssignedAtBirth] = useState<SexAssignedAtBirth | ''>('')
  const [showValidation, setShowValidation] = useState(false)

  const sexInvalid = showValidation && !sexAssignedAtBirth

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!prior || !sexAssignedAtBirth) {
      setShowValidation(true)
      return
    }
    saveProfile({ ...prior, gender, sexAssignedAtBirth })
    navigate('/loading')
  }

  return (
    <OnboardingLayout
      step={3}
      title="A few more details"
      subtitle="These details help us understand your answers using the right reference information."
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
          <div className={styles.selectSlot}>
            <Select
              label="Select your sex"
              required
              hideRequiredMark
              error={sexInvalid}
              helperText={sexInvalid ? 'Please select a sex.' : undefined}
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
        </div>

        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
          <Select
            label="Gender (Optional)"
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
