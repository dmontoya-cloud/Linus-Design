export interface ArrowRightBoldIconProps {
  className?: string
}

/**
 * Icon/ArrowRightBold — Phosphor "bold" weight (phosphor-icons/core, MIT-licensed), real SVG
 * markup pulled directly from the library rather than redrawn. A deliberate exception to this
 * system's "regular weight everywhere" icon convention (see docs/design.md's Icons section
 * and `ArrowRightIcon`, the regular-weight version used elsewhere) — on request, for the
 * "Start Activity" affordance arrow on Memory & Thinking's details screen, which reads too
 * thin at regular weight once it's the only accent on the button.
 */
export function ArrowRightBoldIcon({ className }: ArrowRightBoldIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
    </svg>
  )
}
