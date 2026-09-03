export interface MicrophoneIconProps {
  className?: string
}

/**
 * Icon/Microphone — Phosphor "regular" weight (phosphor-icons/core, MIT-licensed), real SVG
 * markup pulled directly from the library rather than redrawn, matching this system's
 * documented icon-sourcing convention (see docs/design.md's Icons section): 24×24 grid,
 * `viewBox="0 0 256 256"`, `fill="currentColor"`. Added for `MemoryThinkingTaskPage`'s illustrative
 * "recording"/"listening" circles — static stand-ins for the real microphone capture the older
 * device-setup/voice-over flow uses, on request (this page never actually listens).
 */
export function MicrophoneIcon({ className }: MicrophoneIconProps) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M128,176a48.05,48.05,0,0,0,48-48V64a48,48,0,0,0-96,0v64A48.05,48.05,0,0,0,128,176ZM96,64a32,32,0,0,1,64,0v64a32,32,0,0,1-64,0Zm40,143.6V240a8,8,0,0,1-16,0V207.6A80.11,80.11,0,0,1,48,128a8,8,0,0,1,16,0,64,64,0,0,0,128,0,8,8,0,0,1,16,0A80.11,80.11,0,0,1,136,207.6Z" />
    </svg>
  )
}
