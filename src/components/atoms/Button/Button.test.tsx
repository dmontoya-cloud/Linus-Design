import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Button } from './Button'

describe('Button', () => {
  it('renders its children as an accessible button', () => {
    render(<Button>Continue</Button>)
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
  })

  it('fires onClick when activated by mouse', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={onClick}>Continue</Button>)
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('fires onClick when activated by keyboard (Enter/Space)', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={onClick}>Continue</Button>)
    await user.tab()
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is excluded from the tab order and announced as disabled when disabled', () => {
    render(<Button disabled>Continue</Button>)
    const button = screen.getByRole('button', { name: 'Continue' })
    expect(button).toBeDisabled()
  })

  it.each(['primary', 'secondary', 'tertiary', 'danger'] as const)(
    'renders the %s variant without throwing',
    (variant) => {
      render(<Button variant={variant}>Continue</Button>)
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    },
  )

  it.each(['lg', 'md', 'sm'] as const)('renders the %s size without throwing', (size) => {
    render(<Button size={size}>Continue</Button>)
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<Button>Continue</Button>)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })

  it('shows a spinner over the label when loading, without disabling the button', () => {
    render(<Button loading>Continue</Button>)
    const button = screen.getByRole('button', { name: 'Loading' })
    expect(button).toBeEnabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    // The label stays in the DOM (just visually hidden) so the button keeps its resting
    // width instead of shrinking to fit only the spinner — it's still there, just excluded
    // from the accessible name in favor of the "Loading" text.
    expect(screen.getByText('Continue')).toBeInTheDocument()
  })

  it('still fires onClick while loading, since loading alone does not disable the button', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button loading onClick={onClick}>
        Continue
      </Button>,
    )
    await user.click(screen.getByRole('button', { name: 'Loading' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick while loading if disabled is also passed', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button loading disabled onClick={onClick}>
        Continue
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Loading' })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
