import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { ArrowRightIcon } from './ArrowRightIcon'

const meta = {
  title: 'Atoms/Icon/ArrowRight',
  component: ArrowRightIcon,
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
} satisfies Meta<typeof ArrowRightIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
