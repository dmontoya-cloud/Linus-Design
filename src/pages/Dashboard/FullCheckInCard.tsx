import { Link } from 'react-router-dom'
import { useAuth } from '@/auth'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { BrainIcon, ClockIcon, ListNumbersIcon, PersonSimpleRunIcon } from '@/components/atoms/Icon'
import styles from './FullCheckInCard.module.css'

/** `id` matches `DashboardPage`'s own `PENDING_ACTIVITIES` ids — the one shared key this
 * prototype's mock completion state (`useAuth().completedActivityIds`) is keyed by.
 * `startPath` matches that same list's own per-activity `startPath`, so "Start Next Activity"
 * below can hand off to whichever of these is actually next, not just Memory & Thinking's. */
const CATEGORIES = [
  {
    id: 'memory-recall',
    label: 'Memory & Thinking',
    Icon: BrainIcon,
    startPath: '/assessment/start',
  },
  {
    id: 'speech-pattern',
    label: 'Lifestyle',
    Icon: PersonSimpleRunIcon,
    startPath: '/assessment/lifestyle',
  },
  {
    id: 'visual-attention',
    label: 'Priorities',
    Icon: ListNumbersIcon,
    startPath: '/assessment/priorities',
  },
]

/** Full-width hero card at the top of the Dashboard, pointing to the complete three-part
 * check-in (Memory, Lifestyle, Priorities) rather than any single activity below it — the
 * dark, high-contrast treatment is deliberate so it reads as the primary way in, not just
 * another card in the grid. The title itself changes per `completedCount` (see
 * `titleLinesFor`), on request — a two-line "status, then what's next" headline once anything's
 * done, matching `ReportReadyPage`'s own headline pattern, rather than one generic title
 * regardless of progress. Each category gets a leading icon and its own progress track,
 * on request — a completed category (per `useAuth().completedActivityIds`) fills its track
 * solid `success` green, and the "X/3 complete" summary below is a real computed count, not a
 * fixed "0/3" display. Once at least one category is done, the next incomplete one in order
 * gets a "Next" label beside its title, on request — pointing at where to go, not just showing
 * what's finished. The main CTA relabels to "Start Next Activity" once anything's done, on
 * request, rather than staying "Start Activity" forever regardless of progress, and hands off to
 * whichever category is actually next (`nextActivity`) rather than always Memory & Thinking's
 * own `startPath` — once all three are done, on request, it relabels again to "Build my report"
 * and points at `/report/building` instead, since there's no more "next activity" to start but
 * generating the combined report is still the primary action. A secondary "Build my report"
 * button (same label as the main CTA once it takes over that role, on request — previously
 * "Generate report") appears beside it while at least one activity is done and at least one
 * still isn't — a report can be generated the moment the first activity is complete, not only
 * once all three are — but disappears once all three are done, on request, since the main CTA
 * has already relabeled to the same thing by then, leaving one CTA rather than two competing
 * (and now identically-labeled) actions. Both point at `/report/building` (not straight to
 * `/report`), on request, so clicking either one always sits through the same loading
 * interstitial before landing on the real report, regardless of which one got you there.
 * `ActivityCard`'s own completed-state action is a
 * secondary "Redo activity" instead, on request, since redoing is that per-activity card's more
 * relevant next step.
 *
 * Once a report has actually been built and downloaded (`useAuth().hasBuiltReport`, set by
 * `ReportPage`'s Download button), on request, neither "Build my report" CTA re-offers building
 * the same report again: the secondary button disappears entirely (matching the "at least one
 * activity is done and at least one still isn't" condition it already required), and once all
 * three are done, the main CTA relabels to "View report" and points straight at `/report`
 * instead of sitting through `/report/building` again for a report that's already built. Either
 * CTA reappears the moment a newly completed activity makes the existing report stale —
 * `completeActivity` resets `hasBuiltReport` to `false` for exactly this reason — including via
 * `ReportReadyPage`'s "Go to Dashboard", which finishes an activity without building, on
 * request: that's the one path that leaves the button showing. */
/** The title's own copy per `completedCount`, on request — one and two done are each a single
 * line; all three done keeps the two-line "status, then what's next" treatment
 * `ReportReadyPage`'s own `headlineLines` uses, since "All activities are in!" reads as its own
 * short beat before the instruction that follows it. */
function titleLinesFor(completedCount: number): [string] | [string, string] {
  switch (completedCount) {
    case 1:
      return ['Your report is taking shape']
    case 2:
      return ['Your report has more detail']
    case 3:
      return ['All activities are in!', 'Build your full brain health report.']
    default:
      return ['Complete your full brain health report']
  }
}

export function FullCheckInCard() {
  const { completedActivityIds, hasBuiltReport } = useAuth()
  const completedCount = CATEGORIES.filter(({ id }) => completedActivityIds.includes(id)).length
  // The first not-yet-done category, in order — `null` once all three are done, since there's
  // nothing left to start. Also what "Start Next Activity" below hands off to, on request,
  // rather than always pointing at Memory & Thinking's own `startPath` regardless of progress.
  const nextActivity = CATEGORIES.find(({ id }) => !completedActivityIds.includes(id)) ?? null
  // Only meaningful once something's actually been completed, on request — with nothing done
  // yet there's no real "next" to point at, just the same starting line for all three.
  const nextBadgeId = completedCount > 0 ? nextActivity?.id : undefined
  const [titleLine1, titleLine2] = titleLinesFor(completedCount)

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        {titleLine1}
        {titleLine2 && (
          <>
            <br />
            {titleLine2}
          </>
        )}
      </h2>
      <p className={styles.duration}>
        <ClockIcon className={styles.durationIcon} />
        About 20 minutes
      </p>
      <p className={styles.copy}>
        Complete three short activities to learn more about your memory and thinking, lifestyle, and
        what matters most to you. Together, they help create a brain health report personalized to
        you.
      </p>
      <div className={styles.trackerBox}>
        <ul className={styles.categories}>
          {CATEGORIES.map(({ id, label, Icon }) => {
            const isComplete = completedActivityIds.includes(id)
            return (
              <li key={id} className={styles.category}>
                <span className={styles.categoryHeader}>
                  <Icon className={styles.categoryIcon} />
                  <span className={styles.categoryLabel}>{label}</span>
                  {id === nextBadgeId ? <span className={styles.nextBadge}>Next</span> : null}
                </span>
                <span className={styles.categoryBar} aria-hidden="true">
                  <span
                    className={styles.categoryBarFill}
                    style={{ width: isComplete ? '100%' : '0%' }}
                  />
                </span>
              </li>
            )
          })}
        </ul>
        <p className={styles.categoriesComplete}>{completedCount}/3 complete</p>
      </div>
      <div className={styles.buttonRow}>
        {nextActivity ? (
          <Link to={nextActivity.startPath} className={styles.startButton}>
            {completedCount > 0 ? 'Start Next Activity' : 'Start Activity'}
          </Link>
        ) : hasBuiltReport ? (
          <Link to="/report" className={styles.startButton}>
            View report
          </Link>
        ) : (
          <Link to="/report/building" className={styles.startButton}>
            Build my report
          </Link>
        )}
        {completedCount > 0 && nextActivity && !hasBuiltReport ? (
          <Link
            to="/report/building"
            className={`${buttonClassName('secondary', 'lg')} ${styles.downloadButton}`}
          >
            Build my report
          </Link>
        ) : null}
      </div>
    </div>
  )
}
