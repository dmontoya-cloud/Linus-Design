import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ThemeProvider } from '@/tokens'
import { Button } from './Button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    // a11y addon runs axe against every story in this file automatically.
  },
  args: { onClick: fn(), children: 'Continue' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger', 'outline'] },
    size: { control: 'select', options: ['lg', 'md', 'sm'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Tertiary: Story = { args: { variant: 'tertiary' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Delete assessment' } }
export const Outline: Story = { args: { variant: 'outline', children: 'Help' } }
export const Disabled: Story = { args: { variant: 'primary', disabled: true } }
export const Loading: Story = { args: { variant: 'primary', loading: true } }
export const Large: Story = { args: { variant: 'primary', size: 'lg' } }
export const Small: Story = { args: { variant: 'primary', size: 'sm' } }
