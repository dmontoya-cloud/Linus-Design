import { defaultColors, type ColorTokens } from './colors'
import { defaultTypography, type TypographyTokens } from './typography'
import { defaultSpacing, type SpacingTokens } from './spacing'

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
}

export const linusBrand: Brand = {
  id: 'linus',
  name: 'Linus Health',
  logoUrl: '/brand/linus/logo.svg',
  colors: defaultColors,
  typography: defaultTypography,
  spacing: defaultSpacing,
}

/** Flattens a Brand's tokens into CSS custom properties, e.g. `--color-brand-primary`. */
export function brandToCssVars(brand: Brand): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [key, value] of Object.entries(brand.colors)) {
    vars[`--color-${kebabCase(key)}`] = value
  }
  for (const [key, value] of Object.entries(brand.typography)) {
    vars[`--font-${kebabCase(key)}`] = String(value)
  }
  for (const [key, value] of Object.entries(brand.spacing)) {
    vars[`--space-${kebabCase(key)}`] = value
  }
  return vars
}

function kebabCase(input: string): string {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
