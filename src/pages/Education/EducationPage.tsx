import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { EducationLevel } from '@/auth'
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

/** What Registration collected, carried forward in router state rather than saved to
 * AuthContext piecemeal — Gender & Identity, now the last step, saves the whole Profile
 * at once. */
interface RegistrationState {
  firstName: string
  lastName: string
  dateOfBirth: string
}

/**
 * Education — step 2 of the onboarding flow, reached from Registration. A single field,
 * education level, used the same way date of birth and sex assigned at birth are: to
 * place results in the right comparison group, not to change how the visitor is
 * addressed. Doesn't call `saveProfile` itself — this answer rides along in router state
 * to Gender & Identity, which collects the last pieces (gender, sex assigned at birth) and
 * saves the whole Profile at once. Ordered before Gender & Identity rather than after, on
 * request — sex assigned at birth is the more sensitive of the two questions, so it now
 * sits last in the flow rather than in the middle. The form has `noValidate`, and the
 * select uses its own documented `field-error` variant (border-danger border, red helper
 * text below) if Continue is clicked while it's still on "Please choose" — rather than the
 * browser's native "Please select an item in the list." bubble — matching the same
 * treatment used on Gender & Identity's two dropdowns. The select sits in its own
 * `min-height` slot so that message doesn't push Continue down when it appears.
 */
export function EducationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const registration = (location.state as RegistrationState | null) ?? {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  }
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>('')
  const [showValidation, setShowValidation] = useState(false)

  const educationInvalid = showValidation && !educationLevel

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!educationLevel) {
      setShowValidation(true)
      return
    }
    navigate('/gender-identity', { state: { ...registration, educationLevel } })
  }

  return (
    <OnboardingLayout
      step={2}
      title="Which best describes your educational background?"
      subtitle="These details help us understand your answers using the right reference information."
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
