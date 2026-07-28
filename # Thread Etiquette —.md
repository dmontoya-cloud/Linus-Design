# Thread Etiquette — Engineering

**Why this exists:** every issue stays traceable back to a bug number, and anyone can tellthe current status of what's being worked on at a glance. Keep it lightweight — these aredefaults, not red tape.

---

## The core rules

1. **One topic per thread.** Don't bury a new issue inside an existing thread — start a newone. Keep the whole discussion *in* the thread.
2. **Tag the thread with its number.** Every thread title leads with the work item it's about(issue or BUG). If you don't have a number yet, get/create one first (see below).
3. **A bug means a BUG.** If you're addressing a defect — or QA finds one — **log it in Azurefirst**, then reference that BUG number everywhere you touch it (thread, commits, PR).
4. **QA pass = a short report, not a thumbs-up.** When QA passes, post the **QA Verifiedreport** below (bug number + what was tested + result). A bare "passed ✅" doesn't give ustraceability.
5. **Status is always current.** Post a status update whenever it changes so the threadreflects reality.


---

## Starting a thread

Title format — number first so it's searchable:

```
[BUG 2065] GET /api/v1/assets 502 on multiple endpoints  
[ISSUE 1411] Asset list pagination spinner stuck
```

First message should say, in one or two lines: what's happening, where (repo/screen/endpoint),and the current status tag. Link the Azure work item.

---

## Tagging & traceability

The goal is two-way traceability: **BUG ↔ thread ↔ PR/commit ↔ QA result.**

- **Thread** → references the BUG/issue number in the title.
- **Commits & PRs** → reference the bug so it links automatically. If you use the AzureBoards ↔ GitHub integration, put `AB#<id>` in the commit message or PR description and itlinks the work item; also keep a human-readable `Fixes BUG <id>` line.
- **The Azure work item** → links the PR and gets the QA verification note when it's closed.
- **Branch names** keep the number too (matches what we already do): `bug/204-...`,`fix-2065_...`, `feat/1411`.

If it's been touched but you can't trace it to a number, it isn't done.

---

## Logging a bug in Azure (keep it fast)

Minimum fields so the bug is actionable without a follow-up round trip:

- **Title** — short, specific
- **Severity / Priority** — Sev1–4 (or P1–P4)
- **Build / version** tested on (e.g. `0.0.87 (123)` or commit sha)
- **Environment** — Dev / Staging / Prod, plus device + OS for mobile
- **Steps to reproduce** — numbered
- **Expected vs Actual**
- **Evidence** — screenshot / log / short video
- **Area + assignee** (if known)

Then drop the BUG number into the thread.

---

## Status convention

Pick one and post it (and, if your client allows editing the thread title/first post, reflectit there):


| Tag                     | Meaning                                 |
|-------------------------|-----------------------------------------|
| 🔍 **Investigating**  | Triaging / reproducing                  |
| 🛠️ **In Progress** | Actively being fixed                    |
| 👀 **In Review**      | PR open — link it                     |
| 🧪 **In QA**          | Handed to QA on build `<version>` |
| ✅ **Verified**        | QA passed — closes `AB#<id>`    |
| 🚫 **Blocked**        | Say what/who is blocking                |


A bug isn't "done" until it's **merged + QA-verified + the work item is closed** with averification note.

---

## QA hand-off

When you move something to QA, post:

```
🧪 IN QA — AB#<id>  
Build/Version: <e.g. 0.0.87 (123) / commit sha>  
Environment: <Dev / Staging / device + OS>  
What changed / what to check: <one or two lines>  
PR: <link>
```

## QA Verified report (post when QA passes)

```
✅ QA VERIFIED — AB#<id>  
Title: <bug title>  
Build/Version: <version tested>  
Environment: <Dev / Staging / device + OS>  
Tested:  
  - <case / step 1>  
  - <case / step 2>  
Result: Pass — behaves as expected; no regressions seen in <area>  
Notes: <optional>
```

## QA-found bug report (post when QA finds one)

```
🐞 NEW BUG — AB#<id>     (logged in Azure first)  
Title: <short summary>  
Severity: <Sev1–4 / P1–P4>  
Build/Version: <where it was found>  
Environment: <Dev / Staging / device + OS>  
Steps to reproduce:  
1.  
2.  
Expected:  
Actual:  
Evidence: <screenshot / log / video>
```

---

## Blockers

If you're blocked, say so the same day: switch the status to 🚫 **Blocked** and name theblocker (a person, another work item, an environment, a missing decision). A silent blockeris the thing that stalls the board.

## Keep decisions in the thread

Calls and DMs are fine for deep debugging — but the **outcome goes back in the thread**(decision, root cause, next step). If it isn't written down, it didn't happen, and the nextperson re-debugs it from scratch.

## Reopens / regressions

If a verified bug comes back, **reopen the same work item** (don't spin up a fresh BUG with nolink) and note the build it regressed on. Keeps the history in one place.

---

## Good vs. not

- ✅ `[BUG 2065] 502 on /assets` · 🛠️ In Progress · PR linked · `AB#2065` in the commit · QAVerified report on close.
- ❌ "hey the assets thing is broken again" in an unrelated thread, no number, fixed in acommit titled "fix stuff."

 
