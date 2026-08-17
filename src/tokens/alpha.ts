/**
 * Alpha tokens — ported from docs/design.md. A primitive or base neutral at
 * a stated opacity: the sanctioned way to get transparency (shadows,
 * translucent chips) without inventing a standalone rgb value or spawning
 * new primitives for one-off effects.
 */
export interface AlphaTokens {
  shadowInk06: string
  shadowInk04: string
  shadowInk14: string
  shadowInk08: string
  surface85: string
  scrim48: string
}

export const defaultAlpha: AlphaTokens = {
  shadowInk06: 'rgba(32, 37, 42, 0.06)', // gray-900 @ 6%
  shadowInk04: 'rgba(32, 37, 42, 0.04)', // gray-900 @ 4%
  shadowInk14: 'rgba(32, 37, 42, 0.14)', // gray-900 @ 14%
  shadowInk08: 'rgba(32, 37, 42, 0.08)', // gray-900 @ 8%
  surface85: 'rgba(255, 255, 255, 0.85)', // surface (white) @ 85%
  scrim48: 'rgba(32, 37, 42, 0.48)', // gray-900 @ 48% — Modal's backdrop
}
