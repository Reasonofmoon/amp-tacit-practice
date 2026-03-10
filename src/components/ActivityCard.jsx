export default function ActivityCard({ activity, completed, progress = 0, index, onClick }) {
  return (
    <button
      type="button"
      className="activity-card"
      onClick={onClick}
      style={{ '--activity-color': activity.color, '--delay': `${index * 0.06}s` }}
      aria-label={`${activity.title} 활동 열기`}
    >
      <div className="activity-card-top">
        <span className="activity-icon" aria-hidden="true">
          {activity.icon}
        </span>
        <span className={`activity-chip ${completed ? 'is-complete' : ''}`}>{completed ? '완료' : activity.time}</span>
      </div>
      <div className="activity-card-body">
        <h3>{activity.title}</h3>
        <p>{activity.subtitle}</p>
      </div>
      <div className="activity-progress">
        <div className="activity-progress-track">
          <span className="activity-progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </button>
  );
}
