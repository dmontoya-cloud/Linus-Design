/** Corner radius tokens — ported from docs/design.md. Nothing in this system uses a sharp 0px corner. */
export interface RadiusTokens {
  sm: string
  md: string
  lg: string
  xl: string
  pill: string
  circle: string
}

export const defaultRadius: RadiusTokens = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  pill: '999px',
  circle: '50%',
}
