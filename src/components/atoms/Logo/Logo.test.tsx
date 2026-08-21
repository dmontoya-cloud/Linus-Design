import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders the Linus Health logo', () => {
    render(<Logo />)
    expect(screen.getByRole('img', { name: 'Linus Health' })).toBeInTheDocument()
  })

  it('accepts a className for placement', () => {
    render(<Logo className="corner" />)
    expect(screen.getByRole('img', { name: 'Linus Health' })).toHaveClass('corner')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<Logo />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
