# Agentic Engineering Operating Model

**Document type:** Controlled process document**Owner:** CTO / Head of Engineering**Audience:** All engineering staff, AI agents (Claude, Codex), QA, and auditors**Compliance scope:** ISO/IEC 27001:2022 secure development controls**Version:** 1.0 (initial)**Review cycle:** Quarterly, or on any material change to tooling or controls

---

## 1. Purpose

This document defines how we build software using a **human-led, AI-assisted** development model. It establishes the roles, the unit of work (the *PoD*), the lifecycle, the mandatory control gates, and the evidence we keep so the process is auditable and ISO/IEC 27001-aligned.

The model is built around a single principle: **AI accelerates execution; humans own judgement and accountability.** Nothing in this process transfers decision authority, sign-off, or accountability to an AI agent.

## 2. Scope

Applies to all production code, infrastructure-as-code, and customer-facing documentation produced by the engineering organisation. It does not apply to throwaway spikes or research notebooks that never reach a shared branch — but any artefact promoted toward production must enter this process at Phase 1.

## 3. Operating principles

These principles are binding and override convenience. Where the process and a principle appear to conflict, the principle wins and the conflict is escalated to the document owner.

1. **Human-led, AI-assisted.** A human lead owns every PoD. AI agents produce drafts and candidates; humans decide.
2. **Judgement stays with humans.** Architecture, requirements, trade-offs, risk acceptance, and all sign-offs are human acts. They are never delegated to an AI.
3. **Separation of duties between agents.** The agent that *writes* code is never the sole agent that *reviews* it. Claude builds; Codex independently reviews and authors adversarial tests; a human approves. This mirrors author/reviewer segregation and is a control, not a style choice.
4. **No guessing.** When an AI agent is uncertain, missing context, or facing ambiguity, it must **stop and ask the human** rather than assume. A wrong assumption that ships is worse than a question that delays.
5. **Documented remediation.** Every review — human or AI — produces findings, and every finding has a recorded disposition (fixed, accepted with rationale, or deferred with owner and date). No silent drops.
6. **Traceability end to end.** Requirement → design → commit → review → test → documentation are linked through Azure DevOps work items, so any shipped line of code traces back to an approved requirement.
7. **The gate is human merge approval.** CI and AI review inform the decision; they do not replace it. Merge is blocked until a human approves.


## 4. The 80/20 execution split

Coding effort is split so humans spend their time where judgement matters most.

- **~80% — Claude (C):** scaffolding, boilerplate, CRUD, glue code, well-specified functions, mechanical refactors, and first-draft implementations of agreed designs.
- **~20% or more — Human (H):** the judgement-heavy core — security-sensitive logic, novel algorithms, concurrency and consistency decisions, public API contracts, and anything where a wrong call is expensive or hard to reverse.

The split is a guideline, not a quota. The human lead decides per PoD what they retain — some PoDs are 95/5, a security-critical PoD may be 50/50. The chosen split is recorded in the PoD design sign-off so reviewers know what to expect.

## 5. Roles and responsibilities


| Code  | Role                                           | Owns                                                                                                                 | Never does                                                      |
|-------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| **H** | Human Lead (engineer accountable for the PoD)  | Architecture, requirements, trade-off decisions, code review, all sign-offs, risk acceptance, final accountability   | Delegate sign-off to an agent                                   |
| **C** | Claude (builder)                               | First-draft code (~80%), reading review output and proposing remediation, drafting documentation, asking when unsure | Approve a merge, accept a risk, review its own code as the gate |
| **X** | Codex (independent reviewer & test author) | Independent code review and findings report, authoring tests beyond the happy path, regression coverage              | Generate the production code it reviews, approve a merge        |


### 5.1 RACI per lifecycle activity


| Activity                                  | H       | C     | X     |
|-------------------------------------------|---------|-------|-------|
| Architecture & requirements           | **A/R** | C     | I     |
| Design feedback & edge-case surfacing | A       | **R** | C     |
| Requirements sign-off                     | **A/R** | I     | I     |
| Code generation (80%)                     | A/C     | **R** | I     |
| Code (judgement-heavy 20%)                | **A/R** | C     | I     |
| Human code review & sign-off          | **A/R** | I     | I     |
| Independent AI review                     | A       | C     | **R** |
| Remediation proposal                      | A       | **R** | C     |
| Remediation approval                      | **A/R** | I     | I     |
| Test authoring (adversarial)              | A       | C     | **R** |
| PR raise & CI                         | A       | **R** | C     |
| Merge approval                            | **A/R** | I     | I     |
| Documentation draft                       | A       | **R** | I     |
| Documentation review & sign-off       | **A/R** | I     | I     |


