# Skill: azure-traceability (PoD 0: markdown fallback)

PROCESS.md Section 10 specifies Azure DevOps as the system of record: Epic -> Feature (one per
PoD) -> Requirement/PBI, Task (implementation), Bug/Issue (review finding), Task (tests), Task
(docs), all linked, with commits/PRs referencing `AB#<id>`.

**Status:** no Azure DevOps connection exists in this environment yet. Until it does, work items
are tracked as one markdown file per item under `docs/work-items/`, using the ID scheme
`WI-000N` in place of `AB#<id>` everywhere PROCESS.md says to reference the ADO ID (commits, PR
titles, branch names).

## Creating a work item (fallback)

1. Copy `docs/work-items/TEMPLATE.md` to `docs/work-items/WI-000N-<slug>.md`.
2. Fill in: title, type (Feature/PBI/Bug/Task), linked PoD, acceptance criteria, and -- once
   signed off -- the G1 sign-off note (who approved, when).
3. Reference `WI-000N` in the feature branch name, commit messages, and the PR template's
   "Work item" field, exactly as `AB#<id>` would be referenced.
4. On merge, update the file's status and link the merged PR.

## Migrating to real Azure DevOps later

Each markdown file's fields map 1:1 to an Azure DevOps work item's fields, so migration is a
copy-and-recreate, not a redesign. Update this skill once the connection exists.
