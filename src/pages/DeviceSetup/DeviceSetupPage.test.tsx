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

/** A fake `AnalyserNode` whose reported level can be driven from the test, standing in for
 * actual sound reaching the microphone (real speech, or the device's own voice-over leaking
 * back in through its speakers). */
function makeControllableAnalyser() {
  let level = 0
  const analyser = {
    fftSize: 64,
    smoothingTimeConstant: 0.6,
    get frequencyBinCount() {
      return this.fftSize / 2
    },
    getByteFrequencyData(array: Uint8Array) {
      array.fill(level)
    },
  }
  return {
    analyser: analyser as unknown as AnalyserNode,
    setLevel: (byteValue: number) => {
      level = byteValue
    },
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Holds the level loud enough, long enough to confirm on its own — the default
 * `createSpeechBurstDetector` needs one continuous ~700ms burst, not several pause-separated
 * ones (a visitor saying a few words out loud, not "testing, testing"). */
async function speakOneConfirmingBurst(setLevel: (byteValue: number) => void) {
  setLevel(120)
  await sleep(780)
}

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
  const confirmButton = await screen.findByRole('button', { name: 'I can hear the sound' })
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

  it('shows the Exit link as an outline button with a sign-out icon, not the usual plain text link', () => {
    renderPage()
    const exitLink = screen.getByRole('link', { name: 'Exit' })
    expect(exitLink.querySelector('svg')).toBeInTheDocument()
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

    it('hides "I can hear the sound" until the reading is finished', () => {
      renderPage()
      expect(screen.queryByRole('button', { name: 'I can hear the sound' })).not.toBeInTheDocument()
    })

    it('shows "I can hear the sound" once the reading finishes', async () => {
      renderPage()
      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
      utterance?.onend?.({} as SpeechSynthesisEvent)

      expect(
        await screen.findByRole('button', { name: 'I can hear the sound' }),
      ).toBeInTheDocument()
    })

    it('still hides "I can hear the sound" partway through the reading, before the halfway point', async () => {
      renderPage()
      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]

      // charIndex 31 is where "and" (the 6th of 26 words) starts — well before halfway.
      utterance?.onboundary?.({ name: 'word', charIndex: 31 } as SpeechSynthesisEvent)
      await waitFor(() => expect(screen.getByText('and').className).toContain(styles.wordRead))
      expect(screen.queryByRole('button', { name: 'I can hear the sound' })).not.toBeInTheDocument()
    })

    it('reveals "I can hear the sound" once the reading reaches roughly the halfway point, before it finishes', async () => {
      renderPage()
      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]

      // charIndex 76 is where "Make" (the 13th of 26 words, just past halfway) starts — later
      // words are still unread, proving this fires mid-reading rather than only on completion.
      utterance?.onboundary?.({ name: 'word', charIndex: 76 } as SpeechSynthesisEvent)

      const button = await screen.findByRole('button', { name: 'I can hear the sound' })
      expect(button).not.toBeDisabled()
      expect(screen.getByText('below.').className).not.toContain(styles.wordRead)
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

    it('does not let its own voice-over trip the mic confirmation before it finishes reading', async () => {
      const { analyser, setLevel } = makeControllableAnalyser()
      vi.spyOn(window.AudioContext.prototype, 'createAnalyser').mockReturnValue(analyser)
      vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue({
        getTracks: () => [{ stop: () => {} }],
      } as unknown as MediaStream)

      const user = userEvent.setup()
      renderPage()
      await advanceToMicrophoneStep(user)
      await screen.findByRole('img', { name: 'Live microphone input level' })

      // Stands in for this step's own instructions leaking back into the mic through the
      // device's speakers while they're still being read aloud — must not count.
      await speakOneConfirmingBurst(setLevel)
      setLevel(0)
      expect(screen.queryByRole('img', { name: 'Microphone is working' })).not.toBeInTheDocument()

      // The reading actually finishes — detection arms, and the same burst (standing in for the
      // visitor actually speaking) now confirms it.
      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[1]?.[0]
      utterance?.onend?.({} as SpeechSynthesisEvent)

      await speakOneConfirmingBurst(setLevel)
      expect(await screen.findByRole('img', { name: 'Microphone is working' })).toBeInTheDocument()
    }, 20000)

    it('reads its own instructions aloud, separately from the hearing step', async () => {
      const user = userEvent.setup()
      renderPage()
      await advanceToMicrophoneStep(user)

      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[1]?.[0]
      expect(utterance?.text).toBe(MIC_TEXT)
    })

    it('has no manual "Continue" button — even once its own reading finishes', async () => {
      const user = userEvent.setup()
      renderPage()
      await advanceToMicrophoneStep(user)

      expect(screen.queryByRole('link', { name: 'Continue' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument()

      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[1]?.[0]
      utterance?.onend?.({} as SpeechSynthesisEvent)

      expect(screen.queryByRole('link', { name: 'Continue' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Continue' })).not.toBeInTheDocument()
    })

    it('hands off automatically once the mic is confirmed working: checkmark, then a spinner, then the next page — no click required', async () => {
      vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue({
        getTracks: () => [{ stop: () => {} }],
      } as unknown as MediaStream)
      const { analyser, setLevel } = makeControllableAnalyser()
      vi.spyOn(window.AudioContext.prototype, 'createAnalyser').mockReturnValue(analyser)

      const user = userEvent.setup()
      renderPage()
      await advanceToMicrophoneStep(user)

      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[1]?.[0]
      utterance?.onend?.({} as SpeechSynthesisEvent)

      await speakOneConfirmingBurst(setLevel)
      await screen.findByRole('img', { name: 'Microphone is working' })

      // Holds on the checkmark for a moment, then swaps to a spinner on its own...
      await screen.findByText('Getting things ready', {}, { timeout: 3000 })
      expect(screen.queryByRole('img', { name: 'Microphone is working' })).not.toBeInTheDocument()

      // ...then navigates on to the next page on its own, no click involved.
      expect(
        await screen.findByText('Microphone check stub', {}, { timeout: 3000 }),
      ).toBeInTheDocument()
    }, 20000)
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
