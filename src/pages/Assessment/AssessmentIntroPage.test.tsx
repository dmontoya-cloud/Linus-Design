import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { axe } from 'vitest-axe'
import { AuthProvider } from '@/auth'
import { AssessmentIntroPage } from './AssessmentIntroPage'
import { resetSpeechCalibrationForTests } from './assessmentVoiceOver'
import styles from './AssessmentIntroPage.module.css'

const INSTRUCTIONS_TEXT =
  "Welcome to your memory and thinking assessment. Before we begin, let's make sure that " +
  "you're set up in a quiet place where you won't be interrupted and you're wearing your " +
  'glasses or hearing aids if you use them.'

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/assessment']}>
        <Routes>
          <Route path="/assessment" element={<AssessmentIntroPage />} />
          <Route path="/dashboard" element={<p>Dashboard stub</p>} />
          <Route path="/assessment/memory-and-thinking" element={<p>Begin stub</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('AssessmentIntroPage', () => {
  beforeEach(() => {
    vi.spyOn(window.speechSynthesis, 'speak').mockImplementation(() => {})
    vi.spyOn(window.speechSynthesis, 'cancel').mockImplementation(() => {})
    // A test manually firing `onend` doesn't reflect a real elapsed read-through duration —
    // without this, that test's bogus timing would get "learned" and skew every test after it.
    resetSpeechCalibrationForTests()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // A couple of tests simulate a "speaking" engine to exercise the estimated-highlight
    // fallback — reset it so that doesn't leak into unrelated tests in this file.
    Object.defineProperty(window.speechSynthesis, 'speaking', {
      value: undefined,
      configurable: true,
    })
  })

  it('shows the nav bar with the activity name in place of the usual nav links', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Back to start' })).toHaveAttribute('href', '/')
    // "Memory & Thinking" appears twice — once in the nav bar, once as the page's own <h1>.
    expect(screen.getAllByText('Memory & Thinking')).toHaveLength(2)
    expect(screen.queryByRole('link', { name: 'Assessment' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'History' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('shows "Memory & Thinking" as the page\'s own title', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Memory & Thinking' })).toBeInTheDocument()
  })

  it('shows an Exit link back to Dashboard in place of the signed-in user info', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Exit' })).toHaveAttribute('href', '/dashboard')
  })

  it('shows the Exit link as an outline button with a sign-out icon, not the usual plain text link', () => {
    renderPage()
    const exitLink = screen.getByRole('link', { name: 'Exit' })
    expect(exitLink.querySelector('svg')).toBeInTheDocument()
  })

  it('shows the instructions text on screen, not only as audio', () => {
    // The text is now split across one <span> per word (for the live highlight), so it can no
    // longer be matched as a single text node — check the paragraph's overall text instead.
    const { container } = renderPage()
    expect(container.querySelector('p')).toHaveTextContent(INSTRUCTIONS_TEXT)
  })

  it('marks every word up to the one being spoken as read, and keeps them read once speech ends', async () => {
    renderPage()
    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]

    const firstWord = screen.getByText('Welcome')
    const secondWord = screen.getByText('to')
    const thirdWord = screen.getByText('memory')
    expect(firstWord.className).not.toContain(styles.wordRead)

    // charIndex 8 is where "to" starts in "Welcome to your ...".
    utterance?.onboundary?.({ name: 'word', charIndex: 8 } as SpeechSynthesisEvent)
    await waitFor(() => expect(secondWord.className).toContain(styles.wordRead))
    expect(firstWord.className).toContain(styles.wordRead)
    expect(thirdWord.className).not.toContain(styles.wordRead)

    utterance?.onend?.({} as SpeechSynthesisEvent)
    // Speech finished normally — the read-so-far state stays as it is, it doesn't clear.
    expect(firstWord.className).toContain(styles.wordRead)
    expect(secondWord.className).toContain(styles.wordRead)
  })

  it('falls back to an estimated word-by-word "read so far" reveal when the voice never fires onboundary', async () => {
    // Some installed voices speak fine but never actually emit `onboundary` at all — the
    // fallback should still animate the reveal in that case, not leave it permanently off.
    Object.defineProperty(window.speechSynthesis, 'speaking', {
      value: true,
      configurable: true,
    })
    renderPage()
    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))

    const firstWord = screen.getByText('Welcome')
    await waitFor(() => expect(firstWord.className).toContain(styles.wordRead), {
      timeout: 1000,
    })
  })

  it('reads the instructions aloud shortly after mount', async () => {
    renderPage()
    // The mount-time speak call is deliberately delayed (some browsers drop it if it fires
    // the instant the page loads) — assert it hasn't fired yet, then wait for it to.
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled()
    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
    expect(utterance?.text).toBe(INSTRUCTIONS_TEXT)
  })

  it('hides "I\'m Ready to Begin" until the reading is finished', () => {
    renderPage()
    expect(screen.queryByRole('link', { name: /Ready to Begin/ })).not.toBeInTheDocument()
  })

  it('shows "I\'m Ready to Begin" once the reading finishes', async () => {
    renderPage()
    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
    utterance?.onend?.({} as SpeechSynthesisEvent)

    const beginLink = await screen.findByRole('link', { name: /Ready to Begin/ })
    expect(beginLink).toHaveAttribute('href', '/assessment/memory-and-thinking')
  })

  it('still hides "I\'m Ready to Begin" partway through the reading, before the halfway point', async () => {
    renderPage()
    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]

    // charIndex 65 is where "let's" (the 11th of 38 words) starts — well before halfway.
    utterance?.onboundary?.({ name: 'word', charIndex: 65 } as SpeechSynthesisEvent)
    await waitFor(() => expect(screen.getByText("let's").className).toContain(styles.wordRead))
    expect(screen.queryByRole('link', { name: /Ready to Begin/ })).not.toBeInTheDocument()
  })

  it('reveals "I\'m Ready to Begin" once the reading reaches roughly the halfway point, before it finishes', async () => {
    renderPage()
    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]

    // charIndex 103 is where "a" (the 19th of 38 words, just past halfway) starts — later words
    // are still unread, proving this fires mid-reading rather than only on completion.
    utterance?.onboundary?.({ name: 'word', charIndex: 103 } as SpeechSynthesisEvent)

    const beginLink = await screen.findByRole('link', { name: /Ready to Begin/ })
    expect(beginLink).not.toHaveAttribute('tabindex', '-1')
    expect(screen.getByText('them.').className).not.toContain(styles.wordRead)
  })

  it('moves on to the Memory & Thinking task placeholder from "I\'m Ready to Begin"', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() => expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1))
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]?.[0]
    utterance?.onend?.({} as SpeechSynthesisEvent)

    const beginLink = await screen.findByRole('link', { name: /Ready to Begin/ })
    await user.click(beginLink)
    expect(screen.getByText('Begin stub')).toBeInTheDocument()
  })

  it('has no automatically detectable accessibility violations (axe)', async () => {
    const { container } = renderPage()
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
