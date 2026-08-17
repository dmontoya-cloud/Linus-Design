import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('exposes a progressbar role with the right value/max', () => {
    render(<ProgressBar value={1} max={4} label="Step 1 of 4: Registration" />)
    const bar = screen.getByRole('progressbar', { name: 'Step 1 of 4: Registration' })
    expect(bar).toHaveAttribute('aria-valuenow', '1')
    expect(bar).toHaveAttribute('aria-valuemax', '4')
  })

  it('clamps the fill percentage between 0 and 100', () => {
    render(<ProgressBar value={10} max={4} label="Overshoot" />)
    const bar = screen.getByRole('progressbar', { name: 'Overshoot' })
    const fill = bar.firstChild as HTMLElement
    expect(fill.style.width).toBe('100%')
  })

  it('mounts one step behind and animates forward to the target width', async () => {
    render(<ProgressBar value={2} max={4} label="Step 2 of 4: Consent" />)
    const bar = screen.getByRole('progressbar', { name: 'Step 2 of 4: Consent' })
    const fill = bar.firstChild as HTMLElement
    expect(fill.style.width).toBe('25%')
    await waitFor(() => expect(fill.style.width).toBe('50%'))
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<ProgressBar value={2} max={4} label="Step 2 of 4: Consent" />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
