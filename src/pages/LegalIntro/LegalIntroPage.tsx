import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { LegalLayout } from '../LegalLayout'
import styles from './LegalIntroPage.module.css'

/** The "no user added" decorative illustration, on request, on a white circle backdrop (also
 * on request — so it always reads as an icon-in-a-circle badge, matching the "icon in a circle"
 * treatment used elsewhere in this app, e.g. `ActivityCardV2`'s `iconCircle`). The circle and
 * artwork are one shape in one `<svg>` — a single `viewBox`, with the circle painted first (so
 * it sits behind) and the original artwork's own group just translated to stay centered on it —
 * rather than two separately-positioned/sized elements, so there's no way for them to drift
 * apart at a different breakpoint: resizing this one root element scales both together, always.
 * Replaces the earlier placeholder blob (three attempts at an original hand-wave SVG never read
 * as clean, polished art, so that placeholder just marked the spot until a real asset arrived). */
function WelcomeIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="80" cy="80" r="64" fill="var(--color-surface, #fff)" />
      <g transform="translate(1.5, 30)">
        <path
          d="M152.275 58.3115C144.672 65.837 144.892 66.7702 155 69.8137C144.892 66.7695 144.223 67.4325 146.724 78C144.223 67.4318 143.329 67.1645 135.727 74.69C143.329 67.1645 143.111 66.2313 133 63.1929C143.11 66.232 143.779 65.569 141.278 55C143.778 65.5697 144.672 65.8377 152.275 58.3115Z"
          fill="#B1E5FB"
        />
        <path
          d="M11.1846 26C18.7437 35.0013 21.6181 35.3299 31.2946 28.2987C21.6167 35.3299 21.2661 38 28.8224 47C21.2661 37.9987 18.3889 37.6701 8.7124 44.7013C18.3903 37.6701 18.7437 35.0013 11.1846 26Z"
          fill="#B1E5FB"
        />
        <path
          d="M29.0342 81.615C36.4066 84.0883 38.1106 83.4292 40.9433 77C38.1106 83.4286 38.8661 84.9107 46.2397 87.3829C38.8661 84.9107 37.1608 85.5719 34.3293 92C37.1614 85.5724 36.4066 84.0883 29.0342 81.615Z"
          fill="#C3E3AC"
        />
        <path
          d="M126.89 15.615C134.263 18.0883 135.967 17.4292 138.8 11C135.967 17.4286 136.722 18.9107 144.096 21.3829C136.722 18.9107 135.017 19.5719 132.186 26C135.018 19.5724 134.263 18.0883 126.89 15.615Z"
          fill="#C3E3AC"
        />
        <line
          x1="41.75"
          y1="67.25"
          x2="1.25"
          y2="67.25"
          stroke="#EEF8FF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="41.75"
          y1="73.25"
          x2="19.25"
          y2="73.25"
          stroke="#EEF8FF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="155.75"
          y1="47.25"
          x2="107.25"
          y2="47.25"
          stroke="#EEF8FF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="135.75"
          y1="41.25"
          x2="108.25"
          y2="41.25"
          stroke="#EEF8FF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M95.9678 26.3061C95.9678 33.4868 90.4406 39.1434 83.8206 39.1434C77.2006 39.1434 71.6735 33.4868 71.6735 26.3061C71.6735 19.1255 77.2006 13.4689 83.8206 13.4689C90.4406 13.4689 95.9678 19.1255 95.9678 26.3061ZM97.9678 26.3061C97.9678 34.5005 91.6339 41.1434 83.8206 41.1434C76.0074 41.1434 69.6735 34.5005 69.6735 26.3061C69.6735 18.1117 76.0074 11.4689 83.8206 11.4689C91.6339 11.4689 97.9678 18.1117 97.9678 26.3061ZM50.7077 24.543L50.7077 24.543C49.5627 23.1783 48.5073 21.9205 47.496 20.8105C45.8553 19.0096 44.2737 17.5386 42.6069 16.8257C40.8335 16.0672 39.0426 16.1974 37.1721 17.3789C35.3687 18.5178 34.3121 19.9865 34.0607 21.7836C33.8174 23.5223 34.3543 25.3979 35.3414 27.3382C37.3093 31.2065 41.3436 35.8476 46.2522 41.1338C53.5713 49.016 62.3559 53.8811 66.2749 55.3316V88.3557C66.2749 88.908 66.7227 89.3557 67.2749 89.3557H99.4975C100.05 89.3557 100.498 88.908 100.498 88.3557V68.0511C101.83 69.6361 103.412 71.9857 104.843 74.7929C106.914 78.8583 108.588 83.7331 108.733 88.387C108.75 88.9268 109.193 89.3557 109.733 89.3557H121.864C122.416 89.3557 122.864 88.908 122.864 88.3557C122.864 81.976 119.925 66.5661 108.146 55.4072C100.724 48.3762 91.6583 46.0587 83.1344 44.1172C82.6709 44.0116 82.2093 43.9071 81.7499 43.8032L81.7423 43.8015C73.6619 41.9731 66.258 40.2978 60.7437 35.3004C56.5281 31.48 53.3747 27.7217 50.7077 24.543ZM38.24 19.0698C39.5918 18.2161 40.6914 18.1817 41.8204 18.6646C43.0561 19.193 44.3887 20.3694 46.0176 22.1574C46.9451 23.1755 47.9524 24.3755 49.0661 25.7023L49.0661 25.7023C51.7615 28.9133 55.0804 32.8672 59.4007 36.7824C65.3195 42.1463 73.2214 43.9294 81.1525 45.7191L81.1549 45.7197C81.6668 45.8352 82.1787 45.9507 82.6903 46.0672C91.2254 48.0113 99.7869 50.2429 106.771 56.8591C117.458 66.9838 120.549 80.8311 120.84 87.3557H110.682C110.343 82.6171 108.636 77.8333 106.625 73.8849C104.487 69.6898 101.927 66.287 100.126 64.8325C99.8262 64.5904 99.4141 64.542 99.0665 64.7081C98.7188 64.8742 98.4975 65.2251 98.4975 65.6104V87.3557H68.2749V54.6168C68.2749 54.1778 67.9886 53.7901 67.569 53.661C64.4656 52.7061 55.2984 47.9367 47.7177 39.7729C42.7701 34.4445 38.9426 30.0063 37.124 26.4313C36.2178 24.65 35.8802 23.213 36.0414 22.0607C36.1944 20.9667 36.8211 19.966 38.24 19.0698Z"
          fill="#676671"
        />
      </g>
    </svg>
  )
}

