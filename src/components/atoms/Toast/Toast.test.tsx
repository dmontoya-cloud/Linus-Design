import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Toast } from './Toast'

describe('Toast', () => {
  it('renders the title and message', () => {
    render(<Toast variant="success" title="Success" message="Success message" />)
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(screen.getByText('Success message')).toBeInTheDocument()
  })

  it('defaults to the neutral variant with no icon', () => {
    const { container } = render(<Toast title="Custom message" message="Custom message" />)
    // Neutral is the one variant with no icon — success/warning/info/error each render one.
    expect(container.querySelectorAll('svg')).toHaveLength(1) // just the close (×) icon
  })

  it('renders an icon for success, warning, info, and error', () => {
    const { container: success } = render(
      <Toast variant="success" title="Success" message="Success message" />,
    )
    const { container: warning } = render(
      <Toast variant="warning" title="Warning" message="Warning message" />,
    )
    const { container: info } = render(
      <Toast variant="info" title="Information" message="Information message" />,
    )
    const { container: error } = render(
      <Toast variant="error" title="Error" message="Error message" />,
    )
    expect(success.querySelectorAll('svg')).toHaveLength(2) // icon + close
    expect(warning.querySelectorAll('svg')).toHaveLength(2)
    expect(info.querySelectorAll('svg')).toHaveLength(2)
    expect(error.querySelectorAll('svg')).toHaveLength(2)
  })

  it('uses role="alert" for error and role="status" for every other variant', () => {
    const { rerender } = render(<Toast variant="error" title="Error" message="Error message" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()

    rerender(<Toast variant="success" title="Success" message="Success message" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('calls onClose when the close (×) button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Toast variant="info" title="Information" message="Information message" onClose={onClose} />,
    )
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders the close button even without an onClose handler', () => {
    render(<Toast title="Custom message" message="Custom message" />)
    expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(
      <Toast variant="warning" title="Warning" message="Warning message" onClose={() => {}} />,
    )
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
