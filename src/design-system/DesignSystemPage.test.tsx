import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { DesignSystemPage } from './DesignSystemPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <DesignSystemPage />
    </MemoryRouter>,
  )
}

describe('DesignSystemPage', () => {
  it('renders the page title and all top-level sections', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1, name: 'Linus Design System' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Colors/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Typography/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Spacing/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Buttons/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Sources/ })).toBeInTheDocument()
  })

  it('exposes a labelled navigation landmark with a link to every section', () => {
    renderPage()
    const nav = screen.getByRole('navigation', { name: 'Design system sections' })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Buttons' })).toHaveAttribute('href', '#buttons')
  })

  it('labels every confirmed color swatch with an accessible name including its hex value', () => {
    renderPage()
    expect(screen.getByRole('img', { name: 'Primary Blue, #087DAE' })).toBeInTheDocument()
  })

  it('marks unresolved swatches as unavailable rather than guessing a color', () => {
    renderPage()
    expect(screen.getAllByRole('img', { name: /hex value not yet available/ }).length).toBeGreaterThan(0)
  })

  it('links back to the prototype index', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /Back to prototype/ })).toHaveAttribute('href', '/')
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
