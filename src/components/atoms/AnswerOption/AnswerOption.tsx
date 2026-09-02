import styles from './AnswerOption.module.css'

export interface AnswerOptionProps {
  /** `radio` renders as a centered, glyph-less row (Figma's Yes/No treatment) since a
   * question's own radio group already conveys "pick one" without needing a visible dot on
   * every row too. `checkbox` renders a real checked/unchecked box on the left, left-aligned
   * label — this repo's `Checkbox` atom's own checked-state recipe (rounded-sm, border-strong
   * → primary, white check mark), reused here rather than duplicated. Both variants use a
   * native `<input>` under the hood for real radio/checkbox semantics and keyboard support,
   * and both highlight the *whole row* (border + primary-soft fill) once selected — the one
   * visual departure from those bare controls, needed since each row here is its own
   * generously-sized tap target, not a small control beside a separate label. */
  type: 'radio' | 'checkbox'
  name: string
  value: string
  label: string
  checked: boolean
  onChange: () => void
}

export function AnswerOption({ type, name, value, label, checked, onChange }: AnswerOptionProps) {
  return (
    <label
      className={[styles.option, checked && styles.checked, type === 'radio' && styles.centered]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={type === 'checkbox' ? styles.checkboxInput : styles.radioInput}
      />
      <span className={styles.label}>{label}</span>
    </label>
  )
}
