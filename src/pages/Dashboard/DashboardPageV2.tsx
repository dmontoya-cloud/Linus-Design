import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/auth'
import { DashboardNavBar } from '../DashboardNavBar'
import { FullCheckInCardV2 } from './FullCheckInCardV2'
import { PostReportSurvey } from './PostReportSurvey'
import { ReportCTACard } from './ReportCTACard'
import { TOTAL_ACTIVITY_COUNT } from './activitiesV2'
import { ResourcesCard } from './ResourcesCard'
import { cascadeDelay } from '../cascade'
import styles from './DashboardPageV2.module.css'

/**
 * DashboardPageV2 — second, independently-editable version of the Dashboard screen, rebuilt per
 * the Figma mock at node 884:2881 (file `uajF7CIU6kCyd2epbvlNNl`). Which one actually renders at
 * `/dashboard` is picked in App.tsx by `ACTIVE_DASHBOARD_VARIANT` (see `dashboardVariant.ts`),
 * not by anything in the UI.
 *
 * Differs from Dashboard 1 in two ways, per that mock: `FullCheckInCardV2` merges the hero
 * header and the three-activity row into one card (each activity's icon recolors success-green
 * once complete, rather than a separate progress-bar tracker plus a standalone card grid below
 * it — see that component's own doc comment), and a new `ReportCTACard` section sits between it
 * and "Learn more about brain health", reusing the exact same visibility rule Dashboard 1's
 * `FullCheckInCard` already applies to its own secondary "Build my report" button.
 */
export function DashboardPageV2() {
  const { profile } = useAuth()
  const location = useLocation()
  const [showSurvey, setShowSurvey] = useState(
    () => (location.state as { showSurvey?: boolean } | null)?.showSurvey === true,
  )

  return (
    <div className={styles.page}>
      <DashboardNavBar />

      <main className={styles.content}>
        <h1
          className={[styles.welcome, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(0) }}
        >
          Welcome, {profile?.firstName ?? 'there'}!{' '}
          <span className={styles.welcomeSubtext}>We&rsquo;re so glad you&rsquo;re here.</span>
        </h1>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(1) }}>
          <FullCheckInCardV2 />
        </div>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(2) }}>
          <ReportCTACard totalActivityCount={TOTAL_ACTIVITY_COUNT} />
        </div>
        <h2
          className={[styles.copy, styles.copyNoSubtext, styles.reveal].join(' ')}
          style={{ animationDelay: cascadeDelay(3) }}
        >
          Learn more about brain health
        </h2>
        <div className={styles.reveal} style={{ animationDelay: cascadeDelay(4) }}>
          <ResourcesCard />
        </div>
      </main>
      {showSurvey ? <PostReportSurvey onClose={() => setShowSurvey(false)} /> : null}
    </div>
  )
}
