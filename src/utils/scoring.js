import { ACTIVITIES } from '../data/activities';
import { AUTOMATION_ACTIVITIES } from '../data/automationActivities';
import { DEV_ACTIVITIES } from '../data/developerActivities';
import { DEV_PATTERN_CARDS } from '../data/developerPatternCards';
import { DEV_QUIZZES } from '../data/developerQuizzes';
import { DEV_ROLEPLAY_SCENARIOS } from '../data/developerScenarios';
import { PATTERN_CARDS } from '../data/patternCards';
import { QUIZZES } from '../data/quizzes';
import { ROLEPLAY_SCENARIOS } from '../data/scenarios';
import { SHOWCASE_ACTIVITIES } from '../data/showcaseActivities';

// 직책 카드: 게임식 호칭(견습/장인) 대신 "결과물 기반 정체성".
// 무엇을 가졌는가 / 무엇을 하는가로 정의. minXP는 누적 페이지(=내부 xp) 임계값.
export const LEVELS = [
  { level: 1, title: '노트 첫 장을 펼친 원장',         icon: '✏️', minXP: 0 },
  { level: 2, title: '운영 메모를 모으는 원장',        icon: '📓', minXP: 100 },
  { level: 3, title: '자기 매뉴얼을 가진 원장',        icon: '📚', minXP: 250 },
  { level: 4, title: '매뉴얼을 강사와 나누는 원장',    icon: '🗂️', minXP: 500 },
  { level: 5, title: '운영 매뉴얼이 책 한 권이 된 원장', icon: '🏛️', minXP: 800 },
];

export const ACTIVITY_XP = {
  timeline: 40,
  autopilot: 50,
  crisis: 60,
  transfer: 50,
  seci: 70,
  gallery: 30,
  quiz: 80,
  roleplay: 100,
  pattern: 60,
  noticing: 60,
  cdm: 110,
  dev_timeline: 40,
  dev_autopilot: 50,
  dev_crisis: 60,
  dev_transfer: 50,
  dev_seci: 70,
  dev_gallery: 30,
  dev_quiz: 80,
  dev_roleplay: 100,
  dev_pattern: 60,
  dev_noticing: 60,
  dev_cdm: 110,
  auto_setup: 40,
  auto_script: 50,
  auto_property: 50,
  auto_code: 60,
  auto_trigger: 60,
  demo_showcase_intro: 15,
  demo_sign_design: 20,
  demo_readmaster: 20,
  demo_pettrip: 20,
  demo_smartstart: 25,
  demo_writing_correction: 25,
  demo_level_test_proto: 25,
  demo_academy_os: 30,
  demo_ontology: 25,
  demo_storyboard_gen: 30,
  demo_knot: 30,
  demo_bluel: 30,
  demo_librainy: 35,
  demo_moonlang: 35,
  demo_gidoboard: 40,
  demo_sabo_philosophy: 40,
  demo_app_factory: 45,
};

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function getLevelInfo(xp) {
  return LEVELS.reduce((current, level) => (xp >= level.minXP ? level : current), LEVELS[0]);
}

export function getNextLevel(xp) {
  return LEVELS.find((level) => level.minXP > xp) ?? LEVELS[LEVELS.length - 1];
}

export function getComboMultiplier(comboCount) {
  if (comboCount >= 4) {
    return 2;
  }
  if (comboCount === 3) {
    return 1.5;
  }
  if (comboCount === 2) {
    return 1.2;
  }
  return 1;
}

export function formatMultiplier(comboCount) {
  return `x${getComboMultiplier(comboCount).toFixed(1).replace('.0', '')}`;
}

export function calculateQuizBonus(correctCount, bestCombo) {
  return correctCount * 15 + Math.max(0, bestCombo - 1) * 10;
}

export function calculateRoleplayBonus(totalScore) {
  return totalScore * 4;
}

export function calculatePatternBonus(reflectionCount) {
  return reflectionCount * 4;
}

export function calculateRoleplayStyle(totalScore, maxScore) {
  const ratio = maxScore === 0 ? 0 : totalScore / maxScore;

  if (ratio >= 0.8) {
    return {
      title: '신뢰 구축형',
      desc: '감정을 먼저 받으면서도 실행 계획을 빠르게 제시하는 상담 스타일입니다.',
      tone: 'excellent',
    };
  }

  if (ratio >= 0.55) {
    return {
      title: '균형 조율형',
      desc: '상황 파악과 문제 해결의 균형은 좋지만, 결정적 순간의 구체성이 조금 더 필요합니다.',
      tone: 'good',
    };
  }

  return {
    title: '즉흥 대응형',
    desc: '반응은 빠르지만 공감과 후속 계획을 더 구체화하면 신뢰를 크게 높일 수 있습니다.',
    tone: 'warn',
  };
}

