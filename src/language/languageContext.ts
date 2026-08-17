import { createContext } from 'react'

export type Language = 'en' | 'es'

export interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
}

export const LanguageContext = createContext<LanguageState | undefined>(undefined)
