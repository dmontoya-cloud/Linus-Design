import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useAuth } from '@/auth'
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

/** How long "Download my report (PDF)" shows its loading spinner before handing off to
 * Dashboard, on request — no real PDF exists in this prototype, so this is a guessed delay
 * standing in for however long a real download/generation would actually take, same caveat as
 * this funnel's other guessed timers (`BuildingReportPage`'s own `REPORT_DELAY_MS`). */
const DOWNLOAD_DELAY_MS = 4000

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
 * sequence does rather than snapping in. No real PDF exists in this prototype, so clicking
 * "Download my report (PDF)" shows the button's own built-in `loading` spinner (see
 * `Button`'s doc comment) for `DOWNLOAD_DELAY_MS`, then navigates to Dashboard — standing in for
 * a real download, same guessed-timer caveat as this funnel's other stand-ins (e.g.
 * `BuildingReportPage`'s `REPORT_DELAY_MS`). Disabled while downloading, on request, so it can't
 * be re-clicked mid-"download"; "Go to Dashboard" stays enabled throughout since it's a real,
 * immediate exit rather than part of the download flow. Clicking Download also calls
 * `useAuth().markReportBuilt`, on request — Dashboard's `FullCheckInCard` reads this to stop
 * offering "Build my report" once one has actually been downloaded, only offering it again once
 * a newly completed activity makes `hasBuiltReport` stale (see that flag's own doc comment).
 * Once the download "finishes", on request, it hands off to Dashboard with
 * `location.state.showSurvey`, so `DashboardPage` can show `PostReportSurvey` — a short feedback
 * card — only after an actual download, not on every Dashboard visit. "Go to Dashboard" is the
 * same plain
 * `tertiary` variant `ReportReadyPage` uses for its own exit button, on request, reusing
 * `.readyActions` for the same side-by-side layout — this is the one screen in the sequence a
 * visitor can actually leave from without generating anything further, so it gets its own way
 * back to Dashboard where the other two intentionally don't. The second paragraph below the main
 * one uses `.helperText`, on request set to the smallest size in the paragraph type scale, rather
 * than reusing `.subtitle` for both.
 */
export function ReportPage() {
  const navigate = useNavigate()
  const { markReportBuilt } = useAuth()
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (!isDownloading) return
    const timer = window.setTimeout(
      () => navigate('/dashboard', { state: { showSurvey: true } }),
      DOWNLOAD_DELAY_MS,
    )
    return () => window.clearTimeout(timer)
  }, [isDownloading, navigate])

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
            <Button
              type="button"
              size="lg"
              loading={isDownloading}
              disabled={isDownloading}
              onClick={() => {
                setIsDownloading(true)
                markReportBuilt()
              }}
            >
              Download my report (PDF)
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
