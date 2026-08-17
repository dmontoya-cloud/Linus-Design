import { defaultAlpha } from './alpha'

/** Elevation/shadow recipes — ported from docs/design.md, composed from `alpha` tokens. */
export interface ElevationTokens {
  shadowCard: string
  shadowModal: string
}

export const defaultElevation: ElevationTokens = {
  shadowCard: `0 2px 8px ${defaultAlpha.shadowInk06}, 0 1px 2px ${defaultAlpha.shadowInk04}`,
  shadowModal: `0 16px 40px ${defaultAlpha.shadowInk14}, 0 4px 12px ${defaultAlpha.shadowInk08}`,
}
