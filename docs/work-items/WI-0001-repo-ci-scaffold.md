# WI-0001: Repo & CI scaffold (PoD 0)

- **Type:** Feature
- **PoD:** PoD 0 — repo scaffold
- **Human Lead:** David
- **Status:** In progress — pushed to GitHub, CI red (see below), PR not yet opened
- **Feature branch:** feature/0001-repo-ci-scaffold (pushed; `main` also created from the same commit, not yet protected, still the non-default branch on GitHub)
- **PR:** not yet opened

## Acceptance criteria

- [x] React + TypeScript app scaffold with three entries: `/web` (responsive), `/ios` (iPhone 17
      simulator), `/android` (Galaxy S26 Ultra simulator), sharing one `src/` codebase.
- [x] TypeScript strict mode; ESLint (typescript-eslint) + Prettier configured and passing.
- [x] Vitest + React Testing Library configured; 80% coverage thresholds set in `vite.config.ts`.
- [x] Storybook configured with the a11y addon; one real component (`Atom/Button`) migrated from
      the Figma design system as proof of the pipeline.
- [x] Automated axe accessibility assertion wired into a component test (`Button.test.tsx`).
- [x] GitHub Actions CI workflow: install → lint → format check → typecheck → test (coverage
      gate) → build → Storybook build.
- [x] PR template (work item + acceptance criteria + a11y checklist), CODEOWNERS, CONTRIBUTING.
- [x] `CLAUDE.md` placed at repo root per the operating-model README.
- [ ] SAST / dependency (SCA) scan / secret scanning in CI — **not yet wired, flagged as an open
      question, see below.**
- [ ] Preview deploy (Vercel/Netlify) posting to the PR — **not yet wired, needs an account/token.**

## Requirements sign-off (G1)

- **Approved by:** David
- **Date:** 2026-07-28
- **Notes:** Approved the PoD order (PoD 0–5) and two process substitutions in chat: (1) Codex
  independent-reviewer role stood in by a fresh, context-free Claude subagent reviewing each PR's
  diff; (2) Azure DevOps work-item tracking stood in by structured markdown under
  `docs/work-items/` until ADO is connected. See `.claude/skills/codex-review.md` and
  `.claude/skills/azure-traceability.md`.

## Open questions carried into review (not silently decided)

- SAST/SCA/secret-scanning tooling choice (CodeQL vs. npm audit gate vs. gitleaks, etc.) —
  PROCESS.md §9.3 lists these as required baseline checks; deferred to avoid guessing at tooling
  preference.

## CI status (observed, run 30462965122, 2026-07-29T14:51Z)

**Red.** Failed at the "Install dependencies" step (`npm ci`), before lint/typecheck/test/build
ever ran — none of those steps are verified green in real CI yet, despite passing locally.

Root cause: `npm error npm ci can only install packages when your package.json and
package-lock.json ... are in sync ... Missing: @emnapi/core@2.0.0-alpha.3 from lock file` —
the committed `package-lock.json` drifted from `package.json` (a side effect of the sandbox
environment used to build this scaffold; documented as a known-hang workaround at build time, but
the resulting lockfile wasn't re-validated with a clean `npm ci` before committing — that check
should have happened and didn't).

Secondary issue, not yet fatal: the workflow pins `node-version: 20`, but a dependency declares
`engines: { node: '^22.14.0 || >=24.0.0' }` (`EBADENGINE` warning). GitHub Actions also flagged
that `actions/checkout@v4`, `actions/setup-node@v4`, and `actions/upload-artifact@v4` are being
forced onto Node 24 regardless, since Node 20 is deprecated on the runners as of Sept 2025.

**Fix (proposed, not yet applied — needs a decision before I push again):** regenerate
`package-lock.json` with a clean `npm install` and verify `npm ci` succeeds locally first, and
bump the workflow's `node-version` to 22 or 24. This is mechanical, but I'm flagging it for your
sign-off rather than silently pushing a fix to a branch already marked "build complete" — this
line in this file was itself wrong until this correction.

## Independent review findings (G3) & remediation (G4)

_Not yet run — PR not yet opened._

## Documentation sign-off (G7)

_Pending — README/CONTRIBUTING/CLAUDE.md are drafted, not yet reviewed._
