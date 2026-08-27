---
version: alpha
name: Linus
description: Design system for Linus, a consumer app for taking mental-sharpness assessments — calm, encouraging, and human, never clinical.

colors:
  # Primitives — raw hue ramps derived from Linus's confirmed Figma brand
  # palette (blue, green, teal, orange, purple), plus a neutral gray
  # scale. Each ramp runs 50 (lightest tint) to 950 (darkest shade); 500 is
  # fixed to the exact confirmed base hex (gray-500 is anchored on the
  # existing text-secondary value instead, since gray has no brand hex).
  # Purple has no assigned semantic role yet — it's available as a
  # primitive only. gray alone also carries a 400 step (every other family
  # skips it): added so border-strong can clear the 3:1 non-text-contrast
  # minimum for component boundaries — gray-300 falls short at 2.25:1
  # against white, and gray-500 (5.49:1) reads too dark for a border.
  blue-50: '#F8FBFD'
  blue-100: '#E6F2F7'
  blue-200: '#B5D8E7'
  blue-300: '#77B8D2'
  blue-500: '#087DAE'
  blue-700: '#065E83'
  blue-800: '#044560'
  blue-900: '#032C3D'
  blue-950: '#021923'
  green-50: '#FBFDFA'
  green-100: '#F3F9EF'
  green-200: '#DBEECE'
  green-300: '#BCE0A4'
  green-500: '#86C65A'
  green-700: '#659544'
  green-800: '#4A6D32'
  green-900: '#2F4520'
  green-950: '#1B2812'
  teal-50: '#F7FCFC'
  teal-100: '#E6F5F6'
  teal-200: '#B3E2E3'
  teal-300: '#73CACB'
  teal-500: '#009EA1'
  teal-700: '#007679'
  teal-800: '#005759'
  teal-900: '#003738'
  teal-950: '#002020'
  orange-50: '#FFFAF9'
  orange-100: '#FFEEEB'
  orange-200: '#FECCC2'
  orange-300: '#FCA28F'
  orange-500: '#FA5633'
  orange-700: '#BC4126'
  orange-800: '#8A2F1C'
  orange-900: '#581E12'
  orange-950: '#32110A'
  purple-50: '#FAFAFE'
  purple-100: '#EEF0FD'
  purple-200: '#CDD1F8'
  purple-300: '#A3ABF2'
  purple-500: '#5867E8'
  purple-700: '#424DAE'
  purple-800: '#303980'
  purple-900: '#1F2451'
  purple-950: '#12152E'
  gray-50: '#FAFBFB'
  gray-100: '#EFF0F2'
  gray-200: '#CED3D7'
  gray-300: '#A5AEB5'
  gray-400: '#81909C'
  gray-500: '#5B6B79'
  gray-700: '#44505B'
  gray-800: '#323B43'
  gray-900: '#20252A'
  gray-950: '#121518'

  # Functional primitives — unlike blue/green/teal/orange/purple/gray above
  # (multi-purpose brand hues reused across several semantic tokens), these
  # 3 exist solely to back one matching semantic token each: `success`,
  # `danger`, `info`. Added so those 3 states stop reusing brand hues
  # (green/–/blue) that already mean something else (`secondary`/`primary`),
  # and so `danger` finally has a real primitive instead of an off-palette
  # placeholder. `warning` deliberately keeps using the `orange` brand
  # primitive — nothing else claims that hue, so there's no collision to fix.
  success-50: '#F8FBF9'
  success-100: '#E8F2EC'
  success-200: '#B9D9C5'
  success-300: '#7EB994'
  success-500: '#15803D'
  success-700: '#10602E'
  success-800: '#0C4622'
  success-900: '#072D15'
  success-950: '#041A0C'
  danger-50: '#FEF8F8'
  danger-100: '#FCE9E9'
  danger-200: '#F4BEBE'
  danger-300: '#EC8888'
  danger-500: '#DC2626'
  danger-700: '#A51C1C'
  danger-800: '#791515'
  danger-900: '#4D0D0D'
  danger-950: '#2C0808'
  info-50: '#F8FAFE'
  info-100: '#E9EFFD'
  info-200: '#BED0F9'
  info-300: '#87A9F4'
  info-500: '#2563EB'
  info-700: '#1C4AB0'
  info-800: '#143681'
  info-900: '#0D2352'
  info-950: '#071430'

  # Semantic — aliases onto the primitives above (values copied literally
  # since this schema doesn't support in-block token references), plus a
  # handful of values outside the 5-hue brand palette (surface/background/
  # text neutrals).
  primary: '#087DAE'
  primary-hover: '#065E83'
  primary-pressed: '#044560'
  primary-soft: '#E6F2F7'
  on-primary: '#FFFFFF'
  # primary-strong/-strong-hover: dedicated, previously-unused steps at the
  # dark end of the blue ramp — for solid high-emphasis CTA button fills,
  # which need more visual weight than `primary` (500) carries as a large
  # fill. Kept distinct from `primary` so that token keeps meaning "the
  # brand's identity color" (links, icons, focus rings) without doubling as
  # "the CTA button color" too.
  primary-strong: '#032C3D'
  primary-strong-hover: '#021923'
  secondary: '#86C65A'
  secondary-hover: '#659544'
  secondary-soft: '#F3F9EF'
  on-secondary: '#1F2A37'
  # secondary-subtle: a lighter, previously-unused step on the green ramp —
  # for button fills that want visible presence without `secondary`'s full
  # saturation. `secondary`/`secondary-hover` are reused as-is for this same
  # button's hover/pressed states, so no further new tokens were needed there.
  secondary-subtle: '#BCE0A4'
  accent: '#007679'
  accent-soft: '#E6F5F6'
  on-accent: '#FFFFFF'
  surface: '#FFFFFF'
  background: '#FAF9F7'
  border-subtle: '#EFF0F2'
  border: '#CED3D7'
  border-strong: '#81909C'
  border-disabled: '#EFF0F2'
  border-danger: '#DC2626'
  border-success: '#15803D'
  border-info: '#2563EB'
  # text-primary/-secondary/-tertiary are direct aliases of gray steps
  # (gray-900/-500/-300) — consolidated from independently-set hex values
  # that predated the gray primitive scale, closing a real violation of the
  # governing rule below (a standalone hex with no primitive behind it).
  # text-primary now matches content-primary exactly and text-tertiary now
  # matches content-primary-disabled exactly; text-secondary already was an
  # exact match for gray-500 (the scale's anchor point) and needed no value
  # change, just this explicit alias declaration.
  text-primary: '#20252A'
  text-secondary: '#5B6B79'
  text-tertiary: '#A5AEB5'
  text-on-primary: '#FFFFFF'
  success: '#15803D'
  success-soft: '#E8F2EC'
  on-success: '#FFFFFF'
  warning: '#BC4126'
  warning-soft: '#FFEEEB'
  on-warning: '#FFFFFF'
  danger: '#DC2626'
  danger-soft: '#FCE9E9'
  on-danger: '#FFFFFF'
  info: '#2563EB'
  info-soft: '#E9EFFD'
  on-info: '#FFFFFF'

  # Content — text/icon-specific semantic colors, distinct from the fill
  # colors above. `content-primary`/`content-secondary` are aliases of the
  # `gray` primitive; the `-disabled` and `-inverted` variants exist so
  # disabled and on-dark-fill text/icon states never fall back to
  # inventing a one-off gray. The functional trio reuses `danger`/
  # `success`/`warning` as-is, since those were already chosen specifically
  # for text/icon legibility.
  content-primary: '#20252A'
  content-primary-disabled: '#A5AEB5'
  content-primary-inverted: '#FFFFFF'
  content-secondary: '#5B6B79'
  content-secondary-disabled: '#CED3D7'
  content-secondary-inverted: '#EFF0F2'
  content-danger: '#DC2626'
  content-success: '#15803D'
  content-warning: '#BC4126'

