import { motion } from 'framer-motion';

export default function ActivityCard({ activity, completed, progress = 0, index, onClick }) {
  const stars = activity.difficulty || 0;

  return (
    <motion.button
      type="button"
      className={`activity-card ${completed ? 'completed' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      aria-label={`${activity.title} 활동 열기`}
    >
      <div className="activity-card-header">
        <div className="activity-icon-wrap">
          <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
            {activity.icon}
          </span>
        </div>
        <span className={`activity-status ${completed ? 'done' : ''}`}>
          {completed ? '완료됨' : activity.time}
        </span>
      </div>
      
      <h3 className="activity-card-title">{activity.title}</h3>
      <p className="activity-card-desc">{activity.subtitle}</p>

      {/* Difficulty Stars Badge */}
      {stars > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '8px' }}>
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i} style={{ fontSize: '0.75rem', color: '#f59e0b' }}>⭐</span>
          ))}
          {Array.from({ length: 4 - stars }).map((_, i) => (
            <span key={i} style={{ fontSize: '0.75rem', opacity: 0.2 }}>⭐</span>
          ))}
        </div>
      )}

      {/* Tech Tags */}
      {activity.techTags && activity.techTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
          {activity.techTags.map(tag => (
            <span key={tag} style={{
              fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary, #6366f1)',
              border: '1px solid rgba(99, 102, 241, 0.2)', whiteSpace: 'nowrap'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="activity-card-progress" style={{ marginBottom: '8px' }}>
        <div className="progress-text">
          <span>진행도</span>
          <span>{completed ? 100 : Math.round(progress * 100)}%</span>
        </div>
        <div className="progress-thin">
          <div className="progress-thin-fill" style={{ width: `${completed ? 100 : Math.round(progress * 100)}%` }} />
        </div>
      </div>
    </motion.button>
  );
}
