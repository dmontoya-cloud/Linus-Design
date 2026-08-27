import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { BrowserMicPermissionMockup } from './BrowserMicPermissionMockup'

describe('BrowserMicPermissionMockup', () => {
  it('renders as a labeled image, not decorative', () => {
    render(<BrowserMicPermissionMockup />)
    expect(screen.getByRole('img', { name: /microphone permission prompt/i })).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = render(<BrowserMicPermissionMockup />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
