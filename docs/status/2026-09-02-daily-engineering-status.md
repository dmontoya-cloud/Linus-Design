# Daily Engineering Status — 2026-09-02 (end-of-day update)

Cadence report per `CLAUDE.md` ("Daily engineering status report"), generated on request
("before standup") a second time today, **superseding** the earlier same-day version generated
at 10:28 (commit `e77379f`) and reporting **movement since that version**. Assembled mechanically
from GitHub (via `gh`), git, and the local working tree — Azure DevOps is not connected yet, so
every field that would normally come from ADO is marked `data unavailable` rather than inferred.
This report satisfies no gate and grants no approval.

## 1. Portfolio snapshot

| PoD | Feature (ADO) | Phase | Branch | PR | CI |
| --- | --- | --- | --- | --- | --- |
| Ad hoc — design-system reference (WI-0002) | data unavailable — ADO not connected ([WI-0002](../work-items/WI-0002-design-system-reference-page.md)) | PR #14 (merged 2026-09-02T06:33:37Z UTC) is still the last **PR'd** state. One commit (`e77379f`, this morning's own status report) sits committed locally but unpushed. On top of that, a large uncommitted working-tree delta — 5 separable pieces of work across ~50 files — has landed since, none of it committed. | `feature/0002-design-system-reference-page` | none open — last merged is [#14](https://github.com/dmontoya-cloud/Linus-Design/pull/14) | 🟡 Green on the last **pushed** commit (`466f25f`) — but CI has not run against `e77379f` or against anything in the current working tree, since neither has been pushed |

## 2. Movement, since the 2026-09-02 10:28 report (commit `e77379f`)

Observed via `git log`, `git status`, `git diff --stat`, `git branch -a`,
`git log origin/feature/0002-design-system-reference-page..HEAD`, `gh pr list`, `gh run list`,
`gh api .../pulls/{13,14}/reviews`, `gh api .../branches/{main,feature/0001-repo-ci-scaffold}/protection`,
and a local `npx vitest run`.

### On GitHub — nothing moved

- **No new PRs, no new CI runs, no new reviews.** `gh pr list` still tops out at #14 (merged);
  `gh run list`'s newest entry is still the `466f25f` push (`33601449494`, green) from the
  morning. Every git event since the baseline report is local-only (below) — none of it has
  reached origin.

### In the local working tree — substantial, entirely uncommitted

