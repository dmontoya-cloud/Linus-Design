import styles from './Logo.module.css'

export interface LogoProps {
  className?: string
}

/**
 * Atom/Logo — the Linus Health logo, the brand's own finished asset
 * (`public/linus-health-logo.svg`) rendered as an `<img>` rather than
 * inlined — it's a large, multi-color, multi-path mark, not something to
 * duplicate into every bundle that imports this component. Not a themeable
 * component: its colors are the asset's own literal brand colors, not
 * design tokens.
 */
export function Logo({ className }: LogoProps) {
  const classes = [styles.logo, className].filter(Boolean).join(' ')
  return <img src="/linus-health-logo.svg" alt="Linus Health" className={classes} />
}
