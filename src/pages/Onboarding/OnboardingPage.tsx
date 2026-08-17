import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Field } from '@/components/atoms/Field'
import { Select } from '@/components/atoms/Select'
import { Button } from '@/components/atoms/Button'
import { OnboardingLayout } from '../OnboardingLayout'
import { cascadeDelay } from '../cascade'
import styles from './OnboardingPage.module.css'

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

/**
 * Registration — step 1 of the onboarding flow, reached from Setting Up. Just three
 * fields, as specified: first name, last name, and date of birth — the last one split
 * into month (a select), day, and year (plain fields) rather than a single native date
 * input. Each field group gets its own section title ("What's your name?" / "When were
 * you born?"), styled with docs/design.md's `headline-5-semibold` — a tier added to the
 * type scale specifically for this (see typography.ts), since headline-4 and even
 * paragraph-4 both read as too large for a subsection prompt this compact. First name
 * pre-fills from the name given on Legal Intro's "How
 * should we call you?" field, still fully editable here. Every field on this form is
 * required, so the usual per-field asterisk is suppressed (`hideRequiredMark`) — with
 * nothing optional to contrast against, it wouldn't tell the visitor anything. Fields
 * cascade in the same rhythm as Terms of Use / Privacy Policy / Consent — see
 * src/pages/cascade.ts.
 */
export function OnboardingPage() {
  const { saveProfile, preferredName } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState(() => preferredName ?? '')
  const [lastName, setLastName] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [year, setYear] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!month) return
    const dateOfBirth = `${year}-${month}-${day.padStart(2, '0')}`
    saveProfile({ firstName, lastName, dateOfBirth })
    navigate('/dashboard')
  }

  return (
    <OnboardingLayout step={1} title="Tell us about yourself">
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
          <h2 className={styles.sectionTitle}>What&apos;s your name?</h2>
          <div className={styles.nameRow}>
            <Field
              label="First name"
              required
              hideRequiredMark
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Field
              label="Last name"
              required
              hideRequiredMark
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <fieldset
          className={[styles.dobFieldset, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(1) }}
        >
          <legend className={styles.sectionTitle}>When were you born?</legend>
          <div className={styles.dobRow}>
            <Select
              label="Month"
              required
              hideRequiredMark
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="" hidden>
                Choose one
              </option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
            <Field
              label="Day"
              type="number"
              min={1}
              max={31}
              required
              hideRequiredMark
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
            <Field
              label="Year"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              required
              hideRequiredMark
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </fieldset>

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
