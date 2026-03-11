import { motion } from 'framer-motion';

export default function ActivityCard({ activity, completed, progress = 0, index, onClick }) {
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
      
      <div className="activity-card-progress">
        <div className="progress-text">
          <span>진행도</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="progress-thin">
          <div className="progress-thin-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      </div>
    </motion.button>
  );
}
