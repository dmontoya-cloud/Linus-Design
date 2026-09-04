import { Link } from 'react-router-dom'
import { useAuth } from '@/auth'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import styles from './ReportCTACard.module.css'

/**
 * ReportCTACard — the "Ready to create your report?" section new to Dashboard 2's mock
 * (Figma node 884:2942), sitting between `FullCheckInCardV2` and the resources section. Reuses
 * the exact same visibility rule Dashboard 1's `FullCheckInCard` already applies to its own
 * secondary "Build my report" button (see that component's doc comment): shown once at least
 * one activity is done, hidden again once every activity is done (at that point
 * `FullCheckInCardV2`'s own main CTA already relabels to "Build my report"/"View report", so
 * this section would just duplicate it) or once a report's already been built. Always points at
 * `/report/building`, same as every other "build the report" entry point in this app.
 */
export function ReportCTACard({ totalActivityCount }: { totalActivityCount: number }) {
  const { completedActivityIds, hasBuiltReport } = useAuth()
  const completedCount = completedActivityIds.length
  const isVisible = completedCount > 0 && completedCount < totalActivityCount && !hasBuiltReport

  if (!isVisible) return null

  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <h2 className={styles.title}>Ready to create your report?</h2>
        <p className={styles.copy}>
          We&rsquo;ll build your report based on the activities you&rsquo;ve completed. This may
          take a few minutes. You can create it now, or complete more activities for a fuller view
          of your brain health.
        </p>
      </div>
      <Link
        to="/report/building"
        className={`${buttonClassName('secondary', 'lg')} ${styles.link}`}
      >
        Build my report
      </Link>
    </div>
  )
}
