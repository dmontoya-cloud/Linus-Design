import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import styles from './ResourcesCard.module.css'

/** No real resources site exists in this mock-data prototype — this is the actual Linus
 * Health marketing site, the one real external destination this prototype ever links to. */
const RESOURCES_URL = 'https://www.linushealth.com'

/** Phosphor "regular" weight (phosphor-icons/core, MIT) — same sourcing convention as
 * docs/design.md's Icons section and Toast's icons, pulled directly from the library. */
function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={styles.icon}>
      <path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z" />
    </svg>
  )
}

/**
 * ResourcesCard — a standalone block at the end of the Dashboard, below the pending-activity
 * grid, pointing to the real Linus Health website for free-to-browse brain health content.
 * Styled as a plain white card (`--color-surface`, `radius-xl`, `shadow-card`) — the same
 * recipe as `ActivityCard` above it — rather than the gradient `FullCheckInCard` uses, so it
 * reads as "one more card on this page," not another hero moment. The link is a real
 * `<a target="_blank">` (not client-side routing) since it genuinely leaves the app; the
 * external-link icon and copy both call that out so it's never a surprise. The link uses
 * `secondary` — the design system's blue-outline pill — on request, replacing `outline` (a
 * neutral grey-bordered pill meant for quiet actions like Terms of Use/Privacy Policy's own
 * "Back") which read as detached from the rest of the page's blue accent. Applied via
 * `buttonClassName` directly to a real `<a>`, same as `ActivityCard`'s own "Start" link. Two
 * columns: title + copy on the left, the button alone on the right (vertically centered against
 * the text block), stacking back to one column on narrow viewports the same way
 * `FullCheckInCard`'s own category grid does.
 */
export function ResourcesCard() {
  return (
    <div className={styles.card}>
      <div className={styles.text}>
        <h2 className={styles.title}>Linus Health Resources</h2>
        <p className={styles.copy}>
          Explore trusted information, tips, and tools to help you learn more about brain health and
          support your wellbeing.
        </p>
      </div>
      <a
        href={RESOURCES_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonClassName('secondary', 'lg')} ${styles.link}`}
      >
        Open on linushealth.com
        <ExternalLinkIcon />
      </a>
    </div>
  )
}
