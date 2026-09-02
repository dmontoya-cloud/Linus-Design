import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { DashboardNavBar } from '../DashboardNavBar'
import styles from './ProfilePage.module.css'

const PRIVACY_EMAIL = 'privacy@linus.health'

/**
 * Profile — reached from the account menu in `DashboardNavBar` (click the initials avatar).
 * Deliberately minimal, on request: just the two things a visitor might need here (how to
 * delete their data, and where the legal text lives), nothing else.
 *
 * "View" reuses the existing `/terms` route rather than a new page — it's the only Terms/
 * Privacy content already built in this prototype, even though that page's own flow (its
 * "Agree and continue"/"Back" buttons) was designed for onboarding rather than a standalone
 * read. Flagging this rather than silently picking it: a dedicated read-only Terms/Privacy
 * view may be worth asking for separately.
 */
export function ProfilePage() {
  return (
    <div className={styles.page}>
      <DashboardNavBar exitTo="/dashboard" exitLabel="Back to Dashboard" />
      <main className={styles.content}>
        <h1 className={styles.title}>Profile</h1>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Your data</h2>
          <p className={styles.cardBody}>
            You can delete your account and data associated with it by emailing{' '}
            <a className={styles.emailLink} href={`mailto:${PRIVACY_EMAIL}`}>
              {PRIVACY_EMAIL}
            </a>
          </p>
        </div>
        <div className={`${styles.card} ${styles.cardRow}`}>
          <h2 className={styles.cardTitle}>Terms of Use and Privacy Policy</h2>
          <Link to="/terms" className={`${buttonClassName('outline', 'sm')} ${styles.viewButton}`}>
            View
          </Link>
        </div>
      </main>
    </div>
  )
}
