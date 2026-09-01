export interface PersonSimpleRunIconProps {
  className?: string
}

/**
 * Icon/PersonSimpleRun — Phosphor "regular" weight (phosphor-icons/core, MIT-licensed), real
 * SVG markup pulled directly from the library rather than redrawn, matching this system's
 * documented icon-sourcing convention (see docs/design.md's Icons section): 24×24 grid,
 * `viewBox="0 0 256 256"`. Unlike this set's other (filled-path) icons, Phosphor draws this
 * one as strokes rather than a solid fill, so it carries its own `stroke`/`strokeWidth`
 * rather than relying on a single `fill="currentColor"` on the root `<svg>`. Replaces
 * `BarbellIcon` leading the "Lifestyle" column in Dashboard's full-check-in progress row, on
 * request.
 */
export function PersonSimpleRunIcon({ className }: PersonSimpleRunIconProps) {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" className={className}>
      <circle
        cx="152"
        cy="56"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M56,105.6s32-25.67,80,7c50.47,34.3,80,20.85,80,20.85"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M110.64,161.16C128.47,165,176,180,176,232"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M134.44,111.51C128.37,135.24,98.81,206.68,32,200"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  )
}
