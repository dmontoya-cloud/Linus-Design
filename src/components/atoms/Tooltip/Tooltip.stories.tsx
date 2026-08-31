import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { InfoIcon } from '@/components/atoms/Icon'
import { Tooltip } from './Tooltip'
import styles from './Tooltip.stories.module.css'

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '48px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'centered' },
  args: {
    content: 'These tasks measure what you can remember on your own.',
    children: <InfoIcon className={styles.icon} />,
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
