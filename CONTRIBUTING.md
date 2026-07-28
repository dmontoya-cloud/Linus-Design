# Contributing

This repo follows the operating model in `PROCESS.md` and `CLAUDE.md` (the Agentic Engineering
Operating Model / PoD loop). Read those first — this file is the short version for day-to-day
work on this specific prototype.

## The loop, per PoD (unit of work)

1. **Requirements (human-led).** Claude restates the spec, flags ambiguities/risks, and does
   **not** write code until the Human Lead signs off.
2. **Build.** Claude implements on a feature branch (`feature/<work-item-id>-<slug>`), asking
   whenever a requirement is ambiguous, missing, or security/privacy-sensitive — never guessing.
3. **Human review (gate).** Merge-blocking. Sign-off or specific change requests.
4. **Independent review (gate).** See "About the independent reviewer" below.
5. **Tests.** Beyond the happy path — boundaries, invalid input, a11y regressions.
6. **PR + CI.** Opened against a feature branch, never `main`. CI must be green: lint,
   format check, typecheck, tests with the 80% coverage gate, build, Storybook build.
7. **Docs.** Drafted by Claude, reviewed and signed off by the Human Lead.
8. **Closure.** All gates signed off, CI green, work item linked and closed.

## About the independent reviewer

`PROCESS.md` specifies Codex as the independent reviewer (segregation of duties: the agent that
writes code is never the one that approves its own review). This environment doesn't have a
separate Codex/OpenAI agent wired in. Until that's connected, the stand-in is **a fresh Claude
subagent with no memory of the build, given only the diff** — same segregation-of-duties intent,
same vendor underneath. Treat findings from that review with that caveat in mind, and prefer a
real second-vendor review for anything security- or privacy-sensitive.

## About work-item tracking

`PROCESS.md` specifies Azure DevOps as the system of record. No Azure DevOps connection is set up
yet. Until it is, work items are tracked as structured markdown under `docs/work-items/`, one file
per item, using the same fields (title, severity/priority if a bug, acceptance criteria, linked
PR, disposition log) so migrating to real ADO work items later is a copy, not a rewrite.
Reference the work item's file name in commits and PR titles the same way you'd reference an
`AB#<id>`, e.g. `feat(button): add primary/secondary/danger variants WI-0001`.

## Branching & commits

- Branch: `feature/<work-item-id>-<short-slug>`
- Commit: conventional style + work item reference, e.g. `feat(export): add CSV endpoint WI-0007`
- One PoD → one feature branch → one PR. Don't mix PoDs on a branch.
- Never commit to `main`. Branch protection requires a PR, a human approving review, and green
  required CI checks.

## Local setup

```bash
npm install
npm run dev:web       # responsive web entry
npm run dev:ios       # iPhone 17 simulator
npm run dev:android   # Galaxy S26 Ultra simulator
npm run storybook     # component library
```

See `docs/PROTOTYPE_README.md` for the full run/build/re-skin instructions and the
screen ↔ Figma frame ↔ work-item map.

## Code standards (CI-enforced, see CLAUDE.md for the full list)

- TypeScript strict mode; no `any` without a written reason (ESLint errors on it).
- Prettier formatting is required, not a suggestion (`npm run format:check` gates CI).
- Every interactive component needs a keyboard-navigation test and, where practical, an
  automated axe assertion (see `src/components/atoms/Button/Button.test.tsx` for the pattern).
- No secrets, tokens, or real PHI in code, fixtures, or commits — mock data only.
