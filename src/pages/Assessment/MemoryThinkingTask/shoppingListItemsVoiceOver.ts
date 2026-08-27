import { createVoiceOverReader } from '../../voiceOverReading'

/** The actual list a visitor will be asked to recall — read aloud on the "Listen carefully"
 * step, separately from `shoppingListVoiceOver.ts`'s own instructions reading (its own script,
 * its own independent reading progress, the same "one script per step" pattern Device Setup's
 * hearing/microphone steps already use). Commas (not periods) between items, on purpose — a
 * shorter pause between list items than between full sentences, closer to how a person actually
 * reads a list aloud. */
export const ITEMS_TEXT =
  'Notepad, backpack, printer, batteries, lamp, chair, coffee, sweater, candles.'

const reader = createVoiceOverReader(ITEMS_TEXT)
export const WORDS = reader.words
export const speak = reader.speak
export const cancelSpeech = reader.cancelSpeech
export const resetSpeechCalibrationForTests = reader.resetCalibrationForTests
