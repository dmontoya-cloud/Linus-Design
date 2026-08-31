export interface ArrowDownIconProps {
  className?: string
}

/**
 * Icon/ArrowDown — Phosphor "regular" weight (phosphor-icons/core, MIT-licensed), real SVG
 * markup pulled directly from the library rather than redrawn, matching this system's
 * documented icon-sourcing convention (see docs/design.md's Icons section): 24×24 grid,
 * `viewBox="0 0 256 256"`, `fill="currentColor"`. Documented as part of the starter set from
 * the beginning but unused until now — leads `ScrollDownHint`'s "Scroll down to agree" prompt
 * on Terms of Use / Privacy Policy.
 */
export function ArrowDownIcon({ className }: ArrowDownIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  )
}
