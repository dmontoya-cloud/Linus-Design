import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import styles from './MicrophoneLevelBars.module.css'

const BAR_COUNT = 5
/** Percent height at silence — bars never fully flatten to 0, so they read as "listening"
 * rather than "broken/empty" while the visitor is quiet. */
const IDLE_HEIGHT_PERCENT = 12

type PermissionState = 'pending' | 'granted' | 'denied'

/**
 * A live bar visualizer driven by real microphone input — this is a genuine device check, not
 * a canned animation, since a fake one couldn't actually verify anything. Requests
 * `getUserMedia({ audio: true })` on mount (a real browser permission prompt); on success, an
 * `AnalyserNode` reads frequency data every animation frame, averaged into `BAR_COUNT` buckets
 * so each bar reflects a different slice of the incoming sound rather than all five moving
 * identically. Bar heights are written directly to each bar's `style.height` via refs, not
 * React state — this runs on every animation frame, and re-rendering the component that often
 * would be wasteful. The audio graph only ever reads from the microphone (`source` connects to
 * `analyser`, never to `audioContext.destination`) — nothing is played back or recorded.
 * Denied/unavailable permission shows a plain-language explanation and a retry, since silently
 * showing dead bars would look broken rather than explain what to do about it. The mic stream
 * and audio context are torn down on unmount (and before any retry) so the browser's
 * mic-in-use indicator doesn't linger after this screen goes away.
 */
export function MicrophoneLevelBars() {
  const barRefs = useRef<(HTMLDivElement | null)[]>([])
  const [permissionState, setPermissionState] = useState<PermissionState>('pending')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    let stream: MediaStream | undefined
    let audioContext: AudioContext | undefined
    let rafId: number | undefined

    async function start() {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setPermissionState('denied')
        return
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        setPermissionState('granted')
        audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 64
        analyser.smoothingTimeConstant = 0.6
        // Only ever reads from the mic — never connected to `audioContext.destination`, so
        // nothing is played back.
        source.connect(analyser)
        const data = new Uint8Array(analyser.frequencyBinCount)
        const bucketSize = Math.max(1, Math.floor(data.length / BAR_COUNT))

        const tick = () => {
          analyser.getByteFrequencyData(data)
          for (let bar = 0; bar < BAR_COUNT; bar++) {
            let sum = 0
            for (let j = bar * bucketSize; j < bar * bucketSize + bucketSize; j++) {
              sum += data[j] ?? 0
            }
            const level = sum / bucketSize / 255
            const el = barRefs.current[bar]
            if (el) {
              el.style.height = `${IDLE_HEIGHT_PERCENT + level * (100 - IDLE_HEIGHT_PERCENT)}%`
            }
          }
          rafId = requestAnimationFrame(tick)
        }
        tick()
      } catch {
        if (!cancelled) {
          setPermissionState('denied')
        }
      }
    }

    void start()

    return () => {
      cancelled = true
      if (rafId !== undefined) {
        cancelAnimationFrame(rafId)
      }
      stream?.getTracks().forEach((track) => track.stop())
      void audioContext?.close()
    }
  }, [attempt])

  if (permissionState === 'denied') {
    return (
      <div className={styles.denied}>
        <p className={styles.deniedText}>
          We couldn&apos;t access your microphone. Check your browser&apos;s microphone permissions
          for this site, then try again.
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setPermissionState('pending')
            setAttempt((value) => value + 1)
          }}
        >
          Try again
        </Button>
      </div>
    )
  }

  return (
    <div
      className={styles.bars}
      role="img"
      aria-label={
        permissionState === 'granted'
          ? 'Live microphone input level'
          : 'Waiting for microphone access'
      }
    >
      {Array.from({ length: BAR_COUNT }, (_, index) => (
        <div key={index} className={styles.barTrack}>
          <div
            className={styles.barFill}
            ref={(el) => {
              barRefs.current[index] = el
            }}
          />
        </div>
      ))}
    </div>
  )
}
