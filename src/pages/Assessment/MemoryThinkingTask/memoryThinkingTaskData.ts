/**
 * Mock content for `MemoryThinkingTaskPage` — every string here is copy a real administrator
 * would say or show for that step, sourced from Figma's "Memory and Thinking" section (node
 * 756:11410, file `uajF7CIU6kCyd2epbvlNNl`), but nothing here is actually spoken, listened to,
 * or graded; see that page's own doc comment for why. Kept in its own module, the same way
 * `lifestyleQuestions.ts`/`prioritiesTopics.ts` separate their own content from their page
 * components, so the flow's copy can be read/edited on its own.
 */

/** The list "read aloud" at Immediate Recall and asked about again at Delayed Recall/
 * Recognition — a fresh list for this flow rather than importing the older
 * `shoppingListItemsVoiceOver.ts`'s own list, so this new flow stays fully independent of the
 * flow it sits alongside (see `MemoryThinkingTaskPage`'s doc comment on why the two don't share
 * code), even though both use the same "pretend you're going shopping" premise. */
export const SHOPPING_LIST_ITEMS = [
  'Notepad',
  'Backpack',
  'Printer',
  'Batteries',
  'Lamp',
  'Chair',
  'Coffee',
  'Sweater',
  'Candles',
] as const

/** Immediate Recall is administered twice (Figma's "Immediate Recall" and "Immediate Recall
 * Repeat" rows) — same three steps (instructions, listen, recall) run twice with the second
 * trial's own, slightly different instructions copy (`IMMEDIATE_RECALL_INSTRUCTIONS_BY_TRIAL`
 * below), not two different screen designs. */
export const IMMEDIATE_RECALL_TRIAL_COUNT = 2

export const IMMEDIATE_RECALL_INSTRUCTIONS_BY_TRIAL: readonly (readonly string[])[] = [
  [
    'I would like you to pretend that you are going shopping. I am going to read a list of things you need to buy.',
    'When I finish reading the whole list, please repeat back as many words as you can remember, in any order.',
    'Please do not write the words down, just say them out loud.',
    'Press the Start button when you are ready to begin.',
  ],
  [
    'Now I am going to read the shopping list again.',
    'When I am finished reading the whole list, I will ask you to say the words back to me in any order.',
    'Please do not write the words down, just say them out loud.',
    'Press the Start button when you are ready to begin.',
  ],
]

export const CATEGORY_FLUENCY_INSTRUCTIONS = [
  'In this task, you will hear a category.',
  'Then, you will say as many things as you can think of from that category.',
  'You have one minute to say your answers.',
]
export const CATEGORY_FLUENCY_CATEGORY = 'Animals'

export const BACKWARD_DIGIT_SPAN_INSTRUCTIONS = [
  'Now, you will hear five numbers.',
  'After listening to all of them, repeat the numbers backwards.',
  'Please keep the numbers in your mind without writing them down.',
]
export const BACKWARD_DIGIT_SPAN_EXAMPLE = { heard: '1 4 2 7 5', said: '5 7 2 4 1' } as const
export const BACKWARD_DIGIT_SPAN_PRACTICE_RESULT_DIGITS = '6 9 4 8 2'
/** Figma builds exactly three live trials after the practice round ("You will do this three
 * times.") — each just repeats the same listen/repeat/done steps, so this flow loops that
 * fixed-length sequence rather than defining three near-identical screen designs. */
export const BACKWARD_DIGIT_SPAN_TRIAL_COUNT = 3

export const DELAYED_RECALL_INSTRUCTIONS = [
  'Now, try to remember the shopping list from earlier.',
  'When you are ready, say all the words you can remember, in any order.',
  'Please do not write the words down, just say them out loud.',
]

export const DELAYED_RECOGNITION_INSTRUCTIONS = [
  'Now you will see groups of three words.',
  'For each group, please select which word was on the shopping list.',
]

export interface RecognitionTrial {
  /** The first trial spells out where the list came from ("...you heard at the start of the
   * assessment?"); Figma's later trials shorten it to the same question asked plainly, so only
   * the very first trial carries the fuller phrasing. */
  question: string
  /** One real `SHOPPING_LIST_ITEMS` word plus two plausible distractors — this is a click-
   * through, so nothing here is ever checked against the right answer; the point is just to
   * show a real three-option recognition question, not to grade it. */
  options: readonly string[]
}

export const DELAYED_RECOGNITION_TRIALS: readonly RecognitionTrial[] = [
  {
    question: 'Which word was on the shopping list you heard at the start of the assessment?',
    options: [SHOPPING_LIST_ITEMS[0], 'Folder', 'Envelope'],
  },
  {
    question: 'Which word was on the shopping list?',
    options: ['Charger', SHOPPING_LIST_ITEMS[3], 'Remote'],
  },
  {
    question: 'Which word was on the shopping list?',
    options: [SHOPPING_LIST_ITEMS[8], 'Matches', 'Lantern'],
  },
]
