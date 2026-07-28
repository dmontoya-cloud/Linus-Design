# Skill: codex-review (PoD 0 placeholder)

**Status:** placeholder stand-in. No Codex/OpenAI agent is connected in this environment yet.
Real skill should be authored once Codex (or an equivalent independent-vendor reviewer) is
available, and this note removed.

## Current stand-in process

1. Open a fresh Claude subagent with **no memory of the build conversation**.
2. Give it only: the diff (or PR), the relevant acceptance criteria, and this file.
3. Ask it to review for: correctness, security, complexity, error handling, style, and a11y
   regressions -- the same categories PROCESS.md Section 7 Phase 4 specifies for Codex.
4. It must not fix anything itself -- only report findings.
5. The builder (main Claude thread) reads the findings, proposes remediation for each, and
   presents the plan to the Human Lead (see remediation-loop.md).

## Known limitation

This is a segregation-of-duties approximation (different context, not different vendor). Flag
this explicitly in the PR description so the Human Lead can weigh review findings accordingly,
and prefer a genuine second-vendor review for anything security- or privacy-sensitive.
