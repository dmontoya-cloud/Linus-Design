import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { AnswerOption } from '@/components/atoms/AnswerOption'
import { SpeakerHighIcon, MicrophoneIcon, CheckCircleIcon } from '@/components/atoms/Icon'
import { DashboardNavBar } from '../../DashboardNavBar'
import flowStyles from '../QuestionFlowPage.module.css'
import styles from './DeviceSetupPage.module.css'

const ACTIVITY_NAME = 'Memory & Thinking'

type Screen = 'allow-access' | 'sound-test' | 'mic-test' | 'done'

const SCREENS: Screen[] = ['allow-access', 'sound-test', 'mic-test', 'done']

const HEAR_SOUND_OPTIONS = ['Yes, I can hear it', "No, I can't hear it"]

/** Requests the real native browser microphone-permission prompt (Figma's own "Stage 1: Allow
 * Access Modal" frame is a static illustration of that same prompt — this page calls the real
 * `getUserMedia` API instead of recreating it as a mockup, on request, so visitors see their
 * actual browser's own dialog). Immediately stops the resulting track either way, matching this
 * screen's own "Your microphone will turn off when testing is complete" copy. Neither outcome
 * blocks the flow: nothing past this screen is wired to a real audio signal yet (see this page's
 * own doc comment), so Allow and Deny both just advance to the next screen, on request. */
async function requestMicrophoneAccess(): Promise<void> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach((track) => track.stop())
  } catch {
    // Denied, dismissed, or no microphone available — advance regardless (see this function's
    // own doc comment).
  }
}

/**
 * Device Setup — the mic-permission step reinstated between `MemoryThinkingDetailsPage`'s "I'm
 * ready" and `MemoryThinkingTaskPage`'s first screen, on request: Figma's "Section 3" (node
 * 1728:9441, file `uajF7CIU6kCyd2epbvlNNl`) rebuilt with this app's own design-system
 * tokens/components. An earlier version of this same step ran a real live sound-level check and
 * spoke its instructions aloud via the browser's own speech synthesis; that whole approach stays
 * archived (git branch `archive/memory-thinking-device-setup-voiceover`) rather than revived — on
 * request, this page is click-through only, with one deliberate exception: "Allow Access" calls
 * the real `navigator.mediaDevices.getUserMedia` (see `requestMicrophoneAccess`), because showing
 * that actual browser prompt is the one thing about this step that's real. "Let's test your
 * sound" and "Now, let's check your microphone" both auto-advance in Figma's own copy ("This
 * screen will move on automatically once sound is detected") — this page shows their idle
 * artwork only (no fake "sound detected" state to avoid claiming a signal that was never
 * captured) and advances on an ordinary Continue click instead, the same "every step advances on
 * a click, even ones Figma shows auto-advancing" approach `MemoryThinkingTaskPage`'s own doc
 * comment already uses for its listen/recording steps. "Back" on the very first screen exits to
 * `/assessment/start` (`MemoryThinkingDetailsPage`); the last screen's "Let's get started with
 * the activity" hands off to `MemoryThinkingTaskPage` at `/assessment` instead of advancing to a
 * screen of its own.
 */
