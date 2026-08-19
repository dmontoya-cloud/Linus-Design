import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { SettingUpPage } from './SettingUpPage'

function ThanksProbe() {
  return <p>Thanks screen</p>
}

function renderSettingUpPage() {
  return render(
    <MemoryRouter initialEntries={['/setting-up']}>
      <Routes>
        <Route path="/setting-up" element={<SettingUpPage />} />
        <Route path="/thanks" element={<ThanksProbe />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('SettingUpPage', () => {
  it('shows the setting-up message', () => {
    renderSettingUpPage()
    expect(screen.getByText('Setting up your account')).toBeInTheDocument()
  })

  it('navigates to /thanks once the timer completes', async () => {
    renderSettingUpPage()
    await waitFor(() => expect(screen.getByText('Thanks screen')).toBeInTheDocument(), {
      timeout: 3500,
    })
  }, 5000)

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderSettingUpPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
