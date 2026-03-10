import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

export default function XPBar({ xp, levelInfo, nextLevel, xpGain }) {
  const currentFloor = levelInfo.minXP;
  const currentCeiling = nextLevel.minXP === levelInfo.minXP ? currentFloor + 200 : nextLevel.minXP;
  const progress = currentCeiling === currentFloor ? 1 : (xp - currentFloor) / (currentCeiling - currentFloor);

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>CURRENT LEVEL</p>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem' }}>
            <span aria-hidden="true">{levelInfo.icon}</span> {levelInfo.title}
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
            {xp} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>XP</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', height: '12px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(2, progress * 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ height: '100%', background: 'var(--primary)', borderRadius: '6px' }}
        />
        {xpGain && (
          <motion.span 
            key={xpGain.at}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', right: 0, top: 0, color: 'var(--success)', fontWeight: 700, fontSize: '0.875rem' }}
          >
            +{xpGain.amount} XP
          </motion.span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        <span>Lv. {levelInfo.level}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Target size={14} /> 다음 목표: {nextLevel.level}레벨 ({Math.max(nextLevel.minXP - xp, 0)} XP 남음)
        </span>
      </div>
    </div>
  );
}
