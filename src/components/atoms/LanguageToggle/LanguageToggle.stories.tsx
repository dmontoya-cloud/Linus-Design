import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import type { Language } from '@/language'
import { LanguageToggle } from './LanguageToggle'

function LanguageToggleDemo() {
  const [language, setLanguage] = useState<Language>('en')
  return <LanguageToggle value={language} onChange={setLanguage} />
}

const meta = {
  title: 'Atoms/LanguageToggle',
  component: LanguageToggle,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'centered' },
  args: { value: 'en', onChange: () => {} },
} satisfies Meta<typeof LanguageToggle>

export default meta
type Story = StoryObj<typeof meta>

export const English: Story = {}
export const Spanish: Story = { args: { value: 'es' } }
export const Interactive: Story = {
  render: () => <LanguageToggleDemo />,
}
