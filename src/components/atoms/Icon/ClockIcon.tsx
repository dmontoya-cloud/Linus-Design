export interface ClockIconProps {
  className?: string
}

/**
 * Icon/Clock — Phosphor "regular" weight (phosphor-icons/core, MIT-licensed), real SVG
 * markup pulled directly from the library rather than redrawn, matching this system's
 * documented icon-sourcing convention (see docs/design.md's Icons section): 24×24 grid,
 * `viewBox="0 0 256 256"`, `fill="currentColor"` so it recolors with whatever text/content
 * color its container already sets, no separate icon-color system needed. The first icon in
 * this codebase's React implementation to live as its own shared atom (every icon before
 * this — Toast's, ResourcesCard's — was a local one-off inside the component that used it).
 */
export function ClockIcon({ className }: ClockIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
    </svg>
  )
}
