import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { ShoppingListIntroPage } from './ShoppingListIntroPage'
import { resetSpeechCalibrationForTests } from './shoppingListVoiceOver'
import styles from './ShoppingListIntroPage.module.css'

const TITLE_TEXT =
  'I would like you to pretend that you are going shopping. I am going to read a list of ' +
  'things you need to buy.'

const PARAGRAPH_1_TEXT =
  'When I finish reading the whole list, please repeat back as many words as you can ' +
  'remember, in any order.'

const PARAGRAPH_2_TEXT =
  'I will ask you to repeat the shopping list again later, so try to remember it.'

const PARAGRAPH_3_TEXT = 'Press Start when you are ready to begin.'

const FULL_TEXT = [TITLE_TEXT, PARAGRAPH_1_TEXT, PARAGRAPH_2_TEXT, PARAGRAPH_3_TEXT].join(' ')

const ITEMS_TEXT = 'Notepad, backpack, printer, batteries, lamp, chair, coffee, sweater, candles.'

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/assessment/memory-and-thinking/task']}>
        <Routes>
          <Route path="/assessment/memory-and-thinking/task" element={<ShoppingListIntroPage />} />
          <Route path="/dashboard" element={<p>Dashboard stub</p>} />
          <Route
            path="/assessment/memory-and-thinking/task/next"
            element={<p>Next Assessment Item</p>}
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

/** Finishes the instructions reading and clicks "Start" — the same way a visitor would reach
 * the "Listen carefully" step, the same way `advanceToMicrophoneStep` does for Device Setup. */
async function advanceToListeningStep(user: ReturnType<typeof userEvent.setup>) {
  await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
  const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
  utterance?.onend?.({} as SpeechSynthesisEvent)
  const startButton = await screen.findByRole('button', { name: 'Start' })
  await user.click(startButton)
}

/** Also finishes the items reading, reaching "Now it's your turn". */
async function advanceToRecallStep(user: ReturnType<typeof userEvent.setup>) {
  await advanceToListeningStep(user)
  await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2))
  const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[1]?.[0]
  utterance?.onend?.({} as SpeechSynthesisEvent)
  await screen.findByRole('heading', { name: "Now it's your turn" })
}

