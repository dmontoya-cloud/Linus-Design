import { createVoiceOverReader } from '../voiceOverReading'

/** Placeholder copy — the real device-setup instructions haven't been written yet; this is
 * standing in at the same size/position until they are. */
export const INSTRUCTIONS_TEXT =
  "We'll check that your speakers and microphone are working before you begin. Make sure " +
  "your device's volume is turned up, then play the test sound below."

const reader = createVoiceOverReader(INSTRUCTIONS_TEXT)

export const WORDS = reader.words
export const speak = reader.speak
export const cancelSpeech = reader.cancelSpeech
export const resetSpeechCalibrationForTests = reader.resetCalibrationForTests
