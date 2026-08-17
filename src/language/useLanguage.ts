import { useContext } from 'react'
import { LanguageContext, type LanguageState } from './languageContext'

export function useLanguage(): LanguageState {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
