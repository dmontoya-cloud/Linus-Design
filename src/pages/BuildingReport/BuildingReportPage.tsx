import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import { Button } from '@/components/atoms/Button'
import styles from './BuildingReportPage.module.css'

/** How long each "Did you know" fact stays up before rotating to the next one, on request. */
const TIP_ROTATION_MS = 15000

/** How long the "building" state stays up before starting the transition to "ready", on
 * request. Same "guessed timer standing in for a real process" caveat as everywhere else on
 * this page — see the component doc below. */
const READY_DELAY_MS = 30000

/** How long the outgoing "building" elements (headline text, subtitle, spinner) take to
 * animate out before the "ready" elements animate in — on request, so switching states reads
 * as one organic motion rather than a hard cut. Quicker than the entrance animations (0.5–0.7s)
 * elsewhere on this page, matching the usual motion-design convention that exits move faster
 * than entrances. */
const EXIT_DURATION_MS = 350

/** The one activity this prototype's mock assessment flow stands in for — matches the id
 * `DashboardPage`'s `PENDING_ACTIVITIES` and `FullCheckInCard`'s `CATEGORIES` both use for
 * Memory & Thinking. "Go to Dashboard" below marks it complete via this id before navigating,
 * standing in for "you just finished a real assessment" until that flow actually exists. */
const COMPLETED_ACTIVITY_ID = 'memory-recall'

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

/** Hand-drawn from plain SVG shapes, same approach as Assessment Intro's `ReadingCompanion` —
 * a browser window standing in for "your report," with a gauge/chart and a couple of list
 * lines inside it to read as a dashboard rather than a blank document. */
function ReportIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 176 176"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="24" y="16" width="128" height="144" rx="10" />
      <line x1="24" y1="48" x2="152" y2="48" />
      <line x1="36" y1="32" x2="42" y2="32" />
      <line x1="50" y1="32" x2="56" y2="32" />
      <line x1="64" y1="32" x2="90" y2="32" />
      <path d="M52 100a24 24 0 0 1 48 0" />
      <line x1="76" y1="100" x2="90" y2="84" />
      <circle cx="76" cy="100" r="2.5" fill="currentColor" stroke="none" />
      <line x1="112" y1="76" x2="136" y2="76" />
      <line x1="112" y1="88" x2="136" y2="88" />
      <line x1="112" y1="100" x2="128" y2="100" />
      <line x1="40" y1="128" x2="88" y2="128" />
      <line x1="40" y1="140" x2="72" y2="140" />
      <rect x="104" y="120" width="32" height="20" rx="3" />
    </svg>
  )
}

/**
 * Building your report — reached today only via each device-setup/assessment screen's "Skip
 * to report" corner link (see App.tsx's `ROUTES_WITH_REPORT_SKIP`), standing in for where a
 * visitor lands once they actually finish the real assessment — that flow doesn't exist yet,
 * so this is a placeholder for a placeholder in a sense, built ahead of it on request. Unlike
 * Loading/Setting Up/Thanks's own brief interstitials, this one does NOT auto-advance to
 * /report — on request, so it can actually be reviewed rather than flashing by in 2 seconds.
 * Instead, after `READY_DELAY_MS` it transitions in place to a "ready" state (headline,
 * spinner, and subtitle swap for a Download report button) — there's no real report-building
 * process behind either state yet, so both are guessed timers standing in for whatever should
 * actually trigger them once one exists. The transition itself is a deliberate two-step
 * animate-out-then-in (see `phase`/`EXIT_DURATION_MS`) rather than a snap, on request. No
 * `DashboardNavBar` or other chrome, same as Loading/Setting Up/Thanks. Once ready, a secondary
 * "Go to Dashboard" button sits alongside Download report — clicking it marks Memory & Thinking
 * complete (see `COMPLETED_ACTIVITY_ID`) so Dashboard's own card/tracker reflect it, then
 * navigates there.
 */
export function BuildingReportPage() {
  const navigate = useNavigate()
  const { completeActivity } = useAuth()
  const [tipIndex, setTipIndex] = useState(0)
  // 'building' -> 'exiting' (headline/subtitle/spinner fade+rise out in place) -> 'ready'
  // (headline text swaps and the Download button fades+rises in). Two states rather than one
  // boolean so the outgoing elements get their own brief animated exit instead of just
  // vanishing the instant the incoming ones are ready to appear.
  const [phase, setPhase] = useState<'building' | 'exiting' | 'ready'>('building')

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTipIndex((index) => (index + 1) % TIPS.length)
    }, TIP_ROTATION_MS)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('exiting'), READY_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (phase !== 'exiting') return
    const timer = window.setTimeout(() => setPhase('ready'), EXIT_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  const isReady = phase === 'ready'
  const isExiting = phase === 'exiting'
  // `tipIndex` is always kept in range by the modulo in the rotation interval above, so this
  // index is never out of bounds — the non-null assertion just satisfies noUncheckedIndexedAccess.
  const tip = TIPS[tipIndex]!

  function handleGoToDashboard() {
    completeActivity(COMPLETED_ACTIVITY_ID)
    navigate('/dashboard')
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <ReportIcon className={styles.icon} />
        {/* `key` only changes once `isReady` flips, so this remounts (replaying `.title`'s own
            fade-rise entrance) exactly once, right as the new headline appears — during
            `isExiting` it's still the same instance, just fading out via `.titleExiting`. */}
        <h1
          key={isReady ? 'ready' : 'building'}
          className={[
            styles.title,
            isExiting ? styles.titleExiting : '',
            isReady ? styles.titleReady : '',
          ]
            .filter(Boolean)
            .join(' ')}
          role="status"
          aria-live="polite"
        >
          {isReady ? 'Your brain health report is ready!' : 'Building your report!'}
        </h1>
        {isReady ? (
          <div className={styles.readyActions}>
            <Button type="button" variant="secondary" size="lg" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
            <Button type="button" size="lg">
              Download report
            </Button>
          </div>
        ) : (
          <>
            <p
              className={[styles.subtitle, isExiting ? styles.subtitleExiting : '']
                .filter(Boolean)
                .join(' ')}
            >
              This could take up to 5 minutes. <strong>Please stay on this screen.</strong>
            </p>
            <div
              className={[styles.spinnerWrap, isExiting ? styles.spinnerWrapExiting : '']
                .filter(Boolean)
                .join(' ')}
              aria-hidden="true"
            >
              <div className={styles.spinnerPulse}>
                <div className={styles.spinnerRing} />
              </div>
            </div>
          </>
        )}
        {!isReady && (
          <div className={styles.tipCard}>
            {/* The "Did you know" label stays fixed and unanimated across rotations, on
                request — only the fact itself (title/body) pushes up and fades in via `key`
                remounting on every rotation, a fluid transition between facts rather than the
                text just snapping to something new every 15 seconds. */}
            <p className={styles.tipEyebrow}>Did you know</p>
            <div key={tipIndex} className={styles.tipContent}>
              <p className={styles.tipTitle}>{tip.title}</p>
              <p className={styles.tipBody}>{tip.body}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
