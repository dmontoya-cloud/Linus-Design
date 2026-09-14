import { Link } from 'react-router-dom'
import { useAuth } from '@/auth'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import styles from './ReportCTACard.module.css'

/**
 * ReportCTACard — the "Ready to create your report?" section new to Dashboard 2's mock
 * (Figma node 884:2942), sitting between `FullCheckInCardV2` and the resources section. Reuses
 * the exact same visibility rule Dashboard 1's `FullCheckInCard` already applies to its own
 * secondary "Create my report" button (see that component's doc comment): shown once at least
 * one activity is done, hidden again once every activity is done — at that point
 * `FullCheckInCardV2`'s own main CTA already relabels to "Create my report"/"View report", so
 * this section would just duplicate it, and "View report" itself stays exclusive to that main
 * card, on request, never shown here. Unlike that all-done cutoff, a report already having been
 * built (`hasBuiltReport`) no longer hides this section on its own, on request — it's a real,
 * reachable state (build+download a report after only some activities, then come back without
 * completing more), and this section now answers it directly: title/copy switch to acknowledging
 * a report already exists, and the button relabels "Create my report" → "Download my report",
 * pointing at `/report` directly (the already-built report) rather than `/report/building`
 * (which would re-run the build animation for a report that already exists).
 */
export function ReportCTACard({ totalActivityCount }: { totalActivityCount: number }) {
  const { completedActivityIds, hasBuiltReport } = useAuth()
  const completedCount = completedActivityIds.length
  const isVisible = completedCount > 0 && completedCount < totalActivityCount

  if (!isVisible) return null

  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <h2 className={styles.title}>
          {hasBuiltReport ? 'Download your current report' : 'Ready to create your report?'}
        </h2>
        <p className={styles.copy}>
          {hasBuiltReport ? (
            <>
              You&rsquo;ve already built a report from the activities you&rsquo;ve completed so far.
              Download it again any time, or complete more activities for a fuller view of your
              brain health.
            </>
          ) : (
            <>
              We&rsquo;ll build your report based on the activities you&rsquo;ve completed. This may
              take a few minutes. You can create it now, or complete more activities for a fuller
              view of your brain health.
            </>
          )}
        </p>
      </div>
      <Link
        to={hasBuiltReport ? '/report' : '/report/building'}
        className={`${buttonClassName('secondary', 'lg')} ${styles.link}`}
      >
        {hasBuiltReport ? 'Download my report' : 'Create my report'}
      </Link>
    </div>
  )
}