*A = Accountable, R = Responsible, C = Consulted, I = Informed.* Accountability never sits with C or X.

---

## 6. What is a PoD?

A **PoD (Pod of Delivery)** is the atomic unit of this operating model. It has two inseparable dimensions:

1. **The constellation** — exactly one Human Lead plus the two AI agents (Claude as builder, Codex as reviewer/test author). One human, two agents, one accountable owner.
2. **The scope** — a single bounded, independently shippable slice of work: a vertical feature, a service, a well-defined module, or a contained change set. A PoD is small enough that one human can hold the whole design in their head and personally sign off on every gate.


### 6.1 Why "Pod" and not "ticket" or "team"

A traditional ticket is just a unit of *work*. A traditional pod is a unit of *people*. A PoD fuses them: it is the smallest grouping where a human and their AI agents jointly own a deliverable end to end, from requirements through to documented, tested, merged code.

This matters because accountability has to attach to a *person*, not a queue. Every PoD has a name on it. If you can't point to the single human accountable for a PoD, the PoD is mis-scoped.

### 6.2 How a PoD is used

- **Sizing.** Scope a PoD so it can pass through the full lifecycle (Section 7) in a small number of days. If a PoD is too large for one human to review every gate meaningfully, split it. Oversized PoDs defeat the human-led control.
- **Ownership.** One Human Lead per PoD. They may lead several PoDs, but each PoD has exactly one accountable lead.
- **Tracking.** Each PoD maps to one Azure DevOps Feature (or Epic for larger efforts), with child work items for requirements, implementation, review findings, tests, and documentation. See Section 10.
- **Isolation.** Each PoD develops on its own feature branch and produces its own PR. PoDs do not share branches.
- **Closure.** A PoD is closed only when every gate is signed off, every review finding has a disposition, tests pass in CI, documentation is approved, and the work items are linked and complete.

### 6.3 Anatomy of a PoD

```
PoD: "Customer export API"    
├── Human Lead: A. Engineer (accountable)    
├── Claude (builder)    
├── Codex (reviewer + test author)    
├── Azure DevOps Feature #1234    
│   ├── Requirement work items (signed off)    
│   ├── Implementation tasks    
│   ├── Review-finding work items (with dispositions)    
│   ├── Test tasks    
│   └── Documentation task    
├── Git feature branch: feature/1234-customer-export
```

---

## 7. The PoD lifecycle

The lifecycle is a sequence of phases, each ending in a recorded artefact and — where judgement is involved — a human sign-off. The canonical flow:

```
For each PoD:    

Phase 1  H ──── architecture & requirements ───────▶ C    
H ◀─── feedback & considerations ────────── C     (repeat until sign-off)    
H ──── requirements sign-off ─────────────▶ C    

Phase 2  C ──── generates code (~80%) ────────────▶ GitHub (local + remote)    
H ──── implements judgement-heavy (~20%) ▶ GitHub    
C ──── asks H whenever unsure ───────────▶ H      (no guessing)    

Phase 3  H ──── human review & sign-off ──────────  (merge-blocking gate)    

Phase 4  X ──── independent review & findings ────▶ report    
C ──── reads report, proposes remediation ▶ H    
H ──── approves remediation ──────────────  C/H apply & log    

Phase 5  X ──── authors tests (beyond happy path) ▶ GitHub    
CI ─── coverage & quality thresholds checked    

Phase 6  PR raised  ── merge BLOCKED on human review    
CI runs on the PR and on every push (regression catch)    

Phase 7  C ──── drafts documentation update ──────▶ H    
H ──── reviews & signs off docs ──────────  commit    

Phase 8  H ──── close PoD: all gates green, audit trail complete
```

### Phase 1 — Architecture & requirements (human-led)

The Human Lead gives Claude the architecture and requirements. Claude responds with **feedback and considerations** — ambiguities, missing acceptance criteria, edge cases, security implications, and risks — but does **not** start building. This repeats until the human is satisfied and **signs off**. The signed-off requirements and design notes are recorded against the Azure DevOps Feature.*Control intent: requirements and architecture are human decisions (A.8.26, A.8.27).*

### Phase 2 — Implementation (AI-assisted, human-led)

Claude generates roughly 80% of the code on the PoD's feature branch and pushes to GitHub (local and remote). The Human Lead implements the judgement-heavy remainder. Whenever Claude is unsure — ambiguous requirement, multiple valid designs, missing context, a security-sensitive choice — it **stops and asks the human**. Guessing is a process violation.*Control intent: secure coding with human ownership of sensitive logic (A.8.28).*

### Phase 3 — Human review & sign-off (gate)

