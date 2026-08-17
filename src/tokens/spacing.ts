/** Spacing scale tokens, 4px base unit. */
export interface SpacingTokens {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
  xxxl: string
}

export const defaultSpacing: SpacingTokens = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
}

/** Responsive breakpoints (min-width), matching mobile/tablet/desktop from the Figma frames. */
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1280,
} as const

export type Breakpoint = keyof typeof breakpoints
