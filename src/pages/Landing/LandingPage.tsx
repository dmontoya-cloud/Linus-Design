import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/atoms/Logo'
import { buttonClassName } from '@/components/atoms/Button/buttonClassName'
import heroPhoto from './assets/hero-photo.png'
import receiveReportPhoto from './assets/receive-report.png'
import sciencePhoto from './assets/science-photo.png'
import gradientOverlay from './assets/gradient-overlay.svg'
import iconBrainStep from './assets/icon-brain-step.svg'
import iconLifestyleStep from './assets/icon-lifestyle-step.svg'
import iconPrioritiesStep from './assets/icon-priorities-step.svg'
import vennGroup3 from './assets/venn-group3.svg'
import vennGroup4 from './assets/venn-group4.svg'
import vennGroup5 from './assets/venn-group5.svg'
import vennVector1 from './assets/venn-vector1.svg'
import vennVector2 from './assets/venn-vector2.svg'
import vennVector3 from './assets/venn-vector3.svg'
import styles from './LandingPage.module.css'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#the-report', label: 'The Report' },
  { href: '#science', label: 'Science' },
  { href: '#privacy', label: 'Privacy' },
  { href: '#questions', label: 'Questions' },
]

const CALLOUTS = [
  'Developed by brain health experts',
  'Based on validated assessments',
  'Used in healthcare and research',
]

const STEPS = [
  {
    icon: iconBrainStep,
    title: 'Complete a thinking and memory exercise',
    duration: '~7 min',
    body: 'A brief exercise, developed by clinicians, that looks at how you remember, focus, and think.',
  },
  {
    icon: iconLifestyleStep,
    title: 'Reflect on your health and lifestyle',
    duration: '~5 min',
    body: 'Answer questions about sleep, activity, mood, daily habits, and other factors that can influence how you feel and function.',
  },
  {
    icon: iconPrioritiesStep,
    title: 'Tell us what matters to you the most',
    duration: '~8 min',
    body: 'Share your priorities and what you want your brain to help you do in the years ahead, so the guidance is relevant to your life.',
  },
]

const RECEIVE_ITEMS = [
  'Understand your brain health today',
  'See where you may want to focus',
  'Explore practical next steps and relevant resources',
  'Support conversations with your healthcare provider',
]

const SCIENCE_STATS = [
  { title: '20+ years', body: 'Of research behind our approach' },
  { title: 'Clinician-informed', body: 'Shaped by clinical expertise' },
  { title: 'Used in the real world', body: 'Across healthcare and research settings.' },
]

const PRIVACY_STATS = [
  {
    title: 'Yours to keep',
    body: 'Your Brain Health Report belongs to you. You choose whether to save it, print it, or share it with a healthcare provider.',
  },
  {
    title: 'Encrypted end to end',
    body: 'Personal information is encrypted in transit and at rest, and stored on infrastructure that meets healthcare data standards.',
  },
  {
    title: 'Never sold',
    body: 'We do not sell personal information. We do not share it with advertisers or data brokers.',
  },
  {
    title: 'Plain-language consent',
    body: 'You will always see, in clear language, how any information is used before you provide it.',
  },
]

const FAQS = [
  {
    question: 'Will my Brain Health Report tell me if I have a medical condition?',
    answer:
      'No. Your Brain Health Report is not reviewed by a clinician and does not provide a diagnosis, medical advice, or treatment. It is not a complete clinical evaluation. If you have concerns about your health, talk with a healthcare provider.',
  },
  {
    question: 'Can I use my Brain Health Report to track changes over time?',
    answer:
      'Your Brain Health Report is designed to give you a view of your brain health at a point in time, not to monitor or measure changes over time.',
  },
  {
    question: 'How is my information protected?',
    answer:
      'Your information is protected using privacy and security safeguards designed to keep it secure. Access is limited to those who need it to provide and support the experience, and your information is handled in accordance with applicable privacy practices.',
  },
  {
    question: 'Can I stop and come back later?',
    answer:
      'Yes. If you need to pause between parts of the experience, you can return and continue where you left off. However, answers from incomplete parts will not be saved.',
  },
  {
    question: 'Who is Linus Health?',
    answer:
      'Linus Health is a Boston-based digital health company focused on improving brain health around the world. The company works with healthcare delivery organizations, research institutions, and life sciences partners to advance earlier detection and better brain health outcomes.',
  },
]

