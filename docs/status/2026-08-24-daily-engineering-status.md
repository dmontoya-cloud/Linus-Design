# Daily Engineering Status — 2026-08-24

Cadence report per `CLAUDE.md` ("Daily engineering status report"), generated on request to cover
a custom window: **2026-08-20 through 2026-08-24** (5 days ago through yesterday, relative to
today, 2026-08-25) — wider than the usual "since the last report" window (the last report,
2026-08-21, covered through 2026-08-21 itself). Assembled mechanically from GitHub (via `gh`),
git, and the local working tree — Azure DevOps is not connected yet, so every field that would
normally come from ADO is marked `data unavailable` rather than inferred. This report satisfies
no gate and grants no approval.

## 1. Portfolio snapshot

| PoD                                        | Feature (ADO)                                                                                           | Phase                                                                                                                                                              | Branch                                      | PR                                                                                      | CI                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------ |
| Ad hoc — design-system reference (WI-0002) | data unavailable — ADO not connected ([WI-0002](../work-items/WI-0002-design-system-reference-page.md)) | Merged (PR #8, 2026-08-21) is the last shipped state; substantial further work since then sits **uncommitted in the local working tree** — see Attention needed #1 | `feature/0002-design-system-reference-page` | [#8](https://github.com/dmontoya-cloud/Linus-Design/pull/8) merged 2026-08-21T04:41:40Z | 🟢 Green as of PR #8 — no runs since |

## 2. Movement, 2026-08-20 through 2026-08-24

Observed via `gh pr list`, `gh run list`, `gh api .../pulls/8/reviews`,
`gh api .../branches/.../protection`, `git log`, and `git status`/`git diff --stat` against the
current local working tree.

### On GitHub (real, shipped state)

- **PR #7** (merged 2026-08-20T07:16:49Z) and **PR #8** (merged 2026-08-21T04:41:40Z) are the only
  GitHub activity in this window — both already covered in the 2026-08-21 report. Nothing has
  been pushed, opened, or merged since PR #8. `gh run list` shows no workflow runs after
  `32447837754` (2026-08-21T04:41:42Z) — zero CI activity for the last 3+ days.
- PR #8 still shows zero recorded reviews (`gh api .../pulls/8/reviews` → `[]`), unchanged from
  the last report.

### In the local working tree (not on GitHub — this is the bulk of the actual work this window)

A substantial amount of feature work happened in local sessions after PR #8 merged, but none of
it has been committed or pushed. `git status` shows:

- **Modified:** `src/App.tsx`, `src/pages/Dashboard/ActivityCard.tsx`,
  `src/pages/Dashboard/DashboardPage.{tsx,module.css,test.tsx}`, `src/test/setup.ts`
  (+95/−181 lines per `git diff --stat`).
- **Untracked (new):** `src/pages/Assessment/` (`AssessmentIntroPage.tsx` +
  `.module.css` + `.test.tsx`) and `src/pages/DashboardNavBar.{tsx,module.css,test.tsx}`.

What this uncommitted work actually delivers, reconstructed from the working tree and this
session's own record (not from any commit message, since none exist yet):

- A real **Assessment Intro** screen at `/assessment` (previously a stub), reached only from the
  Dashboard's full check-in button or Memory & Thinking's Start button — Lifestyle/Priorities now
  route to their own separate not-yet-built placeholders instead of sharing this screen.
- The screen reads its instructions aloud via the browser's Web Speech API on load, with a
  live word-by-word text highlight (light gray → primary color) as it speaks, and a manual
  "Replay instructions" control — including a fallback estimated-timing highlight for voices that
  never fire the API's `onboundary` event at all (discovered via live user testing in Chrome,
  since not every installed voice reports word timing).
- Two speech-related Chrome-specific bugs found and fixed via iterative live testing: an
  autoplay-drop workaround (small delay before the first speak call), and a fix for calling
  `speechSynthesis.cancel()` on an idle engine (a documented Chrome bug that was silently
  breaking the next `speak()` call, worsened by React StrictMode's dev-mode double-effect).
- A new shared `DashboardNavBar` component, extracted from Dashboard's own header, now reused by
  Assessment Intro with two new optional modes: a plain-text activity name in place of the usual
  nav links, and a tertiary "Exit" link in place of the signed-in user info.
- Per this session's own local verification (not re-derived from a CI artifact, since nothing was
  pushed): `typecheck`/`lint`/`format:check` clean, 195/195 tests passing.

## 3. Attention needed

1. **Multiple sessions' worth of real feature work is sitting uncommitted in the local working
   tree, unpushed and with no PR.** This is new this window and the main risk here: none of the
   Assessment Intro screen, the voice-over feature (plus its two bug fixes), or the
   `DashboardNavBar` extraction exist anywhere except this one local checkout. If that working
   directory were lost or discarded, this work would be gone with no recovery path. Recommend
   committing and pushing at the next natural checkpoint — not mine to decide when.
2. **WI-0002's own doc is stale relative to real state, now for a sixth round.** Same finding as
   every prior report back to 2026-08-07. Last touched 2026-07-30; doesn't reflect PR #7, PR #8,
   or any of the uncommitted work described above.
