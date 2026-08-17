import { Link } from 'react-router-dom'
import { defaultTypography } from '@/tokens/typography'
import { defaultSpacing, breakpoints } from '@/tokens/spacing'
import styles from './DesignSystemPage.module.css'

/**
 * Design System reference page — a single browsable page (inspired by the
 * structure of mews.design) documenting the real tokens and components we
 * have been able to confirm from the "Linus Mobile - Design System" and
 * "Linus - Universal Design System" Figma files plus PDF exports, alongside
 * this repo's placeholder token pipeline (see src/tokens).
 *
 * IMPORTANT — provenance: every value below is labelled Confirmed,
 * Placeholder, or Blocked. Nothing here is invented; where the real Figma
 * value could not be retrieved (see docs/work-items/WI-0002), the gap is
 * shown openly rather than guessed. See the "Sources & status" section at
 * the bottom for exactly how each section was sourced.
 */

interface Swatch {
  name: string
  hex?: string
  note?: string
}

const CHART_SEQUENTIAL: Swatch[] = [
  { name: 'Lightest Teal', hex: '#AAFFFF' },
  { name: 'Light Teal', hex: '#70C7D7' },
  { name: 'Dark Teal', hex: '#3C91AE' },
  { name: 'Darker Teal', hex: '#065E83' },
  { name: 'Lighter Purple', hex: '#FFE3FF' },
  { name: 'Light Purple', hex: '#C399D4' },
  { name: 'Dark Purple', hex: '#7D57AF' },
  { name: 'Darker Purple', hex: '#13208D' },
  { name: 'Dark Orange', hex: '#ED7468', note: 'Errors / important info' },
]

const SEMANTIC_TEXT_TOKENS = [
  'Text/Primary',
  'Text/Secondary',
  'Text/White',
  'Text/Info',
  'Text/Teal',
  'Text/Alert',
  'Text/Warning',
  'Text/Success',
  'Text/Disabled',
]

const BUTTON_VARIANTS = [
  {
    id: 'primary',
    name: 'Primary / Main',
    description: 'Filled, high-emphasis. Default call to action.',
    previewClass: styles.previewPrimary,
  },
  {
    id: 'secondary',
    name: 'Secondary / Ghost',
    description: 'Outlined, medium-emphasis.',
    previewClass: styles.previewSecondary,
  },
  {
    id: 'specialty',
    name: 'Specialty',
    description: 'Filled, square corners — used for distinct one-off actions.',
    previewClass: styles.previewSpecialty,
  },
  {
    id: 'tertiary',
    name: 'Tertiary / Text',
    description: 'Text-only link style. Has "comfortable" and "packed" padding modes.',
    previewClass: styles.previewTertiary,
  },
]

function Swatches({ items, placeholder }: { items: Swatch[]; placeholder?: boolean }) {
  return (
    <div className={styles.swatchGrid}>
      {items.map((item) => (
        <div className={styles.swatch} key={item.name}>
          {placeholder || !item.hex ? (
            <div
              className={styles.swatchColorPlaceholder}
              role="img"
              aria-label={`${item.name}: hex value not yet available`}
            >
              TBD
            </div>
          ) : (
            <div
              className={styles.swatchColor}
              style={{ background: item.hex }}
              role="img"
              aria-label={`${item.name}, ${item.hex}`}
            />
          )}
          <div className={styles.swatchMeta}>
            <span className={styles.swatchName}>{item.name}</span>
            {item.hex && !placeholder ? (
              <span className={styles.swatchHex}>{item.hex}</span>
            ) : (
              <span className={styles.swatchHex}>hex TBD</span>
            )}
            {item.note ? <div className={styles.sourceNote}>{item.note}</div> : null}
          </div>
        </div>
      ))}
    </div>
  )
}

function Badge({ kind }: { kind: 'confirmed' | 'placeholder' | 'blocked' }) {
  const label =
    kind === 'confirmed' ? 'Confirmed' : kind === 'placeholder' ? 'Placeholder' : 'Blocked'
  const className =
    kind === 'confirmed'
      ? styles.badgeConfirmed
      : kind === 'placeholder'
        ? styles.badgePlaceholder
        : styles.badgeBlocked
  return <span className={`${styles.badge} ${className}`}>{label}</span>
}

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ href: '#welcome', label: 'Welcome' }],
  },
  {
    label: 'Foundations',
    items: [
      { href: '#colors', label: 'Colors' },
      { href: '#typography', label: 'Typography' },
      { href: '#spacing', label: 'Spacing & layout' },
    ],
  },
  {
    label: 'Components',
    items: [{ href: '#buttons', label: 'Buttons' }],
  },
  {
    label: 'Reference',
    items: [{ href: '#sources', label: 'Sources & status' }],
  },
]

