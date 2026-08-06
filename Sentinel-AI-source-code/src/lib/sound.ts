/**
 * Lightweight Web Audio sound manager.
 * Sounds are SUBTLE UI feedback, muted by default (PRD requirement).
 * The engine task will call `playSound("alert")` when critical events arrive.
 */

export type SoundName = "open" | "close" | "select" | "success" | "alert" | "error";

let ctx: AudioContext | null = null;
let enabled = false;

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  opts: { type?: OscillatorType; duration?: number; gain?: number; delay?: number; endFreq?: number } = {},
) {
  const c = getContext();
  if (!c) return;
  const { type = "sine", duration = 0.08, gain = 0.04, delay = 0, endFreq } = opts;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + duration);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export function playSound(name: SoundName) {
  if (!enabled) return;
  switch (name) {
    case "open":
      tone(560, { duration: 0.07, gain: 0.03 });
      break;
    case "close":
      tone(320, { duration: 0.06, gain: 0.025 });
      break;
    case "select":
      tone(880, { duration: 0.045, gain: 0.02 });
      break;
    case "success":
      tone(540, { duration: 0.09, gain: 0.035 });
      tone(820, { duration: 0.1, gain: 0.03, delay: 0.07 });
      break;
    case "alert":
      tone(660, { type: "triangle", duration: 0.16, gain: 0.05 });
      tone(440, { type: "triangle", duration: 0.18, gain: 0.045, delay: 0.12 });
      break;
    case "error":
      tone(180, { type: "sawtooth", duration: 0.14, gain: 0.03 });
      break;
  }
}
