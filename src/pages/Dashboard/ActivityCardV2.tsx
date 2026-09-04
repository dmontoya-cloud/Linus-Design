import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import styles from './ActivityCardV2.module.css'

export interface ActivityV2 {
  id: string
  title: string
  Icon: ComponentType<{ className?: string }>
  /** e.g. "About 15 minutes" — a rough estimate, not a real measured duration. */
  duration: string
  requirement?: string
  description: string
  startPath: string
  status: 'not-started' | 'completed'
  /** Label + button style for the completed-state CTA — "Details" (`tertiary`, text-only) for
   * Memory & Thinking, "Restart" (`secondary`, outline pill) for Lifestyle/Priorities, on
   * request. Both still point at the same `activity.startPath` either way — only the label and
   * style change, not the destination. */
  completedActionLabel: string
  completedActionVariant: 'tertiary' | 'secondary'
}

/**
 * One column of `FullCheckInCardV2`'s merged activity row — icon-in-circle, title, duration
 * (plus a "Completed" badge once done), description, and a CTA that's a "Start" link while
 * pending or `completedActionLabel` (e.g. "Details"/"Restart") once complete — both point at
 * the same `activity.startPath`, which already lands on that activity's own Details screen
 * (`MemoryThinkingDetailsPage` etc.), so completing an activity only relabels the link, it
 * doesn't change where it goes. On completion the circle recolors success-green with a
 * lightened icon rather than swapping to a different glyph — matching the Figma mock's own
 * Memory & Thinking-completed asset, which reuses the same brain icon just recolored, not a
 * distinct "completed" icon per activity.
 */
export function ActivityCardV2({ activity }: { activity: ActivityV2 }) {
  const isComplete = activity.status === 'completed'
  const { Icon } = activity

  return (
    <li className={styles.column}>
      <span
        className={[styles.iconCircle, isComplete ? styles.iconCircleComplete : '']
          .filter(Boolean)
          .join(' ')}
      >
        <Icon className={styles.icon} />
      </span>
      <h3 className={styles.title}>{activity.title}</h3>
      <p className={styles.duration}>
        {activity.duration}
        {isComplete ? <span className={styles.completedBadge}>Completed</span> : null}
      </p>
      <p className={styles.description}>{activity.description}</p>
      {activity.requirement ? (
        <span className={styles.requirement}>{activity.requirement}</span>
      ) : null}
      <div
        className={[styles.buttonRow, isComplete ? styles.buttonRowEnd : '']
          .filter(Boolean)
          .join(' ')}
      >
        {isComplete ? (
          <Link
            to={activity.startPath}
            className={buttonClassName(activity.completedActionVariant, 'sm')}
          >
            {activity.completedActionLabel}
          </Link>
        ) : (
          <Link to={activity.startPath} className={buttonClassName('secondary', 'sm')}>
            Start
          </Link>
        )}
      </div>
    </li>
  )
}
