// Ink-spread micro-effect — drop-in replacement for canvas-confetti.
// "Drop of ink hits the page" feel: a center blot + radial scatter dots.
// Imperative API on purpose — keeps the call site identical to confetti(...).

const COLORS = ['#1A1915', '#2E5BFF', '#1E3EB5', '#3C3A33', '#FF6B6B', '#7A746A'];
const SIZE_PRESETS = {
  sm: { dotCount: 8,  spread: 70,  dotMin: 3, dotMax: 7  },
  md: { dotCount: 12, spread: 110, dotMin: 4, dotMax: 9  },
  lg: { dotCount: 20, spread: 180, dotMin: 5, dotMax: 12 },
};

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function triggerInkBurst({ origin = { x: 0.5, y: 0.6 }, size = 'md' } = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const preset = SIZE_PRESETS[size] ?? SIZE_PRESETS.md;
  const x = origin.x * window.innerWidth;
  const y = origin.y * window.innerHeight;

  const root = document.createElement('div');
  root.className = 'ink-burst';
  root.setAttribute('aria-hidden', 'true');
  root.style.left = `${x}px`;
  root.style.top = `${y}px`;

  // Reduced motion: just one static fading blot, no scatter.
  if (prefersReducedMotion()) {
    const stillBlot = document.createElement('span');
    stillBlot.className = 'ink-burst-center reduced';
    root.appendChild(stillBlot);
    document.body.appendChild(root);
    window.setTimeout(() => root.remove(), 800);
    return;
  }

  // Center "first hit" blot
  const center = document.createElement('span');
  center.className = 'ink-burst-center';
  root.appendChild(center);

  // Scatter dots
  const { dotCount, spread, dotMin, dotMax } = preset;
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('span');
    dot.className = 'ink-burst-dot';
    const angle = (Math.PI * 2 * i) / dotCount + (Math.random() - 0.5) * 0.6;
    const distance = spread * (0.45 + Math.random() * 0.85);
    const radius = dotMin + Math.random() * (dotMax - dotMin);
    dot.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
    dot.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
    dot.style.setProperty('--r', `${radius}px`);
    dot.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    dot.style.animationDelay = `${Math.random() * 90}ms`;
    root.appendChild(dot);
  }

  document.body.appendChild(root);
  window.setTimeout(() => root.remove(), 1500);
}
