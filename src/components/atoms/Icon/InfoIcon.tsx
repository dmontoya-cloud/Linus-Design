export interface InfoIconProps {
  className?: string
}

/**
 * Icon/Info — Phosphor "regular" weight (phosphor-icons/core, MIT-licensed), real SVG
 * markup pulled directly from the library rather than redrawn, matching this system's
 * documented icon-sourcing convention (see docs/design.md's Icons section): 24×24 grid,
 * `viewBox="0 0 256 256"`, `fill="currentColor"`. Leads `Tooltip`'s icon-button trigger —
 * see `Atom/Tooltip`, `src/components/atoms/Tooltip`.
 */
export function InfoIcon({ className }: InfoIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
    </svg>
  )
}
