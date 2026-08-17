import type { ReactNode } from 'react'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { Logo } from '@/components/atoms/Logo'
import { LanguageToggle } from '@/components/atoms/LanguageToggle'
import { useLanguage } from '@/language'
import styles from './LegalLayout.module.css'

/** Terms of Use, Privacy Policy, then Consent — one 3-step progress, distinct
 * from OnboardingLayout's later steps, since these are legal-agreement steps
 * that happen before registration, not part of "the process" itself. */
export const LEGAL_TOTAL_STEPS = 3

interface LegalLayoutProps {
  /** 0 renders the progress bar empty — used by the Legal Intro heads-up, which
   * comes before step 1 but still previews the 3-step journey ahead. */
  step: number
  title: string
  subtitle: string
  children: ReactNode
  /** Extra class on the `<h1>`, e.g. for Legal Intro's fade-in entrance — doesn't affect
   * Terms/Privacy/Consent, which don't pass it. */
  titleClassName?: string
  /** Extra class on the subtitle `<p>`, same purpose as `titleClassName`. */
  subtitleClassName?: string
}

/** Shared chrome for the Legal Intro / Terms of Use / Privacy Policy / Consent
 * flow: logo (its own asset already carries the "by Linus Health" byline, so
 * no separate tagline here), an EN/ES language toggle, a 3-step progress bar
 * sitting right below the header (visual only — the step count is still
 * announced to screen readers via ProgressBar's own `label`/`aria-label`,
 * just no longer shown as text), and a title/subtitle pair. */
export function LegalLayout({
  step,
  title,
  subtitle,
  children,
  titleClassName,
  subtitleClassName,
}: LegalLayoutProps) {
  const label = `Step ${step} of ${LEGAL_TOTAL_STEPS} · ${title}`
  const { language, setLanguage } = useLanguage()
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Logo className={styles.logo} />
        <LanguageToggle value={language} onChange={setLanguage} />
      </header>
      <div className={styles.progressSection}>
        <ProgressBar value={step} max={LEGAL_TOTAL_STEPS} label={label} />
      </div>
      <div className={styles.content}>
        <h1 className={[styles.title, titleClassName].filter(Boolean).join(' ')}>{title}</h1>
        <p className={[styles.subtitle, subtitleClassName].filter(Boolean).join(' ')}>{subtitle}</p>
        {children}
      </div>
    </main>
  )
}
