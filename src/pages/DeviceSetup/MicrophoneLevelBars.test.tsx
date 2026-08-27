import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { MicrophoneLevelBars } from './MicrophoneLevelBars'

function fakeStream(stopSpy: () => void) {
  return {
    getTracks: () => [{ stop: stopSpy }],
  } as unknown as MediaStream
}

/** A fake `AnalyserNode` whose reported level can be driven from the test, standing in for
 * actual sound reaching the microphone — real speech would move the level the same way. */
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
 * `createSpeechBurstDetector` needs one continuous ~700ms burst now, not several
 * pause-separated ones (a visitor saying a few words out loud, not "testing, testing"). */
async function speakOneConfirmingBurst(setLevel: (byteValue: number) => void) {
  setLevel(120)
  await sleep(780)
}

describe('MicrophoneLevelBars', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows live bars once microphone access is granted', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    render(<MicrophoneLevelBars />)
    expect(
      await screen.findByRole('img', { name: 'Live microphone input level' }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/couldn't access your microphone/i)).not.toBeInTheDocument()
  })

  it('shows a plain-language explanation and a retry when access is denied', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockRejectedValue(
      new DOMException('Permission denied', 'NotAllowedError'),
    )
    render(<MicrophoneLevelBars />)
    expect(await screen.findByText(/couldn't access your microphone/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('retries getUserMedia when "Try again" is clicked', async () => {
    const user = userEvent.setup()
    const getUserMedia = vi
      .spyOn(navigator.mediaDevices, 'getUserMedia')
      .mockRejectedValueOnce(new DOMException('Permission denied', 'NotAllowedError'))
      .mockResolvedValueOnce(fakeStream(() => {}))
    render(<MicrophoneLevelBars />)

    await screen.findByRole('button', { name: 'Try again' })
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(
      await screen.findByRole('img', { name: 'Live microphone input level' }),
    ).toBeInTheDocument()
    expect(getUserMedia).toHaveBeenCalledTimes(2)
  })

  it('stops every microphone track on unmount', async () => {
    const stopSpy = vi.fn()
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(stopSpy))
    const { unmount } = render(<MicrophoneLevelBars />)
    await waitFor(() => expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled())

    unmount()
    expect(stopSpy).toHaveBeenCalled()
  })

  it('shows a checkmark confirming the microphone works right after one continuous burst of speech', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    const { analyser, setLevel } = makeControllableAnalyser()
    vi.spyOn(window.AudioContext.prototype, 'createAnalyser').mockReturnValue(analyser)

    render(<MicrophoneLevelBars />)
    await screen.findByRole('img', { name: 'Live microphone input level' })

    await speakOneConfirmingBurst(setLevel)

    expect(await screen.findByRole('img', { name: 'Microphone is working' })).toBeInTheDocument()
    expect(
      screen.queryByRole('img', { name: 'Live microphone input level' }),
    ).not.toBeInTheDocument()
  }, 10000)

  it('calls onConfirmed once, alongside swapping to its own checkmark', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    const { analyser, setLevel } = makeControllableAnalyser()
    vi.spyOn(window.AudioContext.prototype, 'createAnalyser').mockReturnValue(analyser)
    const onConfirmed = vi.fn()

    render(<MicrophoneLevelBars onConfirmed={onConfirmed} />)
    await screen.findByRole('img', { name: 'Live microphone input level' })
    expect(onConfirmed).not.toHaveBeenCalled()

    await speakOneConfirmingBurst(setLevel)
    await screen.findByRole('img', { name: 'Microphone is working' })

    expect(onConfirmed).toHaveBeenCalledTimes(1)
  }, 10000)

  it('does not confirm from spoken bursts while detection is disabled', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    const { analyser, setLevel } = makeControllableAnalyser()
    vi.spyOn(window.AudioContext.prototype, 'createAnalyser').mockReturnValue(analyser)

    render(<MicrophoneLevelBars detectionEnabled={false} />)
    await screen.findByRole('img', { name: 'Live microphone input level' })

    // The same burst shape that confirms when detection is enabled — this stands in for the
    // device's own voice-over leaking back into the mic through the speakers while a parent
    // page's instructions are still being read aloud.
    await speakOneConfirmingBurst(setLevel)

    expect(screen.queryByRole('img', { name: 'Microphone is working' })).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Live microphone input level' })).toBeInTheDocument()
  }, 10000)

  it('confirms from bursts that occur only after detection is enabled mid-stream', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    const { analyser, setLevel } = makeControllableAnalyser()
    vi.spyOn(window.AudioContext.prototype, 'createAnalyser').mockReturnValue(analyser)

    const { rerender } = render(<MicrophoneLevelBars detectionEnabled={false} />)
    await screen.findByRole('img', { name: 'Live microphone input level' })

    // A burst while still disabled must not count toward confirmation at all.
    await speakOneConfirmingBurst(setLevel)
    setLevel(0)
    expect(screen.queryByRole('img', { name: 'Microphone is working' })).not.toBeInTheDocument()

    // Detection is armed (e.g. the parent page's own reading just finished) — a fresh burst now
    // counts, without needing to unmount/remount the component or its audio graph.
    rerender(<MicrophoneLevelBars detectionEnabled={true} />)
    await speakOneConfirmingBurst(setLevel)

    expect(await screen.findByRole('img', { name: 'Microphone is working' })).toBeInTheDocument()
  }, 15000)

  it('does not confirm on continuous quiet background noise alone', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    const { analyser, setLevel } = makeControllableAnalyser()
    vi.spyOn(window.AudioContext.prototype, 'createAnalyser').mockReturnValue(analyser)
    setLevel(5) // well below the speaking threshold — ambient room noise, not speech

    render(<MicrophoneLevelBars />)
    await screen.findByRole('img', { name: 'Live microphone input level' })
    await sleep(400)

    expect(screen.queryByRole('img', { name: 'Microphone is working' })).not.toBeInTheDocument()
  })

  it('shows a "Troubleshooting" link once access is granted, opening the modal on click', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    render(<MicrophoneLevelBars />)
    await screen.findByRole('img', { name: 'Live microphone input level' })

    const link = screen.getByRole('button', { name: 'Troubleshooting' })
    expect(screen.queryByRole('heading', { name: /not hearing anything/i })).not.toBeInTheDocument()

    await user.click(link)
    expect(
      screen.getByRole('heading', { name: /not hearing anything come through/i }),
    ).toBeInTheDocument()
  })

  it('does not show a "Troubleshooting" link while access is still pending or denied', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockRejectedValue(
      new DOMException('Permission denied', 'NotAllowedError'),
    )
    render(<MicrophoneLevelBars />)
    await screen.findByRole('button', { name: 'Try again' })
    expect(screen.queryByRole('button', { name: 'Troubleshooting' })).not.toBeInTheDocument()
  })

  it('hides the "Troubleshooting" link once the microphone is confirmed working', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    const { analyser, setLevel } = makeControllableAnalyser()
    vi.spyOn(window.AudioContext.prototype, 'createAnalyser').mockReturnValue(analyser)

    render(<MicrophoneLevelBars />)
    await screen.findByRole('img', { name: 'Live microphone input level' })
    expect(screen.getByRole('button', { name: 'Troubleshooting' })).toBeInTheDocument()

    await speakOneConfirmingBurst(setLevel)
    await screen.findByRole('img', { name: 'Microphone is working' })
    expect(screen.queryByRole('button', { name: 'Troubleshooting' })).not.toBeInTheDocument()
  }, 10000)

  it('has no automatically detectable accessibility violations when granted (axe)', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    const { container } = render(<MicrophoneLevelBars />)
    await screen.findByRole('img', { name: 'Live microphone input level' })
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })

  it('has no automatically detectable accessibility violations when denied (axe)', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockRejectedValue(
      new DOMException('Permission denied', 'NotAllowedError'),
    )
    const { container } = render(<MicrophoneLevelBars />)
    await screen.findByRole('button', { name: 'Try again' })
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })

  it('has no automatically detectable accessibility violations once confirmed (axe)', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(fakeStream(() => {}))
    const { analyser, setLevel } = makeControllableAnalyser()
    vi.spyOn(window.AudioContext.prototype, 'createAnalyser').mockReturnValue(analyser)

    const { container } = render(<MicrophoneLevelBars />)
    await screen.findByRole('img', { name: 'Live microphone input level' })
    await speakOneConfirmingBurst(setLevel)
    await screen.findByRole('img', { name: 'Microphone is working' })

    const results = await axe(container)
    expect(results.violations).toEqual([])
  }, 10000)
})
