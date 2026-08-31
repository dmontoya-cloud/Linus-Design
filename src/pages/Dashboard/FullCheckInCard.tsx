import { Link } from 'react-router-dom'
import { useAuth } from '@/auth'
import { BarbellIcon, BrainIcon, ListNumbersIcon } from '@/components/atoms/Icon'
import styles from './FullCheckInCard.module.css'

/** `id` matches `DashboardPage`'s own `PENDING_ACTIVITIES` ids — the one shared key this
 * prototype's mock completion state (`useAuth().completedActivityIds`) is keyed by. */
const CATEGORIES = [
  { id: 'memory-recall', label: 'Memory & Thinking', Icon: BrainIcon },
  { id: 'speech-pattern', label: 'Lifestyle', Icon: BarbellIcon },
  { id: 'visual-attention', label: 'Priorities', Icon: ListNumbersIcon },
]

/** Full-width hero card at the top of the Dashboard, pointing to the complete three-part
 * check-in (Memory, Lifestyle, Priorities) rather than any single activity below it — the
 * dark, high-contrast treatment is deliberate so it reads as the primary way in, not just
 * another card in the grid. Each category gets a leading icon and its own progress track,
 * on request — a completed category (per `useAuth().completedActivityIds`) fills its track
 * solid `success` green, and the "X/3 complete" summary below is a real computed count, not a
 * fixed "0/3" display. Once at least one category is done, the next incomplete one in order
 * gets a "Next" label beside its title, on request — pointing at where to go, not just showing
 * what's finished. */
export function FullCheckInCard() {
  const { completedActivityIds } = useAuth()
  const completedCount = CATEGORIES.filter(({ id }) => completedActivityIds.includes(id)).length
  // Only meaningful once something's actually been completed, on request — with nothing done
  // yet there's no real "next" to point at, just the same starting line for all three.
  const nextIndex =
    completedCount > 0 ? CATEGORIES.findIndex(({ id }) => !completedActivityIds.includes(id)) : -1

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Complete your full brain health report</h2>
      <p className={styles.copy}>
        To get a full picture of your brain health, we suggest completing all three activities. Each
        looks at a different part of your brain health and helps create a report unique to you.
      </p>
      <div className={styles.trackerBox}>
        <ul className={styles.categories}>
          {CATEGORIES.map(({ id, label, Icon }, index) => {
            const isComplete = completedActivityIds.includes(id)
            return (
              <li key={id} className={styles.category}>
                <span className={styles.categoryHeader}>
                  <Icon className={styles.categoryIcon} />
                  <span className={styles.categoryLabel}>{label}</span>
                  {index === nextIndex ? <span className={styles.nextBadge}>Next</span> : null}
                </span>
                <span className={styles.categoryBar} aria-hidden="true">
                  <span
                    className={styles.categoryBarFill}
                    style={{ width: isComplete ? '100%' : '0%' }}
                  />
                </span>
              </li>
            )
          })}
        </ul>
        <p className={styles.categoriesComplete}>{completedCount}/3 complete</p>
      </div>
      <Link to="/assessment/start" className={styles.startButton}>
        Start Activity
      </Link>
    </div>
  )
}
