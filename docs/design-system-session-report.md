# Session Report: Linus Design System (docs/design.md + docs/design.html)

- **Type:** Ad hoc slice, requested directly by David in-chat (not run through the PoD 1–5 phase gates), now spanning 5 conversation sessions
- **Human Lead:** David
- **Status:** Built and locally verified in-browser across all 5 sessions; **nothing committed** — all changes are uncommitted local edits on branch `feature/0002-design-system-reference-page`
- **Files produced:** [`docs/design.md`](design.md) (source of truth: YAML tokens + prose), [`docs/design.html`](design.html) (self-contained, token-driven style guide)
- **Related but distinct:** [`WI-0002`](work-items/WI-0002-design-system-reference-page.md) covers a *different* artifact — `src/design-system/DesignSystemPage.tsx`, a React reference page built from Figma/PDF research. This work is a separate deliverable (plain HTML/MD, not wired into the app), produced with the `design-system` skill. The two should eventually be reconciled, not assumed to be the same thing — see Session 2's open items for the latest status on that decision.
- **Follow-on:** [`docs/prototype-session-report.md`](prototype-session-report.md) covers the first real port of this system into `src/` and the first real screens (Login/Registration/Consent/Verify Email) built from it — a distinct deliverable from this doc-only work, read it for those sessions' specifics. Session 4 below was itself dispatched from a conversation that report's Session 2 also covers.

## Why this isn't a formal PoD slice

Per CLAUDE.md's "when unsure, ask" rule, most of the judgment calls below were resolved by asking David directly in-chat rather than through a written G1 requirements sign-off — there was no upfront requirements phase, this was built iteratively over one long conversation. Recorded here for traceability; if this is to be tracked formally going forward, it needs its own work-item ID (none assigned yet — do not assume WI-0002 covers it).

## Session 1

### What was built

1. **Tooling**: Installed the BuilderOS skill pack (`npx skills add BuildGreatProducts/builder-os`) after flagging it as a third-party source and getting explicit go-ahead — 10 skills landed in `.agents/skills/`, untracked.
2. **Initial design system** (via the `design-system` skill): analyzed nordhealth.design live in-browser (real CSS custom properties pulled via JS, not guessed) as a structural/mood reference, then built Linus's own system around it:
   - Product framing: consumer mental-sharpness assessment app — calm/encouraging/human, explicitly *not* clinical.
   - Colors anchored on Linus's already-confirmed Figma brand blue (`#087DAE`), not Nord's blue.
   - Typography: kept the repo's existing system-font stack (`src/tokens/typography.ts`) rather than introducing a new webfont.
   - Spacing/radius/elevation: soft, generous, "floating card" direction (10–16px+ radii, gentle shadows) — a deliberate departure from Nord's tight/flat clinical style.
   - 8 components speced: button-primary, button-outline, input, question-card, progress-stepper, score-card, nav-bar, badge.
3. **Navigation**: converted the single-page style guide into a multi-page sidebar (Foundations / Components categories, one page per title), then embedded the real Linus Health SVG logo (from `~/Desktop/Logo/H-Alt-3C.svg`) in place of a placeholder text mark.
4. **Color system overhaul**, driven by a real 5-color Figma brand-palette image the user shared (Blue `#087DAE`, Green `#86C65A`, Teal `#009EA1`, Orange/Yellow `#FAF633`, Purple `#5867E8`):
   - Built primitive scales (later extended from 7 to 9 steps: `50`→`950`) for all 5 hues, plus a `gray` neutral scale anchored on the existing `text-secondary` value.
   - Remapped semantic tokens (`primary`, `secondary`, `accent`, `success`, `warning`, `danger`, `info`) onto these primitives, replacing earlier invented placeholder colors.
   - Found and fixed several real accessibility problems in the process: `green-500` fails as white-on-color text (2.0:1), `teal-500` fails as small foreground text, the original orange/yellow base failed contrast entirely.
   - Added dedicated **Content** semantic colors (text/icon-specific, distinct from fill colors): `content-primary`/`content-secondary`, each with `-disabled` and `-inverted` variants, plus a functional trio.
   - Added 3 new **dedicated functional primitives** — `success`, `danger`, `info` — so those states stop reusing brand hues that already meant something else, and so `danger` (previously an off-palette placeholder) finally has a real scale.
   - Corrected the orange primitive: its Figma-labeled hex (`#FAF633`) rendered as bright yellow, not orange; David supplied the real value (`#FA5633`), the full ramp was rederived, and `warning` moved from `orange-900` to `orange-700` since the corrected base needs less darkening to pass contrast.
   - Split the "Colors" page into separate **Primitives** and **Semantic Colors** pages, then nested both under a collapsible **Colors** group in the sidebar.
   - Reorganized Primitives into **Brand** (blue, green) / **Functional** (orange, success, danger, info) / **Complementary Colors** (teal, purple) / **Grayscale** (gray) sections.
