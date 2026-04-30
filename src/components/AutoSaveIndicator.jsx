import { useEffect, useState } from 'react';
import { Check, Save } from 'lucide-react';

// 활동 화면에서 "내가 쓴 게 사라질까?" 마찰을 줄이기 위한 자동저장 표시.
// useGameState.saveActivityData 가 호출될 때마다 metrics.lastSaveAt 이 갱신됨.
function fmtRelative(timestamp) {
  if (!timestamp) return '저장 대기';
  const elapsed = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (elapsed < 2) return '방금 저장됨';
  if (elapsed < 60) return `${elapsed}초 전 저장됨`;
  const minutes = Math.round(elapsed / 60);
  if (minutes < 60) return `${minutes}분 전 저장됨`;
  return '저장됨';
}

export default function AutoSaveIndicator({ lastSaveAt }) {
  const [, setTick] = useState(0);
  const [pulse, setPulse] = useState(false);

  // 매 5초마다 라벨 재계산
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 5000);
    return () => window.clearInterval(id);
  }, []);

  // lastSaveAt 가 새 값으로 바뀌면 잠깐 pulse
  useEffect(() => {
    if (!lastSaveAt) return;
    setPulse(true);
    const id = window.setTimeout(() => setPulse(false), 1100);
    return () => window.clearTimeout(id);
  }, [lastSaveAt]);

  const idle = !lastSaveAt;

  return (
    <div
      className={`autosave-pill ${idle ? 'idle' : ''} ${pulse ? 'pulse' : ''}`}
      role="status"
      aria-live="polite"
    >
      {idle
        ? <Save size={12} aria-hidden="true" />
        : <Check size={12} aria-hidden="true" />}
      <span>{fmtRelative(lastSaveAt)}</span>
    </div>
  );
}
