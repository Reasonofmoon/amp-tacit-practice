export default function GlowOrb({ color, size = 280, top, left, right, bottom, delay = 0 }) {
  return (
    <span
      aria-hidden="true"
      className="glow-orb"
      style={{
        '--orb-color': color,
        '--orb-size': `${size}px`,
        '--orb-delay': `${delay}s`,
        top,
        left,
        right,
        bottom,
      }}
    />
  );
}
