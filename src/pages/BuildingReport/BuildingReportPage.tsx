import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useAuth } from '@/auth'
import { Button } from '@/components/atoms/Button'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { ClockIcon } from '@/components/atoms/Icon'
import { Logo } from '@/components/atoms/Logo'
import loadingAnimationUrl from './loading-animation.lottie?url'
import successAnimationUrl from './success-animation.lottie?url'
import styles from './BuildingReportPage.module.css'

/** Forces both the loading and success `.lottie` animations to center-fit within `.icon`'s box
 * (see the JSX comment where this is used) — without it, the two files' own differing internal
 * compositions land at different spots inside the same-sized box, reading as a jump/misalign
 * when one swaps for the other. */
const ICON_LAYOUT: { fit: 'contain'; align: [number, number] } = {
  fit: 'contain',
  align: [0.5, 0.5],
}

/** How long each "Did you know" fact stays up before rotating to the next one, on request. */
const TIP_ROTATION_MS = 15000

/** How long the "building" state stays up before starting the transition to "ready", on
 * request. Same "guessed timer standing in for a real process" caveat as everywhere else on
 * this page — see the component doc below. */
const READY_DELAY_MS = 30000

/** How long the outgoing "building" elements (loading animation, headline text, subtitle) take to
 * animate out before the "ready" elements animate in — on request, so switching states reads
 * as one organic motion rather than a hard cut. Quicker than the entrance animations (0.5–0.7s)
 * elsewhere on this page, matching the usual motion-design convention that exits move faster
 * than entrances. */
const EXIT_DURATION_MS = 350

/** Which activity a visitor just finished, matching the ids `DashboardPage`'s
 * `PENDING_ACTIVITIES` and `FullCheckInCard`'s `CATEGORIES` both use. Every question-flow page
 * (`LifestyleQuestionsPage`, `PrioritiesQuestionsPage`) hands this off via router `state` when
 * its last question completes; the one entry point that doesn't — the "Skip to report" corner
 * link (see App.tsx's `ROUTES_WITH_REPORT_SKIP`) — has no state to pass, so this defaults to
 * Memory & Thinking, standing in for "you just finished the real assessment" until that flow
 * exists. */
const DEFAULT_COMPLETED_ACTIVITY_ID = 'memory-recall'

/** Display title for every activity id this prototype tracks completion for — `NEXT_ACTIVITIES`
 * below already carries Lifestyle/Priorities' titles, but the headline and intro copy also need
 * to name whichever activity was *just* finished, which might be Memory & Thinking (not itself
 * one of the "next" suggestions). */
const ACTIVITY_TITLES: Record<string, string> = {
  'memory-recall': 'Memory & Thinking',
  'speech-pattern': 'Lifestyle',
  'visual-attention': 'Priorities',
}

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

/** The two activities that can be nudged from here — whichever of these isn't already done (see
 * `completedActivityIds`/`completedActivityId` in the component below) gets suggested; on
 * request, an already-completed one is dropped from this list entirely rather than shown with
 * its own "Download report" action, so the suggestion always points at what's actually left, not
 * what's already done. `duration` matches the "About 5 minutes"/"About 7 minutes" shown
 * everywhere else these two activities appear (Dashboard's own `PENDING_ACTIVITIES`), so this
 * prototype never shows two different estimates for the same activity. No `description` field,
 * unlike Dashboard's own `ActivityCard` data — this compact card (see `NextActivityCard` below)
 * is a deliberately smaller, title-and-button-on-one-line variant just for this nudge, on
 * request, not the full card Dashboard uses; Dashboard's own cards are untouched. */
const NEXT_ACTIVITIES = [
  {
    id: 'speech-pattern',
    title: 'Lifestyle',
    duration: 'About 5 minutes',
    startPath: '/assessment/lifestyle',
  },
  {
    id: 'visual-attention',
    title: 'Priorities',
    duration: 'About 7 minutes',
    startPath: '/assessment/priorities',
  },
]

