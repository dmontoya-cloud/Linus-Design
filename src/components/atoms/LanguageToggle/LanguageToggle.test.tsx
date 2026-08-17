import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { LanguageToggle } from './LanguageToggle'

describe('LanguageToggle', () => {
  it('marks the current language as pressed and the other as not', () => {
    render(<LanguageToggle value="en" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Español' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with the clicked language', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<LanguageToggle value="en" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Español' }))
    expect(onChange).toHaveBeenCalledWith('es')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<LanguageToggle value="es" onChange={() => {}} />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
