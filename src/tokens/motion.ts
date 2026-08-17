/**
 * Motion tokens — ported from docs/design.md's Motion section. Three
 * durations (fast for a plain color swap, base for something that visibly
 * travels a short distance like a toggle thumb sliding, slow for a larger
 * surface entering/leaving the viewport) and three eases (standard for most
 * transitions, enter/exit for direction-specific arrive/leave motion).
 */
export interface MotionTokens {
  durationFast: string
  durationBase: string
  durationSlow: string
  easingStandard: string
  easingEnter: string
  easingExit: string
}

export const defaultMotion: MotionTokens = {
  durationFast: '120ms',
  durationBase: '150ms',
  durationSlow: '250ms',
  easingStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easingEnter: 'cubic-bezier(0, 0, 0.2, 1)',
  easingExit: 'cubic-bezier(0.4, 0, 1, 1)',
}
