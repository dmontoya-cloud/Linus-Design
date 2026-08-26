import '@testing-library/jest-dom/vitest'
// Note: vitest-axe's `toHaveNoViolations` matcher currently targets an older
// Vitest typing convention that doesn't merge cleanly with Vitest 4's
// `expect` types, so Button.test.tsx asserts on `results.violations` directly
// instead of registering the matcher here. Revisit when vitest-axe catches up.
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// jsdom doesn't implement matchMedia; several breakpoint-aware components
// will need it once PoD 3 (device simulators) and PoD 4 (funnel screens) land.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

// jsdom doesn't implement <dialog>'s showModal()/close() at all — polyfill just
// enough (toggle the `open` attribute, fire the native `close` event) for
// components built on native <dialog> (e.g. Modal) to be testable.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}

// jsdom doesn't implement the Web Speech API at all — polyfill just enough
// (a constructable SpeechSynthesisUtterance, and a no-op speak/cancel/getVoices) for
// AssessmentIntroPage's instructions voice-over to be testable. `window.speechSynthesis`
// is typed `readonly` in lib.dom, so it's cast rather than assigned directly. `getVoices`
// returns `[]`, same as a real browser would before its voice list has loaded — exercising
// AssessmentIntroPage's default-voice fallback path, not its voice-preference logic.
if (typeof window.SpeechSynthesisUtterance === 'undefined') {
  window.SpeechSynthesisUtterance = class {
    text: string
    voice: SpeechSynthesisVoice | null = null
    rate = 1
    pitch = 1
    constructor(text = '') {
      this.text = text
    }
  } as unknown as typeof SpeechSynthesisUtterance
}
if (!window.speechSynthesis) {
  ;(window as unknown as { speechSynthesis: SpeechSynthesis }).speechSynthesis = {
    speak: () => {},
    cancel: () => {},
    getVoices: () => [],
  } as unknown as SpeechSynthesis
}

// jsdom doesn't implement MediaDevices/getUserMedia or the Web Audio API at all — polyfill
// just enough for MicrophoneLevelBars to be testable: a getUserMedia that rejects by default
// (rather than hanging forever), which tests override via `vi.spyOn` to exercise the granted
// path, and a minimal AudioContext whose AnalyserNode reports silence — the component's own
// state handling is what's under test here, not real audio analysis.
if (!navigator.mediaDevices) {
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      getUserMedia: () => Promise.reject(new Error('getUserMedia is not implemented in jsdom')),
    },
  })
}

if (typeof window.AudioContext === 'undefined') {
  class FakeAnalyserNode {
    fftSize = 2048
    smoothingTimeConstant = 0
    get frequencyBinCount() {
      return this.fftSize / 2
    }
    getByteFrequencyData(array: Uint8Array) {
      array.fill(0)
    }
  }
  // Also backs TestSoundPlayer's synthesized bird chirp — a fake AudioParam (setValueAtTime /
  // linearRampToValueAtTime are no-ops) and fake oscillator/gain nodes are enough to exercise
  // that component's playback logic without producing real sound in jsdom.
  class FakeAudioParam {
    setValueAtTime() {
      return this
    }
    linearRampToValueAtTime() {
      return this
    }
  }
  class FakeOscillatorNode {
    type = 'sine'
    frequency = new FakeAudioParam()
    connect() {}
    start() {}
    stop() {}
  }
  class FakeGainNode {
    gain = new FakeAudioParam()
    connect() {}
  }
  class FakeAudioContext {
    currentTime = 0
    state = 'running'
    destination = {}
    createMediaStreamSource() {
      return { connect: () => {} }
    }
    createAnalyser() {
      return new FakeAnalyserNode()
    }
    createOscillator() {
      return new FakeOscillatorNode()
    }
    createGain() {
      return new FakeGainNode()
    }
    resume() {
      return Promise.resolve()
    }
    close() {
      return Promise.resolve()
    }
  }
  window.AudioContext = FakeAudioContext as unknown as typeof AudioContext
}
