import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from '@/components/atoms/Button'
import styles from './Modal.module.css'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  size?: ModalSize
  children: ReactNode
}

/**
 * Atom/Modal — native `<dialog>`, ported from docs/design.md. Focus
 * trapping, Escape-to-close, and an inert background come from the
 * platform via `showModal()`/`close()`, not hand-rolled. Clicking the
 * backdrop (a click landing on the dialog element itself, not its content)
 * also closes it, same as the close (×) button.
 */
export function Modal({ open, onClose, title, size = 'md', children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- native <dialog> backdrop-click-to-close idiom: ::backdrop isn't a real targetable node, so detecting an outside click means checking event.target on the dialog itself; Escape and the close button remain fully keyboard-accessible regardless.
    <dialog
      ref={dialogRef}
      className={[styles.panel, styles[size]].filter(Boolean).join(' ')}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      <div className={styles.header}>
        <h3 className={styles.title} id={titleId}>
          {title}
        </h3>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Close dialog"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      <div className={styles.body}>{children}</div>
      <div className={styles.footer}>
        <Button type="button" variant="outline" onClick={onClose}>
          Dismiss
        </Button>
      </div>
    </dialog>
  )
}
