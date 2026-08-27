import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { CheckCircleIcon } from './CheckCircleIcon'

const meta = {
  title: 'Atoms/Icon/CheckCircle',
  component: CheckCircleIcon,
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
} satisfies Meta<typeof CheckCircleIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
