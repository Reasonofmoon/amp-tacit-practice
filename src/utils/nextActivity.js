// 시연이 매끄럽게 이어지도록 "다음 활동"을 고를 때:
//  1순위) 사용자가 현재 머무는 여정의 demoOrder 안에서 미완료 첫 항목
//  2순위) 가장 가까운 챕터 (findClosestChapter)
//
// 이렇게 하면 쇼케이스 투어 중에 director 활동으로 갑자기 점프하지 않는다.

import { JOURNEY_GUIDES } from '../data/journeyGuides';
import { findClosestChapter, findNextActivityForChapter } from './chapterProgress';

function isCompleted(state, id) {
  if (!state?.completed) return false;
  if (state.completed.includes(id)) return true;
  // dev_* mirror 그룹화
  if (!id.startsWith('auto_') && !id.startsWith('demo_') && state.completed.includes(`dev_${id}`)) return true;
  return false;
}

function activityIdLooksLikeJourney(id, journey) {
  if (!id) return false;
  if (journey === 'showcase') return id.startsWith('demo_');
  if (journey === 'automation') return id.startsWith('auto_');
  if (journey === 'developer') return id.startsWith('dev_');
  if (journey === 'director') return !id.startsWith('demo_') && !id.startsWith('auto_') && !id.startsWith('dev_');
  return true;
}

// 여정 내의 다음 미완료 데모 (있다면).
function pickJourneyDemo(state, activeJourney) {
  const guide = JOURNEY_GUIDES[activeJourney];
  if (!guide?.demoOrder?.length) return null;
  for (const step of guide.demoOrder) {
    if (!isCompleted(state, step.activityId)) {
      return {
        activityId: step.activityId,
        source: 'journey',
        journey: activeJourney,
        label: step.label,
        line: `다음 ${guide.ctaLabel?.replace(/시작$/, '').trim() ?? '시연'}: ${step.label}`,
      };
    }
  }
  return null;
}

// 매끄러운 다음 액션을 픽한다.
// activeJourney 가 들어오면 그 여정의 미완료 항목 우선.
export function pickNextStep(state, activeJourney) {
  // 1) 여정 내 데모 우선
  if (activeJourney) {
    const inJourney = pickJourneyDemo(state, activeJourney);
    if (inJourney) return inJourney;
  }

  // 2) 챕터 PDF 마일스톤 폴백
  const chapter = findClosestChapter(state);
  if (!chapter) return null;
  const nextId = findNextActivityForChapter(chapter, state);
  return { activityId: nextId, source: 'chapter', chapter };
}

// 활동 ID 로 자연스러운 activeJourney 추정.
export function inferJourneyFromActivityId(id) {
  if (!id) return null;
  if (id.startsWith('demo_')) return 'showcase';
  if (id.startsWith('auto_')) return 'automation';
  if (id.startsWith('dev_')) return 'developer';
  return 'director';
}

// nav handler 에서 activeJourney + currentView 를 한 번에 바꾸기.
export function buildSelectActivity(setActiveJourney, setCurrentView) {
  return (id) => {
    if (!id) return;
    const journey = inferJourneyFromActivityId(id);
    if (journey) setActiveJourney(journey);
    setCurrentView(id);
  };
}

// 여정-인식 활동 매칭 헬퍼 (UI labels 등에 사용 가능)
export { activityIdLooksLikeJourney };
