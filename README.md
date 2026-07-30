# Agentic Engineering Operating Model — Team Pack

> Looking for how to run the **Linus Patient Engagement App prototype** (the actual product
> code)? See [`docs/PROTOTYPE_README.md`](./docs/PROTOTYPE_README.md). This file is about the
> engineering process, not the app.

Human-led, AI-assisted software delivery. AI accelerates execution; humans own judgement and accountability. ISO/IEC 27001:2022-aligned.

## What's in here

| File              | Purpose                                                                                   | Audience                              |
| ----------------- | ----------------------------------------------------------------------------------------- | ------------------------------------- |
| `PROCESS.md`      | The full operating model: roles, the PoD, the lifecycle, gates, traceability, ISO mapping | Everyone — engineers, leads, auditors |
| `CLAUDE.md`       | Binding operational rules for Claude (the builder)                                        | Claude + engineers configuring it     |
| `.claude/skills/` | Skills that encode the controls Claude follows                                            | Claude + skill maintainers            |
| `docs/templates/` | Copy-paste templates for PoD kickoff, remediation logs and daily status reports           | Human Leads                           |

## The model in one paragraph

Work is organised into **PoDs** (Pods of Delivery): one Human Lead + Claude (builder) + Codex (independent reviewer & test author), delivering one bounded, shippable scope. The human owns architecture, requirements, and every sign-off. Claude builds ~80% of the code; the human keeps the judgement-heavy ~20%. Codex independently reviews the code and authors adversarial tests. Every review produces findings, and every finding gets a recorded disposition. A pull request is merge-blocked until a human approves, with CI on the PR and every push. Everything is traced through Azure DevOps. When an AI agent is unsure, it asks the human rather than guessing.

## The roles

- **H — Human Lead:** judgement, sign-offs, accountability.
- **C — Claude:** builds, drafts, proposes. Never signs off.
- **X — Codex:** independently reviews and authors tests. Never writes the production code it reviews.

## The two rules that matter most

1. **No AI sign-off.** Requirements, code review, remediation, docs, and merge approval are human acts.
2. **No guessing.** Unsure agents ask the Human Lead — always.

## Getting started

1. Read `PROCESS.md` top to bottom once.
2. Place `CLAUDE.md` and `.claude/skills/` at the root of each repository that uses this model.
3. Configure branch protection and CI per `PROCESS.md` §9.
4. Set up the Azure DevOps work-item types per `PROCESS.md` §10.
5. Run your first PoD using `docs/templates/pod-kickoff.md`.

## A note on ISO 27001

The control mapping in `PROCESS.md` §13 is a design aid, not a certification. Validate it against your Statement of Applicability and confirm with your auditor — applicability is set by your risk assessment.
