export interface SpeechBurstDetectorOptions {
  /** Audio level (0–1) above which a frame counts as "speaking". */
  speakingThreshold?: number
  /** Audio level (0–1) a speaking streak must drop below before the next one can count as a new,
   * distinct burst — kept lower than `speakingThreshold` (hysteresis) so level readings
   * wobbling right at the boundary don't get miscounted as several separate bursts. */
  silenceThreshold?: number
  /** How long a streak must stay above `speakingThreshold` before it counts as a real burst
   * rather than a short blip or click. */
  minBurstDurationMs?: number
  /** How many distinct bursts confirm the microphone is working. */
  requiredBursts?: number
}

/**
 * Turns a stream of per-frame audio levels into a "the visitor is actually speaking" signal —
 * without transcribing or matching any actual words (see the Device Setup session's own
 * decision record for why: real speech-to-text would mean sending live microphone audio to a
 * third-party cloud service in most browsers, which isn't a call to make silently for a
 * healthcare-adjacent prototype). Confirms as soon as one continuous burst of speech passes
 * `minBurstDurationMs` — about as long as saying three or four words takes — rather than
 * waiting for several separate pause-separated bursts (the original "testing, testing, testing"
 * shape felt slow and unnatural in practice; a visitor saying pretty much anything out loud for
 * a moment now confirms it right away). `requiredBursts` still exists for anyone who wants a
 * stricter, multi-burst check instead. Kept as a plain, framework-free state machine — fed one
 * `(level, timestamp)` pair per animation frame — so it's directly unit-testable without needing
 * to fake `requestAnimationFrame` timing.
 */
export function createSpeechBurstDetector(options: SpeechBurstDetectorOptions = {}) {
  const speakingThreshold = options.speakingThreshold ?? 0.16
  const silenceThreshold = options.silenceThreshold ?? 0.08
  const minBurstDurationMs = options.minBurstDurationMs ?? 700
  const requiredBursts = options.requiredBursts ?? 1

  let isSpeaking = false
  let burstStartedAt: number | null = null
  let burstCounted = false
  let burstsDetected = 0

  return {
    /** Feeds one frame's audio level and timestamp (both in the caller's own units, typically
     * 0–1 and `performance.now()` ms); returns true once enough distinct bursts have been seen. */
    update(level: number, now: number): boolean {
      if (!isSpeaking && level > speakingThreshold) {
        isSpeaking = true
        burstStartedAt = now
        burstCounted = false
      } else if (isSpeaking && level < silenceThreshold) {
        isSpeaking = false
        burstStartedAt = null
      }

      if (
        isSpeaking &&
        !burstCounted &&
        burstStartedAt !== null &&
        now - burstStartedAt >= minBurstDurationMs
      ) {
        burstCounted = true
        burstsDetected += 1
      }

      return burstsDetected >= requiredBursts
    },
    get burstsDetected() {
      return burstsDetected
    },
  }
}
