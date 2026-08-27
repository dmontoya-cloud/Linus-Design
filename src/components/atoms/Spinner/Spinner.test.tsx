import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders as a decorative element (aria-hidden), not announced on its own', () => {
    const { container } = render(<Spinner />)
    const ring = container.querySelector('[aria-hidden="true"]')
    expect(ring).toBeInTheDocument()
  })

  it('accepts a className for placement', () => {
    const { container } = render(<Spinner className="size-4" />)
    expect(container.firstChild).toHaveClass('size-4')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<Spinner />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
