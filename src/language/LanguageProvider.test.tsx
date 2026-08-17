import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from './LanguageProvider'
import { useLanguage } from './useLanguage'

function Consumer() {
  const { language, setLanguage } = useLanguage()
  return (
    <div>
      <p>Language: {language}</p>
      <button onClick={() => setLanguage('es')}>Switch to Spanish</button>
      <button onClick={() => setLanguage('en')}>Switch to English</button>
    </div>
  )
}

describe('LanguageContext', () => {
  it('throws when useLanguage is used outside a provider', () => {
    const Broken = () => {
      useLanguage()
      return null
    }
    expect(() => render(<Broken />)).toThrow('useLanguage must be used within a LanguageProvider')
  })

  it('defaults to English', () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>,
    )
    expect(screen.getByText('Language: en')).toBeInTheDocument()
  })

  it('switches language and back', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>,
    )
    await user.click(screen.getByText('Switch to Spanish'))
    expect(screen.getByText('Language: es')).toBeInTheDocument()

    await user.click(screen.getByText('Switch to English'))
    expect(screen.getByText('Language: en')).toBeInTheDocument()
  })
})
