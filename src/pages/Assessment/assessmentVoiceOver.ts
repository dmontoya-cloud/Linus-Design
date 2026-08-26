import { createVoiceOverReader } from '../voiceOverReading'

/** The only instructions script this prototype has so far, written for the Memory & Thinking
 * activity specifically — only its Start button and the full check-in button reach this screen
 * (see ActivityCard's `startPath`); Lifestyle/Priorities route to their own placeholders. */
export const INSTRUCTIONS_TEXT =
  "Welcome to your memory and thinking assessment. Before we begin, let's make sure that " +
  "you're set up in a quiet place where you won't be interrupted and you're wearing your " +
  'glasses or hearing aids if you use them.'

const reader = createVoiceOverReader(INSTRUCTIONS_TEXT)

export const WORDS = reader.words
export const speak = reader.speak
export const cancelSpeech = reader.cancelSpeech
export const resetSpeechCalibrationForTests = reader.resetCalibrationForTests
