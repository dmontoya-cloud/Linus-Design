import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { ClockIcon } from '@/components/atoms/Icon'
import styles from './ActivityCard.module.css'

/** Only status this mock-data prototype ever has — there's no real assessment flow yet to
 * actually progress or complete one. Named (rather than a bare boolean) so a real "in
 * progress"/"completed" status has somewhere to go once that flow exists. */
export type ActivityStatus = 'not-started'

const STATUS_LABELS: Record<ActivityStatus, string> = {
  'not-started': 'Not started',
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
}

/** One pending assessment activity — a status badge on its own line above the title (never
 * pinned to a corner or inline beside it, so a long title never truncates or has to reserve
 * space for it), title, a clock-icon-led duration estimate (with an optional requirement
 * badge beside it, e.g. "Needs quiet room", on activities where that matters), description,
 * and a Start CTA that hands off to `activity.startPath` — only Memory & Thinking's points at
 * the real Assessment Intro screen; the other two still point at not-yet-built placeholders.
 * Cascades in on mount (fade-rise) same as every other card on Dashboard — `style` carries
 * the per-card `animationDelay` DashboardPage staggers by, since a `<li>` can't be wrapped
 * in an extra element without breaking the `<ul>`'s content model. */
export function ActivityCard({ activity, style }: { activity: Activity; style?: CSSProperties }) {
  return (
    <li className={[styles.card, styles.reveal].join(' ')} style={style}>
      <span className={styles.status}>{STATUS_LABELS[activity.status]}</span>
      <h3 className={styles.title}>{activity.title}</h3>
      <div className={styles.durationRow}>
        <p className={styles.duration}>
          <ClockIcon className={styles.durationIcon} />
          {activity.duration}
        </p>
        {activity.requirement ? (
          <span className={styles.requirement}>{activity.requirement}</span>
        ) : null}
      </div>
      <p className={styles.description}>{activity.description}</p>
      <hr className={styles.divider} />
      <Link
        to={activity.startPath}
        className={`${buttonClassName('secondary', 'sm')} ${styles.startButton}`}
      >
        Start
      </Link>
    </li>
  )
}