typography:
  # IBM Plex Sans (Plus Jakarta Sans for headline-1/2/3 only), 1.200 (minor third)
  # modular scale, base = Paragraph 2 = 16px.
  # 11 sizes x 2 weights = 22 content styles, plus a dedicated `button` style
  # unrelated to the content scale. Headline, Paragraph, and Label all use
  # Semi Bold (600) as their second weight. No Display category and no Bold
  # (700) weight remain in the scale — removed at the founder's request;
  # `headline-1` (48px) is now the largest/most prominent style available.
  # Naming direction differs by category: Headline counts DOWN from largest
  # (headline-1 = 48px biggest ... headline-5 = 18px smallest — headline-5 was
  # added after the fact, off the modular progression, see its own note below),
  # but Paragraph
  # counts UP from smallest (paragraph-1 = 13px smallest ... paragraph-4 =
  # 23px biggest) — paragraph-2 (16px) is the base/default reading size, with
  # one smaller step below it and two larger steps above. `paragraph-1` (13px)
  # lands on the same exponent as `label-l` (also 13px) — the two categories
  # now share a rung on the underlying scale rather than each occupying an
  # exclusive step; that's an accepted overlap, not an error.
  headline-1-regular:
    fontFamily: "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 3rem
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: -0.01em
  headline-1-semibold:
    fontFamily: "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: -0.01em
  headline-2-regular:
    fontFamily: "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 2.5rem
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-2-semibold:
    fontFamily: "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 2.5rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-3-regular:
    fontFamily: "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 2.0625rem
    fontWeight: 400
    lineHeight: 1.2
  headline-3-semibold:
    fontFamily: "'Plus Jakarta Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 2.0625rem
    fontWeight: 600
    lineHeight: 1.2
  headline-4-regular:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1.75rem
    fontWeight: 400
    lineHeight: 1.25
  headline-4-semibold:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.25
  # headline-5 — new, and deliberately off the modular scale's own progression. Continuing
  # the 1.200 ratio one more step below headline-4 lands at ~1.458rem, indistinguishable
  # from paragraph-4 (1.4375rem) already sitting right next to it — tried first for
  # Registration's field-group subheadings and found still too large. headline-5 is a
  # visibly smaller size than paragraph-4 while staying bold enough to read as a title
  # rather than body text — the smallest tier in the headline family.
  headline-5-regular:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.3
  headline-5-semibold:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.3
  paragraph-1-regular:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.5
  paragraph-1-semibold:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 0.8125rem
    fontWeight: 600
    lineHeight: 1.5
  paragraph-2-regular:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  paragraph-2-semibold:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.5
  paragraph-3-regular:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1.1875rem
    fontWeight: 400
    lineHeight: 1.5
  paragraph-3-semibold:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1.1875rem
    fontWeight: 600
    lineHeight: 1.5
  paragraph-4-regular:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1.4375rem
    fontWeight: 400
    lineHeight: 1.5
  paragraph-4-semibold:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1.4375rem
    fontWeight: 600
    lineHeight: 1.5
  label-l-regular:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.01em
  label-l-semibold:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 0.8125rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.01em
  label-m-regular:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 0.6875rem
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.02em
  label-m-semibold:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 0.6875rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.02em
  label-s-regular:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 0.5625rem
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.03em
  label-s-semibold:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 0.5625rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.03em
  button:
    fontFamily: "'IBM Plex Sans', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1

rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 999px
  circle: 50%

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px

breakpoints:
  # New to this doc, but not new to the codebase — `src/tokens/spacing.ts`
  # has exported this exact object (mobile/tablet/desktop) since the src/
  # reconciliation session; it was simply never back-ported here, a real
  # documentation gap now closed. Min-width, mobile-first: a rule under
  # `tablet` applies from 0px up until superseded by a `tablet`-qualified
  # rule at 768px, and so on. This reference page's own chrome (sidebar
  # collapse at 860px, swatch grid at 640px) predates this scale and is
  # deliberately left on its own values — those are the page's own
  # authoring breakpoints, not the product's.
  mobile: 0px
  tablet: 768px
  desktop: 1280px

alpha:
  # Alpha — a primitive or base neutral (surface/background) at a stated
  # partial opacity. This is the sanctioned escape hatch for effects
  # (shadows, translucent chips, scrims) that need to sit above arbitrary
  # content: every value here is `<traceable-color> @ <opacity>`, never a
  # standalone invented rgb triplet. This is how the "every color comes
  # from a primitive" rule accommodates transparency without spawning new
  # primitives for one-off effects.
  shadow-ink-06: 'rgba(32, 37, 42, 0.06)' # gray-900 @ 6%
  shadow-ink-04: 'rgba(32, 37, 42, 0.04)' # gray-900 @ 4%
  shadow-ink-14: 'rgba(32, 37, 42, 0.14)' # gray-900 @ 14%
  shadow-ink-08: 'rgba(32, 37, 42, 0.08)' # gray-900 @ 8%
  surface-85: 'rgba(255, 255, 255, 0.85)' # surface (white) @ 85%
  scrim-48: 'rgba(32, 37, 42, 0.48)' # gray-900 @ 48% — Modal's backdrop

motion:
  # Duration + easing, both new — the only foundational token categories this
  # system had never named. Every transition already in this doc (button/
  # field/toggle/checkbox state changes) used ad hoc inline values (0.12s
  # ease, 0.15s ease, scattered independently per component); these tokens
  # replace every one of those inline values, not just the new components
  # below. Three durations, not one: fast for the smallest state changes
  # (a color swap on hover/press — nothing physically moves, including a
  # field's label color change), base for something that visibly moves a
  # short distance (the toggle thumb sliding), slow for a larger surface entering
  # or leaving the viewport (a modal). Two direction-specific eases sit
  # alongside the general-purpose one: enter decelerates (fast in, settle
  # gently — appropriate for something arriving), exit accelerates (get out
  # of the way quickly), both standard, unexotic cubic-béziers.
  duration-fast: 120ms
  duration-base: 150ms
  duration-slow: 250ms
  easing-standard: 'cubic-bezier(0.4, 0, 0.2, 1)'
  easing-enter: 'cubic-bezier(0, 0, 0.2, 1)'
  easing-exit: 'cubic-bezier(0.4, 0, 1, 1)'

z-index:
  # A layering scale, new — nothing in this doc used z-index before Modal
  # below (the reference page's own nav/sidebar chrome doesn't count, and
  # was never given a token). Ordered so a toast can never be trapped
  # behind an open modal, and a tooltip — transient, contextual, can be
  # triggered from inside anything else — always wins. Values are spaced by
  # 100 to leave room to insert something later without renumbering.
  # dropdown/sticky/tooltip have no real consumer yet (this system has no
  # dropdown menu or tooltip component); overlay-backdrop/modal back Modal
  # below.
  dropdown: 1000
  sticky: 1100
  overlay-backdrop: 1200
  modal: 1300
  toast: 1400
  tooltip: 1500