3. **No branch protection exists on either candidate main-line branch**, unchanged from every
   prior report. `gh api .../branches/{main,feature/0001-repo-ci-scaffold}/protection` both still
   return `404 Not Found`.
4. **PR #7 and PR #8 both show zero recorded reviews**, unchanged from the last report — per
   CLAUDE.md rule 2, sign-off is a human act; nothing on GitHub's side captures one happening
   here, in or out of band.
5. **No PR has ever gone through G3/G4 (independent review + remediation)** — unchanged from
   every prior report. No `.claude/skills/codex-review/SKILL.md` exists; no remediation-log file
   exists anywhere in the repo.
6. **SAST / dependency (SCA) scan / secret scanning still not wired into CI** — unchanged, open
   since PoD 0.

## 4. Per-PoD detail

### Ad hoc — Design-system reference + onboarding/dashboard/assessment extension (WI-0002)

- **Human Lead:** David
- **Gates:** G1 — informal, extended informally through conversational requests across multiple
  sessions this window. G2 — no GitHub review recorded on PR #7 or #8 (Attention needed #4), and
  the uncommitted work has no PR at all yet to review. G3/G4 — not run (Attention needed #5). G5
  (coverage) — this session's own local run reports 195/195 tests passing on the current working
  tree state, not independently re-verified from a CI artifact (nothing has been pushed since PR
  #8). G6 — CI green as of PR #8's merge (`32447837754`); no runs since, so nothing to report for
  the uncommitted work. G7 — WI-0002's doc not updated (Attention needed #2).
- **Acceptance criteria:** per the doc's last edit (2026-07-30), 6 of 9 checked off, predating
  everything in this window entirely.

## 5. Cross-PoD risks & metrics

- **0 PRs opened or merged in this window** (2026-08-20 through 2026-08-24) — a change from every
  prior report, each of which had at least one merged PR. This is not because less work happened;
  per the working-tree evidence above, meaningful feature work did happen, it just hasn't been
  committed yet.
- **0 CI runs in this window** — a direct consequence of the above; nothing has been pushed to
  exercise CI since PR #8's merge on 2026-08-21.
- **Cumulative pattern across all reports to date: 5 merged PRs (#4–#8), zero recorded reviews,
  zero independent (G3/G4) passes** — unchanged, still the repo's consistent operating pattern.
- Draft risk call for you to confirm or correct: _"This window's real risk isn't code quality —
  the working tree's own tests are clean (195/195) — it's that a meaningful chunk of work
  (a new Assessment Intro screen with a voice-over feature, two hard-won Chrome-specific bug
  fixes, and a shared nav-bar component) exists in exactly one place: this local checkout,
  uncommitted. Before anything else happens on this branch, that work should get committed and
  pushed — otherwise it's one lost or corrupted working directory away from having to be redone
  from scratch. Everything else (no branch protection, no recorded reviews, WI-0002 drift) is the
  same standing gap as every report since 2026-08-07."_

## 6. Appendix — sourcing

| Field                           | Source                                                                                               | Command / call                                                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| PR list                         | GitHub API                                                                                           | `gh pr list --state all --limit 15 --json number,title,url,state,mergedAt,createdAt,headRefName,baseRefName` |
| PR #8 reviews                   | GitHub API                                                                                           | `gh api repos/dmontoya-cloud/Linus-Design/pulls/8/reviews` (`[]`)                                            |
| Branch protection               | GitHub API                                                                                           | `gh api repos/.../branches/{main,feature/0001-repo-ci-scaffold}/protection` (both 404)                       |
| CI runs                         | GitHub Actions                                                                                       | `gh run list --limit 10 --json databaseId,status,conclusion,createdAt,headBranch,event,displayTitle`         |
| Issues                          | GitHub API                                                                                           | `gh issue list --state all` (empty)                                                                          |
| Local commit history            | git                                                                                                  | `git log --since="2026-08-20 00:00:00" --format='%h\|%ad\|%an\|%s' --date=format:'%Y-%m-%d %H:%M'`           |
| Uncommitted working-tree state  | git                                                                                                  | `git status --short`, `git diff --stat`, `find src/pages/Assessment -type f`                                 |
| Gate/sign-off state per PoD     | repo files                                                                                           | `docs/work-items/WI-0002-design-system-reference-page.md`, last touched 2026-07-30 per `git log`             |
| Test/typecheck/lint/format      | this session's own local commands (direct observation, not from a CI artifact — nothing pushed)      | `npm run typecheck`, `npm run lint`, `npm run format:check`, `npx vitest run`                                |
| Uncommitted feature description | this session's own conversation record (the work was done across several local sessions this window) | N/A — reconstructed from the working tree's actual file contents, not a commit message                       |
| Azure DevOps fields             | data unavailable — no ADO connection                                                                 | —                                                                                                            |

No field in this report was inferred or assumed; anything not directly observed is marked
`data unavailable` above. The description of the uncommitted feature work is sourced from direct
inspection of the working tree's file contents plus this session's own record of the changes —
flagged as such rather than presented with the same evidentiary weight as the git/GitHub-sourced
sections above it, since no commit message or PR description exists yet to independently confirm
scope.
