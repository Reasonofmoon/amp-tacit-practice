import { ArrowRight, Clock } from 'lucide-react';
import { findClosestChapter, findNextActivityForChapter } from '../utils/chapterProgress';
import { ACTIVITY_TITLES } from '../utils/activityTitles';

// "어디까지 했는지" 복귀 카드.
// 1+ 활동을 완료한 뒤 홈에 다시 들어왔을 때, 마지막 완료 활동 + 그 다음
// 가장 가까운 챕터 PDF까지의 거리를 보여주고 한 클릭으로 이어서 진행하게 한다.
//
// 첫 진입(0개 완료)에서는 표시하지 않는다 — 그 경우는 NextStepBeacon 의
// "🎯 1분 데모 시작" 가 안내한다.
function fmtElapsed(timestamp) {
  if (!timestamp) return null;
  const minutes = Math.round((Date.now() - timestamp) / 60000);
  if (minutes < 2) return '방금';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.round(hours / 24);
  if (days <= 14) return `${days}일 전`;
  return `${Math.round(days / 7)}주 전`;
}

export default function ResumeCard({ state, onContinue, onPrintChapter, onGoReport }) {
  const completedCount = state?.completed?.length ?? 0;
  if (completedCount === 0) return null;

  const lastId = state.metrics?.lastCompletedId;
  const lastTitle = lastId ? (ACTIVITY_TITLES[lastId] ?? '마지막 활동') : '마지막 활동';
  const lastTimestamp = state.leaderboard?.[0]?.timestamp;
  const elapsed = fmtElapsed(lastTimestamp);

  const closest = findClosestChapter(state);
  let cta = null;
  if (closest && closest.kind === 'just-completed') {
    cta = {
      label: `📄 ${closest.title} PDF 받기`,
      onClick: () => onPrintChapter?.(closest.id),
    };
  } else if (closest && (closest.kind === 'one-away' || closest.kind === 'in-progress')) {
    const nextId = findNextActivityForChapter(closest, state);
    const nextTitle = ACTIVITY_TITLES[nextId] ?? '다음 활동';
    if (nextId) {
      cta = {
        label: closest.kind === 'one-away'
          ? `${nextTitle} 1개만 더 → ${closest.title} PDF`
          : `이어서 ${nextTitle} 진행`,
        onClick: () => onContinue?.(nextId),
      };
    }
  } else {
    cta = {
      label: `📊 받은 선물 ${completedCount}개 — 리포트에서 보기`,
      onClick: onGoReport,
    };
  }

  return (
    <div className="resume-card" role="region" aria-label="이어서 진행">
      <div className="resume-card-meta">
        <span className="resume-card-eyebrow">
          <Clock size={14} aria-hidden="true" />
          {elapsed ? `${elapsed} 마지막 활동` : '마지막 활동'}
        </span>
        <h3 className="resume-card-title">{lastTitle}</h3>
        {closest && closest.kind !== 'just-completed' && (
          <p className="resume-card-progress">
            {closest.icon} {closest.title} 챕터 — {closest.completedCount} / {closest.totalCount}
          </p>
        )}
      </div>
      {cta && (
        <button type="button" className="resume-card-cta" onClick={cta.onClick}>
          {cta.label}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
