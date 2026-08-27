import { Modal } from '@/components/atoms/Modal'
import { BrowserMicPermissionMockup } from './BrowserMicPermissionMockup'
import styles from './MicrophoneTroubleshootingModal.module.css'

export interface MicrophoneTroubleshootingModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Opened from the "Troubleshooting" link `MicrophoneLevelBars` shows once access is granted but
 * nothing's confirming — the browser says the mic is available, but that alone doesn't mean
 * sound is actually reaching it (wrong input device selected, a hardware mute switch, an OS-level
 * block that getUserMedia can't see). Since there's no reliable way to tell *which* of those is
 * true from here, this offers the general checklist a visitor could work through themselves,
 * plus `BrowserMicPermissionMockup` — an original illustration of the address-bar permission
 * prompt, for anyone who isn't sure whether they ever actually granted access in the browser
 * itself (as opposed to just seeing this page render past the "denied" state, which only proves
 * they didn't explicitly block it).
 */
export function MicrophoneTroubleshootingModal({
  open,
  onClose,
}: MicrophoneTroubleshootingModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Not hearing anything come through?">
      <p>
        If the bars aren&apos;t moving when you talk, work through this list — it covers the most
        common reasons a browser can say your microphone is available when it isn&apos;t actually
        picking up sound.
      </p>
      <ol className={styles.steps}>
        <li>
          Check your browser actually has microphone access for this site. Look for a microphone
          icon in the address bar, or open the site&apos;s permissions from your browser&apos;s
          menu, and make sure it&apos;s set to <strong>Allow</strong>, not <strong>Block</strong>.
        </li>
        <li>
          Check your computer&apos;s sound settings for the correct microphone as the selected input
          device — especially if you have more than one (a headset, a webcam mic, a built-in one)
          plugged in at once.
        </li>
        <li>
          Check for a physical mute switch or button on your microphone or headset, if it has one.
        </li>
        <li>Make sure no other app is already using the microphone, then try again.</li>
      </ol>
      <p className={styles.exampleLabel}>
        Here&apos;s an example of the kind of permission prompt your browser may have shown when
        this page first asked to use your microphone:
      </p>
      <BrowserMicPermissionMockup />
    </Modal>
  )
}
