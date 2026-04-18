import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

function PencilTip() {
  return (
    <svg viewBox="0 0 24 24" className="xp-pencil-tip animate" aria-hidden="true">
      {/* Pencil body */}
      <rect x="2" y="9" width="14" height="6" rx="1" fill="#F4B740" stroke="#1A1915" strokeWidth="0.8" />
      {/* Ferrule */}
      <rect x="14" y="9" width="2.5" height="6" fill="#C9BBA3" stroke="#1A1915" strokeWidth="0.6" />
      {/* Eraser */}
      <rect x="16" y="9" width="2" height="6" rx="0.5" fill="#FF6B6B" stroke="#1A1915" strokeWidth="0.6" />
      {/* Wood tip */}
      <polygon points="2,9 2,15 -2,12" fill="#E8DFCE" stroke="#1A1915" strokeWidth="0.6" />
      {/* Lead */}
      <polygon points="-1,10.5 -1,13.5 -3,12" fill="#1A1915" />
      {/* Highlight */}
      <rect x="2" y="9.5" width="14" height="1" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

export default function XPBar({ xp, levelInfo, nextLevel, xpGain }) {
  const currentFloor = levelInfo.minXP;
  const currentCeiling = nextLevel.minXP === levelInfo.minXP ? currentFloor + 200 : nextLevel.minXP;
  const progress = currentCeiling === currentFloor ? 1 : (xp - currentFloor) / (currentCeiling - currentFloor);
  const clampedProgress = Math.max(0.02, Math.min(1, progress));
  const percent = clampedProgress * 100;

  return (
    <div style={{ padding: '8px 4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: '6px' }}>CURRENT LEVEL</p>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>
            <span aria-hidden="true" style={{ fontSize: '1.6rem' }}>{levelInfo.icon}</span> {levelInfo.title}
          </h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--ink-blue-deep)', fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {xp} <span style={{ fontSize: '1rem', color: 'var(--ink-500)', fontFamily: 'var(--font-sans)' }}>XP</span>
          </div>
        </div>
      </div>

      <div className="xp-track">
        <motion.div
          initial={{ width: '2%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="xp-fill-ink"
        />
        <motion.div
          initial={{ left: '2%' }}
          animate={{ left: `${percent}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', top: '50%', pointerEvents: 'none' }}
        >
          <PencilTip />
        </motion.div>
        {xpGain && (
          <motion.span
            key={xpGain.at}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: -24 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              right: '10px',
              top: 0,
              color: 'var(--sage)',
              fontWeight: 700,
              fontSize: '0.95rem',
              fontFamily: 'var(--font-display)',
              textShadow: '0 1px 2px rgba(255,255,255,0.7)',
            }}
          >
            +{xpGain.amount} XP
          </motion.span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.85rem', color: 'var(--ink-500)', fontWeight: 500 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--ink-700)' }}>Lv. {levelInfo.level}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={14} aria-hidden="true" /> 다음 목표: {nextLevel.level}레벨 ({Math.max(nextLevel.minXP - xp, 0)} XP 남음)
        </span>
      </div>
    </div>
  );
}
