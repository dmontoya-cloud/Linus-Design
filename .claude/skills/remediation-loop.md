# Skill: remediation-loop (PoD 0: markdown fallback)

Records every independent-review finding and its disposition, linked to a work item, so nothing
gets silently dropped (PROCESS.md G3/G4).

**Status:** Azure DevOps isn't connected yet, so this log lives in-repo (see
docs/work-items/README.md) instead of as Azure DevOps work-item comments. Same fields, easy to
migrate later.

## Format (append to the relevant docs/work-items/<id>.md file, or the PR description table)

| Finding | Severity | Disposition                                | Owner | Date | Notes |
| ------- | -------- | ------------------------------------------ | ----- | ---- | ----- |
|         |          | fixed / accepted with rationale / deferred |       |      |       |

## Rules

- Every finding from the independent review gets a row -- no silent drops.
- "Accepted with rationale" requires the rationale in Notes, approved by the Human Lead.
- "Deferred" requires an owner and a date, and should get its own follow-up work-item entry.
- Never mark a finding dispositioned unless the Human Lead has actually approved it (Claude
  proposes, never approves -- CLAUDE.md hard rule 2).
