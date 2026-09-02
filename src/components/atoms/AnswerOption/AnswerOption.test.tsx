import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { AnswerOption } from './AnswerOption'

describe('AnswerOption', () => {
  it('renders a radio option and reports its checked state accessibly', () => {
    render(
      <AnswerOption
        type="radio"
        name="q1"
        value="yes"
        label="Yes"
        checked={false}
        onChange={() => {}}
      />,
    )
    expect(screen.getByRole('radio', { name: 'Yes' })).not.toBeChecked()
  })

  it('renders a checkbox option and reports its checked state accessibly', () => {
    render(
      <AnswerOption
        type="checkbox"
        name="q2-fruit"
        value="fruit"
        label="Fruit"
        checked
        onChange={() => {}}
      />,
    )
    expect(screen.getByRole('checkbox', { name: 'Fruit' })).toBeChecked()
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <AnswerOption
        type="radio"
        name="q1"
        value="no"
        label="No"
        checked={false}
        onChange={onChange}
      />,
    )
    await user.click(screen.getByText('No'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('only allows one radio in a group to be checked at a time', async () => {
    const user = userEvent.setup()
    function Group() {
      const [value, setValue] = useState('yes')
      return (
        <>
          <AnswerOption
            type="radio"
            name="q1"
            value="yes"
            label="Yes"
            checked={value === 'yes'}
            onChange={() => setValue('yes')}
          />
          <AnswerOption
            type="radio"
            name="q1"
            value="no"
            label="No"
            checked={value === 'no'}
            onChange={() => setValue('no')}
          />
        </>
      )
    }
    render(<Group />)
    expect(screen.getByRole('radio', { name: 'Yes' })).toBeChecked()
    await user.click(screen.getByText('No'))
    expect(screen.getByRole('radio', { name: 'No' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Yes' })).not.toBeChecked()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(
      <AnswerOption
        type="checkbox"
        name="q2-fruit"
        value="fruit"
        label="Fruit"
        checked={false}
        onChange={() => {}}
      />,
    )
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
