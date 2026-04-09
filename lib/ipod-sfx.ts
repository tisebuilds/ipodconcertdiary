/**
 * Subtle synthesized UI sounds (Web Audio). No external assets.
 * Mute + one-time boot chime are persisted in localStorage.
 */

const STORAGE_MUTED = "ipod-sfx-muted";
const STORAGE_BOOT = "ipod-boot-chime-played";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

async function ensureRunning(ctx: AudioContext): Promise<void> {
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
}

export function readSfxMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_MUTED) === "1";
}

export function writeSfxMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_MUTED, muted ? "1" : "0");
  window.dispatchEvent(new CustomEvent("ipod-sfx-muted-change"));
}

export function readBootChimePlayed(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(STORAGE_BOOT) === "1";
}

function markBootChimePlayed(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_BOOT, "1");
}

function isMuted(): boolean {
  return readSfxMuted();
}

/** Short tick when moving highlight (scroll). */
export function playScrollTick(): void {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  void ensureRunning(ctx);
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(2400, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.045, t + 0.0015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.014);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.016);
}

/** Slightly fuller blip when confirming / opening. */
export function playSelectTick(): void {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  void ensureRunning(ctx);
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(880, t);
  osc.frequency.exponentialRampToValueAtTime(1320, t + 0.035);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.07, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.06);
}

/** Softer step when going back in the UI stack. */
export function playBackTick(): void {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  void ensureRunning(ctx);
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.exponentialRampToValueAtTime(380, t + 0.04);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.055);
}

/**
 * Tiny two-note “power on” motif — only used once per browser (see tryPlayBootChime).
 */
export function playBootChime(): void {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  void ensureRunning(ctx);
  const t = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.11, t);
  master.connect(ctx.destination);

  const note = (start: number, freq: number, dur: number) => {
    const osc = ctx!.createOscillator();
    const g = ctx!.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.09, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  };

  note(t, 523.25, 0.07);
  note(t + 0.07, 659.25, 0.09);
}

/** Call after user gesture: one short chime the first time ever, then silent. */
export function tryPlayBootChime(): void {
  if (readBootChimePlayed()) return;
  if (!isMuted()) {
    playBootChime();
  }
  markBootChimePlayed();
}
