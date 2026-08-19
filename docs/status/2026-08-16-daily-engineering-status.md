# Daily Engineering Status — 2026-08-16

Cadence report per `CLAUDE.md` ("Daily engineering status report"). Assembled mechanically from
GitHub (via `gh`), git, and the in-repo work-item log (`docs/work-items/`) — Azure DevOps is not
connected yet, so every field that would normally come from ADO is marked `data unavailable`
rather than inferred. This report satisfies no gate and grants no approval.

**Note on dates:** all commit/PR/CI timestamps below are UTC (GitHub's native format). The work
itself ran as one continuous local session on 2026-08-16 (David's local time); the final ~15
minutes of activity (PR #5, the Vercel deploy troubleshooting, and the two new Figma files) crossed
midnight UTC into 2026-08-17T03:07–05:20Z. This report covers that whole session under its local
start date. Nothing in this report was inferred — anything not directly observed is marked
`data unavailable`.

## 1. Portfolio snapshot

| PoD                                                        | Feature (ADO)                                                                                           | Phase                                                                                                       | Branch                                      | PR                                                                                      | CI                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------- |
| Ad hoc — design-system reference (WI-0002)                 | data unavailable — ADO not connected ([WI-0002](../work-items/WI-0002-design-system-reference-page.md)) | Merged (Phase 6 complete per GitHub; **WI-0002's own doc is stale — see Attention needed #1**)              | `feature/0002-design-system-reference-page` | [#4](https://github.com/dmontoya-cloud/Linus-Design/pull/4) merged 2026-08-17T03:19:49Z | 🟢 Green — last run `31990809766` |
| Ad hoc follow-up — dashboard hero card + fixes             | data unavailable — no work item exists for this slice                                                   | Merged                                                                                                      | `feature/0002-design-system-reference-page` | [#5](https://github.com/dmontoya-cloud/Linus-Design/pull/5) merged 2026-08-17T05:19:50Z | 🟢 Green — last run `31997522543` |
| Untracked — Vercel deployment setup                        | data unavailable — no work item; infra/deploy configuration, not app code                               | Ongoing — project reconnected to the correct repo late in the session; result not yet confirmed by David    | N/A (Vercel project settings, not a branch) | N/A                                                                                     | N/A                               |
| Untracked — Figma file rebuild (Design System + Prototype) | data unavailable — no work item; design-asset work, not committed to this repo                          | Design System file complete (Phases 0–3); Prototype file's 11 screens complete; Phase 4 QA pass not yet run | N/A (Figma files, not a git branch)         | N/A                                                                                     | N/A                               |

## 2. Movement since last report (2026-08-07)

Observed via `gh pr list`, `gh run list`, `gh api .../branches/.../protection`, and `git log` — no
report was generated between 2026-08-07 and today, so this section covers that full 9-day gap, plus
the entire 2026-08-16 session in detail.

- **Zero GitHub activity between 2026-08-07 and 2026-08-16.** The next CI run after `30587497119`
  (2026-07-30T22:32Z, last report's cutoff) is `31990127267` at 2026-08-17T03:07:36Z — a real
  9-day gap with no pushes, no PRs, no CI runs.
- **PR #4** (`feature/0002-design-system-reference-page` → `feature/0001-repo-ci-scaffold`, the
  repo's actual default branch): 3 commits, +22,361/−794 across 150 files, merged
  2026-08-17T03:19:49Z. Delivered the full pre-registration legal flow (Legal Intro, Terms of Use,
  Privacy Policy, Consent, Setting Up spinner) and a two-step Registration (name/DOB, then
  Gender & Identity), plus new design-system atoms (Modal, Checkbox, Field, Select, LanguageToggle,
  ProgressBar, Logo), new tokens (alpha, elevation, motion, radius, a new `headline-5` typography
  tier), and `docs/design.md`/`docs/design.html` as the reference this work is built against. Per
  the PR's own test-plan checklist: `typecheck`/`lint`/`format:check` pass, 126 tests passing
  (including a full Login→Dashboard happy-path E2E), `build`/`build-storybook` succeed, coverage
  97.55% against an 80% gate.
- **CI went red before PR #4, twice, same day**: run `31990303519` (2026-08-17T03:10:41Z, the PR's
  own check) and `31990127267` (2026-08-17T03:07:36Z, a direct push) both failed on the Prettier
  format-check step. Fixed by `style: apply Prettier formatting to fix CI format check WI-0002`
  (commit `784d9b9`), verified green on the next run (`31990625866`/`31990627976`), then merged.
- **PR #5** (same branch pair): 3 commits, +160/−23 across 9 files, merged 2026-08-17T05:19:50Z.
  Added the Dashboard's full-width "Your full check-in" hero card (dark card, category progress
  bars, CTA), restyled the Consent page's legal-text box to match Terms/Privacy's card styling and
  height, and removed the logo from the Verify Account / Setting Up spinner interstitials
  (tightening their entrance-animation cascade from three beats to two). CI green throughout
  (`31997438087`, `31997511197`, `31997522543`).
- **Vercel deployment — a multi-step troubleshooting session, not yet confirmed working.** David
  wanted a public URL to share with a client. The session surfaced and resolved, in order: (1) a
  `vercel.json` was added for SPA rewrites on `/web/*`, `/ios/*`, `/android/*` since Vercel's static
  hosting has no knowledge of React Router's client-side routes; (2) the first Vercel project
  connected to the wrong repo (`feature/0001-repo-ci-scaffold`, the actual GitHub default branch,
  which predates all of this session's work) rather than the PR branch; (3) that same project's
  **Production Branch** setting pointed at a stale `main` branch (13 commits behind, last touched
  2026-07-30) instead of the real default branch — Vercel kept rebuilding a weeks-old snapshot;
  (4) a second, separate GitHub repo, `linus-design-public`, was created by David as a workaround for
  a Vercel project-name validation error, and got connected to Vercel instead of the real
  `Linus-Design` repo — confirmed via the Figma... via the Vercel GitHub App's own error
  ("provided GitHub repository can't be found") and by inspecting the live deployed page's CSS,
  which used variable names (`--color-brand-primary`, `data-brand="linus"`) that don't exist
  anywhere in this codebase's actual token system. David deleted `linus-design-public` and created a
  fresh Vercel project via the correct **Import Git Repository** flow (not the "clone from URL"
  flow that had created the duplicate repo the first time) against the real `Linus-Design` repo.
  **As of this report, the new project's first real deployment had not yet been confirmed working by
  David** — this is the top item in Attention needed below.
- **Two new Figma files were created and built out** (`x127h1tzqfrBqDVsuQ2CH3` "Linus Health — Design
  System" and `uajF7CIU6kCyd2epbvlNNl` "Linus Health — Prototype"), replacing two prior files David
  deleted after finding their contents didn't match this session's actual work. The Design System
  file now has 20 pages (Cover, Foundations, 18 component pages covering all 16 documented component
  groups from `docs/design.md` plus Icons split as its own page) — every fill/padding/radius/text
  style bound to real Figma variables, none hardcoded. Two known gaps, both flagged in the file
  itself rather than silently glossed over: (a) only 1 of 8 documented icons (`envelope-simple`) has
  a verified real SVG path — the other 7 are labeled placeholders rather than approximated, since
  design.md requires "real SVG, not redrawn"; (b) Badge's "Encouraging" variant follows design.md's
  YAML spec (green) rather than its prose (which says teal) — a pre-existing inconsistency in the
  doc itself, not introduced by this work. The Prototype file has all 11 real funnel screens (Login
  through Dashboard) built from locally-mirrored tokens and locally-rebuilt shared components (cross-
  file variable/component linking isn't possible without David manually publishing the Design System
  file as a team library, which hasn't happened). Two build-process bugs were hit and fixed
  in-session: a repeated Figma Plugin API gotcha where `resize()` called before setting
  `layoutSizingVertical` silently locks a frame's height at 1px (hit 3 times, each caught via
  structural validation and fixed with a targeted repair rather than a rebuild), and one instance of
  a guessed-rather-than-looked-up component ID that would have referenced the wrong node.

## 3. Attention needed

1. **Vercel deployment not yet confirmed working.** The new project (connected to the correct
   `Linus-Design` repo via the correct Import flow) had not had its first deployment verified by
   David as of this report. Needs: David to check the Deployments tab and confirm the live URL
   actually reflects current code, and to report back the working URL.
2. **WI-0002's own doc is stale relative to real GitHub state**, same finding as the 2026-08-07
   report but now compounded — the doc still describes the design-system reference page as its own
   scope, and doesn't reflect the pre-registration flow, Registration rework, or Dashboard work that
   also merged under its branch/WI reference. Recommend either splitting these into separate work
   items retroactively or updating WI-0002 to reflect everything actually shipped under it — not
   mine to decide.
3. **No new work item was opened for the dashboard hero card / Consent-styling / spinner-logo
   slice** that shipped in PR #5 — commit messages tag `WI-0002`, but that work item's own doc
   doesn't mention it either. Same pattern as #2.
4. **No branch protection exists on either candidate main-line branch**, unchanged from the
   2026-08-07 report. `gh api .../branches/{main,feature/0001-repo-ci-scaffold}/protection` both
   still return `404 Not Found`.
5. **Both merged PRs (#4, #5) show zero recorded reviews** (`gh api .../pulls/{4,5}/reviews` returns
   `[]` for both). Same pattern as the three PRs in the last report — per CLAUDE.md rule 2, sign-off
   is a human act; nothing on GitHub's side captured one happening here, in or out of band.
6. **No PR has ever gone through G3/G4 (independent review + remediation)** — unchanged from last
   report. The `codex-review` skill is still a placeholder per its own header; no remediation-log
   file exists anywhere in the repo (only the skill template at `.claude/skills/remediation-loop.md`).
7. **SAST / dependency (SCA) scan / secret scanning still not wired into CI** — unchanged, open
   since PoD 0.
8. **A second GitHub repo (`linus-design-public`) was created and then deleted this session** as a
   side effect of troubleshooting Vercel's project-name validation. It's gone now (confirmed
   deleted by David), but flagging for the record since it briefly held a real (if stale) copy of
   this codebase under a different, publicly-visible repo name.
9. **Two Figma files were deleted and rebuilt from scratch this session** (the prior "Linus Health —
   Design System"/"Linus Health — Prototype" files, per David: "I just removed the two files").
   The new files' Phase 4 QA pass (accessibility/naming/binding audit) has not yet been run — offered
   to David, not yet confirmed either way.

## 4. Per-PoD detail

### Ad hoc — Design-system reference + pre-registration flow (WI-0002)

- **Human Lead:** David
- **Gates:** G1 — informal, per the work item ("David directed this work conversationally"),
  extended informally through this session's build. G2 — no GitHub review recorded (Attention
  needed #5). G3/G4 — not run (Attention needed #6). G5 (coverage) — enforced in CI
  (`npm run test:coverage`, 80% gate); PR #4's own test plan reports 97.55% locally, not
  independently re-verified from a downloaded CI artifact for this report. G6 — CI green as of
  `31997522543` (2026-08-17T05:19:52Z, PR #5's merge). G7 — WI-0002's doc not updated to reflect
  this session's scope (Attention needed #2).
- **Acceptance criteria:** per the doc's last edit, 6 of 9 checked off, predating this session's
  work entirely — the doc needs a full pass to reflect what's actually shipped now.

### Untracked — Vercel deployment configuration

- **Human Lead:** David (this session)
- **Gates:** None apply — infrastructure configuration, not a PoD.
- **State:** `vercel.json` added in standalone commit `c585b44` (2026-08-16T21:22 local /
  2026-08-17T03:22Z), separate from both PRs' feature commits — confirmed via
  `git log --format='%h %ad %s' -- vercel.json`. Project reconnected to the correct repo as of
  session end; first deployment under the corrected configuration not yet confirmed.

### Untracked — Figma Design System + Prototype rebuild

- **Human Lead:** David (this session)
- **Gates:** None apply — design-asset work in Figma, not tracked by this repo's git/CI.
- **State:** Design System file: Phases 0–3 complete (foundations, file structure, all 18 component
  pages) per the session's own internal phase tracking; Phase 4 (QA pass) not started. Prototype
  file: tokens mirrored, shared components built, all 11 screens built and structurally validated.
  Two real gaps disclosed above (7 of 8 icons are placeholders; Badge's "Encouraging" variant follows
  a YAML/prose inconsistency already present in `docs/design.md`).

## 5. Cross-PoD risks & metrics

- **2 of 2 PRs merged this session** with green CI; **0 of 2** has a recorded GitHub review;
  **0 of 2**'s underlying work item doc matches its real merged scope.
- **1 deployment (Vercel) is mid-flight** with its working state unconfirmed — the second time in
  this repo's history a deployment target has needed multi-step correction (wrong repo, then wrong
  branch, then a duplicate repo) before landing on the right configuration.
- **1 body of design-asset work (2 Figma files, ~30+ build operations)** exists entirely outside
  this repo's git history — real, inspected, and disclosed with its known gaps in this report, but
  invisible to every other process artifact (work items, PRs, CI) the same way last report's
  uncommitted code was.
- Draft risk call for you to confirm or correct: _"Code-wise, this was a productive session — two
  PRs merged, CI green, a full pre-registration/registration flow shipped end to end. But the
  process gaps from the last report (zero recorded reviews, no branch protection, no G3/G4 run
  anywhere) are still fully open and now apply to twice as many merged PRs. Separately, real
  engineering effort went into two areas this report can only partially audit: Vercel deployment
  (currently unconfirmed) and a from-scratch Figma rebuild (currently un-reviewed by a human).
  Before more work stacks on top: (1) confirm the Vercel URL actually works, (2) decide whether
  WI-0002 gets retroactively split or just updated to match reality, (3) turn on branch protection
  on the real default branch before the next merge."_

## 6. Appendix — sourcing

| Field                       | Source                                                                      | Command / call                                                                                                                          |
| --------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Default branch              | GitHub API                                                                  | `gh repo view --json defaultBranchRef`                                                                                                  |
| PR list + details           | GitHub API                                                                  | `gh pr view {4,5} --json number,title,url,createdAt,mergedAt,mergedBy,additions,deletions,changedFiles,commits,baseRefName,headRefName` |
| PR body / test plan         | GitHub API                                                                  | `gh pr view 4 --json body`                                                                                                              |
| PR reviews                  | GitHub API                                                                  | `gh api repos/.../pulls/{4,5}/reviews` (both `[]`)                                                                                      |
| Branch protection           | GitHub API                                                                  | `gh api repos/.../branches/{main,feature/0001-repo-ci-scaffold}/protection` (both 404)                                                  |
| CI runs                     | GitHub Actions                                                              | `gh run list --limit 15 --json databaseId,status,conclusion,createdAt,headBranch,event,displayTitle`                                    |
| Issues                      | GitHub API                                                                  | `gh issue list --state all` (empty)                                                                                                     |
| Local commit history        | git                                                                         | `git log --all --format='%h\|%ad\|%an\|%s' --date=format:'%Y-%m-%d %H:%M'`                                                              |
| Remediation log             | repo search                                                                 | `find` for any remediation-log path — only the skill template exists, no real log                                                       |
| Gate/sign-off state per PoD | repo files                                                                  | `docs/work-items/WI-0002-design-system-reference-page.md`                                                                               |
| Vercel deployment saga      | this session's own conversation (direct observation, not re-derived)        | N/A — recorded live as it happened                                                                                                      |
| Figma file state            | this session's own conversation + Figma MCP tool calls (direct observation) | `get_metadata`, `use_figma` structural validation calls made during the build                                                           |
| Azure DevOps fields         | data unavailable — no ADO connection                                        | —                                                                                                                                       |

No field in this report was inferred or assumed; anything not directly observed is marked
`data unavailable` above. The Vercel and Figma sections are sourced from this session's own direct
actions and observations (this assistant performed that work firsthand in the same continuous
session), not from an independent audit trail — flagged as such rather than presented with the same
evidentiary weight as the git/GitHub-sourced sections above it.