components:
  # Button — 3 variants (primary/secondary/tertiary) x 3 sizes (lg/md/sm) x
  # 5 states (enabled/hover/pressed/disabled/focus). Size controls only
  # height/padding/typography (below); color/shape are per-variant here and
  # apply at every size. Every fill/text/ring color is a semantic token —
  # see the `primary-strong`/`secondary-subtle` note above for the two new
  # ones this introduced.
  button-primary:
    backgroundColor: '{colors.primary-strong}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.pill}'
  button-primary-hover:
    backgroundColor: '{colors.primary-strong-hover}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.pill}'
  button-primary-pressed:
    backgroundColor: '{colors.primary-strong-hover}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.pill}'
    note: "same fill as hover (blue-950 is the ramp's last step); pressed is differentiated by a subtle inset shadow, not a further color change"
  button-primary-disabled:
    backgroundColor: '{colors.border}'
    textColor: '{colors.text-tertiary}'
    rounded: '{rounded.pill}'
  button-primary-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 5px {colors.primary}'
    note: 'corrected — the original single-layer {colors.primary-soft} ring measured ~1.1:1 against a white/near-white surface, far under the 3:1 non-text contrast a focus indicator needs to be perceptible (WCAG 1.4.11/2.4.11). No light tint on any ramp clears 3:1 against white, so the fix is structural, not a lighter color: a {colors.surface} gap separates the ring from the element, then a solid {colors.primary} ring (4.61:1 against surface, 4.38:1 against background) carries the actual contrast. Applies to every focus-ring token below.'
  button-secondary:
    backgroundColor: '{colors.secondary-subtle}'
    textColor: '{colors.on-secondary}'
    rounded: '{rounded.pill}'
  button-secondary-hover:
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.on-secondary}'
    rounded: '{rounded.pill}'
  button-secondary-pressed:
    backgroundColor: '{colors.secondary-hover}'
    textColor: '{colors.on-secondary}'
    rounded: '{rounded.pill}'
  button-secondary-disabled:
    backgroundColor: '{colors.border}'
    textColor: '{colors.text-tertiary}'
    rounded: '{rounded.pill}'
  button-secondary-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 5px {colors.secondary-hover}'
    note: 'secondary-hover (green-700), not secondary itself (green-500, which is only 2.05:1 against white and fails 3:1) — the same fix as button-primary-focus-ring, applied with the one ramp step on green that actually clears 3:1 (3.36:1 against background, 3.54:1 against surface).'
  button-tertiary:
    backgroundColor: transparent
    textColor: '{colors.primary-strong}'
    rounded: '{rounded.sm}'
  button-tertiary-hover:
    backgroundColor: transparent
    textColor: '{colors.primary-strong}'
    textDecoration: underline
    rounded: '{rounded.sm}'
  button-tertiary-pressed:
    backgroundColor: transparent
    textColor: '{colors.primary-strong-hover}'
    textDecoration: underline
    rounded: '{rounded.sm}'
  button-tertiary-disabled:
    backgroundColor: transparent
    textColor: '{colors.text-tertiary}'
    rounded: '{rounded.sm}'
  button-tertiary-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 5px {colors.primary}'
  # Danger — a 4th variant, real and shipped in src/components/atoms/Button
  # (Button.module.css) since the src/ port, never back-ported here until
  # now. Kept for genuine destructive actions (delete, remove, revoke) —
  # reuses `danger`/`danger-soft`/`on-danger` exactly as they already exist;
  # no new color was added. Hover/pressed do NOT introduce a `danger-hover`
  # token: matching the real implementation, they darken via a brightness
  # filter (0.92 hover, 0.85 pressed) over the same `danger` fill rather
  # than swapping to a different color — a filter is a rendering effect,
  # not an invented color, so this still satisfies the governing color rule
  # without adding a semantic alias the ramp doesn't otherwise need.
  button-danger:
    backgroundColor: '{colors.danger}'
    textColor: '{colors.on-danger}'
    rounded: '{rounded.pill}'
  button-danger-hover:
    backgroundColor: '{colors.danger}'
    textColor: '{colors.on-danger}'
    rounded: '{rounded.pill}'
    note: 'same fill as enabled; a brightness(0.92) filter carries the hover feedback, not a color swap'
  button-danger-pressed:
    backgroundColor: '{colors.danger}'
    textColor: '{colors.on-danger}'
    rounded: '{rounded.pill}'
    note: 'brightness(0.85) filter, plus the same inset shadow button-primary-pressed uses'
  button-danger-disabled:
    backgroundColor: '{colors.border}'
    textColor: '{colors.text-tertiary}'
    rounded: '{rounded.pill}'
  button-danger-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 5px {colors.danger}'
    note: 'danger (4.83:1 against surface) clears 3:1 directly at its 500 step, unlike secondary — no darker substitute needed'
  button-size-lg:
    typography: '{typography.button}'
    padding: '{spacing.md} {spacing.xl}'
    height: 56px
  button-size-md:
    typography: '{typography.button}'
    padding: '{spacing.sm} {spacing.lg}'
    height: 48px
  button-size-sm:
    typography: '{typography.label-l-semibold}'
    padding: '{spacing.xs} {spacing.md}'
    height: 40px
  # Field — the shared outlined container behind Input, Select, and Date
  # Picker, plus its persistent label rendered above the field (not
  # notched into the border). Select/Date Picker below reuse every one of
  # these tokens as-is (same container, same states, same sizes) — only
  # the inner control differs (<input type="text">/<select>/
  # <input type="date">). Supersedes the old flat `input`/`input-focus`/
  # `input-error` set.
  field:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.border-strong}'
    textColor: '{colors.text-primary}'
    labelColor: '{colors.text-secondary}'
    rounded: '{rounded.sm}'
  field-hover:
    borderColor: '{colors.text-secondary}'
  field-focus:
    borderColor: '{colors.primary}'
    labelColor: '{colors.primary}'
  field-error:
    borderColor: '{colors.border-danger}'
    labelColor: '{colors.content-danger}'
  field-disabled:
    borderColor: '{colors.border-disabled}'
    textColor: '{colors.text-tertiary}'
    labelColor: '{colors.text-tertiary}'
  field-size-lg:
    typography: '{typography.paragraph-2-regular}'
    padding: '0 {spacing.md}'
    height: 56px
  field-size-md:
    typography: '{typography.paragraph-2-regular}'
    padding: '0 {spacing.md}'
    height: 48px
  field-size-sm:
    typography: '{typography.paragraph-1-regular}'
    padding: '0 {spacing.sm}'
    height: 40px
  question-card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text-primary}'
    typography: '{typography.paragraph-4-semibold}'
    rounded: '{rounded.lg}'
    padding: '{spacing.xl}'
  progress-stepper:
    backgroundColor: '{colors.border}'
    rounded: '{rounded.pill}'
    height: 8px
  progress-stepper-active:
    backgroundColor: '{colors.primary}'
    rounded: '{rounded.pill}'
    height: 8px
  score-card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text-primary}'
    typography: '{typography.headline-1-semibold}'
    rounded: '{rounded.xl}'
    padding: '{spacing.xl}'
  nav-bar:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.text-secondary}'
    typography: '{typography.label-l-regular}'
    height: 64px
  nav-bar-item-active:
    backgroundColor: '{colors.primary-soft}'
    textColor: '{colors.primary}'
    typography: '{typography.label-l-regular}'
    rounded: '{rounded.md}'
  badge:
    backgroundColor: '{colors.primary-soft}'
    textColor: '{colors.primary}'
    typography: '{typography.label-m-semibold}'
    rounded: '{rounded.pill}'
    padding: '{spacing.xs} {spacing.sm}'
  badge-success:
    backgroundColor: '{colors.success-soft}'
    textColor: '{colors.success}'
    typography: '{typography.label-m-semibold}'
    rounded: '{rounded.pill}'
    padding: '{spacing.xs} {spacing.sm}'
  badge-encouraging:
    backgroundColor: '{colors.secondary-soft}'
    textColor: '{colors.secondary}'
    typography: '{typography.label-m-semibold}'
    rounded: '{rounded.pill}'
    padding: '{spacing.xs} {spacing.sm}'
  # Radio, Checkbox, Search, Toggle, Progress Bar — every value below is an
  # existing semantic token; nothing new was added to introduce these 5
  # components.
  radio:
    borderColor: '{colors.border-strong}'
    backgroundColor: '{colors.surface}'
  radio-hover:
    borderColor: '{colors.text-secondary}'
  radio-checked:
    borderColor: '{colors.primary}'
    dotColor: '{colors.primary}'
  radio-checked-hover:
    borderColor: '{colors.primary-hover}'
    dotColor: '{colors.primary-hover}'
  radio-disabled:
    borderColor: '{colors.border-disabled}'
    dotColor: '{colors.text-tertiary}'
    textColor: '{colors.text-tertiary}'
  radio-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 5px {colors.primary}'
    note: "corrected — see button-primary-focus-ring's note; the same low-contrast soft-ring defect applied here"
  checkbox:
    borderColor: '{colors.border-strong}'
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.sm}'
  checkbox-hover:
    borderColor: '{colors.text-secondary}'
  checkbox-checked:
    backgroundColor: '{colors.primary}'
    borderColor: '{colors.primary}'
    markColor: '{colors.on-primary}'
  checkbox-checked-hover:
    backgroundColor: '{colors.primary-hover}'
    borderColor: '{colors.primary-hover}'
  checkbox-error:
    borderColor: '{colors.border-danger}'
  checkbox-disabled:
    borderColor: '{colors.border-disabled}'
    backgroundColor: '{colors.surface}'
  checkbox-disabled-checked:
    backgroundColor: '{colors.border-disabled}'
    markColor: '{colors.surface}'
  checkbox-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 5px {colors.primary}'
  search:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.border-strong}'
    textColor: '{colors.text-primary}'
    iconColor: '{colors.text-tertiary}'
    rounded: '{rounded.pill}'
  search-hover:
    borderColor: '{colors.text-secondary}'
  search-focus:
    borderColor: '{colors.primary}'
    iconColor: '{colors.primary}'
  search-disabled:
    borderColor: '{colors.border-disabled}'
    textColor: '{colors.text-tertiary}'
    iconColor: '{colors.text-tertiary}'
  # search-clear — the trailing clear (×) button that appears once Search
  # has a value. Real bug fixed here: it previously had no documented (or
  # implemented) focus-visible state at all, unlike every other interactive
  # control in this system — a keyboard user tabbing to it got zero visual
  # feedback. It now shares the generic icon-button treatment (hover/focus/
  # disabled) used by Modal's close control below.
  search-clear:
    iconColor: '{colors.text-tertiary}'
  search-clear-hover:
    iconColor: '{colors.text-secondary}'
  search-clear-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 4px {colors.primary}'
  toggle-off:
    backgroundColor: '{colors.border-strong}'
    thumbColor: '{colors.surface}'
  toggle-off-hover:
    backgroundColor: '{colors.text-secondary}'
  toggle-on:
    backgroundColor: '{colors.primary}'
    thumbColor: '{colors.surface}'
  toggle-on-hover:
    backgroundColor: '{colors.primary-hover}'
  toggle-disabled-off:
    backgroundColor: '{colors.border-disabled}'
    thumbColor: '{colors.surface}'
  toggle-disabled-on:
    backgroundColor: '{colors.primary-soft}'
    thumbColor: '{colors.surface}'
  toggle-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 5px {colors.primary}'
  progress-bar-track:
    backgroundColor: '{colors.border}'
    rounded: '{rounded.pill}'
    height: 8px
  progress-bar-fill:
    backgroundColor: '{colors.primary}'
    rounded: '{rounded.pill}'
  progress-bar-fill-success:
    backgroundColor: '{colors.success}'
    rounded: '{rounded.pill}'
  # Textarea — a multi-line variant of the `field` container, not a new
  # container: same colors, same states, same border/label treatment. Two
  # deliberate departures from Input: height isn't pinned to the button
  # size scale (multi-line content needs room to breathe, unlike a single
  # line that must align with a button), and the label's rest position is
  # top-left rather than vertically centered, since text starts at the top
  # of a tall box, not its middle. `resize: vertical` was tried, then
  # rejected: the assessment's fixed layout doesn't want a user-resizable
  # box, so the handle is disabled (`resize: none`) and height stays fixed
  # at whatever `rows` sets.
  textarea:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.border-strong}'
    textColor: '{colors.text-primary}'
    labelColor: '{colors.text-secondary}'
    typography: '{typography.paragraph-2-regular}'
    rounded: '{rounded.sm}'
    minHeight: 120px
    padding: '{spacing.sm} {spacing.md}'
    resize: none
  textarea-hover:
    borderColor: '{colors.text-secondary}'
  textarea-focus:
    borderColor: '{colors.primary}'
    labelColor: '{colors.primary}'
  textarea-error:
    borderColor: '{colors.border-danger}'
    labelColor: '{colors.content-danger}'
  textarea-disabled:
    borderColor: '{colors.border-disabled}'
    textColor: '{colors.text-tertiary}'
    labelColor: '{colors.text-tertiary}'
  # Tag / Chip — distinct from Badge above: Badge communicates a fixed
  # status the user doesn't control ("New", "Improving"); Tag is a
  # user-manipulable unit — a selected filter, a removable value in a
  # multi-select field — so it needs hover/selected/disabled/focus states
  # Badge never needed. Neutral gray by default, tints to `primary` only
  # once selected/active, exactly the same restraint the rest of this
  # system applies to color. Every value is an existing token; nothing new.
  tag:
    backgroundColor: '{colors.border-subtle}'
    textColor: '{colors.text-primary}'
    typography: '{typography.label-l-regular}'
    rounded: '{rounded.pill}'
    padding: '{spacing.xs} {spacing.sm}'
  tag-hover:
    backgroundColor: '{colors.border}'
  tag-removable-icon:
    iconColor: '{colors.text-tertiary}'
  tag-removable-icon-hover:
    iconColor: '{colors.text-secondary}'
  tag-selected:
    backgroundColor: '{colors.primary-soft}'
    textColor: '{colors.primary}'
    borderColor: '{colors.primary}'
  tag-selected-hover:
    backgroundColor: '{colors.primary-soft}'
    textColor: '{colors.primary-hover}'
    borderColor: '{colors.primary-hover}'
  tag-disabled:
    backgroundColor: '{colors.border-disabled}'
    textColor: '{colors.text-tertiary}'
  tag-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 4px {colors.primary}'
  # Modal / Dialog — the highest-value gap in the system: `alpha.scrim-48`
  # and `elevation`'s `shadow-modal` were both already defined (the Shapes
  # section already named `rounded.xl` for "modals, the score card"), but
  # nothing ever consumed them — an orphaned token trio, now a real
  # component. Implemented on the native `<dialog>` element rather than a
  # div+ARIA reconstruction: focus trapping, Escape-to-close, and an inert
  # background all come from the platform for free, consistent with this
  # system's standing preference for real native elements (`<select>`,
  # `<input type="date">`) over custom-built equivalents. `::backdrop` is
  # styled with `alpha.scrim-48`; the panel is `rounded.xl` + `shadow-modal`
  # on `surface`, entering/exiting with `motion.duration-slow` and
  # `motion.easing-enter`/`-exit` — this is the first thing in the system
  # both foundational categories actually back.
  modal-backdrop:
    backgroundColor: '{alpha.scrim-48}'
  modal-panel:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.xl}'
    elevation: '{elevation.shadow-modal}'
    padding: '{spacing.xl}'
  modal-title:
    textColor: '{colors.text-primary}'
    typography: '{typography.headline-4-semibold}'
  modal-body:
    textColor: '{colors.text-secondary}'
    typography: '{typography.paragraph-2-regular}'
  modal-close-icon:
    iconColor: '{colors.text-tertiary}'
  modal-close-icon-hover:
    iconColor: '{colors.text-secondary}'
  modal-close-focus-ring:
    ring: '0 0 0 2px {colors.surface}, 0 0 0 4px {colors.primary}'
  modal-size-sm:
    maxWidth: 400px
  modal-size-md:
    maxWidth: 480px
  modal-size-lg:
    maxWidth: 640px
  # A confirmation variant reuses button-danger (above) for the destructive
  # action and swaps nothing else — no new "danger modal" tokens, the panel
  # itself stays neutral `surface`; only the confirming button communicates
  # the stakes. This is also the first place `button-danger` is shown in a
  # real usage context anywhere in this system (src/'s danger button has
  # shipped since the prototype session but was never exercised against a
  # real destructive flow either — see the session report's open items).
  modal-confirm-danger-button:
    ref: '{components.button-danger}'
