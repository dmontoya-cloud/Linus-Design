export interface WordSpan {
  text: string
  start: number
  end: number
}

/** Splits `text` into words with their start/end character offsets, used to match `onboundary`
 * events (which report a character index into the utterance's text) back to which word is
 * currently being spoken. */
function tokenizeWords(text: string): WordSpan[] {
  const spans: WordSpan[] = []
  const pattern = /\S+/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    spans.push({ text: match[0], start: match.index, end: match.index + match[0].length })
  }
  return spans
}

function wordIndexAtCharIndex(words: WordSpan[], charIndex: number): number {
  const exact = words.findIndex((word) => charIndex >= word.start && charIndex < word.end)
  if (exact !== -1) {
    return exact
  }
  // Some browsers report a boundary charIndex that lands on the space between words rather
  // than the word itself — fall back to the next word that starts at or after it.
  const next = words.findIndex((word) => word.start >= charIndex)
  return next === -1 ? words.length - 1 : next
}

/** Picks the best-sounding installed voice available, preferring ones whose name advertises
 * higher quality (a browser/OS convention, not a formal API) over the terse default voice most
 * platforms fall back to. Still just the OS's own speech engine — nothing here can make it
 * sound fully human; that would take an external TTS service (its own API key/cost, which this
 * mock-data-only prototype deliberately avoids). */
function pickPreferredVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) {
    return undefined
  }
  const english = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'))
  const pool = english.length > 0 ? english : voices
  const byName = (pattern: RegExp) => pool.find((voice) => pattern.test(voice.name))
  return (
    byName(/natural/i) ??
    byName(/neural/i) ??
    byName(/enhanced/i) ??
    byName(/premium/i) ??
    byName(/google/i) ??
    pool[0]
  )
}

/** A rough, deliberately approximate per-word duration for the very first playback, before any
 * real timing has been learned — there's no way to know a browser voice's real per-word timing
 * without `onboundary`, so this just has to be plausible, not exact. Scaled by `rate` since a
 * slower utterance genuinely takes longer per word. */
function guessedWordDurationMs(word: string, rate: number): number {
  return Math.round((180 + word.length * 35) / rate)
}

export interface VoiceOverReader {
  /** This reader's script, split into words — render each one, coloring every word up to and
   * including the one `speak`'s `onWordIndex` callback last reported as "read". */
  words: WordSpan[]
  /** `onWordIndex` is called with the furthest word reached so far (by index into `words`), and
   * with `null` before a fresh utterance starts or if it errors out, to reset back to the
   * start. It's deliberately NOT reset to `null` when speech ends normally: the whole script
   * should read as "read" once it's actually finished, not snap back to unread.
   *
   * Reads the script aloud via the browser's own Web Speech API (`speechSynthesis`), favoring
   * whichever installed voice sounds least robotic (see `pickPreferredVoice`) — no external TTS
   * service or API key, consistent with this being a mock-data-only prototype. `cancel()` is
   * only ever called when something is actually speaking/queued (see `cancelSpeech`), since
   * canceling an idle engine is a known way to silently break the very next `speak()` call in
   * Chrome. The live highlight is driven by the utterance's `onboundary` events where the voice
   * supports them, and by an estimated timed guess (recalibrated against real timing once a
   * read-through actually finishes) otherwise — and either way, `onend` snaps the reveal to the
   * very last word the instant speech actually finishes, so the two stay in sync at the end even
   * if the estimate drifted somewhere in the middle. The optional second `onFinished` callback is
   * a *separate*, more trustworthy "done" signal than watching for `onWordIndex` to reach the
   * final index: that estimated fallback can race ahead of the real audio (a guess, not a
   * measurement) and report the last word "read" well before the voice has actually said it — fine
   * for a highlight a few hundred ms off, but wrong for anything that reacts to completion by
   * unmounting/navigating, since that then cancels the still-playing utterance early. `onFinished`
   * only ever fires from the utterance's real `onend`, once speech has genuinely finished. */
  speak: (onWordIndex: (index: number | null) => void, onFinished?: () => void) => void
  /** Chrome has a well-documented bug where calling `speechSynthesis.cancel()` while nothing is
   * actually speaking or queued can leave the engine unable to produce the *next* `speak()` call
   * — silently, with no error. Only canceling when there's really something to cancel avoids
   * ever triggering that on an idle engine (e.g. on first mount, before anything has spoken). */
  cancelSpeech: () => void
  /** Test-only escape hatch — the learned-timing calibration below is deliberately kept for the
   * lifetime of this reader (it should persist across mounts/replays within a session), which
   * means it would otherwise leak between test cases that share one reader. Not used anywhere
   * in the app itself. */
  resetCalibrationForTests: () => void
}

