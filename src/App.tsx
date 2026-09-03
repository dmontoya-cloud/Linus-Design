import { useEffect, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from '@/tokens'
import { AuthProvider, useAuth } from '@/auth'
import { LanguageProvider } from '@/language'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { DesignSystemPage } from '@/design-system/DesignSystemPage'
import { LoginPage } from '@/pages/Login/LoginPage'
import { VerifyEmailPage } from '@/pages/VerifyEmail/VerifyEmailPage'
import { VerifyAccountPage } from '@/pages/VerifyAccount/VerifyAccountPage'
import { LegalIntroPage } from '@/pages/LegalIntro/LegalIntroPage'
import { TermsOfUsePage } from '@/pages/TermsOfUse/TermsOfUsePage'
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicy/PrivacyPolicyPage'
import { OnboardingPage } from '@/pages/Onboarding/OnboardingPage'
import { GenderIdentityPage } from '@/pages/GenderIdentity/GenderIdentityPage'
import { EducationPage } from '@/pages/Education/EducationPage'
import { SettingUpPage } from '@/pages/SettingUp/SettingUpPage'
import { ThanksPage } from '@/pages/Thanks/ThanksPage'
import { LoadingPage } from '@/pages/Loading/LoadingPage'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage'
import { ProfilePage } from '@/pages/Profile/ProfilePage'
import { MemoryThinkingDetailsPage } from '@/pages/Assessment/MemoryThinkingDetailsPage'
import { MemoryThinkingTaskPage } from '@/pages/Assessment/MemoryThinkingTask/MemoryThinkingTaskPage'
import { LifestyleDetailsPage } from '@/pages/Assessment/LifestyleDetailsPage'
import { LifestyleQuestionsPage } from '@/pages/Assessment/LifestyleQuestions/LifestyleQuestionsPage'
import { PrioritiesDetailsPage } from '@/pages/Assessment/PrioritiesDetailsPage'
import { PrioritiesQuestionsPage } from '@/pages/Assessment/PrioritiesQuestions/PrioritiesQuestionsPage'
import { BuildingReportPage } from '@/pages/BuildingReport/BuildingReportPage'
import { ReportReadyPage } from '@/pages/BuildingReport/ReportReadyPage'
import { ReportPage } from '@/pages/BuildingReport/ReportPage'
import './App.css'

/**
 * Login → Verify Email (magic-link mock) → Legal Intro → Terms of Use →
 * Privacy Policy → Setting Up (spinner) → Thanks (spinner) → Onboarding
 * (registration) → Education → Gender & Identity → Dashboard are real
 * screens, gated by AuthContext's mock auth. Legal Intro is a brief,
 * conversational heads-up ("you'll need to agree to some things") before
 * the two-step Terms/Privacy flow, not a step of its own. There is no
 * separate Consent step — Terms of Use and Privacy Policy's own agreement
 * checkboxes cover that (see TermsOfUsePage / PrivacyPolicyPage), and the
 * age-18+ checkbox now lives on Registration, next to date of birth.
 * Setting Up and Thanks are both brief non-interactive beats between
 * agreeing to Privacy Policy and landing on the registration form — Setting
 * Up marks that consent was recorded, Thanks greets the visitor by the
 * preferred name they gave on Legal Intro. Registration, Education, and
 * Gender & Identity together make up the Profile: Registration collects
 * name/date of birth and Education collects education level, both passing
 * their answers forward in router state; Gender & Identity collects
 * gender/sex assigned at birth and saves the whole thing at once — ordered
 * last rather than second, on request, since sex assigned at birth is the
 * more sensitive of the two mid-funnel questions — then hands off to
 * Loading, a last spinner beat before Dashboard appears. Assessment Intro
 * (reached from Memory & Thinking's own Details screen, `MemoryThinkingDetailsPage`'s "I'm
 * ready") is real too — a click-through recreation of the real assessment task screens
 * (Immediate Recall, Category Fluency, Backward Digit Span, Delayed Recall, Delayed
 * Recognition), on request: no real microphone/audio recording, no voice grading, no real
 * timers, just Next/Continue advancing — see `MemoryThinkingTaskPage`'s own doc comment. An
 * earlier version of this same activity spoke its instructions aloud via the browser's own
 * speech synthesis and ran a real live microphone check before it; that whole flow has been
 * archived (see `archive/memory-thinking-device-setup-voiceover` in git) and replaced by this
 * one, on request, rather than kept alongside it. Report is still a PoD-4 stub, as are
 * History/Settings (reachable only from Dashboard's own nav, not listed in this funnel).
 * There's no paywall or subscription in this product, so no stub for one is listed here either.
 */
const FUNNEL_STEPS = [
  { path: '/login', label: 'Login' },
  { path: '/verify-email', label: 'Verify Email (magic link)' },
  { path: '/legal-intro', label: 'Legal Intro' },
  { path: '/terms', label: 'Terms of Use' },
  { path: '/privacy', label: 'Privacy Policy' },
  { path: '/setting-up', label: 'Setting Up' },
  { path: '/thanks', label: 'Thanks' },
  { path: '/onboarding', label: 'Onboarding' },
  { path: '/education', label: 'Education' },
  { path: '/gender-identity', label: 'Gender & Identity' },
  { path: '/loading', label: 'Loading' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/assessment', label: 'Assessment Intro' },
  { path: '/report/ready', label: 'Report Ready' },
  { path: '/report/building', label: 'Building your report' },
  { path: '/report', label: 'In-App Report' },
] as const

const REAL_STEP_PATHS = [
  '/login',
  '/verify-email',
  '/legal-intro',
  '/terms',
  '/privacy',
  '/setting-up',
  '/thanks',
  '/onboarding',
  '/education',
  '/gender-identity',
  '/loading',
  '/dashboard',
  '/assessment',
  '/report/ready',
  '/report/building',
  '/report',
]

const STUB_STEPS = FUNNEL_STEPS.filter((step) => !REAL_STEP_PATHS.includes(step.path))

/** Every real step except Login/Verify Email themselves — those two are the pre-auth part of
 * the funnel and should still show as-is from the index. Everything else is gated by
 * `RequireAuth`, so jumping to it directly from the prototype index needs a mock sign-in first
 * (see `Home`) or it would just bounce back to /login. */
const REQUIRE_AUTH_STEP_PATHS = REAL_STEP_PATHS.filter(
  (path) => path !== '/login' && path !== '/verify-email',
)

function Placeholder({ title }: { title: string }) {
  return (
    <main className="screen-placeholder">
      <h1>{title}</h1>
      <p>Not yet built — arrives in PoD 4 (funnel screens).</p>
      <Link to="/" className={buttonClassName('secondary')}>
        Back to prototype index
      </Link>
    </main>
  )
}

/** Redirects to /login unless AuthContext says the mock login has happened. */
function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

/** Dashboard's own header already provides a way back to the start (a logo Link to "/", via
 * `DashboardNavBar`) — the global corner link would be a pure duplicate here, so it's hidden
 * rather than given a destination of its own (Dashboard *is* the menu; a "Back to menu" link
 * pointing at itself would be pointless). */
const ROUTES_WITH_OWN_NAV = ['/dashboard']

/** Every screen in the device-setup/assessment flow reached from Dashboard, for all three
 * activities now, on request — Lifestyle and Priorities' own Details/question-flow routes join
 * Memory & Thinking's here. Each already has its own way back to Dashboard (`DashboardNavBar`'s
 * `exitTo`, or the Details pages' own in-card "Back to dashboard" button), plus the same logo
 * Link to "/" every `DashboardNavBar` screen has. The corner link becomes a "Skip to report"
 * shortcut on these instead — a way to jump straight past whichever activity's flow (none of
 * which is the point of a walkthrough) to Report Ready (`ReportReadyPage`), the same page every
 * activity's real "Finish"/"I'm ready" hands off to, so this shortcut lands in the same place
 * actually finishing would have. Keyed by the `completedActivityId` that activity's own
 * "Finish"/"I'm ready" hands to `ReportReadyPage` (see `LifestyleQuestionsPage`/
 * `PrioritiesQuestionsPage`'s own `navigate` calls) — on request, fixing a bug where this
 * shortcut always credited Memory & Thinking regardless of which activity's route it was
 * actually clicked from, so `ReportReadyPage` kept recommending an activity right after
 * "finishing" it from here. */
const REPORT_SKIP_ACTIVITY_BY_ROUTE: Record<string, string> = {
  '/assessment': 'memory-recall',
  '/assessment/start': 'memory-recall',
  '/assessment/lifestyle': 'speech-pattern',
  '/assessment/lifestyle/questions': 'speech-pattern',
  '/assessment/priorities': 'visual-attention',
  '/assessment/priorities/questions': 'visual-attention',
}

/** On most routes, a quick corner shortcut back to the very beginning of the funnel. Hidden on
 * ROUTES_WITH_OWN_NAV (redundant with that page's own logo link); replaced with a "Skip to
 * report" shortcut to /report/ready on every route in `REPORT_SKIP_ACTIVITY_BY_ROUTE`, passing
 * that route's own activity id along as router `state` the same way a real "Finish" would.
 * Same `.back-to-start` styling and bottom-right position in every case — only whether it
 * renders, and its label/destination, change. */
function BackToStart() {
  const location = useLocation()
  if (ROUTES_WITH_OWN_NAV.includes(location.pathname)) {
    return null
  }
  const skipActivityId = REPORT_SKIP_ACTIVITY_BY_ROUTE[location.pathname]
  if (skipActivityId) {
    return (
      <Link
        to="/report/ready"
        state={{ completedActivityId: skipActivityId }}
        className="back-to-start"
      >
        Skip to report
      </Link>
    )
  }
  return (
    <Link to="/" className="back-to-start">
      Back to start
    </Link>
  )
}

/** React Router's client-side navigation doesn't reset scroll position the way a real page
 * load does — without this, landing on a new step while scrolled down (e.g. Terms of Use's
 * scroll-gated text) carries that same scroll position into the next step. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** /login redirects straight to /legal-intro if already authenticated, so the Login screen never re-shows mid-flow. */
function LoginRoute() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/legal-intro" replace />
  }
  return <LoginPage />
}

