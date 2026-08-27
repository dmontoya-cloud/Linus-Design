import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { CheckCircleIcon } from '@/components/atoms/Icon'
import { DashboardNavBar } from '../DashboardNavBar'
import { cascadeDelay } from '../cascade'
import styles from './DeviceReadyPage.module.css'

/** Shown in the nav bar in place of the usual Assessment/History/Settings links — same
 * activity context as every other screen in this device-check flow. */
const ACTIVITY_NAME = 'Memory & Thinking'

/**
 * Device Ready — the screen `DeviceSetupPage`'s microphone check hands off to once the mic is
 * confirmed working, automatically: no button click gets you here, `MicrophoneCheckStep` holds
 * on its own checkmark briefly, then shows a spinner, then navigates here on its own (see
 * `DeviceSetupPage`'s `MicrophoneCheckStep` for that sequencing — this page itself has no
 * knowledge of it, it's just where that hand-off lands). A simple, static confirmation — no
 * voice-over, no reveal-gated button, no live device check of its own — since both device checks
 * are already done by the time a visitor sees this; all that's left is confirming it and moving
 * on. "Continue to test" leads to `ShoppingListIntroPage` — the actual Memory & Thinking task
 * flow. Its `DashboardNavBar` uses `exitVariant="outline"` — a bordered pill with a
 * `SignOutIcon` — the same Exit style `DeviceSetupPage` and `ShoppingListIntroPage` use, on
 * request, so the whole device-setup-through-assessment-task flow looks consistent.
 */
export function DeviceReadyPage() {
  return (
    <div className={styles.page}>
      <DashboardNavBar title={ACTIVITY_NAME} exitTo="/dashboard" exitVariant="outline" />
      <main className={styles.content}>
        <div className={styles.card}>
          <div
            className={[styles.badge, styles.reveal].join(' ')}
            style={{ animationDelay: cascadeDelay(0) }}
          >
            <CheckCircleIcon className={styles.badgeIcon} />
          </div>
          <h1
            className={[styles.title, styles.reveal].join(' ')}
            style={{ animationDelay: cascadeDelay(1) }}
          >
            Your device is working properly.
          </h1>
          <p
            className={[styles.subtitle, styles.reveal].join(' ')}
            style={{ animationDelay: cascadeDelay(2) }}
          >
            You are ready. Find a comfortable position. We will begin now.
          </p>
          <Link
            to="/assessment/memory-and-thinking/task"
            className={`${buttonClassName('primary', 'lg')} ${styles.reveal}`}
            style={{ animationDelay: cascadeDelay(3) }}
          >
            Continue to test
          </Link>
        </div>
      </main>
    </div>
  )
}
