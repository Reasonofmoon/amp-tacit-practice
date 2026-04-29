import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { findClosestChapter, findNextActivityForChapter } from '../utils/chapterProgress';
import { ACTIVITY_TITLES } from '../utils/activityTitles';

// Single floating CTA. Picks ONE action based on current state.
// W8: when 1+ activity completed, the beacon now teaches the closest chapter
// PDF as the next milestone — instead of a generic "리포트 보기".
export default function NextStepBeacon({
  state,
  currentView,
  hasGiftOpen,
  hasModalOpen,
  onStartTour,
  onGoReport,
  onSelectActivity,
  onPrintChapter,
}) {
  if (hasGiftOpen || hasModalOpen) return null;
  if (currentView !== 'home') return null; // 활동/리포트 안에서는 자체 CTA가 있어 숨김

  const completedCount = state?.completed?.length ?? 0;

  // 0개 완료 — 첫 데모로 안내
  if (completedCount === 0) {
    return (
      <BeaconButton
        badge="STEP 1 / 3"
        label="🎯 1분 데모 — ReadMaster부터 시작"
        onClick={onStartTour}
      />
    );
  }

  // 1+ 완료 — 가장 가까운 챕터 마일스톤 노출
  const closest = findClosestChapter(state);
  if (closest && closest.kind === 'just-completed') {
    return (
      <BeaconButton
        badge="📄 발급 가능"
        label={`${closest.icon} ${closest.title} PDF 받기`}
        onClick={() => onPrintChapter?.(closest.id)}
      />
    );
  }
  if (closest && closest.kind === 'one-away') {
    const nextId = findNextActivityForChapter(closest, state);
    const nextTitle = ACTIVITY_TITLES[nextId] ?? '다음 활동';
    return (
      <BeaconButton
        badge="📄 챕터 1개 남음"
        label={`${nextTitle} 1개만 더 → ${closest.title} PDF`}
        onClick={() => onSelectActivity?.(nextId)}
      />
    );
  }

  // 진행 중인 챕터가 있지만 가까이는 아닐 때 — 결과 리포트로 우회
  return (
    <BeaconButton
      badge={`STEP 2 / 3`}
      label={`📊 받은 선물 ${completedCount}개 — 리포트에서 보기`}
      onClick={onGoReport}
    />
  );
}

function BeaconButton({ badge, label, onClick }) {
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
