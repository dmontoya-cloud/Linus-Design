# Figma ↔ Prototype Gap Analysis — 2026-08-30

Ad hoc report, generated on request, following the same sync pass reported inline earlier this
session (new Building Report screens, Dashboard header/tracker updates, Scroll down to agree
pill). This document is the durable record of that comparison: what was checked, what matched,
what was fixed, and what's still open. Figma file: `uajF7CIU6kCyd2epbvlNNl` ("Linus Health —
Prototype"). Prototype: this repo, `src/App.tsx`'s route table as of this commit.

## 1. Method

Every real (non-placeholder) route in `src/App.tsx` was matched to a frame on the corresponding
Figma page, by node ID. "Real" excludes routes rendered by the generic `<Placeholder>` component
(Lifestyle/Priorities and their Details pages, History, Settings, `/report`, `/paywall`, `/assessment/memory-and-thinking/task/next`) —
those have no built screen yet, so there's nothing for Figma to match.

Depth of check varied by screen:

- **Building Report, Report Ready, Dashboard, Memory & Thinking Details, Terms of Use, Privacy Policy** —
  checked against the live running prototype this session (measured DOM positions/colors/type
  where a new Figma frame was built from scratch), and fixed where they drifted. See §3.
- **Every other screen below** — confirmed a Figma frame exists at the right route and covers the
  right content area, via node inventory only. Not re-diffed pixel-for-pixel against the live app
  in this pass — no content drift is known on these, but none was actively re-verified either.
  Flag anything found in the wild.

## 2. Coverage table

| Route                                              | Screen (component)                       | Figma page                | Figma frame(s)                                                                       | Status                                                  |
| -------------------------------------------------- | ---------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `/login`                                           | LoginPage                                | Auth Flow                 | `Login` (5:2)                                                                        | Present — not re-diffed this pass                       |
| `/verify-email`                                    | VerifyEmailPage                          | Auth Flow                 | `Verify Email` (5:32)                                                                | Present — not re-diffed this pass                       |
| `/verify-account`                                  | VerifyAccountPage                        | Auth Flow                 | `Verify Account` (5:63)                                                              | Present — not re-diffed this pass                       |
| `/legal-intro`                                     | LegalIntroPage                           | Onboarding                | `Legal Intro` (32:37)                                                                | Present — not re-diffed this pass                       |
| `/terms`                                           | TermsOfUsePage                           | Onboarding                | `Terms of Use` (34:58)                                                               | **Updated this pass** — see §3.3                        |
| `/privacy`                                         | PrivacyPolicyPage                        | Onboarding                | `Privacy Policy` (47:130)                                                            | **Updated this pass** — see §3.3                        |
| `/setting-up`                                      | SettingUpPage                            | Onboarding                | `Setting Up` (37:105)                                                                | Present — not re-diffed this pass                       |
| `/thanks`                                          | ThanksPage                               | Onboarding                | `Thanks` (37:108)                                                                    | Present — not re-diffed this pass                       |
| `/onboarding`                                      | OnboardingPage                           | Onboarding                | `Onboarding` (35:81)                                                                 | Present — not re-diffed this pass                       |
| `/gender-identity`                                 | GenderIdentityPage                       | Onboarding                | `Gender & Identity` (10:45)                                                          | Present — not re-diffed this pass                       |
| `/education`                                       | EducationPage                            | Onboarding                | `Education` (40:103)                                                                 | Present — not re-diffed this pass                       |
| `/loading`                                         | LoadingPage                              | Onboarding                | `Loading` (37:111)                                                                   | Present — not re-diffed this pass                       |
| `/dashboard`                                       | DashboardPage                            | Dashboard                 | `Dashboard` (10:91)                                                                  | **Updated this pass** — see §3.1; **partial**, see §4.1 |
| `/assessment`                                      | AssessmentIntroPage                      | Assessment & Device Setup | `Assessment Intro` (36:37)                                                           | Present — not re-diffed this pass                       |
| `/assessment/start`                                | MemoryThinkingDetailsPage                | Assessment & Device Setup | `Memory & Thinking Details` (327:767)                                                | **Verified this pass, already accurate** — see §3.2     |
| `/assessment/memory-and-thinking`                  | DeviceSetupPage (hearing + mic)          | Assessment & Device Setup | `Device Setup - Hearing Check` (50:52), `Device Setup - Microphone Check` (51:68)    | Present — not re-diffed this pass                       |
| `/assessment/memory-and-thinking/microphone-check` | DeviceReadyPage                          | Assessment & Device Setup | `Device Ready` (52:84)                                                               | Present — not re-diffed this pass                       |
| `/assessment/memory-and-thinking/task`             | ShoppingListIntroPage (3 in-place steps) | Assessment & Device Setup | `Shopping List - Instructions` (55:100), `- Listening` (55:186), `- Recall` (55:214) | Present — not re-diffed this pass                       |
| `/report/building`                                 | BuildingReportPage (2 states)            | Assessment & Device Setup | `Building Report` (347:192), `Report Ready` (347:193)                                | **Created this pass** — see §3.4                        |

