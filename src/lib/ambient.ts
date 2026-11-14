const CHORDS = [
  [110.0, 164.81, 220.0, 261.63],
  [87.31, 130.81, 164.81, 220.0],
  [130.81, 196.0, 261.63, 329.63],
  [82.41, 123.47, 196.0, 246.94],
];
const SHIMMER = [440.0, 523.25, 587.33, 659.25, 783.99, 880.0];
const PARTIALS = [
  { ratio: 0.5, gain: 0.18 },
  { ratio: 1, gain: 0.5 },
  { ratio: 2, gain: 0.22 },
  { ratio: 3, gain: 0.1 },
  { ratio: 4, gain: 0.06 },
];
const CHORD_SECONDS = 9;
const TICK_SECONDS = 1.25;
const MASTER_LEVEL = 0.22;
const EFFECTS_LEVEL = 0.5;

type Voice = { gain: GainNode; oscillators: OscillatorNode[] };

type Registry = {
  context: AudioContext | null;
  timers: number[];
  master?: GainNode;
  effects?: GainNode;
};

declare global {
  interface Window {
    __ambient?: Registry;
  }
}

/**
 * Closes any score left over from an earlier copy of this module, so only
 * one can ever be heard, and returns the shared registry.
 */
function registry(): Registry {
  if (!window.__ambient) window.__ambient = { context: null, timers: [] };
  return window.__ambient;
}

/**
 * An original ambient score made with the Web Audio API: slow organ chords,
 * a soft clock tick and a few high notes drifting through a long reverb.
 * Nothing is downloaded; every sound is synthesised in the browser.
 */
class Ambient {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private effects: GainNode | null = null;
  private timers: number[] = [];
  private voices: Voice[] = [];
  private chord = 0;

  /** Starts the score, fading it in over a few seconds. */
  async start(): Promise<void> {
    if (!this.context) this.build();
    const context = this.context as AudioContext;
    const master = this.master as GainNode;
    await context.resume();
    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(MASTER_LEVEL * volume, now + 3);
    if (this.timers.length === 0) this.schedule();
  }

  /** Fades the score out and then suspends audio entirely. */
  stop(): void {
    const context = this.context;
    const master = this.master;
    if (!context || !master) return;
    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 1.2);
    this.timers.forEach((timer) => window.clearInterval(timer));
    this.timers.length = 0;
    window.setTimeout(() => {
      if (this.timers.length === 0) void context.suspend();
    }, 1400);
  }

  /** Sets the overall loudness of the music and the effects. */
  level(value: number): void {
    const context = this.context;
    if (!context || !this.master || !this.effects) return;
    const now = context.currentTime;
    if (this.master.gain.value > 0) {
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(MASTER_LEVEL * value, now, 0.08);
    }
    this.effects.gain.setTargetAtTime(EFFECTS_LEVEL * value, now, 0.08);
  }

  /** Plays a soft, airy sweep, for moving between chapters. */
  sweep(): void {
    const context = this.context;
    const bus = this.effects;
    if (!context || !bus || context.state !== "running") return;
    const now = context.currentTime;
    const seconds = 0.7;
    const buffer = context.createBuffer(
      1,
      Math.floor(context.sampleRate * seconds),
      context.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = context.createBufferSource();
    noise.buffer = buffer;
    const filter = context.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.4;
    filter.frequency.setValueAtTime(380, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + seconds * 0.6);
    filter.frequency.exponentialRampToValueAtTime(900, now + seconds);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + seconds * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    noise.connect(filter).connect(gain).connect(bus);
    noise.start(now);
  }

  /** Plays a soft bell note, for clicks while sound is on. */
  chime(): void {
    const context = this.context;
    const bus = this.effects;
    if (!context || !bus || context.state !== "running") return;
    const now = context.currentTime;
    const frequency =
      CLICK_NOTES[Math.floor(Math.random() * CLICK_NOTES.length)];
    [1, 2.01].forEach((ratio, position) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency * ratio;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(
        position === 0 ? 0.08 : 0.018,
        now + 0.01,
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      oscillator.connect(gain).connect(bus);
      oscillator.start(now);
      oscillator.stop(now + 1.5);
    });
  }

  private build(): void {
    const shared = registry();
    shared.timers.forEach((timer) => window.clearInterval(timer));
    shared.timers = [];
    void shared.context?.close();
    const context = new AudioContext();
    shared.context = context;
    const master = context.createGain();
    master.gain.value = 0;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    const sweep = context.createOscillator();
    const sweepDepth = context.createGain();
    sweep.frequency.value = 0.04;
    sweepDepth.gain.value = 500;
    sweep.connect(sweepDepth).connect(filter.frequency);
    sweep.start();
    const reverb = context.createConvolver();
    reverb.buffer = this.impulse(context, 6);
    const wet = context.createGain();
    wet.gain.value = 0.7;
    const bus = context.createGain();
    bus.connect(filter);
    bus.connect(reverb).connect(wet).connect(filter);
    filter.connect(master).connect(context.destination);
    const effects = context.createGain();
    effects.gain.value = EFFECTS_LEVEL * volume;
    const room = context.createConvolver();
    room.buffer = this.impulse(context, 2.4);
    const roomLevel = context.createGain();
    roomLevel.gain.value = 0.35;
    effects.connect(context.destination);
    effects.connect(room).connect(roomLevel).connect(context.destination);
    this.context = context;
    this.effects = effects;
    shared.master = master;
    shared.effects = effects;
    this.master = master;
    this.bus = bus;
  }

  private impulse(context: AudioContext, seconds: number): AudioBuffer {
    const length = context.sampleRate * seconds;
    const buffer = context.createBuffer(2, length, context.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.6);
      }
    }
    return buffer;
  }

  private schedule(): void {
    this.playChord();
    this.timers = registry().timers;
    this.timers.push(
      window.setInterval(() => this.playChord(), CHORD_SECONDS * 1000),
      window.setInterval(() => this.tick(), TICK_SECONDS * 1000),
      window.setInterval(() => {
        if (Math.random() < 0.6) this.shimmer();
      }, 2600),
    );
  }

  private playChord(): void {
    const context = this.context as AudioContext;
    const bus = this.bus as GainNode;
    const now = context.currentTime;
    for (const voice of this.voices) {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
      voice.gain.gain.linearRampToValueAtTime(0, now + 4);
      voice.oscillators.forEach((oscillator) => oscillator.stop(now + 4.2));
    }
    this.voices = CHORDS[this.chord].map((frequency) => {
      const gain = context.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 3.5);
      gain.connect(bus);
      const oscillators = PARTIALS.map((partial) => {
        const oscillator = context.createOscillator();
        const level = context.createGain();
        oscillator.frequency.value = frequency * partial.ratio;
        oscillator.detune.value = (Math.random() - 0.5) * 6;
        level.gain.value = partial.gain;
        oscillator.connect(level).connect(gain);
        oscillator.start(now);
        return oscillator;
      });
      return { gain, oscillators };
    });
    this.chord = (this.chord + 1) % CHORDS.length;
  }

  private tick(): void {
    const context = this.context as AudioContext;
    const bus = this.bus as GainNode;
    const now = context.currentTime + 0.02;
    const noise = context.createBufferSource();
    const buffer = context.createBuffer(
      1,
      context.sampleRate * 0.05,
      context.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const band = context.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 3200;
    band.Q.value = 8;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    noise.connect(band).connect(gain).connect(bus);
    noise.start(now);
  }

  private shimmer(): void {
    const context = this.context as AudioContext;
    const bus = this.bus as GainNode;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value =
      SHIMMER[Math.floor(Math.random() * SHIMMER.length)];
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 5);
    oscillator.connect(gain).connect(bus);
    oscillator.start(now);
    oscillator.stop(now + 5.2);
  }
}

