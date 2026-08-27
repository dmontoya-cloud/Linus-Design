import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'vitest-axe'
import { MicrophoneTroubleshootingModal } from './MicrophoneTroubleshootingModal'

describe('MicrophoneTroubleshootingModal', () => {
  it('renders nothing visible when closed', () => {
    render(<MicrophoneTroubleshootingModal open={false} onClose={() => {}} />)
    expect(screen.queryByRole('heading', { name: /not hearing anything/i })).not.toBeInTheDocument()
  })

  it('shows the checklist and the example permission-prompt illustration when open', () => {
    render(<MicrophoneTroubleshootingModal open onClose={() => {}} />)
    expect(
      screen.getByRole('heading', { name: /not hearing anything come through/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/microphone access for this site/i)).toBeInTheDocument()
    expect(screen.getByText(/correct microphone as the selected input device/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /microphone permission prompt/i })).toBeInTheDocument()
  })

  it('calls onClose when dismissed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<MicrophoneTroubleshootingModal open onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('has no automatically detectable accessibility violations when open (axe)', async () => {
    const { container } = render(<MicrophoneTroubleshootingModal open onClose={() => {}} />)
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
