export interface ArrowLeftBoldIconProps {
  className?: string
}

/**
 * Icon/ArrowLeftBold — Phosphor "bold" weight (phosphor-icons/core, MIT-licensed), real SVG
 * markup pulled directly from the library rather than redrawn — the mirror of
 * `ArrowRightBoldIcon`, for the Lifestyle questionnaire's "Back" button leading the same bold
 * weight `ArrowRightBoldIcon` gives its own "Next" button.
 */
export function ArrowLeftBoldIcon({ className }: ArrowLeftBoldIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z" />
    </svg>
  )
}
