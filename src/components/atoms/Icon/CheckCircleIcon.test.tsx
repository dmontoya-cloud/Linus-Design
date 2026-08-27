import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { CheckCircleIcon } from './CheckCircleIcon'

describe('CheckCircleIcon', () => {
  it('renders as a decorative (aria-hidden) svg', () => {
    const { container } = render(<CheckCircleIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('accepts a className for sizing/placement', () => {
    const { container } = render(<CheckCircleIcon className="size-4" />)
    expect(container.querySelector('svg')).toHaveClass('size-4')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<CheckCircleIcon />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
