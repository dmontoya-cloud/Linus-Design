/** The Priorities questionnaire's content, transcribed from the Figma "Priorities" section
 * (node 599:6497) in reading order — this repo's only source for this content, since there's
 * no real backend or question bank behind this mock-data prototype. Five named topics (each
 * its own instructions screen, then a free-text answer screen), followed by "Other" (answer
 * only, optional, no instructions screen of its own), then a "Top five" ranking of every answer
 * written across those six topics, then a confidence rating for each of the five chosen
 * answers, then a closing yes/no question — see `PrioritiesQuestionsPage`'s own doc comment for
 * how these are sequenced into the 13 numbered steps Figma's own progress bar shows. */
export interface PriorityTopic {
  id: string
  /** Abbreviated label shown in the progress header, e.g. "Social connections" for the
   * "Relationships and social connections" topic — Figma shortens some of these, not others. */
  progressLabel: string
  /** Full name shown as this topic's own instructions-screen title and, again, as the
   * question-card title on every other screen this topic renders. */
  title: string
  /** Paragraphs shown above the dashed example callout on this topic's instructions screen. */
  instructions: string[]
  /** The quoted example inside that dashed callout, e.g. `My ability to drive my car.` */
  example: string
  /** The lead-in question shown above the free-text answer field(s) on this topic's answer
   * screen, e.g. "What matters most to me about my daily tasks is:" */
  answerLeadIn: string
}

export const NAMED_TOPICS: PriorityTopic[] = [
  {
    id: 'daily-tasks',
    progressLabel: 'Daily tasks',
    title: 'Daily tasks',
    instructions: [
      'What are some of your most important daily tasks? These are tasks you want to be able to keep doing for as long as possible even if your brain health got worse.',
      'These things can be simple or complex.',
    ],
    example: 'My ability to drive my car.',
    answerLeadIn: 'What matters most to me about my daily tasks is:',
  },
  {
    id: 'enjoying-life',
    progressLabel: 'Enjoying life',
    title: 'Enjoying life',
    instructions: [
      'What are some of your most important hobbies or activities? These are hobbies or activities you want to be able to continue doing for as long as possible even if your brain health got worse.',
      'It can be anything at all you enjoy doing.',
    ],
    example: 'My ability to play golf.',
    answerLeadIn: 'What matters most to me about the enjoyable things in my life is:',
  },
  {
    id: 'social-connections',
    progressLabel: 'Social connections',
    title: 'Relationships and social connections',
    instructions: [
      'Think about how you are with other people, like friends or family. What are some of the most important abilities that allow you to have meaningful relationships? These are abilities you want to hold on to for as long as possible even if your brain health got worse.',
      'It can be anything that relates to other people around you.',
    ],
    example: 'My ability to chat with friends.',
    answerLeadIn: 'What matters most to me about relationships and social connections in my life is:',
  },
  {
    id: 'thinking-skills',
    progressLabel: 'Thinking skills',
    title: 'Thinking skills',
    instructions: [
      'We use thinking skills to do things like learn, remember, and make plans. What are some of your most important thinking skills? These are skills you want to hold on to for as long as possible even if your brain health got worse.',
      'These things can be simple or complex.',
    ],
    example: "My ability to understand a movie's storyline.",
    answerLeadIn: 'What matters most to me about my thinking skills is:',
  },
  {
    id: 'sense-of-purpose',
    progressLabel: 'Sense of purpose',
    title: 'Sense of who you are as a person',
    instructions: [
      'Some things are central to making you feel like you. These things can give you a sense of purpose in life. What are some of the most important things about you as a person?',
      'These are things about you and your purpose that you want to hold on to even if your brain health got worse.',
    ],
    example: 'My ability to still give advice to my family and friends.',
    answerLeadIn: 'What matters most to me about my sense of who I am as a person is:',
  },
]

export const OTHER_TOPIC = {
  id: 'other',
  progressLabel: 'Other',
  answerLeadIn: 'If there is anything else that is important to you, please write your answer in the box below.',
}

export const TOP_FIVE = {
  progressLabel: 'Top five',
  instructionsTitle: 'What is the most important to you?',
  instructionsBody:
    'Please choose five answers which are most important to you. The order of your answers does not matter.',
  selectTitle: 'What is the most important to you?',
  selectSubtitle: 'You may need to scroll up and down to see all your answers.',
  maxSelections: 5,
}

export const RATING = {
  progressLabel: 'Rating',
  instructionsTitle: 'Rating your confidence in doing the things that matter to you the most',
  instructionsBody: 'Please rate how confident you feel in doing the things that matter to you the most.',
  instructionsExample:
    'For example, maybe you said "Ability to use public transport" matters to you. If you feel you are able to use public transport confidently, rate your confidence as high.\n\nIf you feel you are not able to use public transport confidently, rate your confidence as low.',
  questionLead: 'How confident do you feel about this at the moment?',
  options: ['Not at all', 'Slightly', 'Somewhat', 'Fairly', 'Completely'],
}

export const ASSIST_QUESTION = {
  progressLabel: 'Rating',
  text: 'Did someone assist you in completing these questions today?',
  options: ['Yes', 'No'],
}

export const TOTAL_STEPS = 13
