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
})
