/**
 * Which Dashboard implementation the `/dashboard` route renders. There is no in-app control for
 * this on request — the two versions are meant to be switched by editing this constant (ask
 * Claude to "show dashboard 1/2" rather than adding a UI toggle), so both can be iterated on
 * independently without either being deleted.
 */
export type DashboardVariant = 'v1' | 'v2'

export const ACTIVE_DASHBOARD_VARIANT: DashboardVariant = 'v2'
