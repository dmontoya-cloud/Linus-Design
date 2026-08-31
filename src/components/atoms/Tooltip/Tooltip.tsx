import { useId, useState, type ReactNode } from 'react'
import styles from './Tooltip.module.css'

export interface TooltipProps {
  /** The tooltip's own text — kept short, on request, since this is a caption, not a
   * place to move a whole paragraph out of sight. */
  content: string
  /** The trigger, typically an icon (e.g. `InfoIcon`) — rendered inside a real `<button>`
   * so it's keyboard-focusable and shows/hides the tooltip on both hover and focus, not
   * hover alone. */
  children: ReactNode
  /** The trigger button's accessible name — it has no visible text of its own (usually
   * just an icon), so screen readers need this to announce it as anything at all.
   * Defaults to a generic label; pass a more specific one where the icon alone would be
   * ambiguous. */
  triggerLabel?: string
}

/**
 * Atom/Tooltip — new here, the first real consumer of the `tooltip` z-index token (see
 * docs/design.md's Layering section, reserved but unused until now). Always mounted (not
 * conditionally rendered) so its appearance can be a real CSS opacity/transform transition
 * rather than a mount/unmount snap, the same approach `MemoryThinkingDetailsPage`'s own
 * "Start Activity" arrow already uses. The trigger is a real `<button>`, not a `<span>` with
 * a faked `role="button"` — consistent with this system's standing preference for real
 * native elements over reconstructed equivalents (`<select>`, `<input type="date">`,
 * `<dialog>`). `aria-describedby` links the trigger to the tooltip's own `role="tooltip"`
 * text so screen readers announce it the same way hover/focus reveals it visually.
 */
export function Tooltip({ content, children, triggerLabel = 'More information' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()

  return (
    <span className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={triggerLabel}
        aria-describedby={tooltipId}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </button>
      <span
        role="tooltip"
        id={tooltipId}
        className={[styles.bubble, visible ? styles.bubbleVisible : ''].filter(Boolean).join(' ')}
      >
        {content}
      </span>
    </span>
  )
}
