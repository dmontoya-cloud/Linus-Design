import { Link } from 'react-router-dom'
import { useAuth } from '@/auth'
import { ActivityCardV2 } from './ActivityCardV2'
import { ACTIVITIES_META, TOTAL_ACTIVITY_COUNT } from './activitiesV2'
import styles from './FullCheckInCardV2.module.css'

/** The title's own copy per `completedCount` — ported over from Dashboard 1's `FullCheckInCard`
 * (see that component's own doc comment for the full reasoning) rather than the single static
 * title the Figma mock's one given state showed, on request. */
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

/**
 * FullCheckInCardV2 — Dashboard 2's rebuilt hero card, per the Figma mock at node 884:2881: one
 * merged white card holding both the header (title, duration/progress line, and the main CTA)
 * and, directly inside the same card below a divider, the three-activity row (`ActivityCardV2`)
 * — replacing Dashboard 1's separate progress-bar tracker and its own standalone activity-card
 * grid below the hero. The secondary "Build my report" button Dashboard 1's `FullCheckInCard`
 * shows beside its main CTA is dropped here on request — the mock shows only one button in this
 * card at any state, since that role now belongs to the new `ReportCTACard` section instead.
 *
 * The main CTA keeps `FullCheckInCard`'s exact same progress logic: "Start Activity" with
 * nothing done, "Start Next Activity" pointing at whichever activity is next once something
 * is, "Build my report" once all three are done and nothing's been built yet, and "View report"
 * once it has (`useAuth().hasBuiltReport`) — see that component's own doc comment for the full
 * reasoning. The header title now also carries over `FullCheckInCard`'s own 3-state title copy
 * (`titleLinesFor`) that changes with progress, on request — the duration line stays static
 * ("About 20 minutes" total, not a remaining-time count), which is still an assumption.
 */
export function FullCheckInCardV2() {
  const { completedActivityIds, hasBuiltReport } = useAuth()
  const completedCount = ACTIVITIES_META.filter(({ id }) =>
    completedActivityIds.includes(id),
  ).length
  const nextActivity = ACTIVITIES_META.find(({ id }) => !completedActivityIds.includes(id)) ?? null
  const [titleLine1, titleLine2] = titleLinesFor(completedCount)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>
              {titleLine1}
              {titleLine2 && (
                <>
                  <br />
                  {titleLine2}
                </>
              )}
            </h2>
            <p className={styles.progressLine}>
              About 20 minutes | {completedCount}/{TOTAL_ACTIVITY_COUNT} complete
            </p>
          </div>
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
        </div>
        <p className={styles.copy}>
          Each activity looks at a different part of brain health: your brain abilities, lifestyle,
          and priorities. Completing all three gives you the most complete brain health report, or
          you can choose which activities you want to complete.
        </p>
      </div>
      <ul className={styles.activityRow}>
        {ACTIVITIES_META.map((activity) => (
          <ActivityCardV2
            key={activity.id}
            activity={{
              ...activity,
              status: completedActivityIds.includes(activity.id) ? 'completed' : 'not-started',
            }}
          />
        ))}
      </ul>
    </div>
  )
}
