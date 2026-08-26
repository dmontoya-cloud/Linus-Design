import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { ArrowRightIcon } from './ArrowRightIcon'

describe('ArrowRightIcon', () => {
  it('renders as a decorative (aria-hidden) svg', () => {
    const { container } = render(<ArrowRightIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('accepts a className for sizing/placement', () => {
    const { container } = render(<ArrowRightIcon className="size-4" />)
    expect(container.querySelector('svg')).toHaveClass('size-4')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<ArrowRightIcon />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