let shared: Ambient | null = null;
let on = false;
let volume = 0.6;
let wired = false;
const listeners = new Set<() => void>();
const STORAGE_KEY = "sound";
const VOLUME_KEY = "sound-volume";
const CLICK_NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

function score(): Ambient {
  if (!shared) shared = new Ambient();
  return shared;
}

function remember(value: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
  } catch {}
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

function wire(): void {
  if (wired) return;
  wired = true;
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element | null;
      if (on && target?.closest("a, button") && !target.closest("[data-sweep]"))
        score().chime();
    },
    true,
  );
  document.addEventListener("visibilitychange", () => {
    if (!on) return;
    if (document.hidden) score().stop();
    else void score().start();
  });
}

/** Plays the chapter sweep when sound is on. */
export function playSweep(): void {
  if (on) score().sweep();
}

/** Subscribes to changes in whether sound is on. */
export function subscribeSound(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The current volume, from 0 to 1. */
export function soundVolume(): number {
  return volume;
}

/** Changes the volume and remembers it for the next visit. */
export function setVolume(value: number): void {
  volume = Math.min(1, Math.max(0, value));
  try {
    window.localStorage.setItem(VOLUME_KEY, String(volume));
  } catch {}
  score().level(volume);
  emit();
}

/** Whether sound is on. */
export function soundOn(): boolean {
  return on;
}

/** Turns sound on or off, and remembers the choice for the next visit. */
export function setSound(value: boolean): void {
  wire();
  on = value;
  remember(value);
  if (value) void score().start();
  else score().stop();
  emit();
}

/**
 * Restores a visitor's earlier choice. Browsers only allow audio after a
 * gesture, so the score starts on the first tap, click or key press.
 */
export function restoreSound(): void {
  let saved = false;
  try {
    saved = window.localStorage.getItem(STORAGE_KEY) === "on";
    const level = Number(window.localStorage.getItem(VOLUME_KEY));
    if (
      window.localStorage.getItem(VOLUME_KEY) !== null &&
      !Number.isNaN(level)
    )
      volume = level;
  } catch {}
  if (!saved || on) return;
  wire();
  on = true;
  emit();
  const begin = () => {
    window.removeEventListener("pointerdown", begin);
    window.removeEventListener("keydown", begin);
    if (on) void score().start();
  };
  window.addEventListener("pointerdown", begin);
  window.addEventListener("keydown", begin);
}
