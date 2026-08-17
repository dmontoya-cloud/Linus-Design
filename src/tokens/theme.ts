import { defaultColors, type ColorTokens } from './colors'
import { defaultTypography, type TypographyTokens } from './typography'
import { defaultSpacing, type SpacingTokens } from './spacing'
import { defaultRadius, type RadiusTokens } from './radius'
import { defaultAlpha, type AlphaTokens } from './alpha'
import { defaultElevation, type ElevationTokens } from './elevation'
import { defaultMotion, type MotionTokens } from './motion'

/**
 * A Brand is the unit of white-label theming: swap this object (or load a
 * different one at runtime, e.g. by subdomain/config flag) and every themed
 * component re-skins without any component code changing.
 */
export interface Brand {
  id: string
  name: string
  logoUrl: string
  colors: ColorTokens
  typography: TypographyTokens
  spacing: SpacingTokens
  radius: RadiusTokens
  alpha: AlphaTokens
  elevation: ElevationTokens
  motion: MotionTokens
}

export const linusBrand: Brand = {
  id: 'linus',
  name: 'Linus Health',
  logoUrl: '/brand/linus/logo.svg',
  colors: defaultColors,
  typography: defaultTypography,
  spacing: defaultSpacing,
  radius: defaultRadius,
  alpha: defaultAlpha,
  elevation: defaultElevation,
  motion: defaultMotion,
}

/** Flattens a Brand's tokens into CSS custom properties, e.g. `--color-primary`. */
export function brandToCssVars(brand: Brand): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(brand.colors)) {
    vars[`--color-${kebabCase(key)}`] = value
  }
  for (const [key, value] of Object.entries(brand.spacing)) {
    vars[`--space-${kebabCase(key)}`] = value
  }
  for (const [key, value] of Object.entries(brand.radius)) {
    vars[`--radius-${kebabCase(key)}`] = value
  }
  for (const [key, value] of Object.entries(brand.alpha)) {
    vars[`--alpha-${kebabCase(key)}`] = value
  }
  for (const [key, value] of Object.entries(brand.elevation)) {
    vars[`--${kebabCase(key)}`] = value
  }
  for (const [key, value] of Object.entries(brand.motion)) {
    vars[`--motion-${kebabCase(key)}`] = value
  }

  // Typography needs bespoke flattening: values are nested per-style objects
  // (fontFamily/fontSize/fontWeight/lineHeight/letterSpacing), not plain
  // strings/numbers, so the generic loop above can't handle them.
  vars['--font-family'] = brand.typography.fontFamily
  vars['--font-weight-regular'] = String(brand.typography.weightRegular)
  vars['--font-weight-semibold'] = String(brand.typography.weightSemibold)
  for (const [name, style] of Object.entries(brand.typography.styles)) {
    vars[`--font-${name}-family`] = style.fontFamily
    vars[`--font-${name}-size`] = style.fontSize
    vars[`--font-${name}-weight`] = String(style.fontWeight)
    vars[`--font-${name}-line-height`] = String(style.lineHeight)
    if (style.letterSpacing) {
      vars[`--font-${name}-letter-spacing`] = style.letterSpacing
    }
  }

  return vars
}

function kebabCase(input: string): string {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
