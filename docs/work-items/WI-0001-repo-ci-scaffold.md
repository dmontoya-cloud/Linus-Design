# WI-0001: Repo & CI scaffold (PoD 0)

- **Type:** Feature
- **PoD:** PoD 0 — repo scaffold
- **Human Lead:** David
- **Status:** In progress — build complete locally, pending PR + human review (G2) and merge approval
- **Feature branch:** feature/0001-repo-ci-scaffold
- **PR:** not yet opened (no GitHub push access from this environment this session — see CONTRIBUTING.md)

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
- Coverage (`npm run test:coverage`) could not be fully re-verified in the build sandbox used to
  produce this scaffold — file-deletion is restricted there, which appears to make the v8
  coverage provider's temp-file cleanup hang. Plain `npm test` (17/17 tests) and one earlier
  coverage run both passed; the config itself is standard and should run normally in GitHub
  Actions. Re-verify on the first real CI run and flag back if it doesn't.

## Independent review findings (G3) & remediation (G4)

_Not yet run — PR not yet opened._

## Documentation sign-off (G7)

_Pending — README/CONTRIBUTING/CLAUDE.md are drafted, not yet reviewed._
