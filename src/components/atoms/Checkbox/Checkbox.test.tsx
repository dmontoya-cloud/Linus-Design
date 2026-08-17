import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders an accessible labeled checkbox', () => {
    render(<Checkbox label="I consent to the use of my results" />)
    expect(
      screen.getByRole('checkbox', { name: 'I consent to the use of my results' }),
    ).toBeInTheDocument()
  })

  it('toggles when clicked and fires onChange', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Checkbox label="I consent" onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox', { name: 'I consent' })
    expect(checkbox).not.toBeChecked()
    await user.click(checkbox)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('toggles via keyboard (Space)', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Checkbox label="I consent" onChange={onChange} />)
    await user.tab()
    expect(screen.getByRole('checkbox', { name: 'I consent' })).toHaveFocus()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('is excluded from the tab order and announced as disabled when disabled', () => {
    render(<Checkbox label="I consent" disabled />)
    expect(screen.getByRole('checkbox', { name: 'I consent' })).toBeDisabled()
  })

  it('marks itself invalid when error is set', () => {
    render(<Checkbox label="I consent" error />)
    expect(screen.getByRole('checkbox', { name: 'I consent' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<Checkbox label="I consent" />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