- **`e77379f`** (the 10:28 report's own commit) remains **pushed to nowhere** — `git log
  origin/feature/0002-design-system-reference-page..HEAD` shows it as the only commit ahead of
  origin. Unchanged from the baseline report's own finding.
- **On top of that, five separable pieces of work now sit uncommitted** (`git status --short`:
  ~20 modified, ~25 deleted, ~5 new/untracked; `git diff --stat` on the modified files alone:
  21 files, +468/−719):
  1. **Info-token recolor** — `ActivityDetailsPage.module.css`'s `.redoNotice` (the Memory &
     Thinking redo-cooldown callout) recolored from `--color-warning`/`--color-warning-soft` to
     `--color-info`/`--color-info-soft`, on request — a heads-up, not a warning.
  2. **Calendar icon resynced from Figma** — `CalendarIcon.tsx` replaced with the exact SVG
     exported live from Figma's `Icon/Calendar` component (node `324:56`) after the user edited
     it there. This is a one-off, documented exception to `docs/design.md`'s Phosphor-sourcing
     convention (different viewBox, single flat path) — **`docs/design.md` itself is now stale
     and intentionally not yet updated**, pending the user's sign-off (`CLAUDE.md` Phase 7).
  3. **Full archive-and-replace of the Memory & Thinking assessment flow**, on request. The old
     device-setup/voice-over flow (30 files — `AssessmentIntroPage`, all of `src/pages/DeviceSetup/`,
     the old `ShoppingListIntroPage*`, `voiceOverReading.ts`, `assessmentVoiceOver.ts`) is deleted
     from the working tree (`git rm`, showing as `D`). It was archived first via a new **local-only**
     git branch, `archive/memory-thinking-device-setup-voiceover`, at the pre-deletion HEAD — not
     yet pushed to origin. In its place: a new click-through-only `MemoryThinkingTaskPage` flow
     (untracked, under `src/pages/Assessment/MemoryThinkingTask/`), recreated from a Figma
     reference (50+ frames) at the user's direction, wired in as the canonical `/assessment` route
     in `App.tsx`. Its "Finish" action now hands off to the real `ReportReadyPage`
     (`completedActivityId: 'memory-recall'`) instead of an internal "complete" screen — the
     internal screen was removed entirely, on request, once its existence was flagged by
     screenshot. `src/test/setup.ts`'s SpeechSynthesis/MediaDevices/AudioContext polyfills were
     also removed, confirmed dead after the flow they served was deleted.
  4. **`FullCheckInCard` dynamic hero title**, on request — three distinct copy states by
     `completedCount` (1/2/3 activities done), replacing one fixed title. This went through one
     correction cycle within the window: an initial draft mistakenly rendered the user's own
     explanatory labels ("One activity completed.") as literal first lines of display text; the
     user caught this, and the final copy was applied exactly as they re-supplied it.
  5. **`ResourcesCard` button restyle** (dashboard "Linus Health Resources" block), on request,
     completed just now in this same window: variant switched from `outline` (a neutral
     grey-bordered pill, the source of the "detached from the design system" look the user
     flagged) to `secondary` (the design system's blue-outline pill), matching a reference image
     the user provided; label shortened from "Open resources on linushealth.com" to "Open on
     linushealth.com" to match that same image. `DashboardPage.test.tsx`'s matching assertion
     was updated in the same change.
- **Local `npx vitest run`: 246/246 tests passing across 42 files** — down from the 10:28
  report's 319/319. Expected, not a regression: the old flow's own 30 files carried substantial
  test coverage that was deleted along with them; the new flow's coverage (plus everything else
  in this window) nets out lower. Explicitly reasoned through, not silently absorbed.

## 3. Attention needed

1. **A large, entirely uncommitted working-tree delta** — five separable pieces of work (§2)
   across roughly 50 files — is not committed, pushed, or in any PR. Worth deciding whether to
   split it into more than one commit/PR when it ships, since bundling a color-token tweak, an
   icon resync, a full flow replacement, a copy feature, and a button restyle into one PR mixes
   unrelated review concerns. [new this window]
2. **The old Memory & Thinking flow's only safety net is a local, unpushed git branch**
   (`archive/memory-thinking-device-setup-voiceover`) — 30 deleted files exist nowhere else. If
   this local checkout were lost before a commit/push, the archive would be lost with it. Worth
   deciding whether to push it to `origin` for durability. [new this window, previously flagged
   to the user as an open question, not yet answered]
3. **`e77379f` is still committed locally but unpushed** — carried over unchanged from the
   baseline report.
4. **`466f25f` remains pushed but un-PR'd** into `feature/0001-repo-ci-scaffold` — carried over
   unchanged.
5. **`docs/design.md`'s Icon section is now stale** — it documents Calendar as Phosphor-sourced,
   which is no longer true. Flagged to the user; not updated pending sign-off (`CLAUDE.md` Phase
   7). [new this window]
6. **WI-0002's own doc is stale relative to real state, now for a twelfth round.** Same finding
   as every prior report back to 2026-08-07. Last touched 2026-07-30, still 6 of 9 acceptance
   criteria checked — the gap it doesn't reflect is now larger than the baseline report noted.
7. **PR #13 and #14 both merged with zero recorded reviews**, continuing the pattern of every
   prior merged PR. Per `CLAUDE.md` rule 2, sign-off is a human act — nothing on GitHub's side
   captures one having happened here, in or out of band.
8. **No branch protection exists on either candidate main-line branch** — unchanged, both still
   `404 Not Found`.
9. **No PR has ever gone through G3/G4 (independent review + remediation)** — unchanged. No
   `.claude/skills/codex-review.md`-driven review has run against this repo's code, and no
   remediation-log file exists anywhere in the repo.
10. **SAST / dependency (SCA) scan / secret scanning still not wired into CI** — unchanged, open
    since PoD 0.
11. **This window's Figma design work again has no system of record this report can read** — the
    Memory & Thinking flow's 50+-frame source section and the live Calendar icon export exist
    only in the Figma file and direct session record, same structural gap the baseline report
    flagged for a different set of Figma work.

## 4. Per-PoD detail

### Ad hoc — Design-system reference + onboarding/dashboard/assessment extension (WI-0002)

- **Human Lead:** David
- **Gates:** G1 — informal, extended again this window through conversational requests (archive-
  then-replace the old Memory & Thinking flow, redirect its "Finish" to `ReportReadyPage`, the
  three-tier title copy plus one correction cycle, the Resources button restyle) — none produced
  a written, human-signed acceptance-criteria doc. G2 — none of this window's work has reached a
  PR yet, so no review is possible on it; #13/#14 remain reviewless (Attention needed #7). G3/G4
  — not run (Attention needed #9). G5 (coverage) — local `vitest run` this window: 246/246 across
  42 files, down from 319/319 at the 10:28 baseline for the reasons in §2 (expected, not a
  regression). G6 — CI hasn't run against any of this window's changes at all, since nothing has
  been pushed; the last real CI signal remains green, on `466f25f`. G7 — WI-0002's doc still not
  updated (Attention needed #6); `docs/design.md` also now stale (Attention needed #5).
- **Acceptance criteria:** per the doc's last content edit (2026-07-30), still 6 of 9 checked
  off — unchanged, now against an even larger real-state gap.

## 5. Cross-PoD risks & metrics

- **0 PRs opened or merged this window** (vs. 2 in the 10:28 baseline window) — this window's
  activity happened entirely in the local working tree, not on GitHub.
- **0 CI runs this window** — nothing has been pushed since `466f25f`/`e77379f`.
- **The uncommitted surface area is now large enough to warrant a shipping-strategy decision**:
  five distinct, independently reviewable changes (a token recolor, an icon resync, a full
  flow archive-and-replace, a copy feature, a button restyle) currently sit as one undifferentiated
  working-tree diff. `CLAUDE.md`'s "one PoD → one feature branch → one PR" framing doesn't itself
  resolve whether these should be one PR or several within that shared branch.
- **Cumulative pattern across all reports to date is unchanged**: 11 merged PRs (#4–#14), zero
  recorded reviews on any of them, zero independent (G3/G4) passes — this window didn't move
  that number in either direction, since nothing new reached GitHub.
- **A second window in a row now has real work with no system of record this report can read**
  (§2's Figma-sourced flow recreation and icon resync; the 10:28 report flagged a different batch
  of Figma work for the same reason) — this is becoming a recurring, not one-off, gap.
- Draft risk call for you to confirm or correct: _"Quiet on GitHub, busy locally: nothing shipped
  today, but a genuinely large amount of work — a full assessment-flow swap, a dynamic-copy
  feature, an icon resync, and two smaller fixes — is sitting uncommitted on this branch. Two
  things are worth a same-day decision rather than carrying them open: first, the deleted
  30-file old flow currently has only a local, unpushed git branch as its safety net — I'd push
  that for durability before end of day. Second, given the breadth of what's uncommitted, I'd
  split it into a small number of separately reviewable commits/PRs rather than one large bundle,
  even though it's all one PoD. The longer-running structural gaps are unchanged: no branch
  protection, no recorded reviews across 14 PRs now, no independent review ever run, and both
  WI-0002's doc and docs/design.md are now stale in ways this window made worse, not better."_

## 6. Appendix — sourcing

| Field | Source | Command / call |
| --- | --- | --- |
| PR list | GitHub API | `gh pr list --state all --limit 10 --json number,title,state,headRefName,baseRefName,mergedAt,createdAt` |
| PR #13/#14 reviews | GitHub API | `gh api repos/dmontoya-cloud/Linus-Design/pulls/{13,14}/reviews` (both `[]`) |
| Branch protection | GitHub API | `gh api repos/.../branches/{main,feature/0001-repo-ci-scaffold}/protection` (both 404) |
| CI runs | GitHub Actions | `gh run list --limit 15 --json databaseId,status,conclusion,createdAt,headBranch,event,displayTitle,headSha` — newest is still `466f25f` |
| Local vs. origin commit gap | git | `git log origin/feature/0002-design-system-reference-page..HEAD --oneline` → `e77379f` only |
| Local commit history | git | `git log --oneline -20` |
| Uncommitted working-tree state | git | `git status --short`; `git diff --stat` (21 modified files, +468/−719; plus ~25 deletions and ~5 untracked files not counted in that stat) |
| Local branches | git | `git branch -a` — confirms `archive/memory-thinking-device-setup-voiceover` exists locally only (no `remotes/origin/archive/...`) |
| Local test run | vitest | `npx vitest run` → 246/246 passing, 42 files |
| Gate/sign-off state per PoD | repo files | `docs/work-items/WI-0002-design-system-reference-page.md`; last content edit 2026-07-30 per `git log`; 6/9 acceptance criteria checked |
| Remediation/review tooling | repo files | `find . -iname "*remediation-log*"` (none found; only the skill placeholders exist) |
| Figma design work this window | direct session record only | no repo/GitHub/ADO source captures this — see §2's flow-recreation and icon-resync items |
| Azure DevOps fields | data unavailable — no ADO connection | — |

No field in this report was inferred or assumed; anything not directly observed is marked
`data unavailable` above, and the one category with no reachable source at all (this window's
Figma work) is flagged as such rather than omitted or guessed. All GitHub timestamps are UTC.
