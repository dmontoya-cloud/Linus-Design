import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { DeviceSetupPage } from './DeviceSetupPage'
import { resetSpeechCalibrationForTests as resetHearingCalibration } from './deviceSetupVoiceOver'
import { resetSpeechCalibrationForTests as resetMicCalibration } from './microphoneCheckVoiceOver'
import styles from './DeviceSetupPage.module.css'

const HEARING_TEXT =
  "We'll check that your speakers and microphone are working before you begin. Make sure " +
  "your device's volume is turned up, then play the test sound below."

const MIC_TEXT =
  "Now let's test your microphone. Say something out loud, and you'll see the bars move " +
  'when we can hear you.'

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/assessment/memory-and-thinking']}>
        <Routes>
          <Route path="/assessment/memory-and-thinking" element={<DeviceSetupPage />} />
          <Route path="/dashboard" element={<p>Dashboard stub</p>} />
          <Route
            path="/assessment/memory-and-thinking/microphone-check"
            element={<p>Microphone check stub</p>}
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

/** Fills in the first (hearing) step and reaches the second (microphone) step, the same way a
 * visitor would: wait for the hearing instructions to autoplay, finish that read-through, then
 * click through. */
async function advanceToMicrophoneStep(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
  const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
  utterance?.onend?.({} as SpeechSynthesisEvent)
  const confirmButton = await screen.findByRole('button', { name: 'I confirm, I can hear' })
  await user.click(confirmButton)
}

describe('DeviceSetupPage', () => {
  beforeEach(() => {
    vi.spyOn(window.speechSynthesis, 'speak').mockImplementation(() => {})
    vi.spyOn(window.speechSynthesis, 'cancel').mockImplementation(() => {})
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockRejectedValue(
      new DOMException('not available in tests', 'NotAllowedError'),
    )
    // A test manually firing `onend` doesn't reflect a real elapsed read-through duration —
    // without this, that test's bogus timing would get "learned" and skew every test after it.
    resetHearingCalibration()
    resetMicCalibration()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // A test simulates a "speaking" engine to exercise the estimated-highlight fallback —
    // reset it so that doesn't leak into unrelated tests in this file.
    Object.defineProperty(window.speechSynthesis, 'speaking', {
      value: undefined,
      configurable: true,
    })
  })

  it('shows the nav bar with the activity name in place of the usual nav links', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Back to start' })).toHaveAttribute('href', '/')
    expect(screen.getAllByText('Memory & Thinking')).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Exit' })).toHaveAttribute('href', '/dashboard')
  })

  describe('hearing check (step 1)', () => {
    it('shows the "Set up your device" title and placeholder instructions on screen, not only as audio', () => {
      const { container } = renderPage()
      expect(screen.getByRole('heading', { name: 'Set up your device' })).toBeInTheDocument()
      expect(container.querySelector('p')).toHaveTextContent(HEARING_TEXT)
    })

    it('marks every word up to the one being spoken as read, and keeps them read once speech ends', async () => {
      renderPage()
      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]

      const firstWord = screen.getByText("We'll")
      const secondWord = screen.getByText('check')
      const thirdWord = screen.getByText('that')
      expect(firstWord.className).not.toContain(styles.wordRead)

      // charIndex 6 is where "check" starts in "We'll check that ...".
      utterance?.onboundary?.({ name: 'word', charIndex: 6 } as SpeechSynthesisEvent)
      await waitFor(() => expect(secondWord.className).toContain(styles.wordRead))
      expect(firstWord.className).toContain(styles.wordRead)
      expect(thirdWord.className).not.toContain(styles.wordRead)

      utterance?.onend?.({} as SpeechSynthesisEvent)
      expect(firstWord.className).toContain(styles.wordRead)
      expect(secondWord.className).toContain(styles.wordRead)
    })

    it('reads the instructions aloud shortly after mount', async () => {
      renderPage()
      expect(window.speechSynthesis.speak).not.toHaveBeenCalled()
      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
      expect(utterance?.text).toBe(HEARING_TEXT)
    })

    it('hides "I confirm, I can hear" until the reading is finished', () => {
      renderPage()
      expect(
        screen.queryByRole('button', { name: 'I confirm, I can hear' }),
      ).not.toBeInTheDocument()
    })

    it('shows "I confirm, I can hear" once the reading finishes', async () => {
      renderPage()
      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
      utterance?.onend?.({} as SpeechSynthesisEvent)

      expect(
        await screen.findByRole('button', { name: 'I confirm, I can hear' }),
      ).toBeInTheDocument()
    })

    it('shows a test sound player after the paragraph, independent of whether reading has finished', () => {
      renderPage()
      expect(screen.getByRole('button', { name: 'Play test sound' })).toBeInTheDocument()
    })
  })

  describe('microphone check (step 2)', () => {
    it('replaces the illustration/paragraph/button with the microphone check in place, no navigation', async () => {
      const user = userEvent.setup()
      renderPage()
      await advanceToMicrophoneStep(user)

      // The nav bar (which would unmount/remount on a real route change) is still the same one
      // — this was an in-page state swap, not a navigation to a different route/element.
      expect(screen.getByRole('link', { name: 'Exit' })).toHaveAttribute('href', '/dashboard')
      expect(screen.getByRole('heading', { name: 'Test your microphone' })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Set up your device' })).not.toBeInTheDocument()
    })

    it('shows a live microphone level indicator once access is granted', async () => {
      vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue({
        getTracks: () => [{ stop: () => {} }],
      } as unknown as MediaStream)
      const user = userEvent.setup()
      renderPage()
      await advanceToMicrophoneStep(user)
      expect(
        await screen.findByRole('img', { name: 'Live microphone input level' }),
      ).toBeInTheDocument()
    })

    it('shows an explanation and a retry when microphone access is denied', async () => {
      // The default beforeEach mock already rejects — this documents that path explicitly.
      const user = userEvent.setup()
      renderPage()
      await advanceToMicrophoneStep(user)
      expect(await screen.findByText(/couldn't access your microphone/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    })

    it('reads its own instructions aloud, separately from the hearing step', async () => {
      const user = userEvent.setup()
      renderPage()
      await advanceToMicrophoneStep(user)

      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[1]?.[0]
      expect(utterance?.text).toBe(MIC_TEXT)
    })

    it('hides "Continue" until its own reading is finished, then moves on to the microphone-check placeholder', async () => {
      const user = userEvent.setup()
      renderPage()
      await advanceToMicrophoneStep(user)

      expect(screen.queryByRole('link', { name: 'Continue' })).not.toBeInTheDocument()

      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[1]?.[0]
      utterance?.onend?.({} as SpeechSynthesisEvent)

      const continueLink = await screen.findByRole('link', { name: 'Continue' })
      expect(continueLink).toHaveAttribute(
        'href',
        '/assessment/memory-and-thinking/microphone-check',
      )
      await user.click(continueLink)
      expect(screen.getByText('Microphone check stub')).toBeInTheDocument()
    })
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
