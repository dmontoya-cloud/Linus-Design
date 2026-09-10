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
export const Danger: Story = {
  args: { variant: 'danger', title: 'Danger', message: 'Danger message' },
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
      <Toast {...args} variant="danger" title="Danger" message="Danger message" />
      <Toast {...args} variant="neutral" title="Custom message" message="Custom message" />
    </div>
  ),
}

/** `title` is optional, on request — omitting it drops the title line entirely and promotes
 * `message` to `text-primary` (see `Toast`'s own doc comment), rather than leaving it in its
 * usual muted `text-secondary` as if it were still a supporting line under a title. Every
 * variant supports this the same way, so it's shown as the same all-variants matrix as above
 * rather than one story per variant. */
export const AllVariantsWithoutTitle: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
      {/* `title={undefined}` explicitly overrides `meta.args`' own default `title: 'Success'` —
          without it, {...args} would still spread that default in ahead of these props. */}
      <Toast
        {...args}
        variant="success"
        title={undefined}
        message="Your changes have been saved."
      />
      <Toast
        {...args}
        variant="warning"
        title={undefined}
        message="This action can't be undone once confirmed."
      />
      <Toast
        {...args}
        variant="info"
        title={undefined}
        message="A new version of your report is available."
      />
      <Toast
        {...args}
        variant="danger"
        title={undefined}
        message="This assessment could not be submitted."
      />
      <Toast
        {...args}
        variant="neutral"
        title={undefined}
        message="The one variant with no leading icon."
      />
    </div>
  ),
}
