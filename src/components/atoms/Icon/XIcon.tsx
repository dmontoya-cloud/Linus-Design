export interface XIconProps {
  className?: string
}

/**
 * Icon/X — Phosphor "regular" weight (phosphor-icons/core, MIT-licensed), real SVG markup
 * pulled directly from the library rather than redrawn, matching this system's documented
 * icon-sourcing convention (see docs/design.md's Icons section): 24×24 grid,
 * `viewBox="0 0 256 256"`, `fill="currentColor"`. Dismisses the Help Assistant greeting bubble
 * (see `ChatWidget`).
 */
export function XIcon({ className }: XIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  )
}