---

# Engagement app Design System

## Overview

Linus is a consumer product: people come here on their own, unprompted by a clinician, to take assessments of their mental sharpness. That single fact drives every decision below. The system needs to feel calm, encouraging, and human — closer to a wellness or fitness app than to clinical software — because the person on the other end may be anxious about what the assessment will reveal. Nothing here should read as a hospital intake form, and nothing should dramatize a low score. The system takes structural discipline (a real spacing scale, a real type scale, restrained semantic color) from clinical-grade design systems, but re-skins all of it in warmer, softer, more spacious terms.

## Colors

Color is built in two layers, kept visually and structurally separate: **primitives** are raw values with no meaning attached, and **semantic** tokens are the named roles components actually consume. Primitives exist only to be the source material semantic tokens alias from — nothing renders a primitive directly.

**Governing rule: every color applied anywhere in the UI must trace back to a primitive** — directly, through a semantic alias, or through an `alpha` entry (a primitive/base neutral at a stated opacity, see below). Never introduce a standalone invented hex or rgb value, in this doc or in implementation. When an effect needs partial transparency (a shadow, a scrim, a translucent chip) rather than a new solid color, add an entry to `alpha` instead of inventing an unaliased rgba() — that's exactly what `alpha` is for. This rule binds future components too, not just what's documented today.

