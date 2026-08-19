/**
 * Per-item stagger shared by the "cascade in" reveal on the Terms of Use and Privacy Policy
 * pages (and Registration's field groups) — SummaryCard's own sections use it internally,
 * and each page continues the same rhythm for whatever follows the card (checkboxes, the
 * Back/Continue row), so the whole page reads as one continuous cascade rather than the
 * card and the rest of the page animating out of sync with each other.
 */
export const CASCADE_STEP_MS = 90

export function cascadeDelay(index: number): string {
  return `${index * CASCADE_STEP_MS}ms`
}