The Human Lead reviews the combined code. This is a **merge-blocking** human gate. Output is either sign-off or specific change requests routed back to Phase 2.*Control intent: author/reviewer separation; human approval before progression (A.5.3, A.8.32).*

### Phase 4 — Independent AI review & remediation (Codex)

Codex independently reviews the code and produces a **findings report** (correctness, security, complexity, error handling, style). Codex did not write this code, which is what makes its review independent. Claude reads the report and **proposes remediation** for each finding. The Human Lead **approves** the remediation plan; Claude and/or the human apply it. Every finding gets a disposition in the remediation log (see the `remediation-loop` skill).*Control intent: independent review and documented vulnerability handling (A.8.8, A.8.28).*

### Phase 5 — Test authoring (Codex)

Codex authors unit and integration tests that go **beyond the happy path** — boundary values, error and exception paths, invalid input, security-relevant cases, and concurrency where applicable. Tests are committed to the branch. Coverage and quality thresholds are enforced in CI.*Control intent: security testing in development (A.8.29); test data handled per A.8.33.*

### Phase 6 — Pull request & CI

A PR is raised into the protected branch. Branch protection **blocks merge until a human approves**. CI runs on the PR and on **every push** to catch regressions. Required CI checks must be green before merge is permitted. See Section 9.*Control intent: change management and regression control (A.8.32).*

### Phase 7 — Documentation (AI-drafted, human-reviewed)

Claude drafts the documentation update (API docs, runbook, changelog, architecture decision record). The Human Lead reviews and **signs off**. Approved documentation is committed with the change.*Control intent: maintained, reviewed documentation as part of the SDLC (A.8.25).*

### Phase 8 — Closure

The PoD closes only when: all gates signed off, all review findings dispositioned, CI green, documentation approved, and Azure DevOps work items linked and complete. The audit trail is now self-contained and traceable.

---

## 8. Control gates summary

A gate is a point where progression is blocked until a condition is met. The two human gates are non-negotiable and cannot be satisfied by any AI agent.


| #  | Gate                   | Type          | Pass condition                                | Blocking?            |
|----|------------------------|---------------|-----------------------------------------------|----------------------|
| G1 | Requirements sign-off  | Human         | Human Lead approves requirements & design | Yes                  |
| G2 | Human code review      | Human         | Human Lead approves the code                  | Yes (merge)          |
| G3 | Independent AI review  | Agent (Codex) | Findings reported and each dispositioned      | Yes (advisory to G4) |
| G4 | Remediation approval   | Human         | Human Lead approves dispositions              | Yes                  |
| G5 | Tests & coverage   | CI            | Adversarial tests present; thresholds met     | Yes                  |
| G6 | CI green               | CI            | All required checks pass on PR + latest push  | Yes (merge)          |
| G7 | Documentation sign-off | Human         | Human Lead approves docs                      | Yes                  |


**Merge requires, at minimum: G2 + G6 simultaneously satisfied, with G3/G4/G5/G7 complete.** No agent can approve the merge; branch protection enforces a human reviewer.

---

## 9. Source control & CI configuration

### 9.1 Branch protection (on the protected branch, e.g. `main`)

- Require a pull request before merging.
- Require **at least one human approving review**; agents cannot satisfy this.
- Dismiss stale approvals when new commits are pushed.
- Require all designated **CI status checks to pass** before merge.
- Require the branch to be up to date before merge.
- Require linear history (or your chosen merge strategy) and signed commits where feasible (A.8.4 — access to and integrity of source code).
- Restrict who can push to the protected branch.

### 9.2 CI triggers

- **On pull request:** full test suite, coverage gate, static analysis / SAST, dependency vulnerability scan, secret scanning, lint.
- **On every push to the PR branch:** the same suite, so regressions are caught as they are introduced, not only at merge time.
- A failing required check leaves the PR un-mergeable regardless of approvals.

### 9.3 Required checks (recommended baseline)

Build, unit + integration tests, coverage threshold, SAST, dependency/SCA scan, secret scan, and lint/format. Tune thresholds per team, but record them so they are auditable.

---

## 10. Traceability model (Azure DevOps)

Traceability lets any auditor walk from a shipped line of code back to the approved requirement, and forward from a requirement to its tests and documentation.

```
Epic (large effort)    
└── Feature  ── one PoD    
    ├── Requirement / PBI  ── signed off at G1    
    ├── Task: implementation (links commits/PR)    
    ├── Bug/Issue: review finding  ── one per finding, with disposition    
    ├── Task: test authoring  ── links test commits    
    └── Task: documentation  ── signed off at G7
```

Rules:

