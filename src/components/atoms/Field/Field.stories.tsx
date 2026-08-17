import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { Field } from './Field'

const meta = {
  title: 'Atoms/Field',
  component: Field,
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
  args: { label: 'Email address' },
  argTypes: {
    size: { control: 'select', options: ['lg', 'md', 'sm'] },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Required: Story = { args: { required: true } }
export const WithValue: Story = { args: { defaultValue: 'david@example.com' } }
export const Error: Story = {
  args: { error: true, defaultValue: 'not-an-email', helperText: 'Enter a valid email address' },
}
export const Disabled: Story = { args: { disabled: true } }
export const DateOfBirth: Story = { args: { label: 'Date of birth', type: 'date' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