### Primitives

Nine hue ramps, each running `50` (lightest tint) through `950` (darkest shade), with `500` fixed to the exact confirmed base hex for the 5 brand hues, or anchored on the existing `text-secondary` value for `gray`, which has no brand hex of its own. The full 9-step ramp is kept for every family even though semantic tokens only alias a handful of steps from each — the unused steps are there for future semantic tokens or one-off implementation needs, not dead weight to prune. `gray` alone breaks this pattern with a tenth step, `400` — see Grayscale below. Grouped by role, not just listed flat:

- **Brand** — `blue` (`primary`) and `green` (`secondary`), the two hues that actually carry Linus's brand identity.
- **Functional** — `orange` (`warning`), plus the dedicated `success`/`danger`/`info` families. `orange` is still one of the 5 confirmed brand hues, it's just not shared with anything else; `success`/`danger`/`info` were purpose-built and back nothing but their matching semantic token.
- **Complementary Colors** — `teal` (`accent`) and `purple` (no semantic role yet) — confirmed brand hues not claimed by a primary/secondary/functional role.
- **Grayscale** — `gray`, the neutral scale, kept in its own section since it isn't a brand hue at all. Uniquely among the 9 families, `gray` also has a `400` step: `gray-300` (2.25:1 against white) falls short of the 3:1 non-text-contrast minimum WCAG requires for a component boundary with no other visual cue (e.g. an input outline), and `gray-500` (5.49:1) reads too dark for a border — `gray-400` (`#81909C`, 3.28:1) fills that gap and exists solely to back `border-strong`.

### Semantic

Every semantic color is either a direct alias of one primitive step, or, for `warning`, a brand hue (`orange`) that isn't claimed by anything else.

`primary` is `blue-500` (`#087DAE`) — Linus's confirmed brand blue. `secondary` is `green-500` (`#86C65A`) — the confirmed brand green, used as a solid fill color (paired with dark `on-secondary` text, not white — see below). `accent` is `teal-700` (`#007679`), not the brighter `teal-500`: the base teal reads fine as a _background_ fill but falls short of AA contrast as small foreground text, so the semantic `accent` token uses the darker, legible step; the brighter `teal-500` primitive is still there directly for anyone building a solid teal fill. `warning` is `orange-700` (`#BC4126`), one step darker than the family's `500` base for the same legibility reason (`orange-500` itself is only 3.3:1 as foreground text — under the 4.5:1 line). Note: `orange-500` was originally `#FAF633`, a color that read as bright yellow rather than orange despite its Figma label; it's since been corrected to `#FA5633`, a true orange-red, and the entire ramp was rederived from that corrected base.

`primary-strong` (`blue-900`, `#032C3D`) and `primary-strong-hover` (`blue-950`, `#021923`) exist specifically for the solid, high-emphasis CTA button family below — `primary` itself stays reserved for "the brand's identity color" (links, icons, a focus ring), while these darker, previously-unused ramp steps carry the visual weight a large solid button fill needs. `secondary-subtle` (`green-300`, `#BCE0A4`) is the lighter counterpart on the green ramp, for a button fill with visible presence short of `secondary`'s full saturation; that same button's hover/pressed states reuse `secondary`/`secondary-hover` as-is, so no further new tokens were needed.

`success`, `danger`, and `info` each get their **own dedicated primitive family** (`success-*`, `danger-*`, `info-*`) instead of reusing a brand hue: previously `success` and `info` doubled up with `secondary` (green) and `primary` (blue) respectively — the same color meaning two different things depending on context — and `danger` had no primitive at all, just an off-palette placeholder. `success` is `success-500` (`#15803D`), `danger` is `danger-500` (`#DC2626`), `info` is `info-500` (`#2563EB`) — all three pass AA as both a solid fill (with white `on-*` text) and as small foreground text/icon color directly at their `500` step, so unlike `accent`/`warning` they don't need to reach for a darker step. These 3 primitive families exist solely to back these 3 semantic tokens; they're not multi-purpose brand hues like `blue`/`green`/`teal`/`orange`/`purple`/`gray`.

The neutral text tokens (`text-primary`, `text-secondary`, `text-tertiary`) were originally set independently, before the `gray` primitive existed — a real violation of this doc's own governing rule (standalone hex values with no primitive behind them), now fixed. All three are direct `gray` aliases: `text-primary` is `gray-900` (`#20252A`, previously an independent `#1F2A37` — the shift is imperceptible, and the value now exactly matches `content-primary`), `text-secondary` is `gray-500` (`#5B6B79`, unchanged — it was already an exact match, used as the scale's anchor point, just not declared as an alias until now), and `text-tertiary` is `gray-300` (`#A5AEB5`, previously an independent `#94A3AD` — now exactly matches `content-primary-disabled`). `background` is a warm off-white rather than a cool clinical gray, and `surface` is pure white for cards, so content lifts gently off the page instead of sitting in a sterile field. Text uses a soft charcoal-navy (`text-primary`) rather than true black, which keeps the whole page feeling less severe.

