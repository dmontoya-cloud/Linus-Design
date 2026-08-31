import { useEffect, useState } from 'react'
import { ArrowDownIcon } from '@/components/atoms/Icon'
import styles from './ScrollDownHint.module.css'

/** How close to the bottom of the page (as a fraction of the scrollable distance) before the
 * hint hides — there's nothing left to scroll toward once the checkboxes/buttons are in view. */
const HIDE_THRESHOLD = 0.92

/**
 * A pill fixed to the bottom of the viewport nudging the reader to keep scrolling through the
 * long legal text on Terms of Use / Privacy Policy, on request — those pages used to gate the
 * agreement checkbox until the reader scrolled to the end (see both pages' own docstrings), but
 * that gate was removed; this is a softer, non-blocking version of the same nudge. Flies up from
 * off-screen on mount, bounces a few times to draw the eye, then settles and stays put — and
 * flies back down out of the way once the page is nearly fully scrolled (the checkbox/buttons
 * area is already in view, so the hint has nothing left to say). Purely a visual affordance: it
 * never blocks scrolling or interaction (`pointer-events: none`), and the checkbox/button
 * underneath work identically whether it's showing or not.
 */
export function ScrollDownHint() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function updateVisibility() {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) {
        setVisible(false)
        return
      }
      const progress = window.scrollY / scrollable
      setVisible(progress < HIDE_THRESHOLD)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  return (
    <div
      className={[styles.wrapper, visible ? styles.visible : ''].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      <div className={styles.pill}>
        <span>Scroll down to agree</span>
        <ArrowDownIcon className={styles.icon} />
      </div>
    </div>
  )
}
