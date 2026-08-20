import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ThemeProvider } from '@/tokens'
import { Toast } from './Toast'

const meta = {
  title: 'Atoms/Toast',
  component: Toast,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'padded' },
  args: { onClose: fn(), title: 'Success', message: 'Success message' },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Success: Story = {
  args: { variant: 'success', title: 'Success', message: 'Success message' },
}
export const Warning: Story = {
  args: { variant: 'warning', title: 'Warning', message: 'Warning message' },
}
export const Information: Story = {
  args: { variant: 'info', title: 'Information', message: 'Information message' },
}
export const Error: Story = {
  args: { variant: 'error', title: 'Error', message: 'Error message' },
}
export const Neutral: Story = {
  args: { variant: 'neutral', title: 'Custom message', message: 'Custom message' },
}

/** Every variant stacked together, the same way a design-system reference page shows them. */
export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
      <Toast {...args} variant="success" title="Success" message="Success message" />
      <Toast {...args} variant="warning" title="Warning" message="Warning message" />
      <Toast {...args} variant="info" title="Information" message="Information message" />
      <Toast {...args} variant="error" title="Error" message="Error message" />
      <Toast {...args} variant="neutral" title="Custom message" message="Custom message" />
    </div>
  ),
}