5. **Claude Design (claude.ai canvas beta) + the `DesignSync` bridge tool**: confirmed real and available (a `DesignSync` tool is loaded in this session); explained the push/edit-on-canvas/pull workflow; David chose to defer using it and keep iterating in-chat for now. Not started.
6. **Typography overhaul**, at David's explicit direction (a full rebuild, not an extension of the prior system-font approach):
   - Switched the entire product typeface to **IBM Plex Sans** (loaded via Google Fonts `<link>` — an explicitly-permitted exception to the "self-contained file" rule) — a deliberate, documented reversal of the earlier "keep the existing system font" decision from step 2.
   - Built a **1.200 (minor third) modular scale**. First version: 12 sizes across 4 categories (Display ×2, Headline ×4, Paragraph ×3, Label ×3) × 2 weights = 24 tokens, plus a standalone `button` style. Display used Bold (700); Headline/Paragraph/Label used Semi Bold (600).
   - Re-pointed every component that referenced the old ad hoc scale (`input`, `question-card`, `score-card`, `nav-bar`, `badge`/`badge-success`/`badge-encouraging`) onto the new named tokens.
   - **Removed the Display category and the Bold (700) weight entirely**, at David's follow-up request — `score-card`'s big number was remapped a second time, from `display-2-bold` (57px) to `headline-1-semibold` (48px), now the largest/most prominent style left in the system.
   - Replaced the crafted sample sentences on the Typography page with lorem ipsum placeholder text, at David's request.
   - **Renamed and restructured Paragraph**: from 3 sizes named L/M/S to **4 sizes named Paragraph 1–4**. Paragraph is numbered *ascending* (1 = smallest), the opposite direction from Headline's *descending* numbering (1 = largest) — a deliberate, explicitly-flagged asymmetry. `paragraph-2` (16px) stayed the base/default reading size, gaining one new smaller step below it (`paragraph-1`, 13px, brand new) and keeping its existing two larger steps above (`paragraph-3` 19px, `paragraph-4` 23px — same values as the old M/L, just renamed). Flagged that `paragraph-1` (13px) now shares its rung on the underlying scale with `label-l` (also 13px) — an accepted overlap, not an error. Final scale: 11 sizes × 2 weights = 22 tokens.

## Session 2 — 2026-08-04: borders, the primitive-only rule, buttons, and Material-style fields

Continuation of the same ad hoc slice, same branch, still nothing committed. David redirected scope at the start of this session: the `src/tokens/*` reconciliation plan drafted at the end of Session 1 was explicitly shelved in favor of continuing on `docs/design.md`/`docs/design.html` only (see Open items). Everything below is scoped to those two files.

### What was built

1. **Semantic border family**, at David's request ("border, especially subtle and strong, using the grayscale color"):
   - Added `gray-400` (`#81909C`) — the *only* primitive family with a 10th step, added specifically because `gray-300` (2.25:1 against white) misses the 3:1 non-text-contrast minimum a component boundary needs, and `gray-500` (5.49:1) reads too dark for a border.
   - `border-subtle`/`border`/`border-strong` fully consolidated onto `gray-100`/`gray-200`/`gray-400` (previously independent, unaliased values). Added `border-disabled` (`gray-100`) and, at David's explicit follow-up, `border-danger`/`border-success`/`border-info` (aliasing `danger-500`/`success-500`/`info-500` directly — corrected mid-session after first citing the *semantic* token instead of the primitive step, per the rule below).
   - Added real 1px horizontal-line samples showing each border token as an actual line (not just a color-card swatch), at David's request — the original color-card swatches were kept underneath, explicitly not deleted, "in case we need to come back to this."