/** A compact nudge card for `NEXT_ACTIVITIES` — title and Start share one row (title left,
 * button right), on request, rather than Dashboard's `ActivityCard` layout (status badge, title,
 * duration, description, then a separate button row at the bottom). No description or status
 * badge here at all, on request — only ever rendered for an activity that isn't done yet (see
 * the filter in the component below), so there's nothing for a badge to distinguish. */
function NextActivityCard({
  title,
  duration,
  startPath,
}: {
  title: string
  duration: string
  startPath: string
}) {
  return (
    <li className={styles.nextActivityCard}>
      <div className={styles.nextActivityHeader}>
        <h3 className={styles.nextActivityTitle}>{title}</h3>
        <Link to={startPath} className={buttonClassName('primary', 'sm')}>
          Start
        </Link>
      </div>
      <p className={styles.nextActivityDuration}>
        <ClockIcon className={styles.nextActivityDurationIcon} />
        {duration}
      </p>
    </li>
  )
}

/**
 * Building your report — reached today only via each device-setup/assessment screen's "Skip
 * to report" corner link (see App.tsx's `ROUTES_WITH_REPORT_SKIP`), standing in for where a
 * visitor lands once they actually finish the real assessment — that flow doesn't exist yet,
 * so this is a placeholder for a placeholder in a sense, built ahead of it on request. Unlike
 * Loading/Setting Up/Thanks's own brief interstitials, this one does NOT auto-advance to
 * /report — on request, so it can actually be reviewed rather than flashing by in 2 seconds.
 * Instead, after `READY_DELAY_MS` it transitions in place to a "ready" state (the loading
 * animation swaps for a success one, and the subtitle swaps for a Download report button and a
 * nudge toward the other two activities) — there's no real report-building process behind
 * either state yet, so both are guessed timers standing in for whatever should actually trigger
 * them once one exists. The transition itself is a real crossfade, not a snap, on request — see
 * `showReady`'s own comment for why the "ready" content mounts as soon as exiting begins rather
 * than waiting for it to finish, so the two overlap in time instead of a sequential vanish-
 * then-reappear. No `DashboardNavBar` or other chrome, same as Loading/Setting Up/Thanks. Once
 * ready, a secondary
 * "Go to Dashboard" button sits alongside Download report — clicking it marks whichever activity
 * was just finished complete (see `completedActivityId` below) so Dashboard's own card/tracker
 * reflect it, then navigates there. The headline, intro copy, and `NEXT_ACTIVITIES` nudges all
 * key off that same id plus `completedActivityIds`, on request — reached after finishing
 * Lifestyle or Priorities (not just the original Memory & Thinking "Skip to report" shortcut),
 * this page shouldn't keep suggesting an activity that's already done.
 */
