/**
 * Color tokens — ported from docs/design.md (the design system source of
 * truth). Two open items carried over from that doc, not resolved here:
 * `danger` has no confirmed brand red (a chosen placeholder); `purple` has
 * no assigned semantic role (primitive only, unused).
 *
 * White-label contract: every brand ships one `ColorTokens` object. Swapping
 * skins is swapping this object (see tokens/theme.ts), never touching
 * component code. Primitives below back the semantic tokens but are never
 * consumed directly by components — see docs/design.md's Colors section.
 */

/** Raw hue ramps, 9 steps each (50 lightest → 950 darkest), confirmed Figma brand palette + a neutral gray. */
export const colorPrimitives = {
  blue: {
    50: '#F8FBFD',
    100: '#E6F2F7',
    200: '#B5D8E7',
    300: '#77B8D2',
    500: '#087DAE',
    700: '#065E83',
    800: '#044560',
    900: '#032C3D',
    950: '#021923',
  },
  green: {
    50: '#FBFDFA',
    100: '#F3F9EF',
    200: '#DBEECE',
    300: '#BCE0A4',
    500: '#86C65A',
    700: '#659544',
    800: '#4A6D32',
    900: '#2F4520',
    950: '#1B2812',
  },
  teal: {
    50: '#F7FCFC',
    100: '#E6F5F6',
    200: '#B3E2E3',
    300: '#73CACB',
    500: '#009EA1',
    700: '#007679',
    800: '#005759',
    900: '#003738',
    950: '#002020',
  },
  orange: {
    50: '#FFFAF9',
    100: '#FFEEEB',
    200: '#FECCC2',
    300: '#FCA28F',
    500: '#FA5633',
    700: '#BC4126',
    800: '#8A2F1C',
    900: '#581E12',
    950: '#32110A',
  },
  purple: {
    50: '#FAFAFE',
    100: '#EEF0FD',
    200: '#CDD1F8',
    300: '#A3ABF2',
    500: '#5867E8',
    700: '#424DAE',
    800: '#303980',
    900: '#1F2451',
    950: '#12152E',
  },
  gray: {
    50: '#FAFBFB',
    100: '#EFF0F2',
    200: '#CED3D7',
    300: '#A5AEB5',
    400: '#81909C',
    500: '#5B6B79',
    700: '#44505B',
    800: '#323B43',
    900: '#20252A',
    950: '#121518',
  },
  success: {
    50: '#F8FBF9',
    100: '#E8F2EC',
    200: '#B9D9C5',
    300: '#7EB994',
    500: '#15803D',
    700: '#10602E',
    800: '#0C4622',
    900: '#072D15',
    950: '#041A0C',
  },
  danger: {
    50: '#FEF8F8',
    100: '#FCE9E9',
    200: '#F4BEBE',
    300: '#EC8888',
    500: '#DC2626',
    700: '#A51C1C',
    800: '#791515',
    900: '#4D0D0D',
    950: '#2C0808',
  },
  info: {
    50: '#F8FAFE',
    100: '#E9EFFD',
    200: '#BED0F9',
    300: '#87A9F4',
    500: '#2563EB',
    700: '#1C4AB0',
    800: '#143681',
    900: '#0D2352',
    950: '#071430',
  },
} as const

export interface ColorTokens {
  primary: string
  primaryHover: string
  primaryPressed: string
  primarySoft: string
  onPrimary: string
  primaryStrong: string
  primaryStrongHover: string
  secondary: string
  secondaryHover: string
  secondarySoft: string
  onSecondary: string
  secondarySubtle: string
  accent: string
  accentSoft: string
  onAccent: string
  surface: string
  background: string
  borderSubtle: string
  border: string
  borderStrong: string
  borderDisabled: string
  borderDanger: string
  borderSuccess: string
  borderInfo: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textOnPrimary: string
  success: string
  successSoft: string
  onSuccess: string
  warning: string
  warningSoft: string
  onWarning: string
  danger: string
  dangerSoft: string
  onDanger: string
  info: string
  infoSoft: string
  onInfo: string
  contentPrimary: string
  contentPrimaryDisabled: string
  contentPrimaryInverted: string
  contentSecondary: string
  contentSecondaryDisabled: string
  contentSecondaryInverted: string
  contentDanger: string
  contentSuccess: string
  contentWarning: string
  /** Not part of docs/design.md — a real a11y-critical value the app still needs; defaults to `primary`. */
  focusRing: string
}

export const defaultColors: ColorTokens = {
  primary: colorPrimitives.blue[500],
  primaryHover: colorPrimitives.blue[700],
  primaryPressed: colorPrimitives.blue[800],
  primarySoft: colorPrimitives.blue[100],
  onPrimary: '#FFFFFF',
  primaryStrong: colorPrimitives.blue[900],
  primaryStrongHover: colorPrimitives.blue[950],
  secondary: colorPrimitives.green[500],
  secondaryHover: colorPrimitives.green[700],
  secondarySoft: colorPrimitives.green[100],
  onSecondary: '#1F2A37',
  secondarySubtle: colorPrimitives.green[300],
  accent: colorPrimitives.teal[700],
  accentSoft: colorPrimitives.teal[100],
  onAccent: '#FFFFFF',
  surface: '#FFFFFF',
  background: '#FAF9F7',
  borderSubtle: colorPrimitives.gray[100],
  border: colorPrimitives.gray[200],
  borderStrong: colorPrimitives.gray[400],
  borderDisabled: colorPrimitives.gray[100],
  borderDanger: colorPrimitives.danger[500],
  borderSuccess: colorPrimitives.success[500],
  borderInfo: colorPrimitives.info[500],
  textPrimary: '#1F2A37',
  textSecondary: colorPrimitives.gray[500],
  textTertiary: '#94A3AD',
  textOnPrimary: '#FFFFFF',
  success: colorPrimitives.success[500],
  successSoft: colorPrimitives.success[100],
  onSuccess: '#FFFFFF',
  warning: colorPrimitives.orange[700],
  warningSoft: colorPrimitives.orange[100],
  onWarning: '#FFFFFF',
  danger: colorPrimitives.danger[500],
  dangerSoft: colorPrimitives.danger[100],
  onDanger: '#FFFFFF',
  info: colorPrimitives.info[500],
  infoSoft: colorPrimitives.info[100],
  onInfo: '#FFFFFF',
  contentPrimary: colorPrimitives.gray[900],
  contentPrimaryDisabled: colorPrimitives.gray[300],
  contentPrimaryInverted: '#FFFFFF',
  contentSecondary: colorPrimitives.gray[500],
  contentSecondaryDisabled: colorPrimitives.gray[200],
  contentSecondaryInverted: colorPrimitives.gray[100],
  contentDanger: colorPrimitives.danger[500],
  contentSuccess: colorPrimitives.success[500],
  contentWarning: colorPrimitives.orange[700],
  focusRing: colorPrimitives.blue[500],
}
