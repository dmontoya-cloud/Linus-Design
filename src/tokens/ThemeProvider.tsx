import { type ReactNode, useMemo } from 'react'
import { type Brand, brandToCssVars, linusBrand } from './theme'

interface ThemeProviderProps {
  brand?: Brand
  children: ReactNode
}

/**
 * Scopes CSS custom properties to its subtree rather than the document root,
 * so multiple brands/themes can render side by side (e.g. in Storybook, or
 * two device simulators on one debug page) without clobbering each other.
 */
export function ThemeProvider({ brand = linusBrand, children }: ThemeProviderProps) {
  const style = useMemo(() => brandToCssVars(brand), [brand])
  return (
    <div className="theme-root" style={style as React.CSSProperties} data-brand={brand.id}>
      {children}
    </div>
  )
}
