import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Modal } from './Modal'

function ControlledModal() {
  const [open, setOpen] = useState(true)
  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Full legal text">
      <p>The full text goes here.</p>
    </Modal>
  )
}

describe('Modal', () => {
  it('opens when `open` is true', () => {
    render(
      <Modal open onClose={() => {}} title="Full legal text">
        <p>The full text goes here.</p>
      </Modal>,
    )
    expect(screen.getByRole('heading', { name: 'Full legal text' })).toBeInTheDocument()
    expect(screen.getByText('The full text goes here.')).toBeInTheDocument()
  })

  it('calls onClose when the close (×) button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Full legal text">
        <p>Body</p>
      </Modal>,
    )
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the Dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Full legal text">
        <p>Body</p>
      </Modal>,
    )
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('actually closes the native dialog (not just calls a handler) when driven by state', async () => {
    const user = userEvent.setup()
    const { container } = render(<ControlledModal />)
    const dialog = container.querySelector('dialog')
    expect(dialog).toHaveAttribute('open')
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(dialog).not.toHaveAttribute('open')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(
      <Modal open onClose={() => {}} title="Full legal text">
        <p>Body</p>
      </Modal>,
    )
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
