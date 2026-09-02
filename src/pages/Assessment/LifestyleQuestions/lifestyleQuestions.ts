/** The 15-question Lifestyle questionnaire, transcribed from the Figma "Lifestyle" section
 * (LHQ Segment Screens 16-30, node 575:5665) in reading order — this repo's only source for
 * this content, since there's no real backend or question bank behind this mock-data
 * prototype. `type: 'single'` renders as centered, glyph-less option rows (Figma's Yes/No
 * style, though "medication" has a third non-yes/no option using the same treatment);
 * `type: 'multi'` renders as left-aligned checkbox rows and lets more than one option be
 * selected at once. Every `multi` question ends with a "None of the above" option — see
 * `LifestyleQuestionsPage`'s `toggleMultiOption` for the mutual-exclusivity behavior that
 * option gets (selecting it clears every other selection, and vice versa), matching how a
 * real "none of these" option behaves in a real questionnaire even though Figma's static mock
 * doesn't demonstrate that interaction itself. */
export interface LifestyleQuestion {
  id: string
  text: string
  type: 'single' | 'multi'
  options: string[]
}

export const LIFESTYLE_QUESTIONS: LifestyleQuestion[] = [
  {
    id: 'memory-concern',
    text: 'I am concerned about changes in my memory or thinking abilities.',
    type: 'single',
    options: ['Yes', 'No'],
  },
  {
    id: 'diet',
    text: 'Please select the foods and drinks you have everyday or on most days.',
    type: 'multi',
    options: ['Fruit', 'Vegetables', 'Red Meat', 'Alcohol', 'None of the above'],
  },
  {
    id: 'brain-challenge',
    text: 'I do tasks that challenge my brain (like reading, writing, drawing, or playing a musical instrument) every day or almost every day.',
    type: 'single',
    options: ['Yes', 'No'],
  },
  {
    id: 'sleep',
    text: 'Please select all that apply about your sleep.',
    type: 'multi',
    options: [
      'I sleep on average between 7 and 8 hours each night',
      'I typically take some time to fall asleep',
      'I wake up during the night',
      'None of the above',
    ],
  },
  {
    id: 'activity',
    text: 'Please select all that apply.',
    type: 'multi',
    options: [
      'I can walk up stairs or walk around the neighborhood without help',
      'On average, I sit more than six hours a day',
      'I have been doing some form of moderate or high-intensity exercise (like fast walking, cycling, or running) at least three times a week',
      'None of the above',
    ],
  },
  {
    id: 'pollution',
    text: 'I live in an area of high pollution.',
    type: 'single',
    options: ['Yes', 'No'],
  },
  {
    id: 'purpose',
    text: 'Please select all that apply about your purpose.',
    type: 'multi',
    options: [
      'I am generally satisfied with the course my life has taken',
      'I know what I want to achieve in life, and what is my purpose is',
      'None of the above',
    ],
  },
  {
    id: 'social',
    text: 'Please select all that apply.',
    type: 'multi',
    options: [
      'I sometimes feel lonely or that I lack company or support',
      'Aside from my work, I am involved in some kind of association, club, choir or volunteer activity at least once a week',
      'None of the above',
    ],
  },
  {
    id: 'diagnoses',
    text: 'Please select all that apply.\nA medical doctor has diagnosed me with:',
    type: 'multi',
    options: [
      'Diabetes',
      'Hypertension (high blood pressure)',
      'Heart rhythm problem',
      'Vitamin deficiency (D or B12)',
      'None of the above',
    ],
  },
  {
    id: 'medication',
    text: 'I am taking all my medications as prescribed.',
    type: 'single',
    options: ['Yes', 'No', 'I do not take prescription medication'],
  },
  {
    id: 'senses',
    text: 'Please select all that apply.\nI have noticed (or other people have told me) that:',
    type: 'multi',
    options: [
      'I have poor hearing or hearing problems',
      'I have lost vision or developed vision problems',
      'My sense of smell has become worse over the last 2-3 years',
      'None of the above',
    ],
  },
  {
    id: 'weight',
    text: 'Please select all that apply about your weight:',
    type: 'multi',
    options: [
      'Over the last few years, I have lost noticeable weight without trying (for example, without going on a diet)',
      'A medical doctor has told me that I should lose weight to improve my health',
      'None of the above',
    ],
  },
  {
    id: 'head-injury',
    text: 'I have had a serious head injury (for example, one that included loss of consciousness, being dazed and confused, required hospitalization, or imaging indicating damage to the brain)',
    type: 'single',
    options: ['Yes', 'No'],
  },
  {
    id: 'smoking',
    text: 'I smoke cigarettes or vape regularly.',
    type: 'single',
    options: ['Yes', 'No'],
  },
  {
    id: 'mood',
    text: 'Please select all that apply.\nIn the last month, I have been feeling:',
    type: 'multi',
    options: [
      'Anxious, nervous or worried',
      'Stressed',
      'Down, depressed or hopeless',
      'Little interest or pleasure in doing things',
      'More tired or worn than usual',
      'None of the above',
    ],
  },
]
