import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { PlayIcon } from './PlayIcon'

const meta = {
  title: 'Atoms/Icon/Play',
  component: PlayIcon,
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
} satisfies Meta<typeof PlayIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
