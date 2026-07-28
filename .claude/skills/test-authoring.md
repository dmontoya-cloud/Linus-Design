# Skill: test-authoring

Standard for every test added in this repo (component, integration, or otherwise). Beyond-the-happy-path
is a review criterion, not optional.

## Minimum bar per component/feature

- **Happy path**: renders/behaves correctly with valid, typical input.
- **Boundary values**: empty, minimum, maximum, just-over-maximum where relevant.
- **Invalid input**: what happens with bad props/data -- fails closed, doesn't crash silently.
- **Keyboard/a11y**: every interactive element operable by keyboard alone; an automated axe
  assertion where the component renders DOM (see src/components/atoms/Button/Button.test.tsx
  for the pattern using vitest-axe's `axe()` runner).
- **Error/loading states**: once async data lands (PoD 4+), both states get a test.

## Coverage gate

80% lines/branches/functions/statements, enforced in CI via `npm run test:coverage`
(vite.config.ts `test.coverage.thresholds`). Pure re-export barrel files (`index.ts`) and
`.stories.tsx` files are excluded from the denominator -- see the `coverage.exclude` list.

## PoD 0 note

PROCESS.md assigns adversarial test authoring to Codex (Phase 5). Until Codex is connected
(see codex-review.md), the builder (Claude) authors tests directly against this standard, and
that substitution should be called out in the PR description.
