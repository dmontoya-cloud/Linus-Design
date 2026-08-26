import { Fragment, useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { ArrowRightIcon } from '@/components/atoms/Icon'
import { DashboardNavBar } from '../DashboardNavBar'
import { cascadeDelay } from '../cascade'
import { WORDS, speak, cancelSpeech } from './assessmentVoiceOver'
import styles from './AssessmentIntroPage.module.css'

/** Some browsers (notably Chrome) can silently drop a `speechSynthesis.speak()` call made the
 * instant a page mounts — the synthesis engine hasn't finished spinning up yet. A short delay
 * before the very first, autoplaying call is a commonly-used workaround. */
const AUTOPLAY_DELAY_MS = 250

/** Shown in the nav bar in place of the usual Assessment/History/Settings links — this screen
 * is dedicated to one activity, so navigating elsewhere isn't a real choice here. */
const ACTIVITY_NAME = 'Memory & Thinking'

/** A small original illustration sitting above the instructions — a friendly, bespectacled
 * "thinking" character built from plain shapes/paths in this file, using the design system's
 * own color tokens (no stock art, no external asset). */
function ReadingCompanion({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 200 160"
      className={[styles.companion, className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M40,90 C20,90 15,60 35,45 C30,20 65,10 85,25 C100,8 135,8 148,28
           C170,20 185,45 172,65 C190,80 185,110 165,118 C168,140 140,152 118,142
           C108,158 78,158 68,142 C45,148 22,130 30,108 C18,100 25,90 40,90 Z"
        fill="var(--color-primary-soft, #e6f2f7)"
      />
      <circle
        cx="75"
        cy="85"
        r="24"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
      />
      <circle
        cx="135"
        cy="85"
        r="24"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
      />
      <line
        x1="99"
        y1="85"
        x2="111"
        y2="85"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
      />
      <circle cx="75" cy="85" r="4" fill="var(--color-text-primary, #1f2a37)" />
      <circle cx="135" cy="85" r="4" fill="var(--color-text-primary, #1f2a37)" />
      <path
        d="M87,122 Q105,136 123,122"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M166,38 q10,-7 19,1"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M174,53 q13,-4 22,7"
        fill="none"
        stroke="var(--color-secondary, #86c65a)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Assessment Intro — the screen shown right after tapping "Start" on a Dashboard activity
 * card, before the actual assessment tasks begin (still a PoD-4 stub — there's no real task
 * flow to hand off to yet). The illustration (`ReadingCompanion`), the activity name as an
 * `<h1>`, and the instructions paragraph cascade in on mount — the same
 * fade-rise-staggered-by-`cascadeDelay` rhythm Dashboard uses — rather than simply appearing,
 * so landing here reads as dynamic. `ReadingCompanion` is hand-drawn from plain SVG shapes
 * using this system's own color tokens rather than a stock image, since the reference photo
 * requested for this spot turned out to carry a stock-site watermark and wasn't actually
 * licensed for use. Keeps `DashboardNavBar`'s
 * chrome (logo, nav bar) but swaps its centered Assessment/History/Settings links for the same
 * activity name shown as the page's own title, and its signed-in user info for a tertiary
 * "Exit" link back to Dashboard — this screen is about one activity,
 * not general navigation or whose account it is. Reads its instructions aloud on mount (see
 * `speak`, in `./assessmentVoiceOver`) — autoplaying this way relies on the visitor having just
 * tapped Start, a real user gesture, which is enough for most browsers to allow audio without
 * requiring an extra click first; the mount-time call is delayed slightly (`AUTOPLAY_DELAY_MS`)
 * since some browsers drop it if it fires immediately. The same text is always shown on screen
 * too — the voice-over is never the only way to get this information, for visitors who are
 * deaf/hard of hearing or simply have their sound off. The paragraph starts in its light gray
 * color and progressively darkens word by word as the voice-over reads — a "read so far"
 * reveal, not a single moving highlight. "I'm Ready to Begin" stays hidden until that reveal
 * reaches the last word, then cascades in (the same fade-rise-staggered-by-`cascadeDelay`
 * rhythm Dashboard's cards use) — reading the instructions is the one thing to do here before
 * moving on, so "begin" isn't offered until there's actually something to begin from.
 * `.actionsWrapper` grows the button's row height in smoothly (a CSS grid-rows trick) rather
 * than inserting it all at once — since `.content` vertically centers `.card`, that growth also
 * re-centers everything above the button upward; animating it turns that shift into a graceful
 * glide instead of the abrupt jump an instant insert would cause.
 */
export function AssessmentIntroPage() {
  const [readUpToIndex, setReadUpToIndex] = useState<number | null>(null)
  const hasFinishedReading = readUpToIndex === WORDS.length - 1

  useEffect(() => {
    const timer = window.setTimeout(() => speak(setReadUpToIndex), AUTOPLAY_DELAY_MS)
    return () => {
      window.clearTimeout(timer)
      cancelSpeech()
    }
  }, [])

  return (
    <div className={styles.page}>
      <DashboardNavBar title={ACTIVITY_NAME} exitTo="/dashboard" />
      <main className={styles.content}>
        <div className={styles.card}>
          <ReadingCompanion className={styles.reveal} style={{ animationDelay: cascadeDelay(0) }} />
          <h1
            className={[styles.title, styles.reveal].join(' ')}
            style={{ animationDelay: cascadeDelay(1) }}
          >
            {ACTIVITY_NAME}
          </h1>
          <p
            className={[styles.instructions, styles.reveal].join(' ')}
            style={{ animationDelay: cascadeDelay(2) }}
          >
            {WORDS.map((word, index) => (
              <Fragment key={word.start}>
                <span
                  className={
                    readUpToIndex !== null && index <= readUpToIndex
                      ? `${styles.word} ${styles.wordRead}`
                      : styles.word
                  }
                >
                  {word.text}
                </span>
                {index < WORDS.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </p>
          <div
            className={[
              styles.actionsWrapper,
              hasFinishedReading ? styles.actionsWrapperExpanded : '',
            ].join(' ')}
          >
            <div className={styles.actionsInner}>
              {hasFinishedReading ? (
                <div className={styles.actions}>
                  <Link
                    to="/assessment/memory-and-thinking"
                    className={`${buttonClassName('primary', 'lg')} ${styles.beginButton} ${styles.reveal}`}
                    style={{ animationDelay: cascadeDelay(0) }}
                  >
                    I&apos;m Ready to Begin
                    <ArrowRightIcon className={styles.beginIcon} />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
