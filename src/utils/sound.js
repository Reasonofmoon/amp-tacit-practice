// Simple Web Audio API sound generator for game UI interactions
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration, vol = 0.1) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Button Click Sound
export function playClickSound() {
  playTone(440, 'sine', 0.1, 0.05); // A4
  setTimeout(() => playTone(660, 'sine', 0.1, 0.05), 50); // E5
}

// Success/Correct Answer Sound
export function playSuccessSound() {
  playTone(523.25, 'triangle', 0.1, 0.05); // C5
  setTimeout(() => playTone(659.25, 'triangle', 0.1, 0.05), 100); // E5
  setTimeout(() => playTone(783.99, 'triangle', 0.2, 0.05), 200); // G5
}

// Fail/Skip Sound
export function playSkipSound() {
  playTone(300, 'sawtooth', 0.1, 0.05);
  setTimeout(() => playTone(250, 'sawtooth', 0.2, 0.05), 100);
}

// Level Up / Completion Fanfare
export function playFanfareSound() {
  const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 'square', 0.2, 0.08), idx * 150);
  });
  setTimeout(() => playTone(880, 'square', 0.5, 0.1), notes.length * 150);
}
