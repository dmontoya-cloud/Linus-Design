import { useNavigate } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Button } from '@/components/atoms/Button'
import { Logo } from '@/components/atoms/Logo'
import downloadAnimationUrl from './download-animation.lottie?url'
import styles from './BuildingReportPage.module.css'

/** Forces the download `.lottie` animation to center-fit within `.icon`'s box — same `contain`/
 * centered treatment `BuildingReportPage`/`ReportReadyPage` use for their own icons, even though
 * this animation's native aspect ratio (1920x1414, not square) differs from theirs. */
const ICON_LAYOUT: { fit: 'contain'; align: [number, number] } = {
  fit: 'contain',
  align: [0.5, 0.5],
}

/**
 * In-app report — the real destination `BuildingReportPage` hands off to once its loading
 * interstitial finishes, on request: same page chrome (`.page`/`.logo`/`.content`) and title/
 * subtitle treatment as `BuildingReportPage`/`ReportReadyPage`, "following the same rules" per
 * that request, rather than a one-off layout — this is the third and final screen in that same
 * building → ready-to-generate → report sequence. The icon plays once (`autoplay`, no `loop` —
 * a one-shot reveal, not a continuous loop like the loading animation) at `.iconLg`, on request
 * matched to `BuildingReportPage`'s own loading icon size, so it doesn't visibly jump on the
 * hand-off between the two — `ReportReadyPage`'s own success checkmark used to share this size
 * too but has since been sized down on its own (`.iconSuccess`). Both also share `.icon`'s own
 * fade-rise-on-mount entrance, so this page arrives the same way every other screen in this
 * sequence does rather than snapping in. No real PDF exists in this prototype, so "Download my
 * report" has no `onClick` — a static, disabled-in-spirit CTA standing in for a feature that
 * isn't built, same as this funnel's other guessed-timer/no-op stand-ins. "Go to Dashboard" is
 * the same plain `tertiary` variant `ReportReadyPage` uses for its own exit button, on request,
 * reusing `.readyActions` for the same side-by-side layout — this is the one screen in the
 * sequence a visitor can actually leave from without generating anything further, so it gets its
 * own way back to Dashboard where the other two intentionally don't. The second paragraph below
 * the main one uses `.helperText`, on request set to the smallest size in the paragraph type
 * scale, rather than reusing `.subtitle` for both.
 */
export function ReportPage() {
  const navigate = useNavigate()

  return (
    <main className={styles.page}>
      <Logo className={styles.logo} />
      <div className={styles.content}>
        <div className={styles.readyBlock}>
          <DotLottieReact
            src={downloadAnimationUrl}
            autoplay
            layout={ICON_LAYOUT}
            className={`${styles.icon} ${styles.iconLg}`}
          />
          <h1 className={styles.title}>Your report is ready</h1>
          <p className={styles.subtitle}>
            It brings together all three check-ins. It shows your strengths and simple steps you can
            take.
          </p>
          <p className={styles.helperText}>
            You can open it any time. You can print it. You can share it with your doctor.
          </p>
          <div className={styles.readyActions}>
            <Button
              type="button"
              variant="tertiary"
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
            <Button type="button" size="lg">
              Download my report (PDF)
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
