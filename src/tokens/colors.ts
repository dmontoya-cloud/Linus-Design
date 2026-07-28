/**
 * Color tokens.
 *
 * PLACEHOLDER VALUES — PoD 0 only wires the token pipeline end to end so the
 * component library and CI can be verified. The real values come from the
 * Figma "Linus Web - Design System" library variables and Colors.pdf, and
 * get pulled in during PoD 1 (design tokens). Do not treat these hex values
 * as brand-approved; they exist only to prove the theming mechanism works.
 *
 * White-label contract: every brand ships one `ColorTokens` object. Swapping
 * skins is swapping this object (see tokens/theme.ts), never touching
 * component code.
 */
export interface ColorTokens {
  brandPrimary: string
  brandPrimaryContrast: string
  brandSecondary: string
  surface: string
  surfaceAlt: string
  textPrimary: string
  textSecondary: string
  textInverse: string
  border: string
  success: string
  warning: string
  danger: string
  focusRing: string
}

export const defaultColors: ColorTokens = {
  brandPrimary: '#1B4B91',
  brandPrimaryContrast: '#FFFFFF',
  brandSecondary: '#0E9F6E',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F7FA',
  textPrimary: '#101828',
  textSecondary: '#475467',
  textInverse: '#FFFFFF',
  border: '#D0D5DD',
  success: '#0E9F6E',
  warning: '#B54708',
  danger: '#B42318',
  focusRing: '#1B4B91',
}
