import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import styles from './ActivityCard.module.css'

export interface Activity {
  id: string
  title: string
  estimatedMinutes: number
  description: string
  indication: string
}

/** One pending assessment activity — title, time estimate, description, a
 * setup indication (e.g. "use headphones"), and a Start CTA that hands off
 * to the /assessment stub, same as every other not-yet-built PoD-4 screen. */
export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <li className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{activity.title}</h3>
        <span className={styles.time}>{activity.estimatedMinutes} min</span>
      </div>
      <p className={styles.description}>{activity.description}</p>
      <p className={styles.indication}>{activity.indication}</p>
      <hr className={styles.divider} />
      <Link
        to="/assessment"
        className={`${buttonClassName('secondary', 'sm')} ${styles.startButton}`}
      >
        Start
      </Link>
    </li>
  )
}
