import styles from './Spinner.module.css'

export interface SpinnerProps {
  className?: string
}

/**
 * Atom/Spinner — a continuous ring-in-pulse loading indicator, extracted from
 * `VerifyAccountPage`'s original one-off (that page keeps its own copy, unmigrated — this atom
 * exists for new usages, not to risk touching an already-working screen). Two nested elements,
 * not one: a rotating ring inside a separately-animated "breathing" pulse-scale wrapper, since
 * both a continuous spin and a continuous scale each need their own `transform` — stacking them
 * on a single element would let the second clobber the first instead of composing with it. Pure
 * CSS, no entrance animation of its own — wrap it in the caller's own `.reveal`-style fade-rise
 * if it needs one, the same way `VerifyAccountPage` does.
 */
export function Spinner({ className }: SpinnerProps) {
  return (
    <div className={[styles.pulse, className].filter(Boolean).join(' ')}>
      <div className={styles.ring} aria-hidden="true" />
    </div>
  )
}
