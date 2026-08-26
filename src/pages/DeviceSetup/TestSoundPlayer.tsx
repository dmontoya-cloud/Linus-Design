import { useEffect, useRef, useState } from 'react'
import { PlayIcon } from '@/components/atoms/Icon'
import styles from './TestSoundPlayer.module.css'

/** Total length of the synthesized chirp sequence below — kept in sync with it by hand, since
 * Web Audio schedules its own oscillators independently of this timeline UI. */
const CHIRP_DURATION_MS = 2400

/** Two quick three-note trills (a common, recognizable "bird call" shape: a fast rise, a dip,
 * then another rise), synthesized entirely with oscillators — not a recording or stock sound
 * file, consistent with this prototype's other original assets (see `ReadingCompanion`,
 * `DeviceSetupCompanion`). Each note is its own short sine tone with a fade-in/out gain
 * envelope, so it reads as a chirp rather than clicking on/off. */
function playBirdChirp(audioContext: AudioContext) {
  const now = audioContext.currentTime
  const notes: { start: number; duration: number; from: number; to: number }[] = [
    { start: 0, duration: 0.16, from: 1800, to: 2600 },
    { start: 0.22, duration: 0.12, from: 2400, to: 1900 },
    { start: 0.4, duration: 0.16, from: 2000, to: 2800 },
    { start: 1.1, duration: 0.16, from: 1800, to: 2600 },
    { start: 1.32, duration: 0.12, from: 2400, to: 1900 },
    { start: 1.5, duration: 0.16, from: 2000, to: 2800 },
  ]
  for (const note of notes) {
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(note.from, now + note.start)
    oscillator.frequency.linearRampToValueAtTime(note.to, now + note.start + note.duration)
    gain.gain.setValueAtTime(0, now + note.start)
    gain.gain.linearRampToValueAtTime(0.2, now + note.start + note.duration * 0.3)
    gain.gain.linearRampToValueAtTime(0, now + note.start + note.duration)
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(now + note.start)
    oscillator.stop(now + note.start + note.duration + 0.02)
  }
}

/**
 * The "test sound" `DeviceSetupPage`'s hearing-check paragraph promises — a small player (play
 * button + progress timeline) that synthesizes and plays a short bird-chirp sound via the Web
 * Audio API, so a visitor can confirm they can actually hear their device's audio output. Fully
 * synthesized rather than an embedded audio file — no stock/licensed sound asset, same
 * reasoning as this flow's hand-drawn illustrations. The timeline's progress is driven by a
 * plain timer against `CHIRP_DURATION_MS` (Web Audio has no single "is this graph still
 * playing" signal to read back), reset automatically once that duration elapses. The button
 * disables while playing — this is a one-shot test sound, not something to pause/scrub.
 */
export function TestSoundPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
      void audioContextRef.current?.close()
    },
    [],
  )

  function handlePlay() {
    if (isPlaying) {
      return
    }
    const audioContext = audioContextRef.current ?? new AudioContext()
    audioContextRef.current = audioContext
    if (audioContext.state === 'suspended') {
      void audioContext.resume()
    }
    playBirdChirp(audioContext)
    setIsPlaying(true)
    setProgress(0)
    const startedAt = performance.now()
    const tick = () => {
      const elapsed = performance.now() - startedAt
      if (elapsed >= CHIRP_DURATION_MS) {
        setProgress(1)
        setIsPlaying(false)
        rafIdRef.current = null
        return
      }
      setProgress(elapsed / CHIRP_DURATION_MS)
      rafIdRef.current = requestAnimationFrame(tick)
    }
    rafIdRef.current = requestAnimationFrame(tick)
  }

  return (
    <div className={styles.player}>
      <button
        type="button"
        className={styles.playButton}
        onClick={handlePlay}
        disabled={isPlaying}
        aria-label={isPlaying ? 'Playing test sound' : 'Play test sound'}
      >
        <PlayIcon className={styles.playIcon} />
      </button>
      <div className={styles.timelineTrack}>
        <div className={styles.timelineFill} style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  )
}
