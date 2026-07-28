/**
 * Typography tokens. PLACEHOLDER — see colors.ts note. Real type scale comes
 * from Typography.pdf + Figma text styles in PoD 1.
 */
export interface TypographyTokens {
  fontFamily: string
  fontFamilyHeading: string
  sizeXs: string
  sizeSm: string
  sizeMd: string
  sizeLg: string
  sizeXl: string
  size2xl: string
  weightRegular: number
  weightMedium: number
  weightBold: number
  lineHeightTight: number
  lineHeightBase: number
}

export const defaultTypography: TypographyTokens = {
  fontFamily: `-apple-system, 'Segoe UI', Roboto, system-ui, sans-serif`,
  fontFamilyHeading: `-apple-system, 'Segoe UI', Roboto, system-ui, sans-serif`,
  sizeXs: '0.75rem',
  sizeSm: '0.875rem',
  sizeMd: '1rem',
  sizeLg: '1.125rem',
  sizeXl: '1.5rem',
  size2xl: '2rem',
  weightRegular: 400,
  weightMedium: 500,
  weightBold: 700,
  lineHeightTight: 1.2,
  lineHeightBase: 1.5,
}
