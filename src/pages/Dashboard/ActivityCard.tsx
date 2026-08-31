import { useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { ClockIcon } from '@/components/atoms/Icon'
import { Modal } from '@/components/atoms/Modal'
import styles from './ActivityCard.module.css'

/** This mock-data prototype has no real assessment flow yet to actually progress through, so
 * `completed` only ever gets set one way today: `BuildingReportPage`'s "Go to Dashboard" button
 * marking Memory & Thinking done via `useAuth().completeActivity` — see `DashboardPage`, which
 * computes each activity's live status from `completedActivityIds` rather than a fixed value. */
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
  /** Where this card's Start button hands off to. Only Memory & Thinking has a real
   * intro screen (`/assessment`, with its instructions voice-over) — the other activities
   * route to their own not-yet-built placeholder rather than sharing that one. */
  startPath: string
  /** Where this card's Details button hands off to — a not-yet-built placeholder page. Not
   * needed (and not rendered as a Link) when `detailsContent` is set instead (see below). */
  detailsPath?: string
  /** When set, Details opens a Modal with this content in place instead of navigating to
   * `detailsPath` — on request, for Memory & Thinking, so seeing what the activity involves
   * (its instructions and task list) doesn't require leaving Dashboard for a whole separate
   * screen. Lifestyle/Priorities have no real detail content yet, so they still fall back to
   * their placeholder route. */
  detailsContent?: ReactNode
}

/** One pending assessment activity — a status badge on its own line above the title (never
 * pinned to a corner or inline beside it, so a long title never truncates or has to reserve
 * space for it), title, a clock-icon-led duration estimate, description, an optional
 * requirement note on its own line below the description (e.g. "Needs quiet room", on
 * activities where that matters — on request, moved off the duration row to give it its own
 * line), and a primary CTA that's either Start (hands off to `activity.startPath` — only Memory
 * & Thinking's points at the real Assessment Intro screen, the other two still point at
 * not-yet-built placeholders) or, once `activity.status` is `'completed'`, Download report (to
 * `/report`, on request — there's nothing left to "start" once it's done). Details either opens
 * a Modal in place (when `activity.detailsContent` is set — currently just Memory & Thinking,
 * showing its instructions/task list) or navigates to `activity.detailsPath`'s own not-yet-built
 * placeholder, same as Lifestyle/Priorities' Start above; Details stays available even once
 * completed, so the activity's own instructions/tasks are still reviewable. Cascades in on
 * mount (fade-rise) same as every other card on Dashboard — `style` carries the per-card
 * `animationDelay` DashboardPage staggers by, since a `<li>` can't be wrapped in an extra
 * element without breaking the `<ul>`'s content model. */
export function ActivityCard({ activity, style }: { activity: Activity; style?: CSSProperties }) {
  const [detailsOpen, setDetailsOpen] = useState(false)

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
      <hr className={styles.divider} />
      <div className={styles.buttonRow}>
        {activity.detailsContent ? (
          <button
            type="button"
            className={buttonClassName('outline', 'sm')}
            onClick={() => setDetailsOpen(true)}
          >
            Details
          </button>
        ) : activity.detailsPath ? (
          <Link to={activity.detailsPath} className={buttonClassName('outline', 'sm')}>
            Details
          </Link>
        ) : null}
        {activity.status === 'completed' ? (
          <Link to="/report" className={buttonClassName('primary', 'sm')}>
            Download report
          </Link>
        ) : (
          <Link to={activity.startPath} className={buttonClassName('primary', 'sm')}>
            Start
          </Link>
        )}
      </div>
      {activity.detailsContent ? (
        <Modal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          title={activity.title}
          size="lg"
        >
          {activity.detailsContent}
        </Modal>
      ) : null}
    </li>
  )
}