describe('ShoppingListIntroPage', () => {
  beforeEach(() => {
    vi.spyOn(window.speechSynthesis, 'speak').mockImplementation(() => {})
    vi.spyOn(window.speechSynthesis, 'cancel').mockImplementation(() => {})
    resetSpeechCalibrationForTests()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the same chrome as the rest of this flow: logo, centered item counter, progress bar, and Exit', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Back to start' })).toHaveAttribute('href', '/')
    expect(screen.getByText('Memory & Thinking · 1 of 20')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '20')
    const exitLink = screen.getByRole('link', { name: 'Exit' })
    expect(exitLink).toHaveAttribute('href', '/dashboard')
  })

  it('shows the Exit link as an outline button with a sign-out icon, not the usual plain text link', () => {
    renderPage()
    const exitLink = screen.getByRole('link', { name: 'Exit' })
    expect(exitLink.querySelector('svg')).toBeInTheDocument()
  })

  it('shows the full instructions text on screen, not only as audio', () => {
    const { container } = renderPage()
    expect(container.querySelector('h1')).toHaveTextContent(TITLE_TEXT)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs[0]).toHaveTextContent(PARAGRAPH_1_TEXT)
    expect(paragraphs[1]).toHaveTextContent(PARAGRAPH_2_TEXT)
    expect(paragraphs[2]).toHaveTextContent(PARAGRAPH_3_TEXT)
  })

  it('reads the whole thing — headline and all three paragraphs — aloud as one reading', async () => {
    renderPage()
    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
    expect(utterance?.text).toBe(FULL_TEXT)
  })

  it('highlights words across the headline and paragraph boundary as one continuous reading', async () => {
    renderPage()
    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]

    const lastTitleWord = screen.getByText('buy.')
    const firstParagraphWord = screen.getByText('When')
    expect(lastTitleWord.className).not.toContain(styles.wordRead)
    expect(firstParagraphWord.className).not.toContain(styles.wordRead)

    // charIndex just past "buy." — the last word of the title, first word of paragraph 1 (in
    // the single underlying reading) — should highlight the title's last word without touching
    // paragraph 1's first word yet.
    const charIndex = TITLE_TEXT.length - 1
    utterance?.onboundary?.({ name: 'word', charIndex } as SpeechSynthesisEvent)
    await waitFor(() => expect(lastTitleWord.className).toContain(styles.wordRead))
    expect(firstParagraphWord.className).not.toContain(styles.wordRead)
  })

  it('hides "Start" until the reading finishes, then shows it', async () => {
    renderPage()
    expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument()

    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
    utterance?.onend?.({} as SpeechSynthesisEvent)

    expect(await screen.findByRole('button', { name: 'Start' })).toBeInTheDocument()
  })

  describe('listening step', () => {
    it('swaps out the instructions for just a "Listen carefully" title and illustration, in place', async () => {
      const user = userEvent.setup()
      const { container } = renderPage()
      await advanceToListeningStep(user)

      // The nav bar (which would unmount/remount on a real route change) is still the same one
      // — this was an in-page state swap, not a navigation to a different route/element.
      expect(screen.getByRole('link', { name: 'Exit' })).toHaveAttribute('href', '/dashboard')
      expect(screen.getByRole('heading', { name: 'Listen carefully' })).toBeInTheDocument()
      expect(screen.queryByText(/I would like you to pretend/)).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument()
      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('reads the shopping list aloud, separately from the instructions reading', async () => {
      const user = userEvent.setup()
      renderPage()
      await advanceToListeningStep(user)

      await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(2))
      const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[1]?.[0]
      expect(utterance?.text).toBe(ITEMS_TEXT)
    })

    it('has no automatically detectable accessibility violations (axe)', async () => {
      const user = userEvent.setup()
      const { container } = renderPage()
      await advanceToListeningStep(user)
      const results = await axe(container)
      expect(results.violations).toEqual([])
    })
  })

  describe('recall step', () => {
    it('shows "Now it\'s your turn", a smaller instruction line, a 30-second timer, and live mic bars', async () => {
      const user = userEvent.setup()
      renderPage()
      await advanceToRecallStep(user)

      expect(screen.getByText('Repeat as many words as you remember.')).toBeInTheDocument()
      expect(screen.getByText('0:30')).toBeInTheDocument()
      // The default mocked getUserMedia rejects (see src/test/setup.ts), so MicrophoneLevelBars
      // renders its denied-permission explanation — still proof it's mounted and requesting mic
      // access, the same live component Device Setup's microphone check uses.
      expect(await screen.findByText(/couldn't access your microphone/i)).toBeInTheDocument()
    })

    it("does not confirm/swap the mic bars to a checkmark, unlike Device Setup's usage", async () => {
      vi.spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue({
        getTracks: () => [{ stop: () => {} }],
      } as unknown as MediaStream)
      const user = userEvent.setup()
      renderPage()
      await advanceToRecallStep(user)

      expect(
        await screen.findByRole('img', { name: 'Live microphone input level' }),
      ).toBeInTheDocument()
      expect(screen.queryByRole('img', { name: 'Microphone is working' })).not.toBeInTheDocument()
    })

    it('has no automatically detectable accessibility violations (axe)', async () => {
      const user = userEvent.setup()
      const { container } = renderPage()
      await advanceToRecallStep(user)
      const results = await axe(container)
      expect(results.violations).toEqual([])
    })

    it('navigates on to the next placeholder automatically once the 30-second timer runs out', async () => {
      const user = userEvent.setup()
      renderPage()
      await advanceToRecallStep(user)

      await waitFor(() => expect(screen.getByText('0:29')).toBeInTheDocument(), { timeout: 3000 })
      await waitFor(() => expect(screen.getByText('Next Assessment Item')).toBeInTheDocument(), {
        timeout: 32000,
      })
    }, 40000)
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
