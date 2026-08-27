import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { CheckCircleIcon } from '@/components/atoms/Icon'
import { createSpeechBurstDetector } from './speechBurstDetector'
import { MicrophoneTroubleshootingModal } from './MicrophoneTroubleshootingModal'
import styles from './MicrophoneLevelBars.module.css'

/** Matches `analyser.frequencyBinCount` exactly (fftSize 64 → 32 bins) below — enough bars to
 * fill the box edge-to-edge while staying narrow (see .barTrack), without going past the number
 * of real frequency bins available (which would leave trailing bars permanently flat). */
const BAR_COUNT = 32
/** Percent height at silence — bars never fully flatten to 0, so they read as "listening"
 * rather than "broken/empty" while the visitor is quiet. */
const IDLE_HEIGHT_PERCENT = 12

type PermissionState = 'pending' | 'granted' | 'denied'

export interface MicrophoneLevelBarsProps {
  /** Whether burst detection is allowed to run and confirm the mic. Defaults to `true` so this
   * component stays usable standalone; `DeviceSetupPage` passes `false` while its own
   * instructions are still being read aloud. Bars keep showing live input either way — only the
   * confirmation logic is gated. */
  detectionEnabled?: boolean
  /** Fires once, the moment the burst detector confirms the mic — right as this component
   * swaps its own display to the checkmark, not instead of it. Lets a parent page sequence what
   * happens after (e.g. holding on that checkmark briefly, then a spinner, then moving on) without
   * duplicating the confirmation logic itself. */
  onConfirmed?: () => void
}

/**
 * A live bar visualizer driven by real microphone input — this is a genuine device check, not
 * a canned animation, since a fake one couldn't actually verify anything. Requests
 * `getUserMedia({ audio: true })` on mount (a real browser permission prompt); on success, an
 * `AnalyserNode` reads frequency data every animation frame, averaged into `BAR_COUNT` (32,
 * narrow bars packed edge-to-edge across the box rather than a few wide ones stretched to fill
 * it) buckets so each bar reflects a different slice of the incoming sound rather than all of
 * them moving identically — reads as a proper spectrum, not a single pulsing block. Bar heights are
 * written directly to each bar's `style.height` via refs, not React state — this runs on every
 * animation frame, and re-rendering the component that often would be wasteful. The audio graph
 * only ever reads from the microphone (`source` connects to `analyser`, never to
 * `audioContext.destination`) — nothing is played back or recorded. All three states (live
 * bars, the denied-permission explanation, the confirmed checkmark below) sit inside the same
 * white pill-shaped `.box` card `TestSoundPlayer` uses one step earlier in this flow, so the
 * "device status" card looks the same across both steps and doesn't pop in or out as this one
 * swaps between its own states. Denied/unavailable permission shows a plain-language explanation
 * and a retry, since silently showing dead bars would look broken rather than explain what to do
 * about it. The mic stream and audio context are torn down on unmount (and before any retry) so
 * the browser's mic-in-use indicator doesn't linger after this screen goes away.
 *
 * This is also the one making the call that the microphone works, not just leaving it to the
 * visitor to eyeball the bars: `createSpeechBurstDetector` watches the same per-frame audio
 * level and, as soon as it sees roughly 3-4 words' worth of continuous speech, swaps the bars
 * for a checkmark right away — no need to pause and repeat like a classic "testing, testing,
 * testing" mic check, which felt slow in practice. It's a level/timing check, not real speech
 * recognition — nothing is transcribed and no words are matched, since real speech-to-text would
 * mean sending live microphone audio to a third-party cloud service in most browsers, not a call
 * to make silently for a healthcare-adjacent prototype. Detection only runs while
 * `detectionEnabled` is true — the mic can already hear the device's own voice-over playing
 * through its speakers while the instructions are being read, and without this gate that
 * playback alone could trip the "microphone is working" confirmation before the visitor has
 * said a word. `detectionEnabled` is read from a ref inside the animation-frame loop (not
 * captured at effect-start) so it can flip mid-stream, once the reading actually finishes,
 * without tearing down and restarting the whole audio graph. Browser permission being granted
 * doesn't guarantee sound is actually reaching the mic (wrong input device, a hardware mute,
 * an OS-level block) — since there's no reliable way to tell that apart from "the visitor just
 * hasn't spoken yet," a "Troubleshooting" link sits below the bars once access is granted,
 * opening `MicrophoneTroubleshootingModal` with a general checklist rather than guessing at a
 * cause. `onConfirmed` fires alongside the internal swap to the checkmark, not instead of it —
 * `DeviceSetupPage`'s mic step uses it to sequence what happens after (hold on the checkmark,
 * then a spinner, then move on) without this component needing to know anything about that flow.
 */
export function MicrophoneLevelBars({
  detectionEnabled = true,
  onConfirmed,
}: MicrophoneLevelBarsProps = {}) {
  const barRefs = useRef<(HTMLDivElement | null)[]>([])
  const [permissionState, setPermissionState] = useState<PermissionState>('pending')
  const [attempt, setAttempt] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [troubleshootingOpen, setTroubleshootingOpen] = useState(false)
  const detectionEnabledRef = useRef(detectionEnabled)
  const onConfirmedRef = useRef(onConfirmed)

  useEffect(() => {
    detectionEnabledRef.current = detectionEnabled
  }, [detectionEnabled])

  useEffect(() => {
    onConfirmedRef.current = onConfirmed
  }, [onConfirmed])

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
        setConfirmed(false)
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
        const burstDetector = createSpeechBurstDetector()

        const tick = () => {
          analyser.getByteFrequencyData(data)
          let overallSum = 0
          for (let bar = 0; bar < BAR_COUNT; bar++) {
            let sum = 0
            for (let j = bar * bucketSize; j < bar * bucketSize + bucketSize; j++) {
              sum += data[j] ?? 0
            }
            overallSum += sum
            const level = sum / bucketSize / 255
            const el = barRefs.current[bar]
            if (el) {
              el.style.height = `${IDLE_HEIGHT_PERCENT + level * (100 - IDLE_HEIGHT_PERCENT)}%`
            }
          }
          if (detectionEnabledRef.current) {
            const overallLevel = overallSum / (bucketSize * BAR_COUNT) / 255
            if (burstDetector.update(overallLevel, performance.now())) {
              setConfirmed(true)
              onConfirmedRef.current?.()
              return
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
      <div className={[styles.denied, styles.box].join(' ')}>
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

  if (confirmed) {
    return (
      <div
        className={[styles.confirmed, styles.box].join(' ')}
        role="img"
        aria-label="Microphone is working"
      >
        <CheckCircleIcon className={styles.confirmedIcon} />
        <p className={styles.confirmedText}>Microphone is working</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div
        className={[styles.bars, styles.box].join(' ')}
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
      {permissionState === 'granted' ? (
        <Button variant="tertiary" size="sm" onClick={() => setTroubleshootingOpen(true)}>
          Troubleshooting
        </Button>
      ) : null}
      <MicrophoneTroubleshootingModal
        open={troubleshootingOpen}
        onClose={() => setTroubleshootingOpen(false)}
      />
    </div>
  )
}
