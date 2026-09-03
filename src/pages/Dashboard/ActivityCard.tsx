import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { ClockIcon } from '@/components/atoms/Icon'
import styles from './ActivityCard.module.css'

/** `completed` only ever gets set one way today: `BuildingReportPage`'s "Go to Dashboard" button
 * marking whichever activity was just finished done via `useAuth().completeActivity` — see
 * `DashboardPage`, which computes each activity's live status from `completedActivityIds` rather
 * than a fixed value. */
export type ActivityStatus = 'not-started' | 'completed'

const STATUS_LABELS: Record<ActivityStatus, string> = {
  'not-started': 'Not started',
  completed: 'Completed',
}

export interface Activity {
  id: string
  title: string
  status: ActivityStatus
  /** e.g. "About 15 minutes" — a rough estimate, not a real measured duration. */
  duration: string
  /** Optional environment note shown beside the duration, e.g. "Needs quiet room" —
   * only activities with a real setup requirement (like the listening/speaking tasks) carry one. */
  requirement?: string
  description: string
  /** Where this card's Start button hands off to. Memory & Thinking has its own real intro
   * screen (`/assessment`, with its instructions voice-over); Lifestyle and Priorities each
   * route to their own details screen, which in turn hands off to their own real question flow
   * (`LifestyleQuestionsPage`/`PrioritiesQuestionsPage`) — three different intros, not one
   * shared screen. */
  startPath: string
}

/** One pending assessment activity — a status badge on its own line above the title (never
 * pinned to a corner or inline beside it, so a long title never truncates or has to reserve
 * space for it), title, a clock-icon-led duration estimate, description, an optional
 * requirement note on its own line below the description (e.g. "Needs quiet room", on
 * activities where that matters — on request, moved off the duration row to give it its own
 * line), and a CTA that's either a primary Start (hands off to `activity.startPath` — see that
 * field's own doc comment) or, once `activity.status` is `'completed'`, a secondary "Redo
 * activity" back to that same `startPath` — plain, with no date, on request: the card always
 * lets you click through regardless of any redo-cooldown rule, so a completed activity's own
 * Details page is where that warning now lives (see `MemoryThinkingDetailsPage`'s own
 * `redoNotice`, the one activity with a real minimum-wait-before-redoing rule today) — this
 * card used to show a "Redo activity on {date}" suffix for that one directly, which blocked
 * clicking through to see it without reading the date first. Replaces the earlier "Download
 * report" button, since redoing (not regenerating) is this card's own completed-state action;
 * the dashboard-wide "Generate report" lives on `FullCheckInCard` instead. Cascades in on mount
 * (fade-rise)
 * same as every other card on Dashboard — `style` carries the per-card `animationDelay`
 * DashboardPage staggers by, since a `<li>` can't be wrapped in an extra element without
 * breaking the `<ul>`'s content model. */
export function ActivityCard({ activity, style }: { activity: Activity; style?: CSSProperties }) {
  return (
    <li className={[styles.card, styles.reveal].join(' ')} style={style}>
      <span
        className={[styles.status, activity.status === 'completed' ? styles.statusCompleted : '']
          .filter(Boolean)
          .join(' ')}
      >
        {STATUS_LABELS[activity.status]}
      </span>
      <h3 className={styles.title}>{activity.title}</h3>
      <p className={styles.duration}>
        <ClockIcon className={styles.durationIcon} />
        {activity.duration}
      </p>
      <p className={styles.description}>{activity.description}</p>
      {activity.requirement ? (
        <span className={styles.requirement}>{activity.requirement}</span>
      ) : null}
      <div className={styles.buttonRow}>
        {activity.status === 'completed' ? (
          <Link to={activity.startPath} className={buttonClassName('secondary', 'sm')}>
            Redo activity
          </Link>
        ) : (
          <Link to={activity.startPath} className={buttonClassName('primary', 'sm')}>
            Start
          </Link>
        )}
      </div>
    </li>
  )
}
