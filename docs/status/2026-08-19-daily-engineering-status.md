# Daily Engineering Status — 2026-08-19

Cadence report per `CLAUDE.md` ("Daily engineering status report"). Assembled mechanically from
GitHub (via `gh`), git, and the in-repo work-item log (`docs/work-items/`) — Azure DevOps is not
connected yet, so every field that would normally come from ADO is marked `data unavailable` rather
than inferred. This report satisfies no gate and grants no approval.

**Note on dates:** all commit/PR/CI timestamps below are UTC (GitHub's native format); the session
itself ran locally on 2026-08-19 (David's local time), entirely within that one calendar day —
unlike the last report, nothing here crosses a UTC midnight boundary. Nothing in this report was
inferred — anything not directly observed is marked `data unavailable`.

## 1. Portfolio snapshot

| PoD                                        | Feature (ADO)                                                                                           | Phase                                                                                                                                        | Branch                                      | PR                                                                                      | CI                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------- |
| Ad hoc — design-system reference (WI-0002) | data unavailable — ADO not connected ([WI-0002](../work-items/WI-0002-design-system-reference-page.md)) | Merged (Phase 6 complete per GitHub; **WI-0002's own doc is still stale — see Attention needed #1**)                                         | `feature/0002-design-system-reference-page` | [#6](https://github.com/dmontoya-cloud/Linus-Design/pull/6) merged 2026-08-19T06:40:00Z | 🟢 Green — last run `32224376628` |
| Untracked — Vercel Production Branch drift | data unavailable — no work item; infra/deploy configuration, not app code                               | Open — David confirmed the merge deployed and is Ready, but it's tagged Preview, not Production; Production Branch setting not yet corrected | N/A (Vercel project settings, not a branch) | N/A                                                                                     | N/A                               |

## 2. Movement since last report (2026-08-16)

Observed via `gh pr list`, `gh pr view 6`, `gh run list`, `gh api .../pulls/6/reviews`,
`gh api .../branches/.../protection`, and `git log` — this report covers 2026-08-16 (end of last
report) through today.

- **PR #6** (`feature/0002-design-system-reference-page` → `feature/0001-repo-ci-scaffold`, the
  repo's actual default branch): 4 commits, +1,443/−528 across 46 files, created
  2026-08-19T06:34:19Z, merged 2026-08-19T06:40:00Z by `dmontoya-cloud`. Delivered:
  - Removed the standalone Consent page — the age-18+ attestation moved to Legal Intro (its own
    white `CheckboxCard`, next to a personalized greeting) and the assessment-results consent
    checkbox moved to Privacy Policy's own form.
  - Terms of Use and Privacy Policy now expose their full legal text inline in a scrollable box
    that gates the "I agree" checkbox on having scrolled to the end, reusing a new shared
    `CheckboxCard` component for both agree checkboxes.
  - Extended the onboarding funnel with three new interstitial/step screens: **Thanks** (a
    personalized-greeting spinner after Setting Up), **Education** ("Which best describes your
    educational background?", after Gender & Identity), and **Loading** (a final spinner before
    Dashboard). `ONBOARDING_TOTAL_STEPS` is now 5.
  - Gender & Identity gained an **Intersex** option for sex assigned at birth, plus auto-fill logic:
    choosing Male or Female for gender pre-fills the matching sex-assigned-at-birth value (with an
    explanatory note); Non-binary/Prefer not to say don't auto-fill.
  - Removed the native up/down spinner arrows from the Registration Day/Year number inputs.
  - Added `docs/status/2026-08-16-daily-engineering-status.md` (the last report).
  - Per this session's own local verification (not yet re-derived from a downloaded CI artifact for
    this report): `typecheck`/`lint`/`format:check` pass, 139 tests passing (including a full
    Login→Dashboard happy-path E2E), `build`/`build-storybook` succeed, coverage 98.35% statements /
    93.01% branches against an 80% gate.
- **CI went red twice on this PR's branch, same session**: run `32223958179` (2026-08-19T06:34:05Z,
  a direct push) and its paired `32223980119` (2026-08-19T06:34:23Z, the PR's own check) both failed
  on the Prettier format-check step — `format:check` runs `prettier --check .` across the whole
  repo, not just `src`, and the newly-added status-report markdown file hadn't been formatted.
  Fixed by `style: apply Prettier formatting to daily status report` (commit `d8ab5b9`), verified
  green on the next run (`32224196311`/`32224199965`), then merged (`32224376628`).
- **PR #6 shows zero recorded reviews** (`gh api .../pulls/6/reviews` returns `[]`) and its body is
  the raw, unfilled PR template — no acceptance criteria, no gate checkboxes ticked, no risks/open
  questions recorded. Same pattern as PRs #4 and #5.
- **Vercel — Production Branch setting has drifted, not yet corrected.** David reported the
  production URL wasn't showing the latest work. Inspecting the Deployments tab live: the most
  recent deployment (PR #6's merge commit, `4775557`, on `feature/0001-repo-ci-scaffold`, Ready) is
  tagged **Preview**, while the _previous_ deployment on that same branch (PR #5's merge, 2 days
  prior) was tagged **Production**. This means Vercel's configured Production Branch no longer
  points at `feature/0001-repo-ci-scaffold` — likely reverted to `main`, which receives no pushes.
  David was pointed to Project Settings → Git → Production Branch to fix it, and to the specific
  Preview URL as an immediate workaround; not yet confirmed done as of this report.

## 3. Attention needed

1. **Vercel Production Branch setting needs correcting.** The just-merged, Ready deployment for
   PR #6 is tagged Preview rather than Production. Needs: David to set Project Settings → Git →
   Production Branch to `feature/0001-repo-ci-scaffold` (or merge to whatever branch is actually
   configured), then confirm the stable/production URL reflects current code.
2. **WI-0002's own doc is stale relative to real GitHub state, now for a third round.** Same finding
   as the 2026-08-07 and 2026-08-16 reports, now compounded by a third merged PR (#6) under the same
   branch/WI reference. Last touched 2026-07-30; still 6 of 9 acceptance-criteria boxes checked, none
   reflecting the pre-registration flow, Registration rework, Dashboard work, or this session's
   Thanks/Education/Loading/auto-fill additions. Recommend either splitting these into separate work
   items retroactively or updating WI-0002 to reflect everything actually shipped under it — not
   mine to decide.
3. **PR #6 shipped with an entirely unfilled PR template** — no acceptance criteria, no gate
   checkboxes, no risks/open questions section used. Same gap as #4 and #5, now three-for-three.
4. **No branch protection exists on either candidate main-line branch**, unchanged from the last two
   reports. `gh api .../branches/{main,feature/0001-repo-ci-scaffold}/protection` both still return
   `404 Not Found`.
5. **PR #6 shows zero recorded reviews** (`gh api .../pulls/6/reviews` returns `[]`). Same pattern as
   #4 and #5 — per CLAUDE.md rule 2, sign-off is a human act; nothing on GitHub's side captured one
   happening here, in or out of band.
6. **No PR has ever gone through G3/G4 (independent review + remediation)** — unchanged from last
   report. The `codex-review` skill is still a placeholder per its own header; no remediation-log
   file exists anywhere in the repo.
7. **SAST / dependency (SCA) scan / secret scanning still not wired into CI** — unchanged, open
   since PoD 0.

## 4. Per-PoD detail

### Ad hoc — Design-system reference + onboarding funnel extension (WI-0002)

- **Human Lead:** David
- **Gates:** G1 — informal, per the work item, extended informally through this session's build
  (multiple conversational requests, addressed one at a time). G2 — no GitHub review recorded
  (Attention needed #5). G3/G4 — not run (Attention needed #6). G5 (coverage) — enforced in CI
  (`npm run test:coverage`, 80% gate); this session's own local run reports 98.35% statements /
  93.01% branches, not independently re-verified from a downloaded CI artifact for this report. G6 —
  CI green as of `32224376628` (2026-08-19T06:40:03Z, PR #6's merge), after one red-then-fixed cycle
  earlier the same session. G7 — WI-0002's doc not updated to reflect this session's scope
  (Attention needed #2).
- **Acceptance criteria:** per the doc's last edit (2026-07-30), 6 of 9 checked off, predating this
  session's work entirely.

### Untracked — Vercel Production Branch configuration

- **Human Lead:** David (this session)
- **Gates:** None apply — infrastructure configuration, not a PoD.
- **State:** PR #6's merge deployment builds and is Ready, but is tagged Preview rather than
  Production, confirmed by directly inspecting the Deployments tab during this session. Root cause
  (Production Branch setting) identified and a fix path given; not yet confirmed corrected by David
  as of this report.

## 5. Cross-PoD risks & metrics

- **1 of 1 PR merged this session** with green CI (after one red cycle, fixed within the same
  session); **0 of 1** has a recorded GitHub review; **0 of 1**'s underlying work item doc matches
  its real merged scope.
- **1 CI red/green cycle** this session, caused by a format-check gap in tooling usage (checking
  `src` only, locally, instead of running the actual `npm run format:check` / `npm run lint` scripts
  which cover the whole repo) rather than a real code defect — fixed in the next commit, same
  session.
- **1 deployment-configuration issue (Vercel Production Branch) surfaced and diagnosed, not yet
  confirmed resolved** — the second Vercel-related process gap raised in as many reports (the last
  report's was a wrong-repo/wrong-branch/duplicate-repo issue, since resolved; this one is a
  Production Branch setting that reverted or was never repointed after that earlier fix).
- Draft risk call for you to confirm or correct: _"Code-wise, this was a clean, self-contained
  session — one PR merged, CI green (after a same-session fix), a meaningful funnel extension
  shipped (Thanks/Education/Loading screens, gender/sex auto-fill, Intersex option) with test
  coverage well above gate. But the standing process gaps are now three-for-three: no PR in this
  repo's history has a recorded review, an independent (G3/G4) pass, or a filled-in acceptance-
  criteria/risk section — and WI-0002's own doc hasn't been touched since before any of these three
  PRs merged under its name. Before more work stacks on top: (1) fix the Vercel Production Branch
  setting so the stable URL stays current, (2) decide whether WI-0002 gets retroactively split or
  just updated to match reality, (3) turn on branch protection on the real default branch before the
  next merge."_

## 6. Appendix — sourcing

| Field                        | Source                                                                                    | Command / call                                                                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Default branch               | GitHub API                                                                                | `gh repo view --json defaultBranchRef`                                                                                                   |
| PR list                      | GitHub API                                                                                | `gh pr list --state all --limit 10 --json number,title,url,state,mergedAt,createdAt,headRefName,baseRefName`                             |
| PR #6 details                | GitHub API                                                                                | `gh pr view 6 --json number,title,url,createdAt,mergedAt,mergedBy,additions,deletions,changedFiles,commits,baseRefName,headRefName,body` |
| PR #6 reviews                | GitHub API                                                                                | `gh api repos/dmontoya-cloud/Linus-Design/pulls/6/reviews` (`[]`)                                                                        |
| Branch protection            | GitHub API                                                                                | `gh api repos/.../branches/{main,feature/0001-repo-ci-scaffold}/protection` (both 404)                                                   |
| CI runs                      | GitHub Actions                                                                            | `gh run list --limit 15 --json databaseId,status,conclusion,createdAt,headBranch,event,displayTitle`                                     |
| Issues                       | GitHub API                                                                                | `gh issue list --state all` (empty)                                                                                                      |
| Local commit history         | git                                                                                       | `git log --format='%h\|%ad\|%an\|%s' --date=format:'%Y-%m-%d %H:%M'`                                                                     |
| Remediation log              | repo search                                                                               | `find` for any remediation-log path — only the skill template exists, no real log                                                        |
| Gate/sign-off state per PoD  | repo files                                                                                | `docs/work-items/WI-0002-design-system-reference-page.md`                                                                                |
| Test/coverage numbers        | this session's own local commands (direct observation, not re-derived from a CI artifact) | `npm run test:coverage`, `npm run build`, `npm run build-storybook`                                                                      |
| Vercel Deployments tab state | this session's own conversation (direct observation, screenshot provided by David)        | N/A — recorded live as it happened                                                                                                       |
| Azure DevOps fields          | data unavailable — no ADO connection                                                      | —                                                                                                                                        |

No field in this report was inferred or assumed; anything not directly observed is marked
`data unavailable` above. The Vercel section is sourced from this session's own direct observation
(a screenshot David provided of the Deployments tab), not from an independent audit trail — flagged
as such rather than presented with the same evidentiary weight as the git/GitHub-sourced sections
above it.
