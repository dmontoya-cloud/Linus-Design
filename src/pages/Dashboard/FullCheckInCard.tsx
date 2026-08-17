import { Link } from 'react-router-dom'
import styles from './FullCheckInCard.module.css'

const CATEGORIES = ['Memory', 'Lifestyle', 'Priorities']

/** Full-width hero card at the top of the Dashboard, pointing to the complete three-part
 * check-in (Memory, Lifestyle, Priorities) rather than any single activity below it — the
 * dark, high-contrast treatment is deliberate so it reads as the primary way in, not just
 * another card in the grid. */
export function FullCheckInCard() {
  return (
    <div className={styles.card}>
      <p className={styles.eyebrow}>Start here</p>
      <h2 className={styles.title}>Your full check-in</h2>
      <p className={styles.copy}>
        We suggest all three check-ins for the fullest picture. Together they take about 25 minutes.
        You can spread them across several days.
      </p>
      <ul className={styles.categories}>
        {CATEGORIES.map((category) => (
          <li key={category} className={styles.category}>
            <span className={styles.categoryBar} aria-hidden="true" />
            <span className={styles.categoryLabel}>{category}</span>
          </li>
        ))}
      </ul>
      <Link to="/assessment" className={styles.startButton}>
        Start the full check-in
      </Link>
    </div>
  )
}
