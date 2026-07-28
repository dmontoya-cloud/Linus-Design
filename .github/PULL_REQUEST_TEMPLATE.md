<!--
This template mirrors PROCESS.md's PoD lifecycle and gates (G1-G7).
One PoD = one feature branch = one PR. Don't mix PoDs.
-->

## PoD / work item

- **Work item:** <!-- AB#1234 (Azure DevOps), or the in-repo docs/work-items/ entry ID until ADO is connected -->
- **Human Lead:** <!-- accountable owner, per PROCESS.md §6.2 -->
- **Figma frame(s):** <!-- link(s) to the specific frame(s) this PR implements -->

## What this PR does

<!-- One or two sentences. -->

## Acceptance criteria (signed off at G1)

- [ ]
- [ ]

## Screens affected

<!-- Which screen(s)/breakpoint(s): mobile / tablet / desktop, and which entries (web / ios / android simulators) -->

## Accessibility checklist (WCAG 2.2 AA)

- [ ] Semantic HTML / landmarks used appropriately
- [ ] All interactive elements reachable and operable by keyboard alone
- [ ] Visible focus indicator on every focusable element
- [ ] Labels/accessible names on all inputs and controls
- [ ] Color contrast checked (text and non-text) against tokens, not eyeballed
- [ ] Automated axe check added/updated for new components (see `vitest-axe` pattern in `Button.test.tsx`)
- [ ] No new serious/critical axe violations

## Mock data / stub contract

- [ ] Any new API-shaped data has a typed fixture in `src/mocks/` (no live backend calls)
- [ ] No real PHI, no real auth

## Review status (gates)

- [ ] G2 — Human code review requested
- [ ] G3 — Independent review complete (see remediation notes below)
- [ ] G4 — Remediation dispositions approved
- [ ] G5 — Tests present, coverage gate green
- [ ] G6 — CI green (lint, typecheck, test, build, a11y)
- [ ] G7 — Documentation updated and approved (if applicable)

## Independent review findings & remediation (G3/G4)

<!-- One row per finding. Leave the table empty (not deleted) if none. -->

| Finding | Severity | Disposition (fixed / accepted / deferred) | Notes |
| ------- | -------- | ----------------------------------------- | ----- |
|         |          |                                           |       |

## Risks / open questions

<!-- Anything ambiguous, deferred, or flagged per the "when unsure, ask" protocol -->