/**
 * Jumping straight to a step past Login from this index would otherwise just bounce back to
 * /login via `RequireAuth` — clicking here is a preview shortcut, not the real flow, so it
 * mock-signs-in first (same as actually completing Login) for any step that needs it.
 */
function Home() {
  const { login } = useAuth()

  return (
    <main className="screen-placeholder">
      <h1>Linus Patient Engagement — Prototype</h1>
      <p>
        Login, Legal Intro, Terms of Use, Privacy Policy, Setting Up, Thanks, Onboarding, Gender
        &amp; Identity, Education, and Loading are real. Mock data only.
      </p>
      <nav aria-label="Phase 1 funnel">
        <ul>
          {FUNNEL_STEPS.map((step) => (
            <li key={step.path}>
              <Link
                to={step.path}
                className={buttonClassName('primary')}
                onClick={REQUIRE_AUTH_STEP_PATHS.includes(step.path) ? login : undefined}
              >
                {step.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p>
        {/* A real page load, not a router Link — docs/design.html is a self-contained
            static page outside the SPA, not a React route (see vite.config.ts's
            `designSystem` build entry). */}
        <a href="/docs/design.html" className={buttonClassName('secondary')}>
          Design System reference
        </a>
      </p>
    </main>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      {/* Every entry that mounts <App/> is served under /web/ (see vite.config.ts's three
          rollupOptions.input entries and src/main.tsx) — basename must match, or no Route
          ever matches the real browser pathname and the app silently renders nothing. */}
      <BrowserRouter basename="/web">
        <LanguageProvider>
          <AuthProvider>
            <ScrollToTop />
            <BackToStart />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/design-system" element={<DesignSystemPage />} />
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/verify-account" element={<VerifyAccountPage />} />
              <Route
                path="/legal-intro"
                element={
                  <RequireAuth>
                    <LegalIntroPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/terms"
                element={
                  <RequireAuth>
                    <TermsOfUsePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/privacy"
                element={
                  <RequireAuth>
                    <PrivacyPolicyPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/setting-up"
                element={
                  <RequireAuth>
                    <SettingUpPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/thanks"
                element={
                  <RequireAuth>
                    <ThanksPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <RequireAuth>
                    <OnboardingPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/education"
                element={
                  <RequireAuth>
                    <EducationPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/gender-identity"
                element={
                  <RequireAuth>
                    <GenderIdentityPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/loading"
                element={
                  <RequireAuth>
                    <LoadingPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <DashboardPage />
                  </RequireAuth>
                }
              />
              {/* Reached via the account menu opened by clicking the initials avatar in
                  DashboardNavBar (see DashboardNavBar.tsx) — not part of the funnel above. */}
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              />
              {/* Details screen shown before the task flow below — on request, a new step
                  between Dashboard's "Start Activity"/"Start" and MemoryThinkingTaskPage, not
                  a replacement for it. */}
              <Route
                path="/assessment/start"
                element={
                  <RequireAuth>
                    <MemoryThinkingDetailsPage />
                  </RequireAuth>
                }
              />
              {/* Memory & Thinking's real assessment task screens (Immediate Recall, Category
                  Fluency, Backward Digit Span, Delayed Recall, Delayed Recognition) — a
                  click-through recreation, on request: no real microphone/audio recording, no
                  voice grading, no real timers, just Next/Continue advancing through each step
                  (see `MemoryThinkingTaskPage`'s own doc comment). Replaces an earlier flow that
                  spoke its instructions aloud via the browser's own speech synthesis and ran a
                  real live microphone check first — that flow has been archived (git branch
                  `archive/memory-thinking-device-setup-voiceover`) rather than kept alongside
                  this one, on request. */}
              <Route
                path="/assessment"
                element={
                  <RequireAuth>
                    <MemoryThinkingTaskPage />
                  </RequireAuth>
                }
              />
              {/* Only Memory & Thinking's Start (and the full check-in button) reach the real
                  Assessment Intro screen above; Lifestyle and Priorities each have their own
                  details screen below instead, same pattern as Memory & Thinking's. */}
              <Route
                path="/assessment/lifestyle"
                element={
                  <RequireAuth>
                    <LifestyleDetailsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/assessment/lifestyle/questions"
                element={
                  <RequireAuth>
                    <LifestyleQuestionsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/assessment/priorities"
                element={
                  <RequireAuth>
                    <PrioritiesDetailsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/assessment/priorities/questions"
                element={
                  <RequireAuth>
                    <PrioritiesQuestionsPage />
                  </RequireAuth>
                }
              />
              {/* The confirmation screen every activity's "Finish"/"I'm ready" hands off to, or
                  any route's own "Skip to report" corner link — see
                  REPORT_SKIP_ACTIVITY_BY_ROUTE above. Shows how many activities are done and,
                  from there, either "Go to Dashboard" or "Build my report" (which continues on
                  to /report/building below). */}
              <Route
                path="/report/ready"
                element={
                  <RequireAuth>
                    <ReportReadyPage />
                  </RequireAuth>
                }
              />
              {/* The loading interstitial `ReportReadyPage`'s "Build my report" (above) or
                  Dashboard's own identically-labeled CTA (`FullCheckInCard`, once all three
                  activities are done) hand off to. Hands off to /report after a brief
                  non-interactive beat, same pattern as Loading/Setting Up/Thanks. */}
              <Route
                path="/report/building"
                element={
                  <RequireAuth>
                    <BuildingReportPage />
                  </RequireAuth>
                }
              />
              {/* The real destination `BuildingReportPage`'s loading interstitial hands off to
                  once it finishes — on request, follows the same page rules (chrome, title/
                  subtitle treatment) as `BuildingReportPage`/`ReportReadyPage` rather than a
                  one-off layout. */}
              <Route
                path="/report"
                element={
                  <RequireAuth>
                    <ReportPage />
                  </RequireAuth>
                }
              />
              <Route path="/history" element={<Placeholder title="History" />} />
              <Route path="/settings" element={<Placeholder title="Settings" />} />
              {STUB_STEPS.map((step) => (
                <Route
                  key={step.path}
                  path={step.path}
                  element={<Placeholder title={step.label} />}
                />
              ))}
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