/**
 * Legal Intro — a brief, conversational heads-up shown right after Verify
 * Account, before the two-step Terms of Use / Privacy Policy flow. Shares
 * LegalLayout's chrome with those two steps for visual continuity, at step
 * 0 — the progress bar previews the journey ahead empty rather than
 * counting this heads-up as a step of its own. The greeting is a fixed
 * "We're glad you're here" — this page used to also ask "How would you
 * like to be called?" and swap the greeting to "Hey, <name>" live as the
 * visitor typed, with that name carried into AuthContext to pre-fill
 * Registration's first name field later, but that whole prompt/field/swap
 * was removed on request. There's no separate Consent step: Privacy
 * Policy's own checkbox covers assessment-results consent, and the
 * age-18+ attestation now lives on Login instead (the very first gate in
 * the funnel, not something to re-confirm here). Its own text fades/rises
 * in on a stagger, the same subtle entrance Verify Account uses for its
 * logo/spinner/message.
 */
export function LegalIntroPage() {
  const navigate = useNavigate()

  return (
    <LegalLayout
      step={0}
      title="We're glad you're here"
      subtitle="Before you get started, we’ll ask you to review a few important details about using Linus Health."
      titleClassName={styles.fadeTitle}
      subtitleClassName={styles.fadeSubtitle}
      illustration={
        <WelcomeIllustration className={[styles.companion, styles.fadeCompanion].join(' ')} />
      }
    >
      <Button
        type="button"
        size="lg"
        className={styles.fadeButton}
        onClick={() => navigate('/terms')}
      >
        Continue
      </Button>
    </LegalLayout>
  )
}
