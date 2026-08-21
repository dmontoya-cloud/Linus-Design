import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { ClockIcon } from './ClockIcon'

const meta = {
  title: 'Atoms/Icon/Clock',
  component: ClockIcon,
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
} satisfies Meta<typeof ClockIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
