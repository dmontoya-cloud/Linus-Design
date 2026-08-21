import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, type EducationLevel, type Gender, type SexAssignedAtBirth } from '@/auth'
import { Select } from '@/components/atoms/Select'
import { Button } from '@/components/atoms/Button'
import { OnboardingLayout } from '../OnboardingLayout'
import { cascadeDelay } from '../cascade'
import styles from './EducationPage.module.css'

const EDUCATION_OPTIONS: Array<{ value: EducationLevel; label: string }> = [
  { value: 'none', label: 'None / Not in school' },
  { value: 'elementary-school', label: 'Elementary School (Grades 1–5)' },
  { value: 'middle-school', label: 'Middle School (Grades 6–8)' },
  { value: 'high-school', label: 'High School (Grades 9-11)' },
  { value: 'high-school-graduate', label: 'High School Graduate/GED' },
  { value: 'some-college', label: 'Some College' },
  { value: 'bachelors-degree', label: "Bachelor's Degree" },
  { value: 'some-graduate-education', label: 'Some Graduate Education' },
  { value: 'masters-degree', label: "Master's Degree" },
  { value: 'doctoral-degree', label: 'Doctoral Degree' },
]

/** Everything Registration and Gender & Identity collected together, carried forward in
 * router state rather than saved to AuthContext piecemeal — this page saves the whole
 * Profile at once. */
interface PriorState {
  firstName: string
  lastName: string
  dateOfBirth: string
  /** Optional — left `''` if the visitor didn't answer on Gender & Identity. */
  gender: Gender | ''
  sexAssignedAtBirth: SexAssignedAtBirth
}

/**
 * Education — step 3 of the onboarding flow, reached from Gender & Identity, the last
 * form before Loading hands off to Dashboard. A single field, education level, used the
 * same way date of birth and sex assigned at birth are: to place results in the right
 * comparison group, not to change how the visitor is addressed. This is the page that
 * actually calls `saveProfile`, combining this answer with everything Registration and
 * Gender & Identity passed along in router state. The form has `noValidate`, and the
 * select uses its own documented `field-error` variant (border-danger border, red helper
 * text below) if Continue is clicked while it's still on "Please choose" — rather than the
 * browser's native "Please select an item in the list." bubble — matching the same
 * treatment already used on Gender & Identity's two dropdowns. The select sits in its own
 * `min-height` slot so that message doesn't push Continue down when it appears.
 */
export function EducationPage() {
  const { saveProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const prior = location.state as PriorState | null
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>('')
  const [showValidation, setShowValidation] = useState(false)

  const educationInvalid = showValidation && !educationLevel

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!prior || !educationLevel) {
      setShowValidation(true)
      return
    }
    saveProfile({ ...prior, educationLevel })
    navigate('/loading')
  }

  return (
    <OnboardingLayout
      step={3}
      title="Which best describes your educational background?"
      subtitle="Education gives helpful context for your results. It is part of how we choose the right norms."
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
          <div className={styles.selectSlot}>
            <Select
              label="Education background"
              required
              hideRequiredMark
              error={educationInvalid}
              helperText={educationInvalid ? 'Please select an education background.' : undefined}
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
            >
              <option value="" hidden>
                Please choose
              </option>
              {EDUCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className={[styles.submit, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(1) }}
        >
          Continue
        </Button>
      </form>
    </OnboardingLayout>
  )
}
