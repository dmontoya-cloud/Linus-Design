# Daily Engineering Status — 2026-08-07

Cadence report per `CLAUDE.md` ("Daily engineering status report"). Assembled mechanically from
GitHub (via `gh`), git, and the in-repo work-item log (`docs/work-items/`) — Azure DevOps is not
connected yet, so every field that would normally come from ADO is marked `data unavailable`
rather than inferred. This report satisfies no gate and grants no approval.

## 1. Portfolio snapshot

| PoD                                             | Feature (ADO)                                                                                           | Phase                                                                                  | Branch                                                          | PR                                                                                                                                                                                   | CI                                                   |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| PoD 0 — repo & CI scaffold                      | data unavailable — ADO not connected ([WI-0001](../work-items/WI-0001-repo-ci-scaffold.md))             | Merged (Phase 6 complete per GitHub; **doc says otherwise — see Attention needed #1**) | `feature/0001-repo-ci-scaffold` (GitHub default branch)         | [#3](https://github.com/dmontoya-cloud/Linus-Design/pull/3) merged 2026-07-30T22:32:26Z, and [#2](https://github.com/dmontoya-cloud/Linus-Design/pull/2) merged 2026-07-30T21:42:57Z | 🟢 Green — last run `30587497119`, 2026-07-30T22:32Z |
| Ad hoc — design-system reference                | data unavailable — ADO not connected ([WI-0002](../work-items/WI-0002-design-system-reference-page.md)) | Merged (Phase 6 complete per GitHub; **doc says otherwise — see Attention needed #1**) | `feature/0002-design-system-reference-page`                     | [#1](https://github.com/dmontoya-cloud/Linus-Design/pull/1) merged 2026-07-30T21:37:23Z                                                                                              | 🟢 Green (rolled up into #3 above)                   |
| **Untracked** — current session's local changes | data unavailable — no work item exists for this work                                                    | Build (Phase 2) — **uncommitted, no PR, no CI run**                                    | `feature/0002-design-system-reference-page` (working tree only) | None                                                                                                                                                                                 | ⚪ Not run — nothing pushed                          |

## 2. Movement since last report (2026-07-30)

Observed via `gh pr list`, `gh run list`, `gh api .../branches/.../protection`, and `git log` —
no report was generated between 2026-07-30 and today, so this section covers that full gap.

- **PR #1** (WI-0002, `feature/0002-design-system-reference-page` → `main`) merged
  2026-07-30T21:37:23Z.
- **PR #2** (`main` → `feature/0001-repo-ci-scaffold`) merged 2026-07-30T21:42:57Z.
- **PR #3** (`feature/0002-design-system-reference-page` → `feature/0001-repo-ci-scaffold`) merged
  2026-07-30T22:32:26Z.
- CI went from red (`30462965122`, 2026-07-29, the lockfile/`npm ci` failure logged in the last
  report) to green by the final push of that day (`30587497119`, 2026-07-30T22:32Z) — the lockfile
  fix flagged in the last report was applied and verified.
- **Zero GitHub activity since 2026-07-30T22:32Z** — no new commits pushed, no new PRs, no new CI
  runs in the 8 days since, despite a large amount of local work (below).
- **Uncommitted local work has piled up with no PR and no work item**: the current working tree
  (still on `feature/0002-design-system-reference-page`, 0 commits ahead/behind its own remote —
  i.e. every change below is unstaged/untracked, not even committed locally) contains, per
  `git status --porcelain`, 19 modified tracked files and 28 new untracked paths, including at
  minimum these distinct feature-shaped changes with no corresponding work item:
  - An IBM Plex Serif accent added to `headline-1`/`headline-2`/`headline-3` only, threaded through
    `src/tokens/typography.ts`, `theme.ts` (a real gap fixed: per-style `fontFamily` had no CSS
    variable at all before this), `docs/design.md`, `docs/design.html`, and the four HTML entry
    points' Google Fonts links.
  - Login screen changes: renamed heading to "Welcome back", added a "Sign in to Linus" subtitle,
    removed the "Get a magic link" sub-heading, logo pinned to the top of the panel with the rest
    vertically centered, and a global "Back to start" corner link on every screen.
  - Onboarding's single "Full name" field split into separate First/Last name fields (a `Profile`
    type change: `name: string` → `firstName`/`lastName`), with three test files updated to match.
  - A new interstitial screen (`/verify-account`, `VerifyAccountPage`) inserted between login and
    onboarding — a 3-second animated "Verifying your account" spinner that now owns the
    `isAuthenticated` flip, which both `LoginPage` and `VerifyEmailPage` used to set directly.
  - A new `/dashboard` screen (`DashboardPage`) — nav bar with logo, centered Assessment/History/
    Settings links, and user info — now the real destination after Consent (previously `/assessment`).
  - Two accompanying test-suite fixes: `App.test.tsx` had already drifted out of sync with the
    Login/Onboarding renames above and was failing before today's session touched it; that's now
    fixed alongside the new coverage.
  - All of the above pass locally: `tsc --noEmit` (one pre-existing, unrelated `VerifyEmailPage.test.tsx`
    type error persists — see Attention needed #4), `eslint --max-warnings 0`, `prettier --check`,
    and `vitest run` (84/84 tests passing).

## 3. Attention needed

1. **Both work-item docs are stale relative to real GitHub state.** WI-0001 says "In progress —
   pushed to GitHub, CI red... PR not yet opened"; WI-0002 says "Built and locally verified; not
   yet pushed/PR'd." GitHub shows both fully merged (PRs #1 and #3, CI green) as of
   2026-07-30T22:32Z. Recommend updating both files' Status fields and G6/G7 sections to match
   reality, or confirming they should stay as historical snapshots — your call, not mine to guess.
2. **No branch protection exists on either candidate main-line branch.** `gh api .../branches/main/protection`
   and the same call against `feature/0001-repo-ci-scaffold` (GitHub's actual default branch) both
   return `404 Not Found` — protection was never turned on. Combined with #3 below, nothing has
   technically enforced the "merge-blocked pending human approval" model this repo is supposed to
   run under.
3. **All 3 merged PRs show zero recorded reviews** (`gh api .../pulls/{n}/reviews` returns `[]` for
   #1, #2, and #3). Per CLAUDE.md rule 2, sign-off and merge approval are human acts I cannot give —
   but nothing on GitHub's side captured that a human act happened here either. If review did
   happen out-of-band (in chat, verbally), it isn't in the audit trail this report reads from.
4. **A large body of uncommitted local work has no work item, no PoD assignment, and no commit.**
   See section 2 for the full list (font-family plumbing fix, Login/Onboarding/VerifyAccount/
   Dashboard screens). This is real, tested, working code sitting only in the working tree — it
   has not been through G1 (requirements sign-off), let alone G3/G4/G6/G7. Needs a decision: fold
   into WI-0002's scope, open one or more new work items, or something else — not mine to assign.
   One pre-existing, unrelated typecheck error also surfaced during this work and was left
   unfixed (flagged, not silently patched): `src/pages/VerifyEmail/VerifyEmailPage.test.tsx:30` —
   `string | undefined` not assignable to `string`.
5. **SAST / dependency (SCA) scan / secret scanning still not wired into CI** — open since PoD 0
   (`.github/workflows/ci.yml`'s own trailing comment still lists this as not yet wired), no
   tooling decision made (CodeQL vs. npm audit gate vs. gitleaks, etc.).
6. **No PR has ever gone through G3/G4 (independent review + remediation)** — the `codex-review`
   skill exists only as a placeholder (per its own file header) and has not been invoked for any
   of the 3 merged PRs. No remediation-log file exists yet under any path searched.

## 4. Per-PoD detail

### PoD 0 — Repo & CI scaffold (WI-0001)

- **Human Lead:** David
- **Gates:** G1 ✅ signed off 2026-07-28 (recorded in WI-0001). G2 — no GitHub review recorded
  (Attention needed #3). G3/G4 — not run (Attention needed #6). G5 (coverage) — enforced in CI
  (`npm run test:coverage`, 80% gate) and green on the last run; no coverage artifact was
  downloaded to verify the actual percentage for this report. G6 — CI green as of
  `30587497119` (2026-07-30T22:32Z). G7 — doc says "pending"; not re-verified.
- **Acceptance criteria:** 8 of 10 checked off in WI-0001 as of its last edit. 2 open:
  SAST/SCA/secret-scan wiring, preview deploy — both still absent from `.github/workflows/ci.yml`.

### Ad hoc — Design-system reference page (WI-0002)

- **Human Lead:** David
- **Gates:** G1 — informal, per the work item ("David directed this work conversationally").
  G2 — no GitHub review recorded. G3/G4 — not run. G6 — CI green (rolled into PR #3). G7 — the
  work item itself is the documentation; not re-reviewed since merge.
- **Acceptance criteria:** 6 of 9 checked off. 3 open: real hex values for the ~52-swatch core
  palette (Figma-blocked), a real Figma-sourced typography scale, and closing the gap between the
  documented button system and the implemented `Atom/Button` component.
- **Note:** today's uncommitted IBM Plex Serif change (section 2) extends this same typography
  surface but is not reflected in this work item.

### Untracked — current session's uncommitted work

- **Human Lead:** David (this session)
- **Gates:** None run. No work item exists, so there is nothing to check G1 against.
- **State:** Builds, lints, typechecks (bar the one pre-existing unrelated error), and passes
  84/84 tests locally. Not committed, not pushed, no PR.

## 5. Cross-PoD risks & metrics

- **2 of 2 tracked PoDs** are merged with green CI; **0 of 2** has a recorded GitHub review;
  **0 of 2**'s work-item doc matches its real merged state.
- **1 body of untracked work** (today's session) is sitting locally with no PoD, no work item, and
  no commit — the largest single risk in this report, simply because it's invisible to any process
  artifact except this one.
- Draft risk call for you to confirm or correct: _"Process-wise, this repo has now merged three PRs
  with zero recorded human review and no branch protection enforcing that step — the model's G2/G6
  gates are procedurally unverified even though the code itself is green. Separately, a full
  session's worth of new screens and a token-system fix have accumulated uncommitted with no work
  item. Before anything else ships, the highest-leverage next steps are: (1) turn on branch
  protection on the real default branch, (2) decide whether today's uncommitted work gets its own
  work item or folds into an existing one, and (3) commit and push it under that decision."_

## 6. Appendix — sourcing

| Field                       | Source                               | Command / call                                                                           |
| --------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| Default branch              | GitHub API                           | `gh repo view --json defaultBranchRef`                                                   |
| PR list + details           | GitHub API                           | `gh pr list --state all`, `gh pr view {1,2,3} --json ...`                                |
| PR reviews                  | GitHub API                           | `gh api repos/.../pulls/{1,2,3}/reviews`                                                 |
| Branch protection           | GitHub API                           | `gh api repos/.../branches/{main,feature/0001-repo-ci-scaffold}/protection` (both 404)   |
| CI runs                     | GitHub Actions                       | `gh run list --limit 10`                                                                 |
| Issues                      | GitHub API                           | `gh issue list --state all` (empty)                                                      |
| Local commit/branch state   | git                                  | `git status --porcelain`, `git log --oneline`, `git rev-list --left-right --count`       |
| Uncommitted-work inventory  | git + direct file read               | `git diff --stat`, `git status --porcelain`, reading the changed files themselves        |
| CI workflow definition      | repo file                            | `.github/workflows/ci.yml`                                                               |
| Gate/sign-off state per PoD | repo files                           | `docs/work-items/WI-0001-repo-ci-scaffold.md`, `WI-0002-design-system-reference-page.md` |
| Remediation log             | repo search                          | `find` for any remediation-log path — none exists                                        |
| Azure DevOps fields         | data unavailable — no ADO connection | —                                                                                        |

No field in this report was inferred or assumed; anything not directly observed is marked
`data unavailable` above rather than guessed.
