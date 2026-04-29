import { CHAPTERS } from '../data/chapters';
import { ACTIVITY_XP } from './scoring';

// director ↔ developer 미러 활동을 한 챕터에서 동일 개념으로 취급.
// auto_*, demo_* 는 미러 없음.
function hasDevMirror(id) {
  return !id.startsWith('auto_') && !id.startsWith('demo_');
}

function isCompleted(state, id) {
  if (state.completed.includes(id)) return true;
  if (hasDevMirror(id) && state.completed.includes(`dev_${id}`)) return true;
  return false;
}

// 한 활동이 챕터에 기여한 페이지 수.
// 미러 양쪽 다 완료해도 같은 개념이라 더하지 않고 더 큰 쪽만 인정.
function pagesEarned(state, id) {
  const direct = state.completed.includes(id) ? (ACTIVITY_XP[id] ?? 0) : 0;
  if (!hasDevMirror(id)) return direct;
  const mirror = state.completed.includes(`dev_${id}`) ? (ACTIVITY_XP[`dev_${id}`] ?? 0) : 0;
  return Math.max(direct, mirror);
}

function chapterTotalPages(activities) {
  return activities.reduce((sum, id) => sum + (ACTIVITY_XP[id] ?? 0), 0);
}

export function buildChapterProgress(state) {
  return CHAPTERS.map((chapter) => {
    const completedCount = chapter.activities.filter((id) => isCompleted(state, id)).length;
    const totalCount = chapter.activities.length;
    const filledPages = chapter.activities.reduce((sum, id) => sum + pagesEarned(state, id), 0);
    const totalPages = chapterTotalPages(chapter.activities);

    return {
      ...chapter,
      completedCount,
      totalCount,
      filledPages,
      totalPages,
      ratio: totalCount === 0 ? 0 : completedCount / totalCount,
      pageRatio: totalPages === 0 ? 0 : filledPages / totalPages,
      isComplete: totalCount > 0 && completedCount === totalCount,
    };
  });
}

export function getTotalManualPages() {
  return CHAPTERS.reduce((sum, chapter) => sum + chapterTotalPages(chapter.activities), 0);
}

// W8 — 가까운 마일스톤(챕터 PDF 발급)을 비콘에 노출하기 위한 헬퍼.
// 우선순위:
//   (1) 방금 막 닫힌(완료) 챕터가 있으면 그것을 강조 — "📄 발급 받기"
//   (2) 진행중이면서 "1개만 더" 위치인 챕터
//   (3) 진행중인 챕터 중 남은 활동이 가장 적은 챕터
//   (4) 비어있다면 활동 수가 가장 적은 챕터(빠른 첫 챕터)
export function findClosestChapter(state) {
  const chapters = buildChapterProgress(state);

  const justComplete = chapters.find((chapter) => chapter.isComplete);
  // 가장 최근 활동이 그 챕터 안에 있다면 "방금 닫힌" 것으로 간주
  const lastId = state.metrics?.lastCompletedId;
  const lastNormalized = lastId?.startsWith('dev_') ? lastId.slice(4) : lastId;
  if (justComplete && lastNormalized && justComplete.activities.includes(lastNormalized)) {
    return { ...justComplete, kind: 'just-completed' };
  }

  const inProgress = chapters
    .filter((chapter) => !chapter.isComplete && chapter.completedCount > 0)
    .sort((a, b) => (a.totalCount - a.completedCount) - (b.totalCount - b.completedCount));
  if (inProgress.length > 0) {
    const top = inProgress[0];
    const remaining = top.totalCount - top.completedCount;
    return { ...top, kind: remaining === 1 ? 'one-away' : 'in-progress', remaining };
  }

  // 빈 상태 — 활동 수가 가장 적은 챕터를 첫 목표로
  const empty = chapters
    .filter((chapter) => chapter.completedCount === 0 && chapter.totalCount > 0)
    .sort((a, b) => a.totalCount - b.totalCount);
  if (empty.length > 0) {
    return { ...empty[0], kind: 'empty', remaining: empty[0].totalCount };
  }

  return null;
}

// 어떤 챕터에서 다음에 풀어야 할 canonical activity ID.
// dev_* 미러는 같은 개념으로 묶여 있어 director 활동만 반환.
export function findNextActivityForChapter(chapter, state) {
  if (!chapter) return null;
  for (const id of chapter.activities) {
    const completedDirect = state.completed?.includes(id);
    const completedMirror = !id.startsWith('auto_') && !id.startsWith('demo_')
      && state.completed?.includes(`dev_${id}`);
    if (!completedDirect && !completedMirror) return id;
  }
  return null;
}
