import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useAuth } from '@/auth'
import { Button } from '@/components/atoms/Button'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { Logo } from '@/components/atoms/Logo'
import successAnimationUrl from './success-animation.lottie?url'
import styles from './BuildingReportPage.module.css'

/** Forces the success `.lottie` animation to center-fit within `.icon`'s box — shared with
 * `BuildingReportPage`'s own loading animation so both land at the same spot inside the
 * same-sized box, even though the two pages never actually show at the same time any more. */
const ICON_LAYOUT: { fit: 'contain'; align: [number, number] } = {
  fit: 'contain',
  align: [0.5, 0.5],
}

/** Which activity a visitor just finished, matching the ids `DashboardPage`'s
 * `PENDING_ACTIVITIES` and `FullCheckInCard`'s `CATEGORIES` both use. Every question-flow page
 * (`LifestyleQuestionsPage`, `PrioritiesQuestionsPage`) hands this off via router `state` when
 * its last question completes; the one entry point that doesn't — the "Skip to report" corner
 * link (see App.tsx's `ROUTES_WITH_REPORT_SKIP`) — has no state to pass, so this defaults to
 * Memory & Thinking, standing in for "you just finished the real assessment" until that flow
 * exists. */
const DEFAULT_COMPLETED_ACTIVITY_ID = 'memory-recall'

/** Every completed-count/combination's exact copy, matching Figma's "WIREFRAMES / Content Only"
 * reference set (Assessment & Device Setup page) rather than one generic templated sentence —
 * on request. Keyed by the sorted, comma-joined set of completed activity ids (see
 * `combinationKey`), since the wording is bespoke per combination, not derivable from a
 * template. The all-three-done combination has no entry — nothing is left to recommend there,
 * so `remainingActivities.length === 0` skips this block entirely rather than looking up a key
 * that would never resolve to a "here's what's next" sentence anyway. */
const INTRO_COPY: Record<string, string> = {
  'memory-recall':
    'Completing the Memory & Thinking exercise helps inform one view of your brain health. Add Lifestyle and Priorities to make your report even more personalized to you.',
  'speech-pattern':
    "You've added information about your lifestyle and health habits. Add another activity to make your report more detailed and personalized.",
  'visual-attention':
    "You've added what matters most to you. Add another activity to make your report more detailed and personalized.",
  'memory-recall,speech-pattern':
    "You've added information about your brain function and lifestyle. Add Priorities to include what matters most to you in daily life.",
  'memory-recall,visual-attention':
    "You've added information about your brain function and what matters most to you. Add Lifestyle to include more about your health and everyday habits.",
  'speech-pattern,visual-attention':
    "You've added information about your lifestyle and what matters most to you. Add Memory & Thinking to include how your brain abilities are working.",
}

/** Builds the lookup key `INTRO_COPY` is keyed by — the sorted, comma-joined set of completed
 * activity ids, so `{'speech-pattern', 'memory-recall'}` and `{'memory-recall', 'speech-pattern'}`
 * resolve to the same entry regardless of completion order. */
function combinationKey(ids: Iterable<string>): string {
  return [...ids].sort().join(',')
}

/** All three activities, any of which can be nudged from here once it isn't already done (see
 * `completedActivityIds`/`completedActivityId` in the component below) — on request, matching
 * Figma's reference set where an "only Lifestyle done" or "only Priorities done" state still
 * recommends Memory & Thinking alongside whichever other one is left, not just Lifestyle/
 * Priorities between themselves. An already-completed activity is dropped from this list
 * entirely rather than shown with its own "Build my report" action, so the suggestion always
 * points at what's actually left, not what's already done. `duration`/`description` match
 * Dashboard's own `PENDING_ACTIVITIES` copy verbatim, on request (Figma's reference frames bring
 * the description back here, having originally dropped it for a title-and-button-only row), so
 * this prototype never shows two different descriptions/estimates for the same activity. */
const ALL_ACTIVITIES = [
  {
    id: 'memory-recall',
    title: 'Memory & Thinking',
    duration: 'About 7–10 minutes',
    description:
      'Tasks that look at your brain abilities: memory, attention, language and thinking.',
    startPath: '/assessment/start',
  },
  {
    id: 'speech-pattern',
    title: 'Lifestyle',
    duration: 'About 5 minutes',
    description: 'Tell us about your lifestyle, health, and everyday habits.',
    startPath: '/assessment/lifestyle',
  },
  {
    id: 'visual-attention',
    title: 'Priorities',
    duration: 'About 7 minutes',
    description: 'Share what matters most to you and what you want to keep doing in daily life.',
    startPath: '/assessment/priorities',
  },
]

/** A compact nudge card for `ALL_ACTIVITIES` — title+duration stacked on the left of one header
 * row, a bare "Start" button on the right (on request — previously "Start {title}", but Figma's
 * reference frames use the bare label since the activity's own title sits right beside it
 * already), then the description on its own line below, matching Figma's reference set exactly.
 * No status badge, unlike Dashboard's `ActivityCard` — every card here is only ever rendered for
 * an activity that isn't done yet (see the filter in the component below), so there's nothing
 * for a badge to distinguish. */
function NextActivityCard({
  title,
  duration,
  description,
  startPath,
}: {
  title: string
  duration: string
  description: string
  startPath: string
}) {
  return (
    <li className={styles.nextActivityCard}>
      <div className={styles.nextActivityHeader}>
        <div className={styles.nextActivityTitleGroup}>
          <h3 className={styles.nextActivityTitle}>{title}</h3>
          <p className={styles.nextActivityDuration}>{duration}</p>
        </div>
        <Link to={startPath} className={buttonClassName('primary', 'sm')}>
          Start
        </Link>
      </div>
      <p className={styles.nextActivityDescription}>{description}</p>
    </li>
  )
}

