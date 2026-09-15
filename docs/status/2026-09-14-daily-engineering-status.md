# Daily Engineering Status — 2026-09-14

Cadence report per `CLAUDE.md` ("Daily engineering status report"), generated on request ("from
the last couple sessions"). Git shows this as one continuous session, not several: seven commits,
all authored 2026-09-13 between 19:32:57 and 19:40:02 local time (00:32–00:40 UTC on 2026-09-14,
which is why `git log`'s UTC view and the user's own clock can disagree by a few hours) — reported
as what was actually found rather than assumed from the request's own phrasing. Assembled
mechanically from GitHub (via `gh`), git, and the local working tree, plus this reporting
session's own transcript for the one thing git/GitHub can't see (Figma touchpoints — there were
none this window, confirmed directly, not inferred) — Azure DevOps is not connected, so every
field that would normally come from ADO is marked `data unavailable`. This report satisfies no
gate and grants no approval.

## 1. Portfolio snapshot

| PoD                                        | Feature (ADO)                                                                                           | Phase                                                                                         | Branch                                      | PR                                                                                                          | CI                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Ad hoc — design-system reference (WI-0002) | data unavailable — ADO not connected ([WI-0002](../work-items/WI-0002-design-system-reference-page.md)) | One session merged since the last report. Working tree is clean (`git status --short` empty). | `feature/0002-design-system-reference-page` | [#22](https://github.com/dmontoya-cloud/Linus-Design/pull/22) — merged into `feature/0001-repo-ci-scaffold` | 🟡 One red run (a real formatting miss, fixed forward same session) then green on every run since (see §2) |

## 2. Movement since the last report (2026-09-11)

Observed via `git log`, `git show --stat`, `git status`, `gh pr list`, `gh api .../pulls/22/reviews`,
`gh api .../branches/{main,feature/0001-repo-ci-scaffold}/protection`, `gh run list`,
`gh run view --json jobs` (+ `--log` for the failing step), `gh api .../commits/{sha}/status`
(Vercel), `git branch -a`, and a local `npx vitest run` — plus this reporting session's own
transcript, which carries the full record of the session below.

### Session G — `cbb7712` .. `dc44c8e` (7 commits), 2026-09-13 (PR #22, merged 2026-09-14T00:42:04Z UTC)

Seven commits, one push, one PR, +290/−115 across 14 files (net, per GitHub's own PR diff — the
status-report commit and its own formatting fix both touch the same file, so the per-commit sum
double-counts that one file; the PR number above is the real net):

- **`cbb7712` — Login copy.** Heading now reads "Welcome, let's get started!" (was "Welcome");
  subhead drops the redundant "Get started by" lead-in. Non-breaking spaces inside "let's get
  started!" mean the heading can only ever wrap right after the comma, on any screen width, not
  wherever the browser happens to break the line.
- **`b77710a` — Gender & Identity.** Removed the "How do you identify?" section heading and its
  static explanatory note; the Gender select now carries its own "(Optional)" marker directly in
  its label instead, with a plain "Choose one" placeholder (was "Choose one - Optional").
- **`6449ca5` — duration estimates.** Memory & Thinking now reads "About 7 minutes" (was "About
  7–10 minutes"); Personal Priorities reads "About 8 minutes" (was "About 7 minutes") — updated
  everywhere both appear (Dashboard 1, Dashboard 2's `activitiesV2.ts`, Report Ready,
  Memory & Thinking Details).
- **`9328291` — Dashboard 2 button alignment.** The completed-state "Details"/"Restart" buttons
  on `ActivityCardV2` are now left-aligned, matching "Start" — dropping the right-aligned
  treatment those two carried over from Figma's own mock.
- **`0c15cf0` — report re-download.** `ReportCTACard` ("Ready to create your report?") no longer
  disappears just because a report was already built while activities remain incomplete; it now
  switches to "Download your current report" / "Download my report" (straight to `/report`,
  skipping the build animation) instead of hiding. "View report" itself stays exclusive to
  `FullCheckInCardV2`'s own all-three-done state, on request — never shown on this card.
- **`615b5d8` — committed the 2026-09-11 daily status report.**
- **`dc44c8e` — fixed the Prettier formatting that report itself hadn't been checked against**
  (see below).

**One CI failure this window, caught and fixed forward the same session** — a real formatting
miss, not a flake: the initial push (`615b5d8`) failed the **Format check (Prettier)** step
(confirmed via `gh run view --json jobs` then `--log` on that step) — `prettier --check .` (what
`npm run format:check` actually runs, over the _whole_ repo) flagged
`docs/status/2026-09-11-daily-engineering-status.md`, a markdown table written directly rather
than edited with an existing formatter-clean file as a base. Vercel's own deployment for that same
commit still **succeeded** (`gh api .../commits/615b5d8.../status` → Vercel `success`) — Vercel's
build doesn't run Prettier, so this is a real case of CI and Vercel checking different things, not
a contradiction. Local verification before this push had run `npx prettier --check` only on the
individually-touched source files each time a change was made, never a full-repo
`npm run format:check` before the final push — the fix (`dc44c8e`) ran that whole-repo command,
confirmed it was the only offender, and both the push and `pull_request` runs on the fixed head
came back green, same for the PR #22 merge-commit run on `feature/0001-repo-ci-scaffold`.

### On GitHub

- Reached GitHub the same way every prior session has: a PR from
  `feature/0002-design-system-reference-page` into `feature/0001-repo-ci-scaffold`, auto-created
  shortly after the first push (`2026-09-14T00:36:34Z`) and merged once CI went green on the
  latest head (`2026-09-14T00:42:04Z`) — about 5.5 minutes open, waiting for the fix rather than
  merging a red head, the same pattern PR #20 already established.
- **Zero recorded reviews on PR #22** (`gh api .../pulls/22/reviews` → `[]`), author and merger
  both `dmontoya-cloud` — continuing the pattern already established for #4–#21.
- **22 merged PRs total to date (#1–#22)**, all merged, none showing a recorded review.

### In the local working tree

- **Clean.** `git status --short` returns nothing.
- **Local `npx vitest run`: 259/259 passing across 45 files** — down one test from the 2026-09-11
  baseline (260/260, 45 files), and that's expected, not a regression: `b77710a` deleted the
  Gender & Identity note along with the one test asserting it always showed, and didn't add a
  replacement test in its place since there's no longer a note to assert on.

### Figma touchpoints this session

None. Checked directly against this reporting session's own transcript (a continuation of the
session that did the work, same as the 2026-09-11 report's own visibility window) rather than
inferred from git/GitHub, which can't see Figma activity either way — every change this session
was a pure code/copy edit with no Figma consultation.

## 3. Attention needed

1. **`docs/design.md`'s "Device Setup" documentation still describes a screen that no longer
   exists** — unchanged since first flagged 2026-09-11. Its Icons/Modal/Spinner sections still
   describe the archived voice-over implementation's test-sound player, Troubleshooting modal,
   and illustrated permission mockup, none of which exist in the `DeviceSetupPage` that actually
   shipped. Not touched this session either — three sessions running now without this being
   corrected.
2. **`archive/memory-thinking-device-setup-voiceover` is still local-only.** Unchanged since first
   flagged 2026-09-02.
3. **WI-0002's own work-item doc is stale relative to real state, and the gap widened again.**
   Last content edit 2026-07-30; still 6 of 9 acceptance criteria checked. Login copy, the
   Gender & Identity simplification, both duration corrections, the Dashboard 2 alignment fix, and
   the report re-download feature all landed this session with nothing recorded against this doc.
4. **`docs/design.md`'s Icon section Calendar reference is still stale**, unchanged since first
   flagged 2026-09-02.
5. **22 merged PRs to date (#1–#22), zero recorded reviews on any of them.** Per `CLAUDE.md` rule
   2, sign-off is a human act — nothing on GitHub's side captures one having happened.
6. **No branch protection exists on `main` or `feature/0001-repo-ci-scaffold`** — both still 404
   Not Found as of this report, unchanged.
7. **No PR has ever gone through G3/G4 (independent review + remediation).** No remediation-log
   file exists anywhere in the repo (confirmed via fresh search this cycle).
8. **SAST / dependency (SCA) scan / secret scanning still not wired into CI** — confirmed via
   `.github/workflows/ci.yml`'s own trailing comment. Unchanged, open since PoD 0.
9. **WI-0001's own work-item doc is also stale** — last content edit 2026-08-16, still describes
   status as "In progress — pushed to GitHub, CI red, PR not yet opened," while
   `feature/0001-repo-ci-scaffold` has now been the merge target for all 22 PRs. Unchanged since
   first flagged 2026-09-09.
10. **NEW this cycle — refined process lesson: a per-file format check isn't the same guarantee as
    the repo-wide one CI actually runs.** `npx prettier --check` on individually-touched files
    passed every time this session, but `npm run format:check` (`prettier --check .`, what CI
    runs) still caught a file that check never covered — a markdown status report written
    directly rather than edited from a formatter-clean base. This is a narrower version of the
    2026-09-10 report's "use the project's own npm scripts, not an equivalent-looking substitute"
    lesson: this time the _right_ script was used, just scoped to fewer files than CI checks. The
    fix session already adopted the corrected habit (ran the whole-repo command before the
    corrective push); flagged here so it's a recorded practice change, not just a one-off
    recovery.
11. **One CI failure this window, a real formatting miss (not a flake), caught and fixed forward
    the same session** — not an open item, noted for completeness: the process worked (fix
    forward, not a bypassed check), and the gap that let it through is now item #10 above rather
    than left unrecorded.

## 4. Per-PoD detail

### Ad hoc — Design-system reference + onboarding/dashboard/assessment extension (WI-0002)

- **Human Lead:** David
- **Gates:** G1 — informal, unchanged (no written, human-signed acceptance-criteria doc for this
  session either). G2 — no recorded review on PR #22 (Attention needed #5). G3/G4 — not run
  (Attention needed #7). G5 (coverage) — local `vitest run`: 259/259 across 45 files, down one
  test from the 2026-09-11 baseline for the reason given in §2 (a removed feature's test removed
  with it, not a regression). G6 — CI red once on `615b5d8` (Format check, a real formatting
  miss), fixed forward same session via `dc44c8e`, green on every run since including the merge
  commit; Vercel deployment succeeded on every commit this window, including the one CI run that
  failed. G7 — WI-0002's doc still not updated (Attention needed #3); `docs/design.md` was not
  touched at all this session, so both its Device Setup mismatch (Attention needed #1) and its
  Calendar staleness (Attention needed #4) carry forward unchanged.
- **Acceptance criteria:** per the doc's last content edit (2026-07-30), still 6 of 9 checked off
  — unchanged this session, against an even larger real-state gap.

## 5. Cross-PoD risks & metrics

- **1 PR opened and merged this window** (#22) — same auto-create/wait-for-green pattern as PR
  #20: the first push was red, the fix push was green, and the PR waited for the fix before
  merging rather than merging a broken head.
- **4 CI runs this window**: 2 failures (push + pull_request on `615b5d8`, same root cause), 2
  successes (push + pull_request on `dc44c8e`), plus 1 more success for the PR #22 merge-commit
  run on `feature/0001-repo-ci-scaffold` — 5 runs total, 2 failures.
- **0 Vercel deployment failures this window** — notably including the commit where GitHub
  Actions CI failed; Vercel's own build doesn't run Prettier, so a CI-only formatting failure
  didn't block that deployment.
- **Test suite shrank by exactly one test and stayed green**: 260→259 passing, 45 files unchanged
  — a deliberate removal alongside a deleted feature, not a coverage gap (see §2).
- **Cumulative pattern across all reports to date continues unchanged**: 22 merged PRs (#1–#22)
  now, zero recorded reviews confirmed on any PR checked to date, zero independent (G3/G4) passes
  ever run.
- **No Figma work this window** — confirmed directly from this reporting session's own transcript
  (§2), not inferred. Every prior report's "Figma work happened somewhere, no way to see it"
  structural gap doesn't apply here simply because there was nothing to miss this time; it will
  still apply to the next report unless a real system of record gets built.
- Draft risk call for you to confirm or correct: _"This session shipped and is fully merged and
  green — the one CI failure was a real formatting miss on a file this session generated directly,
  not a flake, and it was caught and fixed in the same session rather than slipping through. The
  local-verification gap that let it through (checking touched files individually instead of the
  whole repo, the way CI does) has already been corrected going forward. Nothing here blocks
  shipping today. The structural gaps are the same ones prior reports have flagged and are not
  shrinking: 22 PRs in, still zero recorded reviews and zero independent gate passes, three
  work-item-adjacent docs (WI-0001, WI-0002, design.md's Device Setup section and its separate
  Calendar staleness) are stale relative to real state, and design.md's Device Setup mismatch in
  particular has now gone three sessions uncorrected since it was first flagged."_

## 6. Appendix — sourcing

| Field                                  | Source                                                  | Command / call                                                                                                                                          |
| -------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Commit identification                  | git                                                     | `git log -15 --oneline`, `git log -1 --format="%ai"` per commit — 7 commits, all 2026-09-13 19:32–19:40 local time                                      |
| Session diff                           | git                                                     | `git show --stat` for each of the 7 commits                                                                                                             |
| Working-tree state                     | git                                                     | `git status --short` — empty (clean) as of this report                                                                                                  |
| PR list / detail                       | GitHub API                                              | `gh pr list --state all --limit 25`, `gh pr view 22 --json ...` — PR #22, merged, +290/−115 (net), 14 files                                             |
| PR #22 reviews                         | GitHub API                                              | `gh api repos/dmontoya-cloud/Linus-Design/pulls/22/reviews` → `[]`                                                                                      |
| PR #22 author/merger                   | GitHub API                                              | `gh pr view 22 --json mergedBy,author` → both `dmontoya-cloud`                                                                                          |
| Branch protection                      | GitHub API                                              | `gh api repos/.../branches/{main,feature/0001-repo-ci-scaffold}/protection` (both 404)                                                                  |
| CI runs                                | GitHub Actions                                          | `gh run list --branch feature/0002-design-system-reference-page --limit 10` and `--branch feature/0001-repo-ci-scaffold --limit 5` — 5 runs, 2 failures |
| CI failure root cause                  | GitHub Actions                                          | `gh run view 34793101424 --json jobs` → step "Format check (Prettier)" failure; `--log` confirms `docs/status/2026-09-11-...md` as the flagged file     |
| Vercel deployment status               | GitHub commit status API                                | `gh api repos/.../commits/{615b5d8,dc44c8e}/status` → Vercel `success` on both                                                                          |
| Local test run                         | vitest                                                  | `npx vitest run` → 259/259 passing, 45 files                                                                                                            |
| Gate/sign-off state, WI-0002           | repo files                                              | `docs/work-items/WI-0002-design-system-reference-page.md`; last content edit 2026-07-30 per `git log`; 6/9 acceptance criteria checked                  |
| Gate/sign-off state, WI-0001           | repo files                                              | `docs/work-items/WI-0001-repo-ci-scaffold.md`; last content edit 2026-08-16 per `git log`                                                               |
| `docs/design.md` Device Setup mismatch | repo files                                              | `grep -n -i "device.setup" docs/design.md` — Icons/Modal/Spinner sections still describe the archived implementation, unchanged since 2026-09-11        |
| `docs/design.md` Calendar staleness    | repo files                                              | `grep -n "Calendar" docs/design.md` — still present, unchanged                                                                                          |
| `docs/design.md`/`design.html` edits   | repo files                                              | `git log -1 --format="%ai" -- docs/design.md docs/design.html` → 2026-09-09 22:45:56, not touched this session                                          |
| Remediation/review tooling             | repo files                                              | `find . -iname "*remediation-log*"` (none found; only the skill placeholder exists)                                                                     |
| SAST/SCA/secret-scanning status        | repo files                                              | `.github/workflows/ci.yml` trailing comment — still lists these as not yet wired                                                                        |
| Archive branch                         | git                                                     | `git branch -a` — confirms `archive/memory-thinking-device-setup-voiceover` still local-only                                                            |
| Figma touchpoints                      | this reporting session's own transcript, not git/GitHub | See §2 — no Figma tool calls occurred this session                                                                                                      |
| Azure DevOps fields                    | data unavailable — no ADO connection                    | —                                                                                                                                                       |

No field in this report was inferred or assumed from an unreachable source. All GitHub timestamps
are UTC; commit/session timestamps in prose are local time (-0500) unless marked UTC.
