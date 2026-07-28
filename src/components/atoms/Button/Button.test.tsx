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

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<Button>Continue</Button>)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
