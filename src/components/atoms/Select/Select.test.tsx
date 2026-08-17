import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { Select } from './Select'

function renderSelect(props: Partial<ComponentProps<typeof Select>> = {}) {
  return render(
    <Select label="Sex" {...props}>
      <option value="">Choose one</option>
      <option value="female">Female</option>
      <option value="male">Male</option>
      <option value="non-binary">Non-binary</option>
      <option value="prefer-not-to-say">Prefer not to say</option>
    </Select>,
  )
}

describe('Select', () => {
  it('renders an accessible labeled listbox', () => {
    renderSelect()
    expect(screen.getByLabelText('Sex')).toBeInTheDocument()
  })

  it('appends * to the label when required', () => {
    renderSelect({ required: true })
    expect(screen.getByLabelText('Sex*')).toBeInTheDocument()
  })

  it('fires onChange when a new option is chosen', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    renderSelect({ onChange })
    await user.selectOptions(screen.getByLabelText('Sex'), 'female')
    expect(onChange).toHaveBeenCalled()
  })

  it('marks the select as invalid when error is set', () => {
    renderSelect({ error: true, helperText: 'Please choose an option' })
    expect(screen.getByLabelText('Sex')).toHaveAttribute('aria-invalid', 'true')
  })

  it('respects the disabled prop', () => {
    renderSelect({ disabled: true })
    expect(screen.getByLabelText('Sex')).toBeDisabled()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderSelect()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
