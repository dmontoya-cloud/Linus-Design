import { describe, expect, it } from 'vitest'
import { createSpeechBurstDetector } from './speechBurstDetector'

/** Feeds a constant level for a span of simulated time, one "frame" every 16ms (~60fps), and
 * returns the detector's last result. */
function feedFor(
  detector: ReturnType<typeof createSpeechBurstDetector>,
  level: number,
  durationMs: number,
  startAt: number,
) {
  let now = startAt
  let confirmed = false
  const end = startAt + durationMs
  while (now <= end) {
    confirmed = detector.update(level, now)
    now += 16
  }
  return { confirmed, endedAt: now }
}

describe('createSpeechBurstDetector', () => {
  it('confirms right away once one continuous burst passes the default minimum duration (~3-4 words), no pause-and-repeat needed', () => {
    const detector = createSpeechBurstDetector()
    const { confirmed } = feedFor(detector, 0.5, 3000, 0)
    expect(confirmed).toBe(true)
    expect(detector.burstsDetected).toBe(1)
  })

  it('does not confirm before the minimum burst duration has elapsed', () => {
    const detector = createSpeechBurstDetector({ minBurstDurationMs: 700 })
    const { confirmed } = feedFor(detector, 0.5, 300, 0)
    expect(confirmed).toBe(false)
    expect(detector.burstsDetected).toBe(0)
  })

  it('does not confirm on bursts shorter than the minimum duration (ignores blips)', () => {
    const detector = createSpeechBurstDetector({ minBurstDurationMs: 150 })
    let now = 0
    for (let i = 0; i < 5; i++) {
      // Loud for only 50ms, well under the 150ms minimum, then silent for 100ms.
      const loud = feedFor(detector, 0.5, 50, now)
      now = loud.endedAt
      const quiet = feedFor(detector, 0.0, 100, now)
      now = quiet.endedAt
    }
    expect(detector.burstsDetected).toBe(0)
  })

  it('confirms after enough distinct bursts when requiredBursts is raised above the default', () => {
    const detector = createSpeechBurstDetector({ requiredBursts: 3, minBurstDurationMs: 150 })
    let now = 0
    let confirmed = false
    for (let i = 0; i < 3; i++) {
      const loud = feedFor(detector, 0.6, 200, now)
      now = loud.endedAt
      confirmed = loud.confirmed
      const quiet = feedFor(detector, 0.0, 200, now)
      now = quiet.endedAt
    }
    expect(detector.burstsDetected).toBe(3)
    expect(confirmed).toBe(true)
  })

  it('does not confirm on only 2 of a required 3 distinct bursts', () => {
    const detector = createSpeechBurstDetector({ requiredBursts: 3, minBurstDurationMs: 150 })
    let now = 0
    for (let i = 0; i < 2; i++) {
      const loud = feedFor(detector, 0.6, 200, now)
      now = loud.endedAt
      const quiet = feedFor(detector, 0.0, 200, now)
      now = quiet.endedAt
    }
    expect(detector.burstsDetected).toBe(2)
  })

  it('requires dropping below the silence threshold before counting a new burst (hysteresis)', () => {
    const detector = createSpeechBurstDetector({
      speakingThreshold: 0.16,
      silenceThreshold: 0.08,
      minBurstDurationMs: 150,
    })
    let now = 0
    // Loud, long enough to count as burst 1.
    const first = feedFor(detector, 0.5, 200, now)
    now = first.endedAt
    // Dips to a level between the two thresholds — not loud, but not below the silence
    // threshold either — then back to loud. Should still read as one continuous burst.
    const wobble = feedFor(detector, 0.12, 100, now)
    now = wobble.endedAt
    const stillLoud = feedFor(detector, 0.5, 200, now)
    now = stillLoud.endedAt
    expect(detector.burstsDetected).toBe(1)
  })

  it('respects a custom requiredBursts count', () => {
    const detector = createSpeechBurstDetector({ requiredBursts: 1, minBurstDurationMs: 150 })
    const { confirmed } = feedFor(detector, 0.5, 200, 0)
    expect(confirmed).toBe(true)
  })
})
