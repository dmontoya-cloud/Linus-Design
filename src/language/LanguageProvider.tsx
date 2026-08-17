import { useMemo, useState, type ReactNode } from 'react'
import { LanguageContext, type Language, type LanguageState } from './languageContext'

/**
 * Mock language preference, held in memory only — this repo is mock-data-only, so
 * switching languages just flips which UI copy renders. Nothing persists across a reload.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  const value = useMemo<LanguageState>(() => ({ language, setLanguage }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