**Border** is a four-tier `gray` scale plus three functional variants, all direct aliases (this is a change — `border`/`border-strong` used to be independent, unaliased values; they're now fully consolidated onto the primitive). `border-subtle` (`gray-100`, `#EFF0F2`) is for decorative-only dividers and rules that carry no boundary information — section rules, seams between non-interactive regions. `border` (`gray-200`, `#CED3D7`) is the default resting-state border for cards and inputs; like `border-subtle` it sits under the 3:1 non-text-contrast minimum, so it's only appropriate where the border isn't the sole cue for a component's boundary (paired with padding, shadow, or a background difference). `border-strong` (`gray-400`, `#81909C`, 3.28:1) is the one tier that actually clears 3:1 — use it wherever a border **is** the sole indicator, such as a text input's resting-state outline sitting on the same white `surface` as its parent card, plus hover/emphasis states generally. `border-disabled` (`gray-100`, same value as `border-subtle`) mutes a disabled control's outline further — a distinct name for a distinct purpose, even though the hex coincides. `border-danger` (`danger-500`, `#DC2626`), `border-success` (`success-500`, `#15803D`), and `border-info` (`info-500`, `#2563EB`) each alias the same primitive step their matching semantic token does (all already ≥4.5:1 as foreground text, so comfortably past the 3:1 non-text minimum too) — for colored outlines on invalid/valid/informational form fields, not just a background tint.

**Contrast is uneven across this palette and that matters for implementation.** All figures below are computed WCAG relative-luminance contrast, not eyeballed. `on-primary` (white on `primary`) is 4.61:1 — passes, but only just. `on-secondary` must be dark (`text-primary`), not white: white text on `green-500` is only 2.05:1. `primary` text on `primary-soft` is 4.04:1 — under AA — safe for large or bold labels and icons, not small body text, where `text-primary` is the safer choice. `success` (5.02:1), `danger` (4.83:1), and `info` (5.17:1) all pass AA as foreground text directly at their `500` step — no darker substitute needed the way `accent` and `warning` require.

**Correction: not every `*`+`*-soft` pairing clears 4.5:1, despite an earlier version of this doc claiming otherwise.** Only `accent`+`accent-soft` (4.85:1) and `warning`+`warning-soft` (4.76:1) genuinely pass AA for small text — both because their semantic token already sits a step darker than the family's `500` base for exactly this reason. `success`+`success-soft` (4.38:1), `danger`+`danger-soft` (4.13:1), and `info`+`info-soft` (4.49:1) all fall short of 4.5:1, the same way `primary`+`primary-soft` does: safe for large (≥24px) or bold text and icons, not small body text, where `text-primary`/`content-danger`/`content-success` etc. on `surface`/`background` (not on the `-soft` tint) is the safer choice. Treat any `*-soft` background as a tint for a colored icon or a large/bold label, never as a guaranteed-AA backdrop for small same-hue text.

### Content

`content-primary`/`content-secondary` are `gray-900`/`gray-500` — the text/icon-specific counterparts to the surface-level `text-primary`/`text-secondary` tokens above (not merged with them, since that consolidation wasn't asked for; `content-secondary` and `text-secondary` do happen to be identical). Each gets two variants: `-disabled` (a lighter `gray` step — `gray-300` for primary, `gray-200` for secondary — deliberately low-contrast, since WCAG doesn't require disabled content to meet AA) and `-inverted` (for text/icons placed on a dark or colored fill instead of the light `background`/`surface`). `content-primary-inverted` is plain white and safe on `primary`, `danger`, and `success` fills, but **not** on `secondary` or a raw `teal`/`orange` fill — those need a dark inverted color instead (reuse `content-primary` itself). `content-secondary-inverted` (`gray-100`) is dimmer than white to preserve hierarchy, but only passes AA on genuinely dark fills (800/900-level primitives); on a mid-tone fill like `blue-500` it's 4.04:1 — under AA — prefer full white there if the hierarchy step doesn't matter.

The functional content trio — `content-danger`, `content-success`, `content-warning` — reuses the `danger`/`success`/`warning` values exactly as-is rather than deriving new ones, since those are already legible as text/icon color at their `500` step (see above). There's no separate `content-caution`; caution and warning were treated as the same state.

## Typography

Typography runs on two families: **IBM Plex Sans** for everything, and **Plus Jakarta Sans** for the three largest Headline styles (`headline-1`, `headline-2`, `headline-3`) only — a deliberate accent for the biggest, most prominent titles, not a wholesale typeface swap. (This accent face was IBM Plex Serif originally; replaced with Plus Jakarta Sans, pulled from Google Fonts same as the base family.) `headline-4`, `headline-5`, and every Paragraph/Label/button style stay on IBM Plex Sans. Both families share the same fallback chain in case the webfont fails to load: `-apple-system, 'Segoe UI', Roboto, system-ui, sans-serif`.

The scale is a **1.200 (minor third) modular scale**, anchored on `paragraph-2` = 16px = the scale's base (exponent 0); every other step is 16px × 1.2ⁿ, rounded to a clean pixel value — with one deliberate exception, `headline-5` (see below). Twelve sizes across three categories, each with two weights (24 tokens total). There is no Display category and no Bold (700) weight anywhere in the scale — both were removed at the founder's request after the scale was first built; `headline-1` (48px, Regular/Semi Bold) is now the largest and most prominent style available:

- **Headline** (`headline-1` through `headline-5` — 48 / 40 / 33 / 28 / 18px) — Regular 400 + Semi Bold 600. Numbered **descending**: `headline-1` is the largest. Page and section headings, and now also the largest hero-style text in the system. `headline-5` is the odd one out: added later for Registration's field-group subheadings, once `headline-4` and even `paragraph-4` both read as too large in that context — rather than let the modular formula place it at ~23px (indistinguishable from `paragraph-4`, defeating the point), it's set to a visibly smaller 18px on purpose. Every other Headline step still follows the formula exactly.
- **Paragraph** (`paragraph-1` through `paragraph-4` — 13 / 16 / 19 / 23px) — Regular 400 + Semi Bold 600. Numbered **ascending**: `paragraph-1` is the smallest — the opposite direction from Headline. `paragraph-2` (16px) is the base reading size, with one smaller step below it (`paragraph-1`) and two larger steps above (`paragraph-3`, `paragraph-4`); the larger sizes are for emphasis or larger-format reading contexts, not a strict hierarchy of importance. `paragraph-1` (13px) lands on the same rung as `label-l` (also 13px) — the two categories now overlap on the underlying scale rather than each owning an exclusive step; that's accepted, not a bug.
- **Label** (`label-l`, `label-m`, `label-s` — 13 / 11 / 9px) — Regular 400 + Semi Bold 600. Small UI text: nav items, badges, captions. **`label-s` (9px) is genuinely small** — borderline for real legibility — and should be treated as decorative/supplementary only, never load-bearing text a user actually needs to read.

A dedicated `button` token (16px/500/single line-height, IBM Plex Sans) sits outside this content scale entirely — buttons get their own fixed style regardless of context, the same as before.

Retiring the old scale meant re-pointing every component that referenced it: `input`/`input-focus`/`input-error` now use `paragraph-2-regular` (an exact 1:1 swap, both were 16px — this token was briefly named `paragraph-s` before Paragraph was renumbered); `question-card`'s title moved from the old `lg` (18px) through `paragraph-l-semibold` to its current name, `paragraph-4-semibold` (23px, same value throughout — only the name changed when Paragraph was renumbered 1–4); `score-card` moved from the old one-off `display` (40px) to `headline-1-semibold` (48px) — briefly `display-2-bold` (57px) when Display existed, remapped again to the largest remaining style once Display was removed; `nav-bar` moved from `sm` (14px) to `label-l-regular` (13px); `badge`/`badge-success`/`badge-encouraging` moved from `xs` (12px) to `label-m-semibold` (11px, semibold rather than `label-s`'s 9px, to stay legible at that size).

## Layout

Spacing keeps the repo's existing 4px-based scale (`xs` 4px through `xxl` 48px) and adds one more generous step, `xxxl` (64px), for section-level breathing room. This system leans toward the spacious end of that scale by default — generous internal padding on cards (`spacing.xl`), generous gaps between question cards — because density reads as clinical and this product needs to read as unhurried. Content should never feel like it's being processed through a form.

**Breakpoints** are new to this doc but not new to the codebase: `src/tokens/spacing.ts` has exported `mobile`/`tablet`/`desktop` (0/768/1280px) since the src/ reconciliation session — it was simply never documented here, a real gap this closes. Min-width, mobile-first: a `tablet`-qualified rule applies from 768px up, superseding whatever the unqualified/`mobile` rule set below it. This reference page's own chrome (the sidebar collapses at 860px, the color swatch grid drops to 2 columns at 640px) predates this scale and intentionally keeps its own values — those are the page's own authoring breakpoints, not a rendering of the product scale.

## Elevation & Depth

Cards float rather than sit flush: a soft, layered shadow — `0 2px 8px {alpha.shadow-ink-06}, 0 1px 2px {alpha.shadow-ink-04}` (both `gray-900` at low opacity, never an invented standalone rgb) — lifts `question-card` and `score-card` gently off the background, reinforcing that this is a moment to pay attention to, not a row in a table. Modals and popovers use a stronger version of the same recipe — `0 16px 40px {alpha.shadow-ink-14}, 0 4px 12px {alpha.shadow-ink-08}` — so they read as clearly above the page; `modal-panel` below is the first component to actually consume this value; it had been defined, named, and demoed in isolation on the Elevation page for three sessions with no real component behind it. Flat, inline elements (nav bar, badges, form labels) carry no shadow at all; reserve elevation for the few things that deserve visual weight.

## Motion