/** Creates an independent voice-over reader for one specific script. Each reader keeps its own
 * generation counter and learned-timing calibration, so two different screens' scripts (with
 * different lengths and different content) never bleed into each other's pacing estimate —
 * call this once per script, at module scope in the page that owns it, and reuse the same
 * reader across that page's mounts/replays. */
export function createVoiceOverReader(text: string): VoiceOverReader {
  const words = tokenizeWords(text)
  const totalChars = words.reduce((sum, word) => sum + word.text.length, 0)

  /** Bumped every time `speak()` starts a new utterance — lets the estimated-highlight fallback
   * recognize it's been superseded by a newer call and stop touching state, without needing a
   * cancellation token/AbortController for what's otherwise a fire-and-forget loop. Also bumped
   * when an utterance ends naturally, so any of its own still-pending estimate timers stop too
   * — otherwise one could fire afterward and drag the highlight backward from the "fully read"
   * state `onend` just set. */
  let currentGeneration = 0

  /** How long each character of this script actually took to speak the last time it played all
   * the way through — learned from real `onend` timing, so a replay can pace itself against
   * real, measured data instead of the first pass's rougher guess. `null` until one full
   * read-through has actually completed. */
  let calibratedMsPerChar: number | null = null

  function cancelSpeech() {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return
    }
    const synth = window.speechSynthesis
    if (synth.speaking || synth.pending) {
      synth.cancel()
    }
  }

  function runEstimatedHighlight(
    generation: number,
    shouldStopEstimating: () => boolean,
    onWordIndex: (index: number | null) => void,
    rate: number,
  ) {
    let index = 0
    const step = () => {
      if (generation !== currentGeneration || shouldStopEstimating()) {
        return
      }
      const word = words[index]
      if (!window.speechSynthesis?.speaking || !word) {
        // Reached the last word or the engine stopped — leave the read-so-far state as it is
        // rather than clearing it (see `speak`'s `onend`, which does the same).
        return
      }
      onWordIndex(index)
      const duration =
        calibratedMsPerChar !== null
          ? Math.round(word.text.length * calibratedMsPerChar)
          : guessedWordDurationMs(word.text, rate)
      window.setTimeout(step, duration)
      index += 1
    }
    // A small head start accounts for the real, unavoidable latency between calling `speak()`
    // and the engine actually starting to produce audible sound — far shorter than waiting to
    // first find out whether this voice will ever fire a real `onboundary` event (most don't).
    window.setTimeout(step, 80)
  }

  function speak(onWordIndex: (index: number | null) => void, onFinished?: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return
    }
    cancelSpeech()
    onWordIndex(null)
    currentGeneration += 1
    const generation = currentGeneration
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = pickPreferredVoice(window.speechSynthesis.getVoices())
    if (voice) {
      utterance.voice = voice
    }
    // A touch slower than the 1.0 default, at a neutral pitch, reads as calmer and less
    // clipped than the browser's default cadence.
    utterance.rate = 0.95
    utterance.pitch = 1
    let sawBoundaryEvent = false
    let finished = false
    utterance.onboundary = (event) => {
      // Chrome fires 'word' and 'sentence' boundaries on the same utterance — only word
      // boundaries should move the highlight. Some engines omit `name` entirely; treat that
      // as a word boundary too rather than silently never highlighting anything.
      if (event.name && event.name !== 'word') {
        return
      }
      sawBoundaryEvent = true
      onWordIndex(wordIndexAtCharIndex(words, event.charIndex))
    }
    const startedAt = performance.now()
    utterance.onend = () => {
      finished = true
      // A sanity floor — an `onend` firing almost instantly points at something aborted or
      // broken, not a real completed read-through, and shouldn't poison future replays' timing.
      const elapsedMs = performance.now() - startedAt
      if (elapsedMs > 1000) {
        calibratedMsPerChar = elapsedMs / totalChars
      }
      // Guard against a *stale* utterance's `onend` (e.g. one just canceled by a newer
      // `speak()` call, which some browsers still fire asynchronously) overwriting the newer
      // one's state.
      if (generation === currentGeneration) {
        onWordIndex(words.length - 1)
        currentGeneration += 1
        onFinished?.()
      }
    }
    utterance.onerror = () => {
      finished = true
      if (generation === currentGeneration) {
        onWordIndex(null)
      }
    }
    window.speechSynthesis.speak(utterance)
    runEstimatedHighlight(
      generation,
      () => sawBoundaryEvent || finished,
      onWordIndex,
      utterance.rate,
    )
  }

  return {
    words,
    speak,
    cancelSpeech,
    resetCalibrationForTests: () => {
      calibratedMsPerChar = null
    },
  }
}
