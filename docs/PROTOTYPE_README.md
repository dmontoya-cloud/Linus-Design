# Linus Patient Engagement App — Prototype

A clickable, responsive UX prototype built on the real stack (React + TypeScript, componentized,
Storybook), so it can graduate toward production rather than being thrown away. Mock data only —
no real auth, no real PHI, no live backend.

This file covers how to run it. For the delivery process (PoDs, gates, sign-offs), see
`PROCESS.md` and `CLAUDE.md` at the repo root, and `CONTRIBUTING.md` for the short version.

## Running it

```bash
npm install
npm run dev:web       # http://localhost:5173/web/     — responsive, fluid layout
npm run dev:ios       # http://localhost:5173/ios/     — iPhone 17 device-frame simulator
npm run dev:android   # http://localhost:5173/android/ — Galaxy S26 Ultra device-frame simulator
npm run dev           # http://localhost:5173/         — index page linking to all three
```

```bash
npm run storybook       # component library, http://localhost:6006
npm run build            # production build of web/ios/android/index into dist/
npm run build-storybook  # static Storybook build
```

```bash
npm run lint            # ESLint
npm run format:check    # Prettier
npm run typecheck       # tsc --noEmit
npm run test             # Vitest
npm run test:coverage   # Vitest with the 80% coverage gate
```

## How the three entries relate (one codebase, not three)

`web`, `ios`, and `android` are **not** separate apps. There is one React + TypeScript source
tree in `src/`. `web` mounts it directly with a fluid responsive layout. `ios` and `android` mount
a `DeviceFrame` component (`src/simulate/DeviceFrame.tsx`) that embeds the `web` build inside an
iframe pinned to that device's exact CSS-pixel viewport, so responsive behavior is checked against
real device dimensions:

| Entry       | Device           | CSS viewport | Device pixel ratio |
| ----------- | ---------------- | ------------ | ------------------ |
| `/ios/`     | iPhone 17        | 402 × 874    | 3x                 |
| `/android/` | Galaxy S26 Ultra | 412 × 891    | 3.5x               |

Source and update these in `src/simulate/devices.ts` if Apple/Samsung revise them; nothing else
depends on device specifics.

## White-label theming

Brand tokens (color, type, spacing, logo) live in `src/tokens/`. `ThemeProvider`
(`src/tokens/ThemeProvider.tsx`) turns a `Brand` object into scoped CSS custom properties, so a
partner skin is swapping the `Brand` object passed to `ThemeProvider`, not touching component
code. Current values in `src/tokens/colors.ts` / `typography.ts` are **PoD 0 placeholders** — the
real Linus brand tokens land in PoD 1, pulled from Figma variables + `Colors.pdf`/`Typography.pdf`.

## Mock data / API stubs

See `src/mocks/README.md`. Contract-first: every future API integration point gets a typed
fixture, so swapping in the real Linus API later is a change to where data comes from, not to the
shape components expect.

## Screen ↔ Figma frame ↔ work item map

Populated as funnel screens land (PoD 4). Placeholder below.

| Screen                 | Figma frame | Work item | Status            |
| ---------------------- | ----------- | --------- | ----------------- |
| Login                  | _TBD_       | _TBD_     | Not built (PoD 4) |
| Onboarding             | _TBD_       | _TBD_     | Not built (PoD 4) |
| Consent / Privacy      | _TBD_       | _TBD_     | Not built (PoD 4) |
| Paywall / Subscription | _TBD_       | _TBD_     | Not built (PoD 4) |
| Assessment Intro       | _TBD_       | _TBD_     | Not built (PoD 4) |
| In-App Report          | _TBD_       | _TBD_     | Not built (PoD 4) |

## Known gaps (tracked, not silent)

- SAST / dependency (SCA) scan / secret scanning aren't wired into CI yet (PROCESS.md §9.3 lists
  these as required baseline checks) — tooling choice needs a decision, see
  `docs/work-items/WI-0001-repo-ci-scaffold.md`.
- No preview-deploy step (Vercel/Netlify) yet — needs an account/token.
- Real Azure DevOps and Codex integrations aren't connected — see `CONTRIBUTING.md` for the
  current stand-ins.
