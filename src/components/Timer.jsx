const RADIUS = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ duration, timeLeft, label }) {
  const progress = duration === 0 ? 0 : timeLeft / duration;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="timer-ring" role="timer" aria-label={`${label} 남은 시간 ${Math.ceil(timeLeft)}초`}>
      <svg viewBox="0 0 120 120" className="timer-svg" aria-hidden="true">
        <circle className="timer-track" cx="60" cy="60" r={RADIUS} />
        <circle
          className="timer-progress"
          cx="60"
          cy="60"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="timer-value">
        <strong>{Math.ceil(timeLeft)}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