export function DesignSystemPage() {
  return (
    <div className={styles.page}>
      <nav className={styles.sidebar} aria-label="Design system sections">
        <p className={styles.sidebarTitle}>Linus Design System</p>
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className={styles.navGroupLabel}>{group.label}</p>
            <ul className={styles.navGroup}>
              {group.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Link to="/">&larr; Back to prototype</Link>
      </nav>

      <main className={styles.content}>
        <section id="welcome" className={styles.section}>
          <h1>Linus Design System</h1>
          <p className={styles.lede}>
            A working reference for the tokens and components backing the Linus Patient Engagement
            prototype. Structured after mews.design; content pulled from the &quot;Linus Mobile -
            Design System&quot; and &quot;Linus - Universal Design System&quot; Figma files, plus
            PDF exports where live Figma access wasn&apos;t available.
          </p>
          <p className={styles.sourceNote}>
            This is a living document for a prototype in progress — sections are explicitly labelled{' '}
            <Badge kind="confirmed" /> (verified against a real source),{' '}
            <Badge kind="placeholder" /> (a stand-in value, not yet brand-approved), or{' '}
            <Badge kind="blocked" /> (a real value exists in Figma but couldn&apos;t be retrieved
            yet). See <a href="#sources">Sources &amp; status</a> for the full breakdown.
          </p>
        </section>

        <section id="colors" className={styles.section}>
          <h2>
            Colors <Badge kind="placeholder" />
          </h2>
          <p className={styles.lede}>
            The core UI palette (&quot;Main app colors&quot; and &quot;Grayscale&quot; — roughly 52
            swatches) lives on the Figma &quot;Color Styles&quot; page but only as raw shapes with
            label/hex text content; the tooling available in this session couldn&apos;t read that
            text (see Sources &amp; status). One brand hex is confirmed from a design-rationale note
            on the same page.
          </p>

          <h3>Brand</h3>
          <Swatches
            items={[
              {
                name: 'Primary Blue',
                hex: '#087DAE',
                note: 'Confirmed — cited directly in Figma design notes as the primary interaction color',
              },
            ]}
          />

          <h3>
            Semantic text colors <Badge kind="blocked" />
          </h3>
          <p className={styles.sourceNote}>
            Token names are confirmed; hex values are not yet retrievable.
          </p>
          <Swatches items={SEMANTIC_TEXT_TOKENS.map((name) => ({ name }))} placeholder />

          <h3>
            Data visualization / charts <Badge kind="confirmed" />
          </h3>
          <p className={styles.sourceNote}>
            Published Figma styles under &quot;Sequential Graphs&quot; — hex is embedded directly in
            the style name.
          </p>
          <Swatches items={CHART_SEQUENTIAL} />

          <h3>
            Main app colors &amp; grayscale (52 swatches) <Badge kind="blocked" />
          </h3>
          <p className={styles.sourceNote}>
            Placeholder grid below stands in for the real palette until it can be exported or read
            live from Figma.
          </p>
          <Swatches
            items={Array.from({ length: 6 }, (_, i) => ({ name: `Unresolved swatch ${i + 1}` }))}
            placeholder
          />
        </section>

        <section id="typography" className={styles.section}>
          <h2>
            Typography <Badge kind="placeholder" />
          </h2>
          <p className={styles.lede}>
            Not Figma-sourced — this is the founder-decided IBM Plex Sans scale now documented in{' '}
            <code>docs/design.md</code> (see that file for the full 25-style scale and rationale); a
            Figma-confirmed type scale is still open, tracked separately in WI-0002.
          </p>
          {(
            [
              ['headline-1-semibold', 'Heading 1'],
              ['headline-3-semibold', 'Heading 3'],
              ['headline-5-semibold', 'Heading 5 (section title)'],
              ['paragraph-4-semibold', 'Body Large'],
              ['paragraph-2-regular', 'Body Medium'],
              ['paragraph-1-regular', 'Body Small'],
              ['label-m-regular', 'Caption'],
            ] as const
          ).map(([name, label]) => {
            const style = defaultTypography.styles[name]
            return (
              <div
                key={name}
                className={styles.typeSample}
                style={{
                  fontFamily: style.fontFamily,
                  fontSize: style.fontSize,
                  fontWeight: style.fontWeight,
                }}
              >
                {label}
                <span className={styles.typeMeta}>
                  {style.fontSize} / {style.fontWeight} ({name})
                </span>
              </div>
            )
          })}
        </section>

        <section id="spacing" className={styles.section}>
          <h2>Spacing &amp; layout</h2>
          <p className={styles.lede}>
            4px-base spacing scale and the three responsive breakpoints used across the prototype.
          </p>
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(defaultSpacing).map(([token, value]) => (
                <tr key={token}>
                  <td>
                    <code>{token}</code>
                  </td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Breakpoint</th>
                <th>Min-width</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(breakpoints).map(([bp, min]) => (
                <tr key={bp}>
                  <td>
                    <code>{bp}</code>
                  </td>
                  <td>{min}px</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="buttons" className={styles.section}>
          <h2>
            Buttons <Badge kind="confirmed" />
          </h2>
          <p className={styles.lede}>
            Sourced from the Figma &quot;Buttons&quot; page (Linus Mobile - Design System) and a PDF
            export of the same page. Four variants, three states, two sizes, five icon-position
            options.
          </p>

          <h3>Variants</h3>
          <div className={styles.buttonPreviewRow}>
            {BUTTON_VARIANTS.map((variant) => (
              <button key={variant.id} type="button" className={variant.previewClass} disabled>
                {variant.name}
              </button>
            ))}
          </div>
          <table>
            <thead>
              <tr>
                <th>Variant</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {BUTTON_VARIANTS.map((variant) => (
                <tr key={variant.id}>
                  <td>{variant.name}</td>
                  <td>{variant.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>States</h3>
          <p>Default, Pressed, Disabled — every variant/size/icon combination has all three.</p>
          <div className={styles.buttonPreviewRow}>
            <button type="button" className={styles.previewPrimary}>
              Default
            </button>
            <button
              type="button"
              className={styles.previewPrimary}
              style={{ filter: 'brightness(0.85)' }}
            >
              Pressed
            </button>
            <button
              type="button"
              className={`${styles.previewPrimary} ${styles.previewDisabled}`}
              disabled
            >
              Disabled
            </button>
          </div>

          <h3>Sizes</h3>
          <table>
            <thead>
              <tr>
                <th>Size</th>
                <th>Min-width</th>
                <th>Horizontal padding</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Large</td>
                <td>220px</td>
                <td>32px</td>
              </tr>
              <tr>
                <td>Small</td>
                <td>160px</td>
                <td>16px</td>
              </tr>
            </tbody>
          </table>
          <p className={styles.sourceNote}>
            Height is fixed per size; width is variable (content-driven) above the stated minimum.
          </p>

          <h3>Icon positions</h3>
          <ul className={styles.calloutList}>
            <li>No icon</li>
            <li>Icon right (R1)</li>
            <li>Icon left (L1)</li>
            <li>Icon left and right (L1-R1)</li>
            <li>Icon only</li>
          </ul>

          <h3>
            Gap vs. this repo&apos;s implementation <Badge kind="blocked" />
          </h3>
          <p>
            The current <code>Atom/Button</code> component (<code>src/components/atoms/Button</code>
            ) only implements a single filled/outline/danger set with no size, icon-slot, or
            pressed-state props. Closing that gap is out of scope for this reference page — tracked
            as follow-up work in WI-0002.
          </p>
        </section>

        <section id="sources" className={styles.section}>
          <h2>Sources &amp; status</h2>
          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Brand primary blue</td>
                <td>
                  <Badge kind="confirmed" />
                </td>
                <td>
                  Figma design-rationale text, &quot;Linus - Universal Design System&quot; Color
                  Styles page
                </td>
              </tr>
              <tr>
                <td>Semantic text tokens (names)</td>
                <td>
                  <Badge kind="confirmed" />
                </td>
                <td>Figma layer names, same page (hex values blocked)</td>
              </tr>
              <tr>
                <td>Chart / data-viz colors</td>
                <td>
                  <Badge kind="confirmed" />
                </td>
                <td>Published Figma styles, &quot;Sequential Graphs&quot; group</td>
              </tr>
              <tr>
                <td>Main app colors / grayscale</td>
                <td>
                  <Badge kind="blocked" />
                </td>
                <td>
                  Exists in Figma; hex sits in text-layer content not exposed by the metadata API,
                  and live-selection tools returned no selection in this session
                </td>
              </tr>
              <tr>
                <td>Typography scale</td>
                <td>
                  <Badge kind="placeholder" />
                </td>
                <td>Repo placeholder tokens only; no Figma type scale confirmed yet</td>
              </tr>
              <tr>
                <td>Spacing / breakpoints</td>
                <td>
                  <Badge kind="placeholder" />
                </td>
                <td>Repo tokens; not yet cross-checked against a Figma grid/spacing spec</td>
              </tr>
              <tr>
                <td>Buttons (variants, states, sizes, icon rules)</td>
                <td>
                  <Badge kind="confirmed" />
                </td>
                <td>
                  Figma &quot;Buttons&quot; page + PDF export (<code>pdf/Buttons.pdf</code>)
                </td>
              </tr>
            </tbody>
          </table>
          <p className={styles.sourceNote}>
            Full write-up: docs/work-items/WI-0002-design-system-reference-page.md
          </p>
        </section>
      </main>
    </div>
  )
}
