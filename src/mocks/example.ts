/**
 * Placeholder demonstrating the typed-fixture pattern (see README.md in this
 * folder). Not wired into any screen yet — real mock data lands with the
 * funnel screens in PoD 4, scoped to whatever each screen actually needs.
 */
export interface ExamplePatientSummary {
  id: string
  displayName: string
  lastAssessmentDate: string | null
}

export const mockPatientSummary: ExamplePatientSummary = {
  id: 'mock-patient-1',
  displayName: 'Sample Patient',
  lastAssessmentDate: null,
}