export function DeviceSetupPage() {
  const navigate = useNavigate()
  const [screenIndex, setScreenIndex] = useState(0)
  const [heardSound, setHeardSound] = useState<string | undefined>(undefined)

  // `screenIndex` is always kept in `[0, SCREENS.length)` by `handleBack`/`handleNext` below, so
  // this index is never out of bounds — the non-null assertion just satisfies
  // noUncheckedIndexedAccess.
  const screen = SCREENS[screenIndex]!
  const isLastScreen = screenIndex === SCREENS.length - 1

  function isAnswered(): boolean {
    if (screen === 'sound-test') {
      return heardSound !== undefined
    }
    return true
  }

  function handleBack() {
    if (screenIndex === 0) {
      navigate('/assessment/start')
      return
    }
    setScreenIndex((index) => index - 1)
  }

  function handleNext() {
    setScreenIndex((index) => Math.min(index + 1, SCREENS.length - 1))
  }

  async function handleAllowAccess() {
    await requestMicrophoneAccess()
    handleNext()
  }

  function handleFinish() {
    navigate('/assessment')
  }

  function primaryLabel(): string {
    switch (screen) {
      case 'allow-access':
        return 'Allow Access'
      case 'sound-test':
      case 'mic-test':
        return 'Continue'
      case 'done':
        return "Let's get started with the activity"
    }
  }

  function renderScreenContent() {
    switch (screen) {
      case 'allow-access':
        return (
          <>
            <h1 className={flowStyles.question}>
              First, let&rsquo;s get your device ready for this assessment.
            </h1>
            <p className={flowStyles.paragraph}>
              Some tasks ask you to listen and speak your answers out loud.
            </p>
            <p className={flowStyles.paragraph}>To continue, we need access to your microphone.</p>
            <p className={[flowStyles.paragraph, styles.note].join(' ')}>
              Please make sure you have &ldquo;Silent Mode&rdquo; turned off on your device.
            </p>
            <p className={[flowStyles.paragraph, styles.note].join(' ')}>
              Your microphone will turn off when testing is complete.
            </p>
          </>
        )
      case 'sound-test':
        return (
          <fieldset className={flowStyles.fieldset}>
            <div className={styles.iconCircle}>
              <SpeakerHighIcon className={styles.iconGlyph} />
            </div>
            <legend className={[flowStyles.question, styles.centerTitle].join(' ')}>
              Let&rsquo;s test your sound.
            </legend>
            <p className={[flowStyles.paragraph, styles.paragraphStrong].join(' ')}>
              Can you hear a sound playing right now?
            </p>
            <div className={flowStyles.options}>
              {HEAR_SOUND_OPTIONS.map((option) => (
                <AnswerOption
                  key={option}
                  type="radio"
                  name="hear-sound"
                  value={option}
                  label={option}
                  checked={heardSound === option}
                  onChange={() => setHeardSound(option)}
                />
              ))}
            </div>
            <p className={[flowStyles.paragraph, styles.note].join(' ')}>
              Turn up your volume and make sure &ldquo;Silent Mode&rdquo; is off in your phone
              settings.
            </p>
          </fieldset>
        )
      case 'mic-test':
        return (
          <>
            <div className={styles.micRow}>
              <div className={styles.iconCircle}>
                <MicrophoneIcon className={styles.iconGlyph} />
              </div>
              <div className={styles.waveformTrack}>
                <div className={styles.waveformLine} />
              </div>
            </div>
            <p className={[flowStyles.paragraph, styles.centerParagraph, styles.note].join(' ')}>
              Auto-checking your audio&hellip;
            </p>
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              Now, let&rsquo;s check your microphone.
            </h1>
            <p className={[flowStyles.paragraph, styles.centerParagraph].join(' ')}>
              Say <strong>&ldquo;Testing, testing&rdquo;</strong> out loud now.
            </p>
          </>
        )
      case 'done':
        return (
          <>
            <div className={styles.doneBadge}>
              <CheckCircleIcon className={styles.doneGlyph} />
            </div>
            <h1 className={[flowStyles.question, styles.centerTitle].join(' ')}>
              Your device is working properly!
            </h1>
            <p className={[flowStyles.paragraph, styles.centerParagraph].join(' ')}>
              Let&rsquo;s get started with the activity.
            </p>
          </>
        )
    }
  }

  return (
    <div className={flowStyles.page}>
      <DashboardNavBar
        title={ACTIVITY_NAME}
        exitTo="/dashboard"
        exitVariant="outline"
        confirmExit
      />
      <main className={flowStyles.content}>
        <div className={flowStyles.card}>
          {renderScreenContent()}
          <div className={flowStyles.actions}>
            <Button variant="outline" size="lg" onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={!isAnswered()}
              onClick={
                screen === 'allow-access'
                  ? handleAllowAccess
                  : isLastScreen
                    ? handleFinish
                    : handleNext
              }
            >
              {primaryLabel()}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
