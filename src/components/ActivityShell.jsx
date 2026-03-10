export default function ActivityShell({ title, desc, color, icon, time, onBack, children, actions }) {
  return (
    <section className="activity-shell glass-panel" style={{ '--activity-accent': color }}>
      <button type="button" className="back-link" onClick={onBack} aria-label="활동 목록으로 돌아가기">
        ← 활동 목록으로
      </button>
      <div className="activity-shell-header">
        <div className="activity-hero-mark" aria-hidden="true">
          {icon}
        </div>
        <div className="activity-hero-copy">
          <p className="eyebrow">TACTIC LAB · {time}</p>
          <h2>{title}</h2>
          <p>{desc}</p>
        </div>
      </div>
      <div className="activity-shell-body">{children}</div>
      {actions ? <div className="activity-shell-actions">{actions}</div> : null}
    </section>
  );
}
