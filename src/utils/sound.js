// Paper/ink-toned sound design.
// Replaced game-fanfare style triads/squares with:
//   - paper tap (filtered noise burst)
//   - pen scratch (bandpass-swept noise)
//   - warm chime (low sine, slow attack/decay) — single tone, never an arpeggio.
let audioCtx = null;
try {
  audioCtx = new AudioContext();
} catch {
  // AudioContext not available; sounds will be silently skipped
}

function ensureRunning() {
  if (!audioCtx) return false;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return true;
}

function makeNoiseSource(duration) {
  if (!audioCtx) return null;
  const sampleCount = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
  const buffer = audioCtx.createBuffer(1, sampleCount, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  return src;
}

// Paper tap — short, dry, low-passed noise. Used for clicks.
function playPaperTap({ vol = 0.05, duration = 0.06 } = {}) {
  if (!ensureRunning()) return;
  const noise = makeNoiseSource(duration);
  if (!noise) return;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2400, audioCtx.currentTime);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0005, audioCtx.currentTime + duration);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
  noise.stop(audioCtx.currentTime + duration + 0.02);
}

// Pen scratch — bandpassed noise with a slight upward sweep.
function playPenScratch({ vol = 0.045, duration = 0.18 } = {}) {
  if (!ensureRunning()) return;
  const noise = makeNoiseSource(duration);
  if (!noise) return;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1700, audioCtx.currentTime);
  filter.frequency.linearRampToValueAtTime(2600, audioCtx.currentTime + duration);
  filter.Q.value = 1.6;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(vol, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0005, audioCtx.currentTime + duration);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
  noise.stop(audioCtx.currentTime + duration + 0.02);
}

// Warm chime — single low sine, slow attack, gentle decay.
// Avoid arpeggios/triads; one note keeps the office tone.
function playWarmChime(freq = 196, { duration = 0.7, vol = 0.045 } = {}) {
  if (!ensureRunning()) return;
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(vol, audioCtx.currentTime + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration + 0.05);
}

// Subtle low fail tone — pure sine, no sawtooth grit.
function playLowSine(freq, duration, vol = 0.04) {
  if (!ensureRunning()) return;
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0005, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration + 0.02);
}

// ─── Public API (signatures unchanged) ──────────

// Button tap — soft paper.
export function playClickSound() {
  playPaperTap({ vol: 0.05, duration: 0.05 });
}

// Activity correct / completion — pen stroke + faint warm chime.
export function playSuccessSound() {
  playPenScratch({ vol: 0.05, duration: 0.16 });
  setTimeout(() => playWarmChime(587.33, { duration: 0.55, vol: 0.035 }), 80); // D5 quietly
}

// Skip / minor "no" — soft low sine, not sawtooth.
export function playSkipSound() {
  playLowSine(280, 0.12, 0.035);
}

// Level up / report open — page settling: long paper rustle + warm low tone.
// Replaces the old major-key fanfare. One warm note, no melody.
export function playFanfareSound() {
  playPenScratch({ vol: 0.04, duration: 0.5 });
  setTimeout(() => playWarmChime(196, { duration: 1.0, vol: 0.045 }), 220); // G3
}
