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

/** Strips anything that isn't a letter, space, hyphen, or apostrophe — letters only, not
 * ASCII-only, so accented names (e.g. "José", "Renée") still type normally; hyphen and
 * apostrophe stay allowed since real names commonly use them (e.g. "Anne-Marie",
 * "O'Brien"). Applied on every change, so pasting a number/symbol is blocked too, not just
 * typing one. */
function sanitizeName(value: string): string {
  return value.replace(/[^\p{L}\s'-]/gu, '')
}

/** True on or after the person's `birthYear`-th birthday, given today's date — used to
 * enforce the 18+ eligibility requirement against the date of birth entered below. */
function isAtLeastAge(
  minimumAge: number,
  birthYear: number,
  birthMonth: number,
  birthDay: number,
): boolean {
  const today = new Date()
  const cutoff = new Date(birthYear + minimumAge, birthMonth - 1, birthDay)
  return today >= cutoff
}

/**
 * Registration — step 1 of the onboarding flow, reached from Setting Up. Just three
 * fields, as specified: first name, last name, and date of birth — the last one split
 * into month (a select), day, and year (plain fields) rather than a single native date
 * input. Each field group gets its own section title ("What's your name?" / "When were
 * you born?"), styled with docs/design.md's `headline-5-semibold` — a tier added to the
 * type scale specifically for this (see typography.ts), since headline-4 and even
 * paragraph-4 both read as too large for a subsection prompt this compact. First name
 * pre-fills from the name given on Legal Intro's "How
 * should we call you?" field, still fully editable here. Both name fields strip digits and
 * symbols as you type (`sanitizeName`) — letters (including accented ones), spaces,
 * hyphens, and apostrophes are all that's allowed, since real names commonly use the
 * latter two ("Anne-Marie", "O'Brien"). Every field on this form is
 * required, so the usual per-field asterisk is suppressed (`hideRequiredMark`) — with
 * nothing optional to contrast against, it wouldn't tell the visitor anything. Fields
 * cascade in the same rhythm as Terms of Use / Privacy Policy — see
 * src/pages/cascade.ts. Doesn't call `saveProfile` itself — these fields ride along in
 * router state to Education, then Gender & Identity, which collects the rest of the
 * Profile and saves it all at once. The age-18+ attestation lives on Login instead, right
 * after the email
 * field — but since this page is where an actual date of birth gets entered, it's also
 * where that attestation gets checked for real: submitting a date of birth under 18
 * years old shows a `content-danger` message below the date-of-birth fields (the fields
 * themselves stay neutral, same quiet treatment as Login's age checkbox) instead of
 * silently proceeding. That message sits in its own `min-height` slot so it doesn't
 * push the Continue button down when it appears. Every field on this form shows its own
 * `field-error` variant (border-danger border, red helper text) if left empty when
 * Continue is clicked — First name/Last name/Month/Day/Year each get a "Please
 * enter/select a ___." message. Day and Year additionally carry a live range check that
 * isn't gated behind a submit attempt at all — a day above 31 or a year at or below 1910 is
 * never valid, so that particular message shows the moment it's typed, before the "missing"
 * message would ever apply (once something's been typed, it's no longer empty). Every field
 * sits in its own `min-height` slot so none of these messages ever push the rest of the form
 * down when they appear. The form has `noValidate` so the browser's own native validation
 * bubble (e.g. "Please fill out this field" / "Please select an item in the list") never
 * preempts any of these custom error states — `handleSubmit` re-checks names and
 * date-of-birth completeness itself before navigating, doing in JS what the removed native
 * `required` gate used to do.
 */
export function OnboardingPage() {
  const { preferredName } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState(() => preferredName ?? '')
  const [lastName, setLastName] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [year, setYear] = useState('')
  const [showValidation, setShowValidation] = useState(false)

  const namesComplete = Boolean(firstName.trim()) && Boolean(lastName.trim())
  const yearComplete = year.length === 4
  const dobComplete = Boolean(month) && Boolean(day) && yearComplete
  const firstNameInvalid = showValidation && !firstName.trim()
  const lastNameInvalid = showValidation && !lastName.trim()
  const monthInvalid = showValidation && !month
  const underageInvalid =
    showValidation && dobComplete && !isAtLeastAge(18, Number(year), Number(month), Number(day))
  // Live, not gated behind a submit attempt — a day above 31 is never valid, regardless of
  // whether the rest of the form has been touched yet. Missing (as opposed to out-of-range)
  // is still gated behind showValidation, same as every other "you skipped this" message.
  const dayTooHigh = Boolean(day) && Number(day) > 31
  const dayMissing = showValidation && !day
  const dayInvalid = dayTooHigh || dayMissing
  const dayHelperText = dayTooHigh
    ? 'Value must be equal or less than 31.'
    : dayMissing
      ? 'Please enter a day.'
      : undefined
  // Waits for all four digits before judging the year — otherwise typing "1995" would flash
  // an error after just the "1" (1 <= 1910), before the visitor has finished typing.
  const yearTooLow = yearComplete && Number(year) <= 1910
  const yearMissing = showValidation && !year
  const yearInvalid = yearTooLow || yearMissing
  const yearHelperText = yearTooLow
    ? 'Value must be higher than 1910.'
    : yearMissing
      ? 'Please enter a year.'
      : undefined

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!namesComplete || !dobComplete || dayInvalid || yearInvalid) {
      setShowValidation(true)
      return
    }
    if (!isAtLeastAge(18, Number(year), Number(month), Number(day))) {
      setShowValidation(true)
      return
    }
    const dateOfBirth = `${year}-${month}-${day.padStart(2, '0')}`
    navigate('/education', { state: { firstName, lastName, dateOfBirth } })
  }

  return (
    <OnboardingLayout step={1} title="Tell us about yourself">
      <p className={styles.description}>
        We use these details about you to help understand and analyze your answers.
      </p>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }}>
          <h2 className={styles.sectionTitle}>What&apos;s your name?</h2>
          <div className={styles.nameRow}>
            <div className={styles.nameFieldSlot}>
              <Field
                label="First name"
                required
                hideRequiredMark
                error={firstNameInvalid}
                helperText={firstNameInvalid ? 'Please enter a first name.' : undefined}
                value={firstName}
                onChange={(e) => setFirstName(sanitizeName(e.target.value))}
              />
            </div>
            <div className={styles.nameFieldSlot}>
              <Field
                label="Last name"
                required
                hideRequiredMark
                error={lastNameInvalid}
                helperText={lastNameInvalid ? 'Please enter a last name.' : undefined}
                value={lastName}
                onChange={(e) => setLastName(sanitizeName(e.target.value))}
              />
            </div>
          </div>
        </div>

        <fieldset
          className={[styles.dobFieldset, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(1) }}
          aria-describedby={underageInvalid ? 'dob-error' : undefined}
        >
          <legend className={styles.sectionTitle}>When were you born?</legend>
          <div className={styles.dobRow}>
            <div className={styles.monthFieldSlot}>
              <Select
                label="Month"
                required
                hideRequiredMark
                error={monthInvalid}
                helperText={monthInvalid ? 'Please select a month.' : undefined}
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
            </div>
            <div className={styles.dayFieldSlot}>
              <Field
                label="Day"
                type="number"
                min={1}
                max={31}
                required
                hideRequiredMark
                error={dayInvalid}
                helperText={dayHelperText}
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </div>
            <div className={styles.yearFieldSlot}>
              <Field
                label="Year"
                type="number"
                min={1911}
                max={new Date().getFullYear()}
                required
                hideRequiredMark
                error={yearInvalid}
                helperText={yearHelperText}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.dobErrorSlot}>
            {underageInvalid ? (
              <p id="dob-error" className={styles.dobError}>
                You must be over eighteen years old to use Linus Health.
              </p>
            ) : null}
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
