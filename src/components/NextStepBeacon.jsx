import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Single floating CTA. Picks ONE action based on current view + completion state.
// Never shows more than one button at a time. Hidden in non-relevant moments
// (inside an activity, when a modal is open).
export default function NextStepBeacon({
  currentView,
  completedCount,
  hasGiftOpen,
  hasModalOpen,
  onStartTour,
  onGoReport,
}) {
  if (hasGiftOpen || hasModalOpen) return null;
  if (currentView !== 'home' && currentView !== 'report') return null;

  let label = null;
  let onClick = null;
  let badge = null;

  if (currentView === 'home' && completedCount === 0) {
    label = '🎯 1분 데모 — ReadMaster부터 시작';
    badge = 'STEP 1 / 3';
    onClick = onStartTour;
  } else if (currentView === 'home' && completedCount > 0) {
    label = `📊 받은 선물 ${completedCount}개 — 리포트에서 보기`;
    badge = `STEP 2 / 3`;
    onClick = onGoReport;
  } else if (currentView === 'report') {
    return null; // 리포트 안에서는 가방 PDF 버튼이 이미 단 하나의 액션
  }

  if (!label) return null;

  return (
    <AnimatePresence>
      <motion.button
        key={label}
        type="button"
        onClick={onClick}
        className="next-step-beacon print-hide"
        initial={{ opacity: 0, y: 28, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        aria-label={label}
      >
        {badge && <span className="next-step-beacon-badge">{badge}</span>}
        <span className="next-step-beacon-label">{label}</span>
        <ArrowRight size={18} aria-hidden="true" />
      </motion.button>
    </AnimatePresence>
  );
}
