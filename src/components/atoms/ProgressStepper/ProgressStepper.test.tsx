import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { ProgressStepper } from './ProgressStepper'

describe('ProgressStepper', () => {
  it('exposes a progressbar role with the right value/max', () => {
    render(<ProgressStepper value={3} max={15} label="Question 3 of 15" />)
    const bar = screen.getByRole('progressbar', { name: 'Question 3 of 15' })
    expect(bar).toHaveAttribute('aria-valuenow', '3')
    expect(bar).toHaveAttribute('aria-valuemax', '15')
  })

  it('renders the fill at the exact target width immediately, no delayed animation', () => {
    render(<ProgressStepper value={3} max={15} label="Question 3 of 15" />)
    const bar = screen.getByRole('progressbar', { name: 'Question 3 of 15' })
    const fill = bar.firstChild as HTMLElement
    expect(fill.style.width).toBe('20%')
  })

  it('clamps the fill percentage between 0 and 100', () => {
    render(<ProgressStepper value={20} max={15} label="Overshoot" />)
    const bar = screen.getByRole('progressbar', { name: 'Overshoot' })
    const fill = bar.firstChild as HTMLElement
    expect(fill.style.width).toBe('100%')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<ProgressStepper value={3} max={15} label="Question 3 of 15" />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
