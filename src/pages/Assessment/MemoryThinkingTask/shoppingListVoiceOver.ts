import { createVoiceOverReader } from '../../voiceOverReading'

export const TITLE_TEXT =
  'I would like you to pretend that you are going shopping. I am going to read a list of ' +
  'things you need to buy.'

export const PARAGRAPH_1_TEXT =
  'When I finish reading the whole list, please repeat back as many words as you can ' +
  'remember, in any order.'

export const PARAGRAPH_2_TEXT =
  'I will ask you to repeat the shopping list again later, so try to remember it.'

export const PARAGRAPH_3_TEXT = 'Press Start when you are ready to begin.'

/** The whole screen — headline plus all three paragraphs — is one continuous voice-over read,
 * not four separate ones; `ShoppingListIntroPage` slices `WORDS` back into per-block segments
 * for rendering (see its own `WORD_SEGMENTS`) while the single `readUpToIndex` from this one
 * reading advances across all of them in the same reading order shown on screen. */
export const INSTRUCTIONS_TEXT = [
  TITLE_TEXT,
  PARAGRAPH_1_TEXT,
  PARAGRAPH_2_TEXT,
  PARAGRAPH_3_TEXT,
].join(' ')

const reader = createVoiceOverReader(INSTRUCTIONS_TEXT)
export const WORDS = reader.words
export const speak = reader.speak
export const cancelSpeech = reader.cancelSpeech
export const resetSpeechCalibrationForTests = reader.resetCalibrationForTests
