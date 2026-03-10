const PIECES = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index % 6) * 16 + 8}%`,
  delay: `${(index % 5) * 0.08}s`,
  duration: `${1.8 + (index % 4) * 0.3}s`,
  rotate: `${index * 27}deg`,
}));

export default function ConfettiEffect({ active }) {
  if (!active) {
    return null;
  }

  return (
    <div className="confetti-layer" aria-hidden="true">
      {PIECES.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            transform: `rotate(${piece.rotate})`,
          }}
        />
      ))}
    </div>
  );
}
