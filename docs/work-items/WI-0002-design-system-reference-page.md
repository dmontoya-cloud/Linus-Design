# WI-0002: Design System reference page

- **Type:** Feature (documentation/reference, not a Phase-1 funnel screen)
- **PoD:** Ad hoc slice, requested directly by David outside the PoD 1–5 order
- **Human Lead:** David
- **Status:** Built and locally verified; not yet pushed/PR'd
- **Feature branch:** feature/0002-design-system-reference-page (not yet created at time of writing)
- **PR:** not yet opened

## Context

David asked for a single, browsable design-system reference page — styled/structured after
[mews.design](https://www.mews.design/latest/welcome-eumfLxWD) — sourced from the "Linus Mobile -
Design System" Figma file (`fxgMZlgszHyM50nvv5HcRw`) and, once that proved thin, also the
"Linus - Universal Design System" Figma file (`ZeWegEMb6WNXeXQTIsIEY2`).

## What actually happened during research (why this isn't a full token migration)

Per CLAUDE.md hard rules 1 and 6 ("never guess", "don't fabricate"), this section records exactly
what was retrievable and what wasn't, rather than presenting a polished result that implies more
was confirmed than actually was.

- `fxgMZlgszHyM50nvv5HcRw` ("Linus Mobile - Design System") has only two real pages: a Cover slide
  and a "Buttons" page (node `1326:46137`). No color/typography/spacing variables or styles surface
  via `search_design_system` scoped to its library.
- `search_design_system` scoped to that file's "Primary" button component set returned a real spec:
  Large = 220px min-width / 32px horizontal padding; Small = 160px min-width / 16px padding; width
  variable, height fixed.
- `get_design_context` and `get_variable_defs` (the tools that read real hex/type values out of a
  node) require a live selection in the Figma desktop app. David selected the relevant frame twice,
  in two different files, and both calls still returned "nothing currently selected." This looks
  like a connector limitation in this session, not a user error — flagging rather than continuing to
  retry indefinitely.
- `ZeWegEMb6WNXeXQTIsIEY2` ("Linus - Universal Design System") has one real page, "🎨 Color Styles"
  (node `2216:739`), with ~606 nodes. `get_metadata` on that page confirms structure (headers: Main
  app colors, Text labels, Grayscale, Initials, Icons, Button Rules, Graphs & Charts) but the actual
  swatch hex/label values live in text-layer *content*, which `get_metadata` does not expose — it
  only returns layout (position/size/name), and ~52 of those swatches use generic Figma default
  names (`info`, `label`, `HEX`), not semantic names.
- One real hex value surfaced anyway: a design-rationale paragraph on that page states the primary
  interaction color is `#087DAE`.
- Nine semantic text-color *names* are confirmed as real layer names (`Text/Primary`,
  `Text/Secondary`, `Text/White`, `Text/Info`, `Text/Teal`, `Text/Alert`, `Text/Warning`,
  `Text/Success`, `Text/Disabled`) — their hex values are not.
- The full data-visualization/chart palette (Sequential Graphs group) *is* published as real Figma
  FILL styles with hex baked into the style name (e.g. `Sequential Graphs/Darker Teal #065E83`) —
  fully confirmed.
- `pdf/Buttons.pdf` (a fresh export David dropped into the repo's `pdf/` folder, dated the same day
  as this work) gave a full visual read of the button system: four variants (Primary/Main,
  Secondary/Ghost, Specialty, Tertiary/Text), three states (Default, Pressed, Disabled), two sizes
  (Large, Small — width variable, height fixed), and five icon-position variants (none, right (R1),
  left (L1), both (L1-R1), icon-only).
- `pdf/Colors.pdf` and `pdf/Typography.pdf` already exist in the same folder from the original
  (pre-Figma-swap) sources, but David explicitly asked to ignore those in favor of the new Figma
  file — they were not used here. They remain a candidate source if the Figma color-palette blocker
  isn't resolved another way; not touched without a fresh decision from David.
- David's explicit decision at the point this became a hard blocker: build the reference page now
  with everything confirmed, and clearly-flagged placeholders for the unresolved 52-swatch core
  palette, rather than waiting on a Figma-access fix.

## What was built

- `src/design-system/DesignSystemPage.tsx` + `.module.css` + `.test.tsx` — a single scrollable page
  at route `/design-system`, linked from the prototype's Home screen. Structured like mews.design:
  a sticky sidebar nav (Overview / Foundations / Components / Reference) over section content.
- Every data point on the page is tagged Confirmed / Placeholder / Blocked (see the in-app "Sources
  & status" section, which mirrors the breakdown above) — no value is presented as real unless a
  real source was found for it.
- Reuses this repo's existing placeholder tokens (`src/tokens/typography.ts`,
  `src/tokens/spacing.ts`) for the Typography and Spacing sections rather than inventing new
  numbers, and flags them as placeholder/provisional since no Figma type scale or spacing spec has
  been confirmed yet.
- Flags an open gap: the real button system (4 variants × 3 states × 2 sizes × 5 icon positions) is
  documented on this page, but the actual `Atom/Button` component in
  `src/components/atoms/Button` only implements one filled/outline/danger set with no size or icon
  props. Closing that gap is out of scope here and called out as follow-up work, not silently done.

## Acceptance criteria

- [x] Single reference page, structured after mews.design, reachable from the app's Home screen.
- [x] Every color/type/spacing/button value traceable to a named source (Figma node, PDF, or repo
      token file) — nothing invented.
- [x] Unresolved data shown as an explicit "Blocked"/placeholder state, not a guessed value.
- [x] Semantic HTML (landmark nav, heading hierarchy) and non-color-only labelling for swatches
      (accessible name states the hex or "not yet available" explicitly).
- [x] Component test + axe accessibility check, consistent with `test-authoring` conventions
      already used for `Atom/Button`.
- [x] Lint, typecheck, and tests verified locally (8/8 tests passing, including the new 6).
- [ ] Real hex values for the ~52-swatch core "Main app colors"/"Grayscale" palette — blocked, see
      above. Follow-up options: (a) retry Figma live-selection tooling in a future session, (b) a
      manual PNG/PDF export of the Color Styles page like `pdf/Buttons.pdf`, or (c) revisit
      `pdf/Colors.pdf` with David's explicit go-ahead.
- [ ] Real Figma-sourced typography scale — not yet attempted beyond one failed
      `search_design_system` query.
- [ ] Closing the gap between the documented button system and the implemented `Atom/Button`
      component — separate future slice, not this one.

## Requirements sign-off (G1)

Informal — David directed this work conversationally and chose the "build now with placeholders"
path via an in-chat decision rather than a written sign-off block. Recorded here for traceability.

## CI / PR status

Not yet pushed. Local verification only: `tsc --noEmit`, `eslint`, and `vitest run` all pass for
the new files (run against a Linux-native `node_modules` copy, since the mounted repo's
`node_modules` is missing a platform-specific native binding — see WI-0001 for the same class of
environment issue).

## Independent review findings (G3) & remediation (G4)

_Not yet run — PR not yet opened._

## Documentation sign-off (G7)

_Pending — this work item is the documentation for this slice._
