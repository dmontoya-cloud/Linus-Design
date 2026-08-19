import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, type EducationLevel, type Gender, type SexAssignedAtBirth } from '@/auth'
import { Select } from '@/components/atoms/Select'
import { Button } from '@/components/atoms/Button'
import { OnboardingLayout } from '../OnboardingLayout'
import { cascadeDelay } from '../cascade'
import styles from './EducationPage.module.css'

const EDUCATION_OPTIONS: Array<{ value: EducationLevel; label: string }> = [
  { value: 'less-than-high-school', label: 'Less than high school' },
  { value: 'high-school', label: 'High school diploma or GED' },
  { value: 'some-college', label: 'Some college' },
  { value: 'associate-degree', label: 'Associate degree' },
  { value: 'bachelors-degree', label: "Bachelor's degree" },
  { value: 'graduate-degree', label: 'Graduate or professional degree' },
]

/** Everything Registration and Gender & Identity collected together, carried forward in
 * router state rather than saved to AuthContext piecemeal — this page saves the whole
 * Profile at once. */
interface PriorState {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: Gender
  sexAssignedAtBirth: SexAssignedAtBirth
}

/**
 * Education — step 3 of the onboarding flow, reached from Gender & Identity, the last
 * form before Loading hands off to Dashboard. A single field, education level, used the
 * same way date of birth and sex assigned at birth are: to place results in the right
 * comparison group, not to change how the visitor is addressed. This is the page that
 * actually calls `saveProfile`, combining this answer with everything Registration and
 * Gender & Identity passed along in router state.
 */
export function EducationPage() {
  const { saveProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const prior = location.state as PriorState | null
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!prior || !educationLevel) return
    saveProfile({ ...prior, educationLevel })
    navigate('/loading')
  }

  return (
    <OnboardingLayout
      step={3}
      title="Which best describes your educational background?"
      subtitle="Education gives helpful context for your results. It is part of how we choose the right norms."
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
          <Select
            label="Education background"
            required
            hideRequiredMark
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
