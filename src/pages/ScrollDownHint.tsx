import { useEffect, useState, type MouseEvent } from 'react'
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
 * area is already in view, so the hint has nothing left to say). Clickable, on request — a real
 * `<button>` that smooth-scrolls straight to the very bottom of the page (not just far enough to
 * reveal the checkbox/agree button) so there's nothing left to scroll. Gated by CSS
 * (`pointer-events`/`tabIndex`) rather than the `disabled` attribute while hidden — `disabled`
 * would drop the button (still focused right after the click that triggered this scroll) out of
 * the accessibility tree the instant `visible` flips false partway through the animation, which
 * forces a focus change and interrupts the in-flight smooth scroll before it reaches bottom. The
 * checkbox/button underneath work identically either way.
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

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    // Blurred immediately, before the scroll even starts — otherwise this button stays
    // focused into the moment `visible` flips false (see the doc comment above), and an
    // `aria-hidden` element that still holds DOM focus is itself an accessibility violation
    // separate from the interrupted-scroll bug that not using `disabled` already fixes.
    event.currentTarget.blur()
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
  }

  return (
    <div className={[styles.wrapper, visible ? styles.visible : ''].filter(Boolean).join(' ')}>
      <button
        type="button"
        className={styles.pill}
        onClick={handleClick}
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
      >
        <span>Scroll down to agree</span>
        <ArrowDownIcon className={styles.icon} />
      </button>
    </div>
  )
}
