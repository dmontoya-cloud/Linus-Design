import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders the Thrive wordmark', () => {
    render(<Logo />)
    expect(screen.getByRole('img', { name: 'Thrive' })).toBeInTheDocument()
  })

  it('accepts a className for placement', () => {
    render(<Logo className="corner" />)
    expect(screen.getByRole('img', { name: 'Thrive' })).toHaveClass('corner')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<Logo />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
