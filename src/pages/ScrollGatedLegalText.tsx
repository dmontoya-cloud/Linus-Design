import { useEffect, useRef, type ReactNode, type UIEvent } from 'react'
import styles from './ScrollGatedLegalText.module.css'

interface ScrollGatedLegalTextProps {
  paragraphs: ReactNode[]
  /** Fires once — the moment the visitor reaches the bottom, or immediately on mount if the
   * text is short enough to never need scrolling in the first place. Never fires "un-read"
   * again after that; scrolling back up doesn't re-lock whatever it unlocked. */
  onScrolledToEnd: () => void
}

const BOTTOM_THRESHOLD_PX = 4

/** Full legal text (Terms of Use, Privacy Policy), scrollable in place rather than behind a
 * "Read full text" link/Modal — the whole point is that a visitor can't agree to text they
 * never actually saw. Same card look as SummaryCard (radius, shadow, padding), fixed height
 * so it scrolls internally instead of growing the page. */
export function ScrollGatedLegalText({ paragraphs, onScrolledToEnd }: ScrollGatedLegalTextProps) {
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const box = boxRef.current
    if (box && box.scrollHeight <= box.clientHeight) {
      onScrolledToEnd()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: does the text even need scrolling?
  }, [])

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const box = event.currentTarget
    if (box.scrollTop + box.clientHeight >= box.scrollHeight - BOTTOM_THRESHOLD_PX) {
      onScrolledToEnd()
    }
  }

  return (
    <div className={styles.box} ref={boxRef} onScroll={handleScroll}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  )
}
