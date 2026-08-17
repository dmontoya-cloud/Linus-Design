import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '@/tokens'
import { Button } from '@/components/atoms/Button'
import { Modal } from './Modal'

function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Full legal text">
        <p>This is where the full legal text renders, scrollable if it runs long.</p>
      </Modal>
    </>
  )
}

const meta = {
  title: 'Atoms/Modal',
  component: Modal,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'centered' },
  args: { open: false, onClose: () => {}, title: 'Full legal text', children: null },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ModalDemo />,
}
