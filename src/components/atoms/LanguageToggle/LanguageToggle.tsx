import type { Language } from '@/language'
import styles from './LanguageToggle.module.css'

export interface LanguageToggleProps {
  value: Language
  onChange: (language: Language) => void
  className?: string
}

const OPTIONS: Array<{ value: Language; label: string; name: string }> = [
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'es', label: 'ES', name: 'Español' },
]

/**
 * Atom/LanguageToggle — a plain two-option segmented control: a pill-shaped
 * `borderSubtle` thumb sits behind whichever option is selected and slides
 * to the other side on change (`motion.duration-base` + `motion.easing-
 * standard`, the same recipe docs/design.md calls out for "the toggle thumb
 * sliding"), matching the reference toggle's "14 / 16" look.
 */
export function LanguageToggle({ value, onChange, className }: LanguageToggleProps) {
  const activeIndex = OPTIONS.findIndex((option) => option.value === value)
  return (
    <div
      className={[styles.group, className].filter(Boolean).join(' ')}
      role="group"
      aria-label="Language"
    >
      <div
        className={styles.thumb}
        aria-hidden="true"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={[styles.option, value === option.value && styles.active]
            .filter(Boolean)
            .join(' ')}
          aria-pressed={value === option.value}
          aria-label={option.name}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
