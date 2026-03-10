export default function Badge({ badge, unlocked = false, compact = false }) {
  return (
    <div className={`badge-card ${unlocked ? 'is-unlocked' : ''} ${compact ? 'is-compact' : ''}`}>
      <div className="badge-icon" aria-hidden="true">
        {badge.icon}
      </div>
      <div>
        <div className="badge-name">{badge.name}</div>
        <div className="badge-desc">{badge.desc}</div>
      </div>
    </div>
  );
}
