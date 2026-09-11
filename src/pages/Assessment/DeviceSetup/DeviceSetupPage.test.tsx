import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/auth'
import { DeviceSetupPage } from './DeviceSetupPage'

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/assessment/device-setup']}>
        <Routes>
          <Route path="/assessment/device-setup" element={<DeviceSetupPage />} />
          <Route path="/assessment/start" element={<p>Memory &amp; Thinking Details stub</p>} />
          <Route path="/assessment" element={<p>Memory &amp; Thinking task stub</p>} />
          <Route path="/dashboard" element={<p>Dashboard stub</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

/** A fake `MediaStream` with one fake track, so `requestMicrophoneAccess` has something to call
 * `.stop()` on after `getUserMedia` "grants" access — matches the shape the real Web API
 * resolves with, without needing a real microphone in the test environment. */
function fakeMediaStream() {
  const track = { stop: vi.fn() }
  return { stream: { getTracks: () => [track] }, track }
}

describe('DeviceSetupPage', () => {
  let getUserMedia: ReturnType<typeof vi.fn>

  beforeEach(() => {
    getUserMedia = vi.fn()
    vi.stubGlobal('navigator', {
      ...navigator,
      mediaDevices: { getUserMedia },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the Allow Access screen first, with no progress bar', () => {
    renderPage()
    expect(
      screen.getByText('First, let’s get your device ready for this assessment.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Allow Access' })).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  it('Back on the very first screen exits to Memory & Thinking Details', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('Memory & Thinking Details stub')).toBeInTheDocument()
  })

  it('calls the real getUserMedia API and stops the resulting track when access is granted', async () => {
    const { stream, track } = fakeMediaStream()
    getUserMedia.mockResolvedValue(stream)
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Allow Access' }))

    expect(getUserMedia).toHaveBeenCalledWith({ audio: true })
    expect(track.stop).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Let’s test your sound.')).toBeInTheDocument()
  })

  it('still advances to the sound test when access is denied', async () => {
    getUserMedia.mockRejectedValue(new DOMException('Permission denied', 'NotAllowedError'))
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Allow Access' }))

    expect(screen.getByText('Let’s test your sound.')).toBeInTheDocument()
  })

  it('walks through the sound and mic checks to the done screen, then hands off to the task screens', async () => {
    getUserMedia.mockResolvedValue(fakeMediaStream().stream)
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Allow Access' }))

    // Continue is disabled on the sound-test screen until an answer is picked.
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: 'Yes, I can hear it' }))
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByText('Now, let’s check your microphone.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByText('Your device is working properly!')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: "Let's get started with the activity" }))

    expect(screen.getByText('Memory & Thinking task stub')).toBeInTheDocument()
  })
})