/**
 * Report ready — the confirmation screen shown immediately after finishing an activity
 * (Lifestyle/Priorities' "Finish" button, or Memory & Thinking's "Skip to report" stand-in
 * corner link — see App.tsx's `ROUTES_WITH_REPORT_SKIP`), reached directly with no loading
 * interstitial in between any more, on request: this page and `BuildingReportPage` (the loading
 * animation at `/report/building`) used to be one page with an in-place "building" → "ready"
 * transition, which meant finishing an activity always sat through a 30-second fake loading
 * screen before showing what it actually finished. They're now two separate screens —
 * `BuildingReportPage` is reached only from this page's own "Build my report" button below (or
 * Dashboard's own identically-labeled CTA once all three activities are done, via
 * `FullCheckInCard`), standing in for someone actually asking for their report rather than just
 * finishing an activity. No `DashboardNavBar` or other chrome, same as Loading/Setting Up/Thanks.
 * Both exit buttons — "Go to Dashboard" and "Build my report" — call `completeActivity` for
 * whichever activity was just finished (see `completedActivityId` below) before navigating on, so
 * Dashboard's own card/tracker reflect it either way; previously only "Go to Dashboard" did
 * this, which would have left the just-finished activity unrecorded for anyone who clicked
 * straight through to "Build my report" instead. "Go to Dashboard" is always the plain `tertiary`
 * button variant; "Build my report" switches from `secondary` (an outline pill — matching Figma's
 * reference frames for the two "activities remain" states) to `primary` (solid) once nothing's
 * left to recommend, on request — generating the report only becomes the one obvious action once
 * there's nothing else to do first. The headline, intro copy (`INTRO_COPY`), and `ALL_ACTIVITIES`
 * nudges all key off that same id plus `completedActivityIds`, on request — reached after
 * finishing Lifestyle or Priorities (not just the original Memory & Thinking "Skip to report"
 * shortcut), this page shouldn't keep suggesting an activity that's already done.
 */
export function ReportReadyPage() {
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
  // here — the one just finished isn't written to `completedActivityIds` until an exit button is
  // clicked (see `handleGoToDashboard`/`handleGenerateReport`), so this page computes its own
  // union for display rather than waiting on that click to know what's actually done.
  const allCompletedIds = new Set([...completedActivityIds, completedActivityId])
  const remainingActivities = ALL_ACTIVITIES.filter((activity) => !allCompletedIds.has(activity.id))
  const completedCount = allCompletedIds.size
  // Matches Figma's reference set exactly rather than one formula covering every count — the
  // three states don't share a sentence pattern (the third drops the second line entirely), on
  // request. `introCopy` is the bespoke per-combination sentence (see `INTRO_COPY`) — undefined
  // once nothing's left to recommend (`remainingActivities.length === 0`), which the render below
  // already guards on, so a missing key there is never actually rendered.
  const headlineLines =
    completedCount >= 3
      ? ['All three activities are complete!']
      : completedCount === 2
        ? ['Two activities complete.', 'Your report has more details about you!']
        : ['One activity complete.', 'Your report is taking shape.']
  const introCopy = INTRO_COPY[combinationKey(allCompletedIds)]

  function handleGoToDashboard() {
    completeActivity(completedActivityId)
    navigate('/dashboard')
  }

  function handleBuildReport() {
    completeActivity(completedActivityId)
    navigate('/report/building')
  }

  return (
    <main className={styles.page}>
      <Logo className={styles.logo} />
      <div className={styles.content}>
        <div className={styles.readyBlock}>
          <DotLottieReact
            src={successAnimationUrl}
            autoplay
            layout={ICON_LAYOUT}
            className={`${styles.icon} ${styles.iconSuccess}`}
            // Explicit `.play()` alongside `autoplay`, on request — in dev, React StrictMode's
            // double-invoked mount/unmount cycle occasionally left this canvas blank (the
            // `autoplay` prop's own timing lost the race); calling `play()` directly off the
            // ref callback whenever a fresh instance attaches is a guaranteed kick regardless
            // of that race. No-op once the animation's already playing.
            dotLottieRefCallback={(dotLottie) => dotLottie?.play()}
          />
          <h1
            className={[styles.title, styles.titleReady].join(' ')}
            role="status"
            aria-live="polite"
          >
            {headlineLines[0]}
            {headlineLines[1] && (
              <>
                <br />
                {headlineLines[1]}
              </>
            )}
          </h1>
          {remainingActivities.length > 0 ? (
            <div className={styles.nextActivities}>
              <p className={styles.nextActivitiesIntro}>{introCopy}</p>
              <ul className={styles.nextActivitiesList}>
                {remainingActivities.map((activity) => (
                  <NextActivityCard
                    key={activity.id}
                    title={activity.title}
                    duration={activity.duration}
                    description={activity.description}
                    startPath={activity.startPath}
                  />
                ))}
              </ul>
            </div>
          ) : (
            <hr className={styles.readyDivider} />
          )}
          <div className={styles.readyActions}>
            <Button type="button" variant="tertiary" size="lg" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
            <Button
              type="button"
              variant={remainingActivities.length > 0 ? 'secondary' : 'primary'}
              size="lg"
              onClick={handleBuildReport}
            >
              Build my report
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