/** A single check-mark bullet, on request matching the callout strip's icon-in-a-box treatment
 * — a plain checkmark glyph (not the app's own circle-outlined `CheckCircleIcon`, which reads
 * wrong stacked on its own filled color box). */
function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true" className={className}>
      <path
        d="M15 4.5 6.75 12.75 3 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowRightGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M13.5 5.25 20.25 12l-6.75 6.75M3.75 12h16.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MinusGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PlusGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** A two-column marketing block — an eyebrow + heading + body on one side, a photo/illustration
 * on the other. `imageFirst` mirrors it for alternating left/right sections, matching the
 * Figma frame's own "Two Column v2 Left/Right" naming. */
function TwoColumnSection({
  id,
  eyebrow,
  heading,
  emphasis,
  headingSuffix,
  body,
  image,
  imageFirst,
  tone = 'default',
  children,
}: {
  id?: string
  eyebrow: string
  heading: string
  emphasis?: string
  headingSuffix?: ReactNode
  body: ReactNode
  image?: ReactNode
  imageFirst?: boolean
  tone?: 'default' | 'muted'
  children?: ReactNode
}) {
  const text = (
    <div className={styles.twoColText}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.h2}>
        {heading}
        {emphasis ? <em>{emphasis}</em> : null}
        {headingSuffix}
      </h2>
      <div className={styles.bodyCopy}>{body}</div>
      {children}
    </div>
  )
  const imageBlock = image ? <div className={styles.twoColImage}>{image}</div> : null

  return (
    <section
      id={id}
      className={[styles.twoColSection, tone === 'muted' ? styles.tonedMuted : ''].join(' ')}
    >
      <div className={[styles.twoColInner, imageFirst ? styles.imageFirst : ''].join(' ')}>
        {imageFirst ? (
          <>
            {imageBlock}
            {text}
          </>
        ) : (
          <>
            {text}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  )
}

function StatRow({ title, body, bordered }: { title: string; body: string; bordered?: boolean }) {
  return (
    <div className={[styles.statRow, bordered ? styles.statRowBordered : ''].join(' ')}>
      <p className={styles.statTitle}>{title}</p>
      <p className={styles.statBody}>{body}</p>
    </div>
  )
}

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string
  answer: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className={styles.faq}>
      <button type="button" className={styles.faqHeader} aria-expanded={open} onClick={onToggle}>
        <span className={styles.faqQuestion}>{question}</span>
        {open ? (
          <MinusGlyph className={styles.faqIcon} />
        ) : (
          <PlusGlyph className={styles.faqIcon} />
        )}
      </button>
      {open ? <p className={styles.faqAnswer}>{answer}</p> : null}
    </div>
  )
}

/**
 * Marketing landing page for the public, pre-login funnel entry point — the app's real front
 * door for a first-time visitor, distinct from the `/` prototype/QA index (which lists every
 * funnel step for internal testing and is left untouched). Every "Begin"/"Get started" CTA
 * hands off to `/login`, the actual start of the mock auth funnel (see `App.tsx`'s
 * `FUNNEL_STEPS`); "Explore Resources" and the nav links jump to this same page's own sections
 * rather than a real resources site, which doesn't exist in this prototype.
 *
 * Ported from Figma (node 454:7147) using this app's own design tokens/components where they
 * fit (`Button`'s pill shape and sizes, `Logo`, the color/spacing/type scale) — this is a
 * marketing page, not app UI, so its Larken/Indivisible display type and exact section styling
 * are recreated with plain CSS rather than forced onto the in-app IBM Plex Sans/Plus Jakarta
 * Sans component system, on request.
 */