function countFilledValues(record = {}) {
  return Object.values(record).filter((value) => typeof value === 'string' && value.trim()).length;
}

export function getActivityProgress(activityId, activityData) {
  const normalizedActivityId = activityId?.replace(/^dev_/, '');

  switch (activityId) {
    case 'timeline':
    case 'dev_timeline':
      return clamp(Object.keys(activityData?.placedEvents ?? activityData?.entries ?? {}).length / 6, 0, 1);
    case 'autopilot':
    case 'dev_autopilot':
      return clamp(countFilledValues(activityData?.answers) / 6, 0, 1);
    case 'crisis':
    case 'dev_crisis':
      return clamp((activityData?.completedScenarios ?? 0) / 3, 0, 1);
    case 'transfer':
    case 'dev_transfer':
      return clamp(countFilledValues(activityData?.answers) / 6, 0, 1);
    case 'seci':
    case 'dev_seci':
      return activityData?.completed ? 1 : 0;
    case 'gallery':
    case 'dev_gallery':
      return clamp((activityData?.posts?.length ?? 0) / 3, 0, 1);
    case 'quiz':
      return clamp((activityData?.responses?.length ?? 0) / QUIZZES.length, 0, 1);
    case 'dev_quiz':
      return clamp((activityData?.responses?.length ?? 0) / DEV_QUIZZES.length, 0, 1);
    case 'roleplay':
      return clamp((activityData?.completedScenarioIds?.length ?? 0) / ROLEPLAY_SCENARIOS.length, 0, 1);
    case 'dev_roleplay':
      return clamp((activityData?.completedScenarioIds?.length ?? 0) / DEV_ROLEPLAY_SCENARIOS.length, 0, 1);
    case 'pattern':
      return clamp((Object.keys(activityData?.reflections ?? {}).length || 0) / PATTERN_CARDS[0].situations.length, 0, 1);
    case 'dev_pattern':
      return clamp((Object.keys(activityData?.reflections ?? {}).length || 0) / DEV_PATTERN_CARDS[0].situations.length, 0, 1);
    case 'noticing':
    case 'dev_noticing':
      return clamp(
        [
          ...(activityData?.cues ?? []),
          activityData?.interp,
          activityData?.resp,
        ].filter((value) => typeof value === 'string' && value.trim()).length / 5,
        0,
        1,
      );
    case 'cdm':
    case 'dev_cdm':
      return clamp(
        (
          (activityData?.intuition?.action?.trim() ? 1 : 0) +
          (activityData?.timeline?.filter((value) => value?.trim()).length ?? 0) / 4 +
          Object.keys(activityData?.probeAns ?? {}).length / 5 +
          Object.keys(activityData?.aarAns ?? {}).length / 4 +
          Object.values(activityData?.card ?? {}).filter((value) => value?.trim()).length / 5
        ) / 5,
        0,
        1,
      );
    default:
      if (normalizedActivityId?.startsWith('auto_') || activityId?.startsWith('demo_')) {
        return activityData && Object.keys(activityData).length > 0 ? 1 : 0;
      }
      return 0;
  }
}

export function getOverallProgress(state) {
  if (!state?.activityData) {
    return 0;
  }

  const allActivities = [
    ...ACTIVITIES,
    ...DEV_ACTIVITIES,
    ...AUTOMATION_ACTIVITIES,
    ...SHOWCASE_ACTIVITIES,
  ];
  const total = allActivities.reduce((sum, activity) => sum + getActivityProgress(activity.id, state.activityData[activity.id]), 0);
  return Math.round((total / allActivities.length) * 100);
}

export function getJourneyProgress(state, activities = ACTIVITIES) {
  if (!state?.activityData || activities.length === 0) {
    return 0;
  }

  const total = activities.reduce((sum, activity) => sum + getActivityProgress(activity.id, state.activityData[activity.id]), 0);
  return Math.round((total / activities.length) * 100);
}

export function roundPercent(value, total) {
  if (!total) {
    return 0;
  }
  return Math.round((value / total) * 100);
}
