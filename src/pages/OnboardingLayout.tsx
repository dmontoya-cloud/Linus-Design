import type { ReactNode } from 'react'
import { ProgressBar } from '@/components/atoms/ProgressBar'
import { Logo } from '@/components/atoms/Logo'
import { LanguageToggle } from '@/components/atoms/LanguageToggle'
import { useLanguage } from '@/language'
import styles from './OnboardingLayout.module.css'

/** Total steps in the intended flow — Registration, Assessment, Report. Login, Terms of
 * Use, Privacy Policy, and Consent are all part of the pre-registration legal flow and
 * carry LegalLayout's own, separate 3-step progress bar instead of this one. */
export const ONBOARDING_TOTAL_STEPS = 3

interface OnboardingLayoutProps {
  step: number
  title: string
  subtitle?: string
  children: ReactNode
}

/** Shared chrome for every step after Consent — keeps Registration and later Assessment/
 * Report visually consistent, and matches LegalLayout's structure (logo + language toggle
 * header, full-width progress bar right below it, title/subtitle content column) so the
 * whole funnel reads as one continuous design rather than two different layouts stitched
 * together. */
export function OnboardingLayout({ step, title, subtitle, children }: OnboardingLayoutProps) {
  const label = `Step ${step} of ${ONBOARDING_TOTAL_STEPS}: ${title}`
  const { language, setLanguage } = useLanguage()
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Logo className={styles.logo} />
        <LanguageToggle value={language} onChange={setLanguage} />
      </header>
      <div className={styles.progressSection}>
        <ProgressBar value={step} max={ONBOARDING_TOTAL_STEPS} label={label} />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        {children}
      </div>
    </main>
  )
}
