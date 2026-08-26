import { createVoiceOverReader } from '../voiceOverReading'

/** Placeholder copy — the real microphone-check instructions haven't been written yet; this is
 * standing in until they are. */
export const INSTRUCTIONS_TEXT =
  "Now let's test your microphone. Say something out loud, and you'll see the bars move " +
  'when we can hear you.'

const reader = createVoiceOverReader(INSTRUCTIONS_TEXT)

export const WORDS = reader.words
export const speak = reader.speak
export const cancelSpeech = reader.cancelSpeech
export const resetSpeechCalibrationForTests = reader.resetCalibrationForTests