export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.logoLink} aria-label="Linus Health home">
          <Logo className={styles.logo} />
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>
        <Link
          to="/login"
          className={[buttonClassName('secondary', 'md'), styles.headerCta].join(' ')}
        >
          Begin
        </Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>A brain health experience</p>
          <h1 className={styles.h1}>
            A more <em>personal</em> look at your brain health
          </h1>
          <p className={styles.heroLead}>
            Take a closer look at your brain health through a guided experience from{' '}
            <a href="https://www.linushealth.com" target="_blank" rel="noreferrer">
              Linus Health
            </a>{' '}
            that explores how you think and remember, your lifestyle, and what matters most to you.
            In about 20 minutes, it all comes together in your Brain Health Report — a personalized
            view of your brain health today.
          </p>
          <div className={styles.heroActions}>
            <Link to="/login" className={buttonClassName('primary', 'lg')}>
              Get Started
            </Link>
            <a href="#how-it-works" className={styles.textLink}>
              Explore Resources
              <ArrowRightGlyph className={styles.textLinkIcon} />
            </a>
          </div>
        </div>
        <div className={styles.heroPhoto}>
          <img src={heroPhoto} alt="A woman smiling, looking out a window in soft natural light" />
        </div>
        <div className={styles.heroGradient} aria-hidden="true">
          <img src={gradientOverlay} alt="" />
        </div>
      </section>

      <section className={styles.callouts}>
        {CALLOUTS.map((text) => (
          <div key={text} className={styles.calloutItem}>
            <span className={styles.calloutIcon}>
              <CheckGlyph className={styles.calloutIconGlyph} />
            </span>
            <p className={styles.calloutText}>{text}</p>
          </div>
        ))}
      </section>

      <section className={styles.singleColSection}>
        <div className={styles.singleColInner}>
          <div className={styles.singleColHeading}>
            <p className={styles.eyebrow}>What it is</p>
            <h2 className={styles.h2}>
              Your brain health is <em>more</em> than a single measure.
            </h2>
          </div>
          <div className={styles.bodyCopy}>
            <p>
              No single score can tell the whole story. Your Brain Health Report connects how you
              remember, focus, and think; your health and daily life; and what matters most to you.
              Together, they create a more meaningful view of your brain health today.
            </p>
            <p>
              The result: a report designed to help you understand your brain health and identify
              practical steps you can take to support it.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={styles.stepsSection}>
        <div className={styles.stepsInner}>
          <div className={styles.stepsHeading}>
            <p className={styles.eyebrow}>How it works</p>
            <h2 className={styles.h2}>How your Brain Health Report comes together</h2>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((step) => (
              <div key={step.title} className={styles.step}>
                <img src={step.icon} alt="" aria-hidden="true" className={styles.stepIcon} />
                <div className={styles.stepText}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDuration}>{step.duration}</p>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TwoColumnSection
        id="the-report"
        eyebrow="What you’ll receive"
        heading="A "
        emphasis="personalized"
        headingSuffix=" report you can use"
        tone="muted"
        body={
          <p>
            Your Brain Health Report helps turn what you’ve learned into clear insights, practical
            guidance, and resources tailored to what matters to you.
          </p>
        }
        image={
          <img src={receiveReportPhoto} alt="A preview of the personalized Brain Health Report" />
        }
      >
        <ul className={styles.checklist}>
          {RECEIVE_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </TwoColumnSection>

      <section className={styles.ctaSection}>
        <p className={styles.eyebrow}>Begin</p>
        <h2 className={styles.h2}>Ready to see your Brain Health Report?</h2>
        <p className={styles.ctaSubtitle}>
          See your personalized insights, guidance, and resources — all in one place.
        </p>
        <Link to="/login" className={buttonClassName('primary', 'lg')}>
          Get started
        </Link>
      </section>

      <section className={styles.singleColSection}>
        <div className={styles.singleColInnerRow}>
          <div className={styles.vennWrap} aria-hidden="true">
            <div className={styles.venn}>
              <img src={vennVector1} alt="" className={styles.vennCircleTop} />
              <img src={vennVector2} alt="" className={styles.vennCircleLeft} />
              <img src={vennVector3} alt="" className={styles.vennCircleRight} />
              <img src={vennGroup3} alt="" className={styles.vennLabelTop} />
              <img src={vennGroup4} alt="" className={styles.vennLabelLeft} />
              <img src={vennGroup5} alt="" className={styles.vennLabelRight} />
            </div>
          </div>
          <div className={styles.singleColText}>
            <p className={styles.eyebrow}>Why each part matters</p>
            <h2 className={styles.h2}>Each perspective adds something important</h2>
            <div className={styles.bodyCopy}>
              <p>
                Our clinician-developed cognitive exercise helps show how you think. Your overall
                health adds context. What you want your brain to be able to do in the years ahead
                gives those insights direction. Completing all three parts helps make your Brain
                Health Report more useful and relevant to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TwoColumnSection
        id="science"
        eyebrow="The research"
        heading="Built on science. "
        headingSuffix={
          <>
            Designed around <em>you.</em>
          </>
        }
        imageFirst
        image={<img src={sciencePhoto} alt="A person tending to a garden outdoors" />}
        body={
          <p>
            This experience draws on decades of research across cognitive neuroscience, behavioral
            health, and preventive medicine — from the team behind Linus Health, whose brain health
            technology has been recognized among TIME’s Best Inventions.
          </p>
        }
      >
        <div className={styles.statTable}>
          {SCIENCE_STATS.map((stat, index) => (
            <StatRow
              key={stat.title}
              title={stat.title}
              body={stat.body}
              bordered={index < SCIENCE_STATS.length - 1}
            />
          ))}
        </div>
      </TwoColumnSection>

      <section id="privacy" className={styles.privacySection}>
        <div className={styles.privacyInner}>
          <div className={styles.privacyText}>
            <p className={styles.eyebrow}>Privacy &amp; Trust</p>
            <h2 className={styles.h2}>
              Your brain health is <em>personal.</em> Your information is, too.
            </h2>
            <p className={styles.bodyCopy}>
              Brain health information is deeply personal. We treat it that way — technically,
              legally, and in the language we use with you.
            </p>
          </div>
          <div className={styles.statTable}>
            {PRIVACY_STATS.map((stat, index) => (
              <StatRow
                key={stat.title}
                title={stat.title}
                body={stat.body}
                bordered={index < PRIVACY_STATS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="questions" className={styles.faqSection}>
        <p className={styles.eyebrow}>Questions</p>
        <h2 className={[styles.h2, styles.faqHeading].join(' ')}>Before you begin</h2>
        <div className={styles.faqList}>
          {FAQS.map((faq, index) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              open={openFaq === index}
              onToggle={() => setOpenFaq((current) => (current === index ? null : index))}
            />
          ))}
        </div>
      </section>

      <section className={styles.ctaSection}>
        <p className={styles.eyebrow}>Begin</p>
        <h2 className={styles.h2}>Your Brain Health Report starts here</h2>
        <p className={styles.ctaSubtitle}>
          Find a quiet place where you can focus. When you’re ready, we’ll guide you through each
          step to create a report personalized to you.
        </p>
        <div className={styles.ctaActions}>
          <Link to="/login" className={buttonClassName('primary', 'lg')}>
            Get started
          </Link>
          <a href="#how-it-works" className={styles.textLink}>
            Explore Resources
            <ArrowRightGlyph className={styles.textLinkIcon} />
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Logo className={styles.footerLogo} />
            <p className={styles.footerTagline}>
              A guided, evidence-based brain health experience. Developed and brought to you by
              Linus Health, in collaboration with Eisai, Inc. This is not a diagnostic test.
            </p>
          </div>
          <div className={styles.footerColumn}>
            <p className={styles.footerHeading}>Explore</p>
            <a href="#how-it-works" className={styles.footerLink}>
              How it Works
            </a>
            <a href="#the-report" className={styles.footerLink}>
              The Report
            </a>
            <a href="#science" className={styles.footerLink}>
              Science
            </a>
          </div>
          <div className={styles.footerColumn}>
            <p className={styles.footerHeading}>Trust</p>
            <a href="#privacy" className={styles.footerLink}>
              Privacy
            </a>
            <a href="#questions" className={styles.footerLink}>
              Questions
            </a>
            <span className={styles.footerLinkDisabled}>Terms</span>
          </div>
          <div className={styles.footerColumn}>
            <p className={styles.footerHeading}>Contact</p>
            <p className={styles.footerLink}>
              For clinical partnerships and research inquiries, please write to [email address].
            </p>
          </div>
        </div>
        <p className={styles.footerCopyright}>All rights reserved © 2026. Linus Health</p>
      </footer>
    </div>
  )
}
