export interface UserIconProps {
  className?: string
}

/**
 * Icon/User — Phosphor "regular" weight (phosphor-icons/core, MIT-licensed), real SVG markup
 * pulled directly from the library rather than redrawn, matching this system's documented
 * icon-sourcing convention (see docs/design.md's Icons section): 24×24 grid,
 * `viewBox="0 0 256 256"`, `fill="currentColor"`. Leads the "Profile" item in
 * `DashboardNavBar`'s account menu.
 */
export function UserIcon({ className }: UserIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
    </svg>
  )
}
