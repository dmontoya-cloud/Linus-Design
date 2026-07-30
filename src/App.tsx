import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ThemeProvider } from '@/tokens'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import { DesignSystemPage } from '@/design-system/DesignSystemPage'
import './App.css'

/**
 * PoD 0 scaffold. The Phase-1 funnel screens (login, onboarding,
 * consent/privacy, paywall, assessment intro, report) are built in PoD 4 —
 * this route table is a placeholder so navigation, theming, and the
 * component library can be verified end to end before that content lands.
 */
const FUNNEL_STEPS = [
  { path: '/login', label: 'Login' },
  { path: '/onboarding', label: 'Onboarding' },
  { path: '/consent', label: 'Consent / Privacy' },
  { path: '/paywall', label: 'Paywall / Subscription' },
  { path: '/assessment', label: 'Assessment Intro' },
  { path: '/report', label: 'In-App Report' },
] as const

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

function Home() {
  return (
    <main className="screen-placeholder">
      <h1>Linus Patient Engagement — Prototype</h1>
      <p>PoD 0 scaffold: routing, theming, and the component library are wired. Mock data only.</p>
      <nav aria-label="Phase 1 funnel">
        <ul>
          {FUNNEL_STEPS.map((step) => (
            <li key={step.path}>
              <Link to={step.path} className={buttonClassName('primary')}>
                {step.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p>
        <Link to="/design-system" className={buttonClassName('secondary')}>
          Design System reference
        </Link>
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
          {FUNNEL_STEPS.map((step) => (
            <Route key={step.path} path={step.path} element={<Placeholder title={step.label} />} />
          ))}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