2. **Removed the "Do's and Don'ts" section entirely**, from both files, on direct instruction — not reconciled elsewhere, no content preserved.
3. **Governing rule adopted, and retroactively enforced**: *every color applied in the UI must trace to a primitive* — directly, via a semantic alias, or via a new `alpha` category (a primitive/base neutral at a stated opacity — David's own suggestion for handling transparency without spawning new primitives). Audited both files and fixed every violation found:
   - The elevation shadows and a translucent swatch-label pill were invented standalone `rgba()` values with no primitive behind them — replaced with `alpha.shadow-ink-*` (derived from `gray-900`) and `alpha.surface-85`.
   - 44 inline `color:#fff` + 2 inline `color:#1F2A37` swatch-label styles (on the Primitives page's step-number labels) were hardcoded — swapped for the real existing tokens they should have been all along (`content-primary-inverted`, `text-primary`).
   - This audit was scoped to `docs/design.md`/`docs/design.html` only; `src/` (`Button.module.css`, `App.css`, `DeviceFrame.module.css`) was **not** touched and still runs its own separate, older placeholder pipeline — see the still-open `src/tokens/*` reconciliation item below.
4. **New 3-variant button system**, replacing the old 2-variant (`button-primary`/`button-outline`) spec, built from two reference screenshots David provided (a dark filled CTA + text link; a light-green filled CTA on a dark section): `button-primary` (solid, dark), `button-secondary` (solid, light green), `button-tertiary` (text-only) — each at 3 sizes (`lg`/`md`/`sm` = 56/48/40px) and 5 real states (enabled/hover/pressed/disabled/focus, not computed-opacity fakes).
   - Two new semantic tokens introduced: `primary-strong`/`primary-strong-hover` (`blue-900`/`blue-950`, previously-unused ramp steps — kept separate from `primary` so that token keeps meaning "the brand's identity color," not "the CTA button color") and `secondary-subtle` (`green-300`, also previously unused). Secondary's hover/pressed states reuse the *existing* `secondary`/`secondary-hover` as-is.
   - **Flagged assumption, not confirmed**: the exact primitive steps behind `primary-strong` and `secondary-subtle` are my best visual match to David's reference screenshots, not a pixel-sampled or Figma-confirmed value — worth a sanity check against the originals.
   - Built as genuinely interactive `<button>` elements in `design.html` (real `:hover`/`:active`/`:focus-visible`/native `disabled`, verified via `.matches()` in the live DOM, not just a screenshot), plus a static all-5-states reference grid.
5. **New Input/Select/Date Picker field system**, replacing the old flat `input`/`input-focus`/`input-error` spec, at David's request to match a Material-Design outlined-text-field reference screenshot he provided, with one hard constraint: **field height must pixel-match button height at every size**, so a field and a button always line up. Built:
   - A shared `field` container (outlined box, notched floating label) reused as-is by all three components — only the inner control differs (`<input>`/`<select>`/`<input type="date">`).
   - `field-size-lg`/`-md`/`-sm` deliberately identical to `button-size-lg`/`-md`/`-sm` (56/48/40px) — verified pixel-exact via `getBoundingClientRect()` in the live page, not just eyeballed.
   - Select adds a drawn chevron over a real `<select>` (native keyboard/screen-reader behavior). Date Picker uses a real `<input type="date">` — the browser's native calendar affordance was kept deliberately rather than building a custom calendar widget; flagged as a judgment call David didn't explicitly rule on either way.
   - **The floating label needed a correction mid-session.** The first pass permanently floated the label (always notched on the border) for all three components. David caught that this was wrong for Input specifically: real Material fields rest the label *inside* the field (like a placeholder) when empty and unfocused, and only float it on focus or once it has a value. Rebuilt Input's label as a genuine two-state CSS behavior — `:has(input:focus)` / `:has(input:not(:placeholder-shown))` — which required adding a real (if empty, `" "`) `placeholder` attribute to every text input, since `:placeholder-shown` never matches at all without one. Select and Date Picker were deliberately *left* permanently-floated (not given the same fix) since neither has a true "empty text" moment the way a text input does — documented as a reasoned distinction, not an oversight.
6. **Small nav/UI polish requests**, handled inline as they came up: renamed the page H1 to "Engagement app Design System"; removed an unintended blue active-state background rendering behind the sidebar logo; recolored the "FOUNDATIONS"/"COMPONENTS" group labels to `primary-hover` (dark blue) so they read as a distinct tier from their children; indented every child nav item 8px further than its group label.
7. **Verification note for future sessions**: the file:// browser-preview tooling used to check this work was persistently unreliable — `location.reload(true)` and re-navigating the same tab repeatedly served stale cached content; the only reliable fix found was closing stale tabs and opening a genuinely fresh one per check. Separately, a same-tick `:has()`-relational-selector recompute timing issue produced a false "the fix isn't working" reading in one script-based check (the DOM change and the style read happened in the same synchronous block, before the browser's style recalc had run) — resolved by splitting the state change and the verification read into two separate script calls. Anyone re-verifying this page should know both failure modes going in.

### Open items / not yet resolved (current, supersedes the Session 1 list above)

- **Danger has no real brand red.** Still `#DC2626`, a chosen placeholder, not a confirmed Figma value.
- **Purple has no semantic role.** Still unused.
- **`text-primary`/`text-secondary`/`text-tertiary`** still independently set, not aliased onto `gray` (unlike `border`/`border-strong`, which Session 2 resolved).
- **`paragraph-1`/`label-l` still share a pixel size (13px)** — accepted overlap, unchanged.
- **`src/tokens/*` reconciliation still fully open and now explicitly out of scope for the foreseeable term** — David redirected away from it at the start of Session 2, on top of it already being unstarted after Session 1. This includes the new primitive-only/`alpha` rule and the new button/field systems: none of it has been ported to `src/` (`Button.module.css`, `App.css`, `DeviceFrame.module.css`, or any real `Atom/*` component). `docs/` and `src/` are two increasingly different systems.
- **`src/design-system/DesignSystemPage.tsx` (WI-0002) fate still undecided.** The question (delete now vs. leave alone) was dismissed unanswered in Session 2 too — still don't delete it or assume an outcome without asking again.
- **`primary-strong`/`secondary-subtle` exact values are an unconfirmed visual match**, not pixel-sampled from David's reference screenshots or checked against Figma — flag if either ever needs correcting.
- **Native `<input type="date">` for Date Picker was a judgment call**, not an explicit instruction — a custom calendar-popup widget is the likely alternative if that's ever wanted instead.
- **No review, no tests, no commit.** Still true — local, uncommitted work product only.
- **Claude Design sync not started.** Unchanged from Session 1.

## Session 3 — 2026-08-04: page navigation, logo sizing, and 5 new form controls

Continuation of the same slice, same day as Session 2, same branch, still nothing committed.

### What was built

1. **Category overview pages.** "FOUNDATIONS" and "COMPONENTS" in the sidebar are now real links (`data-page="foundations"`/`"components"`), each opening a card-grid overview of everything in that category (reusing the Overview page's existing `.quick-link` card pattern). Caught and fixed a real CSS specificity bug in the process — the group-title links briefly inherited child nav-items' +8px indent because of a same-specificity rule tie, resolved by re-asserting the flush-left padding later in the cascade.
2. **Sidebar logo** reduced 20% (176px → 141px max-width) and confirmed flush-left.
3. **Radius page**: converted from a small swatch grid to a full-width stacked card list at David's request (better shows each corner radius at a realistic size); `circle` was fully removed from the page (and its now-orphaned CSS) at a follow-up request — the `circle` *token* itself is untouched in `docs/design.md`, only the demo went.
4. **Semantic Colors page**: removed the redundant Border color-card swatches (the line-sample visualization added earlier in Session 2 already covers it) and its now-orphaned CSS; changed `.swatch-grid` from a 3-column auto-fill to a fixed 4-column grid (2 columns under 640px) at David's request.
5. **5 new form-control components** — Radio, Checkbox, Search, Toggle, Progress Bar — every color reused from the existing semantic set, **no new tokens added**. All are real, keyboard-accessible `<input>` elements (`appearance: none` + custom paint), not decorative divs:
   - `radio`/`checkbox` share one state ladder: `border-strong` rest → `text-secondary` hover → `primary` checked (`primary-hover` checked+hover) → `border-disabled`/`text-tertiary` disabled → the field system's `0 0 0 3px primary-soft` focus ring. `checkbox` additionally gets `indeterminate` (set via the JS `.indeterminate` property — there's no HTML attribute for it) and an `error` state (`border-danger`).
   - **A real bug found and fixed here**: neither control had `box-sizing: border-box`, so a 20px-square control with a 2px border was actually rendering at 24×24, throwing off the checkmark's rotated-border-trick positioning enough that David spotted it as visibly off-center. Root-caused and fixed by adding `border-box`; confirmed via a 4×-zoomed screenshot after the fix.
   - `search` reuses the `field` container exactly, just `rounded.pill` instead of `rounded.sm`, and **deliberately skips the floating-label mechanic** — a search box's placeholder conventionally stays put rather than floating away, so Input's two-state label wouldn't apply here. Adds a leading icon and a trailing clear button once it has a value.
   - `toggle` is a real checkbox (`role="switch"`) styled as a sliding track+thumb; disabled-but-on reuses `primary-soft` rather than inventing a muted-primary token.
   - `progress-bar` is a plain track+fill (not the segmented `progress-stepper` already on the Question Card page), reusing that same 8px/pill recipe, plus a `success`-filled complete-state variant.
6. Added all 5 to the sidebar (grouped near Input/Select/Date Picker and Score Card respectively) and to the Components overview page's card grid.

### Open items / not yet resolved (current, supersedes the Session 2 list above)

All Session 2 open items are unchanged (danger's real red, purple's role, text-primary/secondary/tertiary aliasing, `src/tokens/*` reconciliation still shelved, `DesignSystemPage.tsx`'s fate still undecided, `primary-strong`/`secondary-subtle` still unconfirmed against source references, native-date-input still a judgment call, no review/tests/commit, Claude Design sync not started). Nothing new to flag from Session 3 beyond what's already noted inline above (the box-sizing bug is fixed, not open).

### Verification note

The file:// browser-preview tool was **significantly** flakier this session than in Session 2: screenshots repeatedly lagged behind actual DOM/navigation state by one or more steps (e.g. a screenshot would show "Primitives" immediately after a script confirmed `page-search` was the visible panel), and this got markedly worse as more browser tabs accumulated across the session. The fix that worked every time: query the DOM directly (`Array.from(document.querySelectorAll('.page-panel')).find(p => !p.hidden)`, or check a specific panel's `.hidden` property) rather than trusting a screenshot's apparent page state, and periodically close accumulated tabs / open a fresh one rather than reusing a long-lived tab. Treat any screenshot in a long session like this as advisory, not authoritative, when it disagrees with a direct DOM query.

## Session 4 — 2026-08-06: independent review agent, dispatched from Session 2 of the prototype work

David asked for an independent review of `docs/design.md` specifically — "create an agent, and this agent will be a UX/UI expert that implements design systems on a daily basis... review the MD file and find flaws and potential errors and fix them... suggest improvements and add components... for a common SaaS project." This request happened mid-conversation during what `docs/prototype-session-report.md` records as its Session 2 (which is why this entry's dated the same day as that report's Session 2, not chronologically after Session 3 above) — recorded here rather than there because the agent's scope was strictly `docs/design.md`/`docs/design.html`, never `src/`.

### What the agent did, and what I independently verified (not just relayed)

Per this repo's "you do not gate-review your own code" posture, I treated the agent's own report as a claim to check, not a fact to relay — everything below marked *(verified)* was independently re-derived, not just re-stated from the agent's summary.

1. **A false claim in the doc's own prose, found and corrected**: the doc asserted every `*`/`*-soft` semantic color pairing was "checked at 4.5:1 or better" — three actually weren't (`success`/`success-soft` 4.38:1, `danger`/`danger-soft` 4.13:1, `info`/`info-soft` 4.49:1). *(Verified: recomputed all three via a real WCAG luminance-contrast calculation, got exact matches to the agent's corrected numbers.)*
2. **Focus rings across buttons/radio/checkbox/toggle were nearly invisible**: the single-layer soft-tint ring measured ~1.1:1 against a white surface, under the 3:1 minimum a focus indicator needs (WCAG 2.2 SC 2.4.11). Fixed to a two-layer `surface`-gap-plus-solid-ring recipe, using whichever step of each hue actually clears 3:1 (`secondary-hover`/green-700, not plain `secondary`/green-500, which fails at 2.05:1). *(Verified: recomputed green-700 vs. surface/background at 3.54/3.36:1 and green-500 vs. surface at 2.05:1 — exact matches.)*
3. **`text-primary`/`text-tertiary` were standalone hex values with no primitive behind them** — a direct violation of this doc's own governing rule (every color must trace to a primitive, an alias, or an `alpha` entry, adopted in Session 2). Re-aliased onto `gray-900`/`gray-300`.
4. **Other real fixes**: the Search clear button had no focus state at all (a real keyboard dead-zone); stale prose claiming danger has no brand red (false since Session 2 gave it one); a wrong shadow RGB value; missing ARIA on progress indicators; un-hidden decorative SVGs.
5. **6 new sections built** (not just proposed): **Breakpoints** (closed a real doc/code gap — `src/tokens/spacing.ts` has had this since the prototype-session-report Session 1 token reconciliation, never back-ported here), **Motion** (duration/easing tokens, retrofitted into existing components), **Layering/z-index**, **Textarea**, **Tags & Chips**, and **Modal/Dialog** — the highest-value addition, the first real consumer of `alpha`, `shadow-modal`, and `rounded.xl`, and the first real documented usage context for `button-danger` (a destructive-confirmation dialog).
6. **Deferred, proposed but not built** (with a stated rationale each): Tabs, Tooltip, Dropdown/Popover, Toast, Alert/Banner, Table, Avatar, Empty state, Skeleton loading, Pagination, Slider.

### Verification performed live, beyond the math re-checks above

- Confirmed via `git status` that only `docs/design.md`/`docs/design.html` changed — no unexpected `src/` edits, matching the agent's stated scope.
- Confirmed all 6 new nav links have exactly one matching page panel each, no orphans.
- Opened `docs/design.html` fresh in-browser: no console errors; the Modal is a genuine native `<dialog>` (`.showModal()` moves focus in, native focus-trap confirmed, `.close()` works); Tags are genuinely removable (after catching and correcting my own same-tick DOM-read timing mistake — the same class of browser-tool artifact noted elsewhere in this report and in `docs/prototype-session-report.md`'s Session 2); Textarea renders all 5 documented states correctly.

### A gap I noticed myself, not raised by the agent — still open

The Tag component's remove "×" icon is `aria-hidden="true"`, so a screen reader announces just the tag's label and "button," with no indication that activating it removes/deselects the tag. Not yet fixed either way — flagged to David, awaiting a decision on whether to add an `aria-label` now or leave it for a later pass.

### Open items / not yet resolved (current, supersedes the Session 3 list above)

- **The Tag remove-icon accessibility gap above** — new this session.
- All carried-forward Session 3 items are unchanged except where this session's fixes closed them: danger's real red (was open, now resolved — see item 4 above), `text-primary`/`text-secondary`/`text-tertiary` aliasing (was open, `text-primary`/`text-tertiary` now resolved by this session; `text-secondary` still independently set, not yet aliased), focus-ring contrast (was not previously flagged as an open item, but was a real defect — now fixed).
- Still open, unchanged: purple's role, `paragraph-1`/`label-l`'s shared 13px size, `src/tokens/*` reconciliation status (this is now more nuanced — see `docs/prototype-session-report.md`, which *did* reconcile `src/tokens/*` in its own Session 1, but this doc's newest sections — breakpoints aside — have not been ported back into `src/`), `DesignSystemPage.tsx`'s fate, `primary-strong`/`secondary-subtle` unconfirmed against source references, native-date-input as a judgment call, no Codex review/adversarial tests/commit, Claude Design sync not started.
- **The 11 deferred component proposals** (Tabs through Slider above) are recorded as proposals only — none has a written go/no-go decision from David yet.

## Session 5 — 2026-08-07: IBM Plex Serif accent on the three largest Headline styles, and a real CSS-variable gap fixed

Continuation of the same ad hoc slice, same branch, still nothing committed. This session's request came mid-conversation during what `docs/prototype-session-report.md` records as its own Session 3 — recorded here because the typeface change itself is a `docs/design.md`/`docs/design.html` token decision; see that report's Session 3 for how the same change reached (and initially failed to reach) the real prototype.

### What was built

1. David asked to change `headline-1`/`headline-2`/`headline-3` (referred to as "h one, h two, h three") to IBM Plex Serif. `headline-4` and every Paragraph/Label/`button` style stay on IBM Plex Sans — a deliberate accent on the three largest titles only, not a typeface swap.
   - `docs/design.md`: added the serif stack (`'IBM Plex Serif', Georgia, 'Times New Roman', serif`) to the six `headline-1`/`headline-2`/`headline-3` style entries (regular + semibold each); updated the top-of-block comment and the Typography section's prose to describe the two-family system.
   - `docs/design.html`: added a `--font-family-serif` CSS variable; applied it to the Typography page's `headline-1`/`headline-2`/`headline-3` sample rows and to `score-card`'s number (which documents `headline-1-semibold`); updated the Google Fonts `<link>` to also load IBM Plex Serif (400/600); updated the section-intro prose to match.
2. **A real gap found and fixed, not cosmetic**: `src/tokens/theme.ts`'s `brandToCssVars` generated `--font-{style}-size`/`-weight`/`-line-height`/`-letter-spacing` CSS variables for every named type style, but never a `--font-{style}-family` variable — so a per-style `fontFamily` override (including this new serif accent) had no CSS variable to actually reach any real component through. Every real screen's CSS hardcoded `font-family: var(--font-family, ...)`, the generic sans stack, regardless of what the token said — this is why David reported the change was "not applied on the prototype" even after this doc and `typography.ts` were already correct. Fixed by adding `vars[\`--font-${name}-family\`] = style.fontFamily` to the per-style loop in `theme.ts`. See the prototype report's Session 3 for the matching fix on the consuming side (three real screens whose CSS still referenced the generic variable).
3. `src/tokens/typography.ts`: added a `FONT_FAMILY_SERIF` constant; applied it to the six `headline-1`/`headline-2`/`headline-3` style entries, mirroring `docs/design.md` exactly.
4. Google Fonts `<link>` in all four HTML entry points (`web/index.html`, `ios/index.html`, `android/index.html`, `docs/design.html`) updated to also request IBM Plex Serif (weights 400/600) — without this, the `font-family` value would have silently fallen through to its own next stack entry (`Georgia`), never the actual webfont.
5. `src/design-system/DesignSystemPage.tsx`'s Typography section had the same class of gap independently: its inline `style={{...}}` for the "Heading 1"/"Heading 3" tiles set `fontSize`/`fontWeight` but never `fontFamily`, so it would have stayed sans-serif regardless of the token fix above — added `fontFamily: style.fontFamily` to that inline style.

### Key decisions (flagged, not silently assumed)

- The serif *choice* was explicit ("It has to be IBM Plex Serif") — no judgment call there. The one flagged call: the serif fallback chain (`Georgia, 'Times New Roman', serif`) is my own conventional pick, not confirmed with David.

### Verification

- Confirmed visually in-browser: `docs/design.html`'s Typography page (`headline-1`/`2`/`3` render in serif; `headline-4` and every Paragraph row correctly stay sans-serif) and the real prototype screens that consume those tokens (`/web/login`, `/web/verify-email`, `/web/onboarding`) — all now render in serif, after the Session 3 (prototype report) fix on the consuming side.
- `tsc --noEmit`, `eslint --max-warnings 0`, `prettier --check`, and `vitest run` all clean (one pre-existing, unrelated `VerifyEmailPage.test.tsx` type error persists — flagged, not fixed, since it predates this session and is out of scope for a token change).

### Open items / not yet resolved (current, supersedes Session 4's list where unchanged)

- All Session 4 items are unchanged: purple's role, `paragraph-1`/`label-l`'s shared 13px size, `src/tokens/*`'s newest-sections-not-yet-ported-back status, `DesignSystemPage.tsx`'s fate, `primary-strong`/`secondary-subtle` unconfirmed, native-date-input as a judgment call, no Codex review/adversarial tests/commit, Claude Design sync not started, the Tag remove-icon accessibility gap, the 11 deferred component proposals.
- **New**: the serif fallback stack (`Georgia, 'Times New Roman', serif`) is an unconfirmed convention choice, not checked against any reference.
- **New**: this is the first change in this doc's history that was verified as actually reaching the real prototype rather than staying doc-only — and it surfaced a real, previously-invisible `src/tokens/theme.ts` bug in the process (see item 2 above). Worth treating as a standing verification habit going forward: a token change isn't done until it's checked in a real screen, not just in `docs/design.html`.

## Traceability

No formal G1/G3/G4/G7 gates apply — this was built directly from conversational direction, with every non-obvious decision (BuilderOS install, brand-color anchor, orange/yellow mismatch, "three vs four" functional colors, caution-vs-warning, paragraph weight scope, label naming, display removal, paragraph renumbering in Session 1; the gray-400 contrast gap, the primitive-only/alpha rule, the two new button/field semantic tokens, native-date-input vs. custom-calendar, and the permanently-floated vs. two-state label distinction in Session 2; the review agent's fixes and the deferred-proposals list, independently verified rather than taken on trust, in Session 4; the serif fallback stack and the theme.ts CSS-variable root cause in Session 5) surfaced as an explicit question, an explicitly-flagged assumption, or an independently-verified claim rather than silently decided or silently relayed. See the conversation history for the specific questions asked and David's answers.
