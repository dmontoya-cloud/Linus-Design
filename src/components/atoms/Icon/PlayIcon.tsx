export interface PlayIconProps {
  className?: string
}

/**
 * Icon/Play — Phosphor "regular" weight (phosphor-icons/core, MIT-licensed), real SVG markup
 * pulled directly from the library rather than redrawn, matching this system's documented
 * icon-sourcing convention (see docs/design.md's Icons section): 24×24 grid,
 * `viewBox="0 0 256 256"`, `fill="currentColor"` so it recolors with whatever text/content
 * color its container already sets, no separate icon-color system needed.
 */
export function PlayIcon({ className }: PlayIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z" />
    </svg>
  )
}
