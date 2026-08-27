import styles from './MicrophoneTroubleshootingModal.module.css'

/**
 * An original illustration of a generic browser microphone-permission prompt — the little
 * address-bar dropdown ("example.com wants to Use your microphone" / Block / Allow) that shows
 * up the first time a site asks for mic access. Hand-drawn from plain SVG shapes and `<text>`
 * using this system's own color tokens, the same "no stock assets" approach as this flow's other
 * illustrations (`ReadingCompanion`, `SpeakerCompanion`/`MicrophoneCompanion`) — not a screenshot
 * of any one real browser, since the exact chrome differs by browser/OS/version and would go
 * stale; generic enough to read as "that permission popup" in any of them.
 */
export function BrowserMicPermissionMockup() {
  return (
    <svg
      viewBox="0 0 320 190"
      className={styles.mockup}
      role="img"
      aria-label='Example browser microphone permission prompt: a popup reading "example.com wants to Use your microphone", with Block and Allow buttons'
    >
      <rect
        x="1"
        y="1"
        width="318"
        height="188"
        rx="12"
        fill="var(--color-surface, #fff)"
        stroke="var(--color-border-subtle, #eff0f2)"
        strokeWidth="2"
      />
      <path
        d="M1,13 A12,12 0 0 1 13,1 H307 A12,12 0 0 1 319,13 V38 H1 Z"
        fill="var(--color-background, #faf9f7)"
      />
      <line x1="1" y1="38" x2="319" y2="38" stroke="var(--color-border-subtle, #eff0f2)" />
      <circle cx="18" cy="19" r="4" fill="var(--color-text-tertiary, #94a3ad)" />
      <circle cx="34" cy="19" r="4" fill="var(--color-text-tertiary, #94a3ad)" />
      <circle cx="50" cy="19" r="4" fill="var(--color-text-tertiary, #94a3ad)" />
      <rect
        x="70"
        y="11"
        width="234"
        height="16"
        rx="8"
        fill="var(--color-surface, #fff)"
        stroke="var(--color-border-subtle, #eff0f2)"
      />
      <text
        x="86"
        y="23"
        fontSize="9"
        fontFamily="var(--font-family, system-ui, sans-serif)"
        fill="var(--color-text-secondary, #5b6b79)"
      >
        example.com
      </text>

      <rect
        x="34"
        y="52"
        width="220"
        height="118"
        rx="10"
        fill="var(--color-surface, #fff)"
        stroke="var(--color-border-subtle, #eff0f2)"
        strokeWidth="1.5"
      />

      <rect
        x="50"
        y="66"
        width="30"
        height="30"
        rx="15"
        fill="var(--color-primary-soft, #e6f2f7)"
      />
      <rect
        x="60"
        y="72"
        width="10"
        height="18"
        rx="5"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="2.5"
      />
      <path
        d="M56,83 a9,9 0 0 0 18,0"
        fill="none"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="65"
        y1="92"
        x2="65"
        y2="98"
        stroke="var(--color-text-primary, #1f2a37)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <text
        x="92"
        y="76"
        fontSize="11"
        fontWeight="600"
        fontFamily="var(--font-family, system-ui, sans-serif)"
        fill="var(--color-text-primary, #1f2a37)"
      >
        example.com
      </text>
      <text
        x="92"
        y="92"
        fontSize="10"
        fontFamily="var(--font-family, system-ui, sans-serif)"
        fill="var(--color-text-secondary, #5b6b79)"
      >
        wants to
      </text>
      <text
        x="92"
        y="106"
        fontSize="10"
        fontFamily="var(--font-family, system-ui, sans-serif)"
        fill="var(--color-text-secondary, #5b6b79)"
      >
        Use your microphone
      </text>

      <rect
        x="50"
        y="130"
        width="88"
        height="26"
        rx="13"
        fill="var(--color-surface, #fff)"
        stroke="var(--color-border-subtle, #eff0f2)"
      />
      <text
        x="94"
        y="147"
        fontSize="11"
        textAnchor="middle"
        fontFamily="var(--font-family, system-ui, sans-serif)"
        fill="var(--color-text-secondary, #5b6b79)"
      >
        Block
      </text>

      <rect x="150" y="130" width="88" height="26" rx="13" fill="var(--color-primary, #087dae)" />
      <text
        x="194"
        y="147"
        fontSize="11"
        textAnchor="middle"
        fontFamily="var(--font-family, system-ui, sans-serif)"
        fill="var(--color-text-on-primary, #fff)"
        fontWeight="600"
      >
        Allow
      </text>
    </svg>
  )
}
