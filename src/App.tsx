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
import { AssessmentIntroPage } from '@/pages/Assessment/AssessmentIntroPage'
import { DeviceSetupPage } from '@/pages/DeviceSetup/DeviceSetupPage'
import './App.css'

/**
 * Login → Verify Email (magic-link mock) → Legal Intro → Terms of Use →
 * Privacy Policy → Setting Up (spinner) → Thanks (spinner) → Onboarding
 * (registration) → Gender & Identity → Dashboard are real screens, gated by
 * AuthContext's mock auth. Legal Intro is a brief, conversational heads-up
 * ("you'll need to agree to some things") before the two-step Terms/Privacy
 * flow, not a step of its own. There is no separate Consent step — Terms of
 * Use and Privacy Policy's own agreement checkboxes cover that (see
 * TermsOfUsePage / PrivacyPolicyPage), and the age-18+ checkbox now lives
 * on Registration, next to date of birth. Setting Up and Thanks
 * are both brief non-interactive beats between agreeing to Privacy Policy
 * and landing on the registration form — Setting Up marks that consent was
 * recorded, Thanks greets the visitor by the preferred name they gave on
 * Legal Intro. Registration, Gender & Identity, and Education together make
 * up the Profile: Registration collects name/date of birth and Gender &
 * Identity collects gender/sex assigned at birth, both passing their answers
 * forward in router state; Education collects education level and saves the
 * whole thing at once, then hands off to Loading — a last spinner beat
 * before Dashboard appears. Assessment Intro (reached from any Dashboard
 * activity card's Start link) is real too — it reads its instructions aloud
 * via the browser's own speech synthesis — but the actual assessment task
 * flow it would hand off to doesn't exist yet. Paywall/Report are still
 * PoD-4 stubs, as are History/Settings (reachable only from Dashboard's own
 * nav, not listed in this funnel).
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
  { path: '/gender-identity', label: 'Gender & Identity' },
  { path: '/education', label: 'Education' },
  { path: '/loading', label: 'Loading' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/paywall', label: 'Paywall / Subscription' },
  { path: '/assessment', label: 'Assessment Intro' },
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
  '/gender-identity',
  '/education',
  '/loading',
  '/dashboard',
  '/assessment',
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

/** Routes whose own header already provides a way back to the start (e.g. a logo Link to "/"),
 * so the global corner link would only sit on top of their content. */
const ROUTES_WITH_OWN_NAV = ['/dashboard', '/assessment', '/assessment/memory-and-thinking']

/** Hidden on routes in ROUTES_WITH_OWN_NAV — otherwise it overlaps that page's own header content,
 * since both are pinned to the same top-right corner. */
function BackToStart() {
  const location = useLocation()
  if (ROUTES_WITH_OWN_NAV.includes(location.pathname)) {
    return null
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
                path="/gender-identity"
                element={
                  <RequireAuth>
                    <GenderIdentityPage />
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
              <Route
                path="/assessment"
                element={
                  <RequireAuth>
                    <AssessmentIntroPage />
                  </RequireAuth>
                }
              />
              {/* Lifestyle/Priorities aren't built yet — only Memory & Thinking's Start (and
                  the full check-in button) reach the real Assessment Intro screen above. */}
              <Route
                path="/assessment/lifestyle"
                element={
                  <RequireAuth>
                    <Placeholder title="Lifestyle" />
                  </RequireAuth>
                }
              />
              <Route
                path="/assessment/priorities"
                element={
                  <RequireAuth>
                    <Placeholder title="Priorities" />
                  </RequireAuth>
                }
              />
              {/* Where Assessment Intro's "I'm Ready to Begin" hands off to — a device check
                  (hearing, then a real live microphone level check, swapped in place on this
                  one page) before the actual Memory & Thinking task flow, which isn't built yet
                  ("Continue", after the microphone check, leads to its own placeholder below). */}
              <Route
                path="/assessment/memory-and-thinking"
                element={
                  <RequireAuth>
                    <DeviceSetupPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/assessment/memory-and-thinking/microphone-check"
                element={
                  <RequireAuth>
                    <Placeholder title="Microphone Check Complete" />
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