Not in Figma, and correctly so — no built screen exists yet: `/assessment/lifestyle`,
`/assessment/priorities`, both Details variants, `/assessment/memory-and-thinking/task/next`,
`/history`, `/settings`, `/report`, `/paywall`. `/design-system` (the DesignSystemPage/
`docs/design.html` reference) is generated from `docs/design.md`, not a hand-built screen — out
of scope for a Figma diff.

## 3. Fixed this pass

### 3.1 Dashboard (`10:91`)

- Removed the `Assessment` / `History` / `Settings` header nav links and the active-page
  underline rectangle — the app removed these from `DashboardNavBar` earlier this session; Figma
  still had all three plus the underline.
- Increased the tracker box's internal padding from 8px/16px to 16px/24px (top-bottom/
  left-right), matching the CSS change to `FullCheckInCard.module.css`'s `.trackerBox`. It's a
  real auto-layout frame (`Frame 61`) so this was a direct padding edit, not a manual reposition.

### 3.2 Memory & Thinking Details (`327:767`)

Checked all four instruction item texts against the current component
(`src/pages/Assessment/MemoryThinkingDetailsContent.tsx`) — already word-for-word correct,
including "Only take this once every three months" (no leading "Please," matching a wording
change made earlier this session) and the House-icon "Make sure you're in a quiet room." item.
No edit needed.

### 3.3 Terms of Use (`34:58`) / Privacy Policy (`47:130`)

Added the `scroll-down-hint` pill (primary-filled, `Icon/ArrowDown`, "Scroll down to agree") to
both — this component (`src/pages/ScrollDownHint.tsx`) didn't exist in Figma at all. Placed at
y=820 on each frame as a representative "mid-scroll" position, since the real component is
`position: fixed` to the viewport bottom and has no single fixed position on the full scrollable
page.

### 3.4 Building Report / Report Ready (new: `347:192`, `347:193`)

Neither existed in Figma. Built both from scratch against the live running prototype
(`src/pages/BuildingReport/BuildingReportPage.tsx`), measuring actual DOM rects/colors/type
rather than eyeballing the screenshot:

- Shared: the hand-drawn browser/gauge icon (112×112, `primary` stroke), headline
  (`headline-2-regular`, 40px), "Did you know" tip card (white, 24px radius, `shadow-card`,
  32px padding, measured tip card height 168–172px matches the live app's 172.4px within
  rounding).
- Building Report only: the two-part subtitle (`paragraph-3-regular` secondary + bold
  primary-text "Please stay on this screen."), and the spinner (48px ring, `border`-colored
  track + a `primary`-colored arc standing in for the live spin animation's current frame).
- Report Ready only: `Button` component instances for "Download report" (Primary/lg) and
  "Go to Dashboard" (Secondary/lg — confirmed Figma's Secondary/lg variant already matches the
  app's actual blue-outline style, not design.md's originally-documented green fill, so no
  further reconciliation was needed there).

Vertical rhythm in both frames reproduces the live app's own margin chain (24px icon→title,
16px title→next element, 32px →tip card) rather than copying absolute pixel positions, since the
real page's `justify-content: center` means its absolute Y shifts with viewport height and isn't
meaningful to copy directly.

## 4. Open gaps

### 4.1 Dashboard — completed-activity state not represented

This session added real (client-side, in-memory) completion tracking: a green `Completed` badge
(`badge-success` tokens) replacing `Not started`, the tracker's first progress bar filling solid
`success` green, a blue `Next` badge on the following category, and the activity card's `Start`
button swapping to `Download report`. None of this is in Figma — the `Dashboard` frame still
only shows the all-`not-started` default state. This is a genuinely different screen state (not
a small drift), so it wasn't built into the existing frame; it would need either a second
`Dashboard — Completed` frame or in-place variant work. Flagging rather than guessing which you'd
prefer.

### 4.2 Screens not re-diffed this pass

Every row marked "Present — not re-diffed this pass" in §2 was confirmed to exist and to cover
the right route, but its content wasn't pixel-compared against the current running app in this
session. Given how many small copy/spacing edits have landed over the course of this project,
absence of a flag here is **not** a guarantee of pixel-perfect sync — it means no drift is
_known_, not that none exists. Worth a dedicated pass if you want the same rigor applied there
that Building Report/Dashboard/Memory & Thinking Details got today.

### 4.3 Figma-only content — legacy, correctly excluded

The `Dashboard` page also holds `Dashboard test` (209:888, an earlier reference frame from
before the current `Dashboard` frame existed), a duplicate `full-checkin-card`/`activity-card`
pair as standalone component frames, and a `cailin section` / `old wireframes` section
containing mobile-viewport (375×812) exploratory concepts (`AFTER · My Assessments · Option A`,
etc.) — these read as another designer's alternative explorations, not part of the current
desktop web flow. None of this needed reconciling against the prototype; noted here only so it
isn't mistaken for drift in a future pass.

## 5. Recommendation

Priority order if continuing this work: (1) decide on §4.1's Dashboard-completed representation,
since it's the one **known**, materially different gap; (2) if you want full confidence rather
than "no known drift," schedule a dedicated re-diff pass over the §4.2 list — that's roughly a
dozen more screens, comparable in effort to today's Dashboard/Building-Report pass.