New: durations and eases, previously only ever inlined ad hoc per component (`0.12s ease` on a button, independently chosen each time with no shared vocabulary). Three durations — `duration-fast` (120ms) for a state change where nothing moves, just a color swap (hover/press on a button, a border-color change on a field, a field's label recoloring on hover/focus/error); `duration-base` (150ms) for something that visibly travels a short distance (the toggle thumb sliding); `duration-slow` (250ms) for a larger surface entering or leaving the viewport (Modal). Two direction-specific eases sit alongside a general-purpose one: `easing-standard` for most transitions, `easing-enter` (decelerate) for something arriving, `easing-exit` (accelerate) for something leaving. Every transition already documented in this system has been re-pointed onto these tokens in `docs/design.html`; nothing about how anything currently animates has changed, only where the timing value now lives.

## Layering

New: a z-index scale, ordered so a toast can never end up trapped behind an open modal, and a tooltip — transient, contextual, triggerable from inside anything else on the page including a modal — always wins regardless of what else is open. `overlay-backdrop` (1200) and `modal` (1300) back Modal below, the first real consumers; `dropdown` (1000), `sticky` (1100), `toast` (1400), and `tooltip` (1500) are reserved ahead of the components that will need them (see Deferred proposals) rather than left undefined until the day they're needed and someone reaches for an arbitrary number under deadline pressure.

## Shapes

Radius is generous and consistent: 8px on inputs and small chips, 12px on buttons, 16px on cards, 24px on the largest containers (modals, the score card), and full pill/circle shapes for progress indicators and badges. Nothing in this system uses a sharp 0px corner — hard edges read as clinical or industrial, which is exactly the tone this product is avoiding — **except `progress-bar`** (see Components below), corrected to a flat edge after its one real usage showed the pill recipe reading as a stray rounded shape under a hard-edged header. The scale increases with the size and importance of the element, so bigger, more prominent surfaces feel proportionally softer.

## Components

**Icons**, new here, is this system's first documented icon set — until now every icon (`search`'s leading icon, `tag`'s remove `×`, `modal`'s close button) was either a one-off inline SVG or plain text, with no shared library behind it. Sourced from [Phosphor Icons](https://phosphoricons.com) (MIT-licensed, open source — real SVG markup pulled directly from `phosphor-icons/core`, not redrawn or approximated), **regular** weight specifically (24×24 grid, `viewBox="0 0 256 256"`, 16px stroke, `stroke="currentColor"`) — the stroke-based weight was chosen over `fill`/`bold`/`duotone` because `currentColor` lets every icon inherit whatever `color` its container already sets, the same recompositing this system already relies on for `iconColor` tokens (`search`'s `text-tertiary`→`primary` on focus, `tag-removable-icon`'s `text-tertiary`→`text-secondary` on hover) — no separate icon-color system needed. **Deliberately a starter set, not the full ~1,500-icon library**: 12 icons — `arrow-up`, `arrow-down`, `arrow-left`, `arrow-right`, `plus`, `minus`, `magnifying-glass`, `envelope-simple`, `clock`, `play`, `check-circle`, `sign-out` — added on request, more to be added only as a real component actually needs one (the same "don't build ahead of a real consumer" discipline already applied to Deferred proposals below). `clock` was this set's first icon with a real React implementation (`Icon/ClockIcon`, `src/components/atoms/Icon`) rather than existing only in this doc and `docs/design.html` — Dashboard's `ActivityCard` uses it to lead its "About 5–10 minutes" duration estimate. `arrow-right` (`Icon/ArrowRightIcon`), `play` (`Icon/PlayIcon`), `check-circle` (`Icon/CheckCircleIcon`), and `sign-out` (`Icon/SignOutIcon`) followed the same way — `arrow-right` used by Assessment Intro's "I'm Ready to Begin" button, `play` by Device Setup's test-sound player, `check-circle` by Device Setup's microphone check once it's confirmed working, `sign-out` by `DashboardNavBar`'s Exit link when `exitVariant="outline"` (the actual assessment task chrome uses this; every other screen keeps the plain tertiary text link). No new size or color tokens were introduced for icons themselves — recolor via the existing text/content color tokens on a wrapping element (`content-secondary`, `text-tertiary`, etc.), size via a plain `width`/`height` on the `<svg>`, exactly like every `iconColor` reference elsewhere in this doc already assumes.

**Buttons** come in 3 variants, each at 3 sizes, each with 5 explicit states (never computed opacity tricks) — supersedes the earlier 2-variant (`button-primary`/`button-outline`) version. `button-primary` is a solid pill using `primary-strong` (not `primary` — see the Semantic Colors note above), white text; hover/pressed darken to `primary-strong-hover`, pressed adding a subtle inset shadow rather than a further color change since `blue-950` is the ramp's last step. `button-secondary` is a solid pill using the lighter `secondary-subtle`, dark `on-secondary` text; hover/pressed step through the existing `secondary`/`secondary-hover` values, reusing rather than adding new tokens. `button-tertiary` is text-only, no fill or border — `primary-strong` text, an underline on hover/pressed, sized to just its own padded hit-area (`rounded.sm`, for the focus ring only, since there's no visible container). A 4th variant, **`button-danger`**, is documented here for the first time: it shipped to `src/components/atoms/Button` in a later session for real destructive actions (delete, remove, revoke) but was never back-ported into this spec. It reuses `danger`/`danger-soft`/`on-danger` exactly as they already exist — no new color. Hover/pressed darken via a `brightness()` filter over the same `danger` fill rather than a color swap (matching the real implementation) — a filter is a rendering effect, not an invented color, so this still holds the governing color rule without adding a `danger-hover` alias the ramp doesn't otherwise need.

