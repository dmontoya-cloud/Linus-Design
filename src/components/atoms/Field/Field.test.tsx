import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Field } from './Field'

describe('Field', () => {
  it('renders an accessible labeled textbox', () => {
    render(<Field label="Email address" />)
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
  })

  it('appends * to the label when required', () => {
    render(<Field label="Full name" required />)
    expect(screen.getByLabelText('Full name*')).toBeInTheDocument()
  })

  it('accepts typed input and fires onChange', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Field label="Full name" onChange={onChange} />)
    await user.type(screen.getByLabelText('Full name'), 'Ada')
    expect(onChange).toHaveBeenCalled()
  })

  it('renders helper text and links it via aria-describedby', () => {
    render(<Field label="Full name" helperText="This field is required" />)
    const input = screen.getByLabelText('Full name')
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('helper'))
  })

  it('marks the input as invalid when error is set', () => {
    render(<Field label="Email address" error helperText="Enter a valid email" />)
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true')
  })

  it('respects the disabled prop', () => {
    render(<Field label="Email address" disabled />)
    expect(screen.getByLabelText('Email address')).toBeDisabled()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<Field label="Email address" />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