- Every PoD = one Feature (or Epic→Feature for large work).
- Every commit message and PR references its work item ID (e.g. `AB#1234`) so Azure DevOps auto-links code to work items.
- Every review finding becomes its own work item with a disposition field, linked to the PoD Feature. This is the audit spine.
- The PR links the work items it resolves; merge updates their state.
- Sign-offs (G1, G2, G4, G7) are recorded as comments or state transitions with the approver's identity and timestamp.

The `azure-traceability` skill defines how Claude creates and links these work items.

---

## 11. The "when unsure, ask" protocol

AI agents must not guess. An agent is **unsure** when any of the following is true:

- A requirement is ambiguous or contradicts another requirement or the existing code.
- More than one reasonable design exists and the choice has meaningful consequences.
- Context is missing (an interface, a data contract, an external system's behaviour, a credential boundary).
- The change touches security, privacy, money, data deletion, access control, or anything irreversible.
- A review finding's correct fix is genuinely unclear.

When unsure, the agent **stops, states what it knows, states precisely what it does not know, and asks the Human Lead a specific question** — ideally with options and trade-offs. It does not proceed on an assumption. The question and its answer are recorded against the PoD so the decision is part of the audit trail.

This is enforced in `CLAUDE.md` and in every skill.

---

## 12. Records & audit evidence

For each PoD, the following are retained and linked (this is the evidence an ISO 27001 auditor will sample):

- Signed-off requirements and design notes (G1).
- Daily Status Reports (N/A)
- Commit history and PR with human approval record (G2, G6).
- Codex independent review report (G3).
- Remediation log: every finding with its disposition, owner, and date (G4).
- Test suite and coverage report (G5).
- CI run results on PR and pushes (G6).
- Approved documentation diff (G7).
- Azure DevOps work item graph linking all of the above.

Records are retained per the organisation's information-security retention policy.

---

## 13. ISO/IEC 27001:2022 control mapping

This maps process elements to Annex A controls **as a design aid**. It is not a compliance certification. Validate against your organisation's Statement of Applicability and ISMS, and confirm wording with your auditor — control applicability is determined by your risk assessment, not by this table.


| Annex A control | Title                                                   | How this process addresses it                                                                   |
|-----------------|---------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| A.5.2           | Information security roles & responsibilities       | Defined H/C/X roles and RACI (Section 5)                                                        |
| A.5.3           | Segregation of duties                                   | Builder (C) ≠ reviewer (X) ≠ approver (H) (Principle 3, Gates)                              |
| A.8.4           | Access to source code                                   | Branch protection, restricted push, signed commits (Section 9)                                  |
| A.8.8           | Management of technical vulnerabilities                 | SAST/SCA in CI; independent review findings & remediation (Phases 4, 6)                     |
| A.8.25          | Secure development life cycle                           | This entire document                                                                            |
| A.8.26          | Application security requirements                       | Requirements phase with security considerations & sign-off (Phase 1, G1)                    |
| A.8.27          | Secure system architecture & engineering principles | Human-owned architecture with AI-surfaced considerations (Phase 1)                              |
| A.8.28          | Secure coding                                           | 80/20 split keeping sensitive logic human-owned; secure-coding standards in CLAUDE.md (Phase 2) |
| A.8.29          | Security testing in development & acceptance        | Adversarial tests beyond happy path; CI security checks (Phase 5, G5)                           |
| A.8.31          | Separation of development, test & production        | Feature-branch isolation; protected-branch promotion (Section 9)                                |
| A.8.32          | Change management                                       | PR + human gate + CI + linked work items (Phases 3, 6, Section 10)                              |
| A.8.33          | Protection of test information                          | Test data handling rules in the test-authoring skill (Phase 5)                                  |


---

## 14. Glossary

- **PoD (Pod of Delivery):** the atomic unit — one Human Lead + Claude + Codex, plus one bounded shippable scope.
- **H / C / X:** Human Lead / Claude (builder) / Codex (independent reviewer & test author).
- **Gate:** a blocking checkpoint with a defined pass condition.
- **Disposition:** the recorded outcome of a review finding (fixed / accepted-with-rationale / deferred-with-owner-and-date).
- **Independent review:** review performed by an agent that did not write the code under review.

---

## 15. Document control


| Version          | Date       | Author                                          | Change |
|------------------|------------|-------------------------------------------------|--------|
| 1.1<br>1.0       |            |
| 07/20/2026  |
| 06/22/2026       | CTO<br>CTO | Added Daily Status reports<br>Initial issue<br> |


Changes to this document follow the same change-management discipline as code: proposed via PR, reviewed by the document owner, and version-bumped on merge.

 
