import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { Select } from './Select'

const meta = {
  title: 'Atoms/Select',
  component: Select,
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
  args: {
    label: 'Sex',
    children: (
      <>
        <option value="">Choose one</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="non-binary">Non-binary</option>
        <option value="prefer-not-to-say">Prefer not to say</option>
      </>
    ),
  },
  argTypes: {
    size: { control: 'select', options: ['lg', 'md', 'sm'] },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Required: Story = { args: { required: true } }
export const Error: Story = { args: { error: true, helperText: 'Please choose an option' } }
export const Disabled: Story = { args: { disabled: true } }
