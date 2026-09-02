export interface PlusCircleIconProps {
  className?: string
}

/**
 * Icon/PlusCircle — Phosphor "regular" weight (phosphor-icons/core, MIT-licensed), real SVG
 * markup pulled directly from the library rather than redrawn, matching this system's
 * documented icon-sourcing convention. `plus` is one of docs/design.md's documented starter-set
 * icons without a React implementation yet — this is its first real consumer: the Priorities
 * questionnaire's "Add another" answer button.
 */
export function PlusCircleIcon({ className }: PlusCircleIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z" />
    </svg>
  )
}
