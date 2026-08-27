import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { SignOutIcon } from './SignOutIcon'

const meta = {
  title: 'Atoms/Icon/SignOut',
  component: SignOutIcon,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: 24, height: 24, color: 'var(--color-text-secondary)' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SignOutIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