Every variant gets a focus ring — **corrected here**: the original single-layer `0 0 0 3px` ring, in each variant's own `*-soft` tint, measured roughly 1.1:1 against a white or near-white surface, far under the 3:1 non-text contrast a focus indicator needs to be perceptible (WCAG 1.4.11/2.4.11) — no tint on any ramp clears 3:1 against white, so a lighter color was never going to fix it. The ring is now two layers: a `surface`-colored gap, then a solid ring in each variant's base contrast-passing color — `primary` for primary/tertiary/danger's own hue would clash so danger uses `danger` itself (4.83:1), and secondary uses `secondary-hover` rather than `secondary` (green-500 itself is only 2.05:1 against white and fails 3:1; `secondary-hover`/green-700 clears it at 3.36–3.54:1). This same corrected recipe applies to every focus ring in this system, not just buttons — see Radio/Checkbox/Toggle below. Size (`button-size-lg`/`-md`/`-sm`) controls only height/padding/typography and composes with any variant/state: `lg` (56px) and `md` (48px, the prior default) share the `button` typography token; `sm` (40px) drops to `label-l-semibold` (13px) rather than shrinking the same type style, reusing an existing token instead of inventing a smaller one. **Input, Select, and Date Picker** all sit on the same `field` container: an outlined box whose label is a separate element on its own line directly above it — not notched into the border, not resting inside the field like a placeholder, and never floating between the two. The label renders at `label-l-semibold` size in `colors.text-primary` (bold and legible, but sized as a caption rather than a headline — `headline-4-semibold` was tried first and read as oversized for a field label, corrected down to `label-l-semibold` while keeping the same semibold weight) and is always present, regardless of whether the field is empty, focused, filled, or in error; there is no two-state transition to speak of. A real `placeholder`, if given, is entirely optional and renders as an actual placeholder inside the field — it no longer stands in for the label, and no longer needs the empty-space `placeholder=" "`/`:not(:placeholder-shown)` CSS trick the old notched-label implementation depended on. Default border is `colors.border-strong` — the one gray tier that clears 3:1 non-text contrast, since a resting field's outline is its only boundary cue on a white `surface`. `field-hover` darkens the border to `colors.text-secondary` (a hint of interactivity, not yet full commitment); `field-focus` swaps the border to `colors.primary`, with a matching 1px inset `box-shadow` layered on top of the 1px border to read as a thicker ~2px ring without shifting any layout; `field-error` swaps the border to `colors.border-danger` and the label to `colors.content-danger`; `field-disabled` fades the border to `colors.border-disabled` and both the label and input text to `colors.text-tertiary`, using the real HTML `disabled` attribute, never a fake class-only look. `field-size-lg`/`-md`/`-sm` are **deliberately identical in height to `button-size-lg`/`-md`/`-sm`** (56/48/40px) — the whole reason this is a separate size scale rather than reusing spacing tokens directly is so a field and a button always line up when placed side by side. Select adds a chevron affordance and uses a real `<select>`; Date Picker uses a real `<input type="date">`, whose native calendar affordance is kept rather than reimplementing a custom calendar widget — both inherit `field`'s border/label/state treatment unchanged. **Textarea**, new here, is the multi-line member of this family — same container, same label-above-field treatment, same border colors, same hover/focus/error/disabled states — with one deliberate departure: its height isn't pinned to the button size scale, since multi-line content needs room to grow, unlike a single line that must align with a button. `resize: vertical` was reconsidered and turned off (`resize: none`) — the box stays a fixed size set by `rows`, no user-draggable handle; text also sits closer to the top edge now (`{spacing.sm}` top padding, matching Input's horizontal `{spacing.md}`, in place of the earlier `{spacing.lg}` top padding that read as too much empty space above the caret). `question-card` is the core surface of the product: one question, generously padded, elevated. `progress-stepper` / `progress-stepper-active` render as a pill-shaped track and fill, not numbered steps, to keep the "N of M" nature of an assessment from feeling like a countdown. `score-card` renders the result using `headline-1-semibold` — the largest style in the scale now that Display has been removed. `nav-bar` stays quiet (`text-secondary`, no shadow) with `nav-bar-item-active` marked only by a soft `primary-soft` tint, never a hard color block. `badge`, `badge-success`, and `badge-encouraging` are the only places pill-shaped color chips appear: `badge` is the neutral/default (blue), `badge-success` uses the legible `success` green for informational status, and `badge-encouraging` uses `accent` teal — reserve it for genuine positive moments (streaks, milestones), not routine UI.

**Radio, Checkbox, Search, Toggle, and Progress Bar** round out the form-control set, every one built from tokens that already existed — no new semantic color was added for any of them. `radio` and `checkbox` share the same states: `border-strong` at rest, `text-secondary` on hover, `primary` once checked (`primary-hover` on checked+hover), `border-disabled` when disabled (a disabled+checked mark uses `text-tertiary` for radio's dot, `border-disabled` as the fill with a `surface`-colored mark for checkbox), and — **corrected, same fix as Buttons above** — a two-layer `0 0 0 2px surface, 0 0 0 5px primary` focus ring in place of the old single-layer `primary-soft` ring, which was nearly invisible (~1.1:1) against a white surface. `checkbox` alone also gets an error state (`border-danger`, for a required-checkbox validation failure) and uses `rounded.sm` for its corners — deliberately soft rather than sharp, consistent with the rest of the system, even at a 20px control size where that reads as more rounded than most checkboxes. `search` reuses the `field` container's exact border/hover/focus/disabled treatment but in `rounded.pill` instead of `rounded.sm`, and **deliberately has no label at all** — a search box conventionally shows its placeholder ("Search…") persistently instead, so there's nothing for a label above the field to add; it adds a leading icon (`text-tertiary`, `primary` on focus) and a trailing clear button once it has a value. **Real bug fixed here**: that clear button had no documented, or implemented, focus-visible state at all — the one interactive element in this entire system a keyboard user could tab to and get zero visual feedback from. `search-clear`/`search-clear-hover`/`search-clear-focus-ring` close that gap, sharing the same corrected ring recipe as everything else. `toggle` is a sliding track+thumb: `border-strong` fill when off, `primary` when on, `surface` for the thumb always; hover darkens the same way (`text-secondary` off, `primary-hover` on); disabled reuses `border-disabled` (off) and `primary-soft` (on) rather than inventing a muted-primary token, since `primary-soft` already reads as "on, but not solid." `progress-bar` is a plain track-and-fill, not the segmented `progress-stepper` above — `border` for the track, `primary` for the fill, `8px` tall like `progress-stepper` but with a flat `0` corner radius rather than `rounded.pill` — **the one deliberate exception to this system's "nothing uses a sharp 0px corner" rule** (see Radius above): the pill recipe read as a stray rounded shape floating below a hard-edged header in its one real usage (the pre-registration Terms/Privacy/Consent funnel), so `progress-bar` now diverges from `progress-stepper`'s corners on purpose; `progress-stepper` itself is untouched, still `rounded.pill`. `progress-bar`'s fill also animates its width on change (`motion.duration-base` + `motion.easing-standard` — the same recipe as a toggle thumb sliding) rather than jumping straight to the new value; since each step of a funnel is its own page/route, a fresh `progress-bar` mounts per step, so the implementation mounts one step behind its target and animates forward a frame later to still read as growth rather than a fresh bar simply appearing pre-filled. Both `progress-bar` and `progress-stepper` are visual only in `docs/design.html` today — a markup requirement worth stating explicitly rather than assuming it's implied: wherever either is actually implemented, it needs `role="progressbar"` plus `aria-valuenow`/`aria-valuemin`/`aria-valuemax` (and an `aria-label` when there's no adjacent visible text already stating the same thing, e.g. Question Card's "Question 3 of 8") — a plain unlabeled `<div>` conveys a filled bar visually but nothing at all to assistive tech.

**Tag / Chip**, new here, fills a real gap next to Badge: Badge communicates a fixed status the user doesn't control ("New", "Improving"); Tag is a user-manipulable unit — a selected filter, a removable value in a multi-select field — so it needs hover/selected/disabled/focus states Badge never needed, plus an optional remove (×) icon. Neutral (`border-subtle` fill, `text-primary` text) at rest, tinting to `primary`/`primary-soft` only once selected — the same color restraint the rest of this system applies elsewhere, not a new rule invented for Tag. Every value is an existing token; nothing new was added to build it, matching the standard the 5 Session-3 form controls set.

**Modal / Dialog**, new here, was this system's highest-value gap: `alpha.scrim-48` (new — `gray-900` at 48% opacity, the sanctioned way to add a page-dimming scrim without inventing a standalone rgba) is the only genuinely new color value this whole audit introduced, and `elevation.shadow-modal` and `rounded.xl` were both already defined and named specifically for a modal — they simply had nothing to render. `modal-panel` is `surface` + `rounded.xl` + `shadow-modal`, entering and leaving with `motion.duration-slow` and `motion.easing-enter`/`-exit` — the first real consumer of both the Motion and Layering (z-index) additions above (`overlay-backdrop` behind the panel, `modal` for the panel itself). Built on the native `<dialog>` element rather than a div-plus-ARIA reconstruction, consistent with this system's standing preference for real native elements over custom-built equivalents (`<select>`, `<input type="date">`): focus trapping, Escape-to-close, and an inert background are the platform's job, not this doc's. The close (×) control reuses the same corrected focus-ring recipe as everything else above. A destructive-confirmation variant reuses `button-danger` for the confirming action and changes nothing else — the panel itself stays neutral `surface`; only the button communicates the stakes — which also makes this the first place in the entire system `button-danger` is shown in a real usage context, something even its `src/` implementation still lacks (see the prototype session report's open items). `Modal` (`src/components/atoms/Modal`) got its own first real `src/` usage in Device Setup's microphone check — a "Troubleshooting" link opens it to show a general permission/device checklist, alongside an originally-illustrated mockup of a browser's microphone-permission prompt (not a real screenshot, since the exact chrome differs by browser/OS/version).

**Spinner**, new here, is a small standalone atom (`src/components/atoms/Spinner`) extracted from a pattern `VerifyAccountPage` had already been using inline (that page keeps its own copy, unmigrated — extracted for new usages, not to risk touching an already-working screen): a rotating ring inside a separately-animated "breathing" pulse-scale wrapper, since a continuous spin and a continuous scale both need their own `transform` — one element per animation, not two animations stacked on one. Its first consumer is Device Setup's microphone check, which shows it for a fixed hold once the mic is confirmed working, between that confirmation and automatically navigating on — a transition beat, not tied to any real loading work.
