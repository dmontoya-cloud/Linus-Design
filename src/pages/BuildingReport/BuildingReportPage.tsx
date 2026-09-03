import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Logo } from '@/components/atoms/Logo'
import loadingAnimationUrl from './loading-animation.lottie?url'
import styles from './BuildingReportPage.module.css'

/** Forces the loading `.lottie` animation to center-fit within `.icon`'s box — shared with
 * `ReportReadyPage`'s own success animation so both land at the same spot inside the same-sized
 * box, even though the two pages never actually show at the same time any more. */
const ICON_LAYOUT: { fit: 'contain'; align: [number, number] } = {
  fit: 'contain',
  align: [0.5, 0.5],
}

/** How long each "Did you know" fact stays up before rotating to the next one, on request. */
const TIP_ROTATION_MS = 15000

/** How long this loading interstitial stays up before handing off to `/report`, on request —
 * there's no real report-generation process behind it yet, so this is a guessed timer standing
 * in for whatever should actually trigger that handoff once one exists, same caveat as this
 * page's loading Lottie standing in for that process's progress. */
const REPORT_DELAY_MS = 30000

/** Mock brain-health facts — this prototype has no real report to pull one from, so this is a
 * fixed list rather than anything sourced from the visitor's own results. Cycles in a fixed
 * order rather than at random, on request, so the same walkthrough is reproducible. */
const TIPS = [
  {
    title: 'Your brain loves a bedtime routine.',
    body: 'Doing the same relaxing things before bed can help your body know it’s time to wind down.',
  },
  {
    title: 'Movement is medicine for your mind.',
    body: 'Just 30 minutes of walking a few times a week is linked to sharper memory and a better mood.',
  },
  {
    title: 'Staying social keeps your brain active.',
    body: 'Regular conversation with friends and family is one of the best-studied ways to help protect memory as you age.',
  },
  {
    title: 'Sleep is when your brain files things away.',
    body: 'Getting 7–9 hours a night gives your brain time to consolidate what you learned and experienced that day.',
  },
  {
    title: 'What you eat shapes how you think.',
    body: 'Diets rich in vegetables, fish, and healthy fats are consistently linked to better long-term brain health.',
  },
]

/**
 * Building your report — the loading interstitial shown once a visitor actually asks for their
 * report, reached only from `ReportReadyPage`'s "Generate report" button or Dashboard's own
 * "Build my report" once all three activities are done (via `FullCheckInCard`) — never reached
 * directly from finishing an activity any more, on request: this page and `ReportReadyPage` used
 * to be one page with an in-place "building" → "ready" transition, which meant finishing an
 * activity always sat through this 30-second loading screen before showing what it actually
 * finished. `ReportReadyPage` is that confirmation now, reached directly; this page is purely
 * the "generating" wait in between it and the real report. Auto-advances to `/report` after
 * `REPORT_DELAY_MS` — no real report-building process exists yet, so this is a guessed timer
 * standing in for one. No `DashboardNavBar` or other chrome, same as Loading/Setting Up/Thanks.
 */
export function BuildingReportPage() {
  const navigate = useNavigate()
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((index) => (index + 1) % TIPS.length)
    }, TIP_ROTATION_MS)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/report'), REPORT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [navigate])

  // `tipIndex` is always kept in range by the modulo in the rotation interval above, so this
  // index is never out of bounds — the non-null assertion just satisfies noUncheckedIndexedAccess.
  const tip = TIPS[tipIndex]!

  return (
    <main className={styles.page}>
      <Logo className={styles.logo} />
      <div className={styles.content}>
        <div className={styles.buildingBlock}>
          <DotLottieReact
            src={loadingAnimationUrl}
            loop
            autoplay
            layout={ICON_LAYOUT}
            className={`${styles.icon} ${styles.iconLg}`}
          />
          <h1 className={styles.title} role="status" aria-live="polite">
            Building your report…
          </h1>
          <p className={styles.subtitle}>
            This could take up to 5 minutes.
            <br />
            Please stay on this screen.
          </p>
          <div className={styles.tipCard}>
            {/* The "Did you know" label stays fixed and unanimated across rotations, on
                request — only the fact itself (title, then body) pushes up and fades in, via
                `key` remounting this wrapper on every rotation. Title and body each play their
                own staggered `fade-rise-tip` (see `.tipTitle`/`.tipBody`) — one element after
                another, on request, rather than the two animating in together as one block. */}
            <p className={styles.tipEyebrow}>Did you know</p>
            <div key={tipIndex}>
              <p className={styles.tipTitle}>{tip.title}</p>
              <p className={styles.tipBody}>{tip.body}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
