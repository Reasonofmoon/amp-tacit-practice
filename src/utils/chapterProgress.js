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
