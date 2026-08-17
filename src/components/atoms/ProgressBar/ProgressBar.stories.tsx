import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: 320 }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'centered' },
  args: { value: 1, max: 4, label: 'Step 1 of 4: Registration' },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Step1: Story = {}
export const Step2: Story = { args: { value: 2, label: 'Step 2 of 4: Consent' } }
export const Complete: Story = { args: { value: 4, success: true, label: 'Step 4 of 4: Report' } }