export function BuildingReportPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { completeActivity, completedActivityIds } = useAuth()
  // Passed via router `state` by whichever question-flow page just finished (see
  // `DEFAULT_COMPLETED_ACTIVITY_ID`'s own comment) — a plain `unknown` read rather than a typed
  // route param, since react-router's `state` isn't itself typed; falls back to Memory & Thinking
  // for the one entry point (the "Skip to report" link) that doesn't pass any.
  const completedActivityId =
    typeof (location.state as { completedActivityId?: unknown } | null)?.completedActivityId ===
    'string'
      ? (location.state as { completedActivityId: string }).completedActivityId
      : DEFAULT_COMPLETED_ACTIVITY_ID
  // Everything already completed before this visit, plus whatever was just finished to land
  // here — the one just finished isn't written to `completedActivityIds` until "Go to Dashboard"
  // is clicked (see `handleGoToDashboard`), so this page computes its own union for display
  // rather than waiting on that click to know what's actually done.
  const allCompletedIds = new Set([...completedActivityIds, completedActivityId])
  const remainingActivities = NEXT_ACTIVITIES.filter(
    (activity) => !allCompletedIds.has(activity.id),
  )
  const completedTitle = ACTIVITY_TITLES[completedActivityId] ?? 'that activity'
  const completedCount = allCompletedIds.size
  const headlineLead =
    completedCount >= 3
      ? 'All activities complete.'
      : completedCount === 2
        ? 'Two activities complete.'
        : 'One activity complete.'
  const [tipIndex, setTipIndex] = useState(0)
  // 'building' -> 'exiting' (the whole building block fades out in place, absolutely
  // positioned, while the ready block mounts underneath it and fades in over the same window —
  // see `showReady`) -> 'ready' (building block gone, ready block settled). Two states rather
  // than one boolean so the outgoing block gets its own brief animated exit instead of just
  // vanishing the instant the incoming one is ready to appear.
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
  // The ready block mounts as soon as exiting begins, not only once it's fully "ready" — so it
  // overlaps in time with the building block's own fade-out instead of waiting for that to
  // finish first. That overlap (a true crossfade, not a sequential vanish-then-reappear) is
  // what "smooth" means here, on request.
  const showReady = isExiting || isReady
  // `tipIndex` is always kept in range by the modulo in the rotation interval above, so this
  // index is never out of bounds — the non-null assertion just satisfies noUncheckedIndexedAccess.
  const tip = TIPS[tipIndex]!

  function handleGoToDashboard() {
    completeActivity(completedActivityId)
    navigate('/dashboard')
  }

  return (
    <main className={styles.page}>
      <Logo className={styles.logo} />
      <div className={styles.content}>
        {/* Two whole-block overlays rather than each element choreographing its own exit/enter —
            simpler to keep in sync, and it's what makes this a real crossfade instead of a
            sequential vanish-then-reappear, on request. `.buildingBlock` renders the whole time
            up through `isExiting` (absolutely positioned once exiting, so it stops influencing
            layout right as `.readyBlock` takes over) and `.readyBlock` mounts as soon as exiting
            begins — `showReady`, not `isReady` — so the two overlap in time and opacity for the
            full `EXIT_DURATION_MS` window: the incoming block is already in normal flow sizing
            the card correctly while the outgoing one fades away on top of it, instead of the
            card snapping to its new size only after everything was briefly blank. */}
        {!isReady && (
          <div
            className={[styles.buildingBlock, isExiting ? styles.buildingBlockExiting : '']
              .filter(Boolean)
              .join(' ')}
          >
            <DotLottieReact
              src={loadingAnimationUrl}
              loop
              autoplay
              layout={ICON_LAYOUT}
              className={styles.icon}
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
        )}
        {showReady && (
          <div className={styles.readyBlock}>
            <DotLottieReact
              src={successAnimationUrl}
              autoplay
              layout={ICON_LAYOUT}
              className={styles.icon}
            />
            <h1
              className={[styles.title, styles.titleReady].join(' ')}
              role="status"
              aria-live="polite"
            >
              {headlineLead}
              <br />
              Your report is taking shape.
            </h1>
            {remainingActivities.length > 0 && (
              <div className={styles.nextActivities}>
                <p className={styles.nextActivitiesIntro}>
                  Completing the {completedTitle} exercise helps inform one view of your brain
                  health. Add {remainingActivities.map((activity) => activity.title).join(' and ')}{' '}
                  to make your report even more personalized to you.
                </p>
                <ul className={styles.nextActivitiesList}>
                  {remainingActivities.map((activity) => (
                    <NextActivityCard
                      key={activity.id}
                      title={activity.title}
                      duration={activity.duration}
                      startPath={activity.startPath}
                    />
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.readyActions}>
              <Button type="button" variant="secondary" size="lg" onClick={handleGoToDashboard}>
                Go to Dashboard
              </Button>
              <Button type="button" size="lg">
                Download report
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
