/**
 * Typography tokens — ported from docs/design.md. Real typeface and modular
 * scale, decided directly with the founder (see
 * docs/design-system-session-report.md) — not Figma-sourced; a Figma type
 * scale is tracked separately (WI-0002) and stays open.
 */
const FONT_FAMILY = "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
/** Every Headline style — the accent face that sets titles apart from body/label text, which
 * stays on FONT_FAMILY. */
const FONT_FAMILY_SERIF =
  "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"

export interface TextStyle {
  fontFamily: string
  fontSize: string
  fontWeight: number
  lineHeight: number
  letterSpacing?: string
}

/**
 * 1.200 (minor third) modular scale, base = paragraph-2 = 16px. Headline
 * counts down from largest (headline-1 biggest); Paragraph counts up from
 * smallest (paragraph-1 smallest) — a deliberate asymmetry, see
 * docs/design.md. Keyed with design.md's exact kebab-case names so the two
 * stay trivially diffable.
 */
export type TypeStyleName =
  | 'headline-1-regular'
  | 'headline-1-semibold'
  | 'headline-2-regular'
  | 'headline-2-semibold'
  | 'headline-3-regular'
  | 'headline-3-semibold'
  | 'headline-4-regular'
  | 'headline-4-semibold'
  | 'headline-5-regular'
  | 'headline-5-semibold'
  | 'paragraph-1-regular'
  | 'paragraph-1-semibold'
  | 'paragraph-2-regular'
  | 'paragraph-2-semibold'
  | 'paragraph-3-regular'
  | 'paragraph-3-semibold'
  | 'paragraph-4-regular'
  | 'paragraph-4-semibold'
  | 'label-l-regular'
  | 'label-l-semibold'
  | 'label-m-regular'
  | 'label-m-semibold'
  | 'label-s-regular'
  | 'label-s-semibold'
  | 'button'

export interface TypographyTokens {
  /** Generic body font — the same stack every named style below also carries. */
  fontFamily: string
  weightRegular: number
  weightSemibold: number
  styles: Record<TypeStyleName, TextStyle>
}

export const defaultTypography: TypographyTokens = {
  fontFamily: FONT_FAMILY,
  weightRegular: 400,
  weightSemibold: 600,
  styles: {
    'headline-1-regular': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '3rem',
      fontWeight: 400,
      lineHeight: 1.15,
      letterSpacing: '-0.01em',
    },
    'headline-1-semibold': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '3rem',
      fontWeight: 600,
      lineHeight: 1.15,
      letterSpacing: '-0.01em',
    },
    'headline-2-regular': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '2.5rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    'headline-2-semibold': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    'headline-3-regular': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '2.0625rem',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    'headline-3-semibold': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '2.0625rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    'headline-4-regular': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.25,
    },
    'headline-4-semibold': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    /* Below the modular scale's own progression on purpose — continuing the 1.200 ratio one
       more step down from headline-4 would land at ~1.458rem, indistinguishable from
       paragraph-4 (1.4375rem) already sitting right next to it. headline-5 exists for a real
       need (Registration's field-group subheadings — see OnboardingPage), a size visibly
       smaller than paragraph-4 while still bold enough to read as a title, not body text. */
    'headline-5-regular': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    'headline-5-semibold': {
      fontFamily: FONT_FAMILY_SERIF,
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    'paragraph-1-regular': {
      fontFamily: FONT_FAMILY,
      fontSize: '0.8125rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    'paragraph-1-semibold': {
      fontFamily: FONT_FAMILY,
      fontSize: '0.8125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    'paragraph-2-regular': {
      fontFamily: FONT_FAMILY,
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    'paragraph-2-semibold': {
      fontFamily: FONT_FAMILY,
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    'paragraph-3-regular': {
      fontFamily: FONT_FAMILY,
      fontSize: '1.1875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    'paragraph-3-semibold': {
      fontFamily: FONT_FAMILY,
      fontSize: '1.1875rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    'paragraph-4-regular': {
      fontFamily: FONT_FAMILY,
      fontSize: '1.4375rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    'paragraph-4-semibold': {
      fontFamily: FONT_FAMILY,
      fontSize: '1.4375rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    'label-l-regular': {
      fontFamily: FONT_FAMILY,
      fontSize: '0.8125rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.01em',
    },
    'label-l-semibold': {
      fontFamily: FONT_FAMILY,
      fontSize: '0.8125rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.01em',
    },
    'label-m-regular': {
      fontFamily: FONT_FAMILY,
      fontSize: '0.6875rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.02em',
    },
    'label-m-semibold': {
      fontFamily: FONT_FAMILY,
      fontSize: '0.6875rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.02em',
    },
    'label-s-regular': {
      fontFamily: FONT_FAMILY,
      fontSize: '0.5625rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.03em',
    },
    'label-s-semibold': {
      fontFamily: FONT_FAMILY,
      fontSize: '0.5625rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0.03em',
    },
    button: {
      fontFamily: FONT_FAMILY,
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1,
    },
  },
}
