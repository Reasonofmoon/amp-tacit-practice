import { ACTIVITIES } from '../data/activities';
import { PATTERN_CARDS } from '../data/patternCards';
import { QUIZZES } from '../data/quizzes';
import { ROLEPLAY_SCENARIOS } from '../data/scenarios';

export const LEVELS = [
  { level: 1, title: '견습 원장', icon: '🌱', minXP: 0 },
  { level: 2, title: '성장 원장', icon: '🌿', minXP: 100 },
  { level: 3, title: '숙련 원장', icon: '🌳', minXP: 250 },
  { level: 4, title: '마스터 원장', icon: '⭐', minXP: 500 },
  { level: 5, title: '암묵지 장인', icon: '🏆', minXP: 800 },
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
  demo_readmaster: 20,
  demo_pettrip: 20,
  demo_smartstart: 25,
  demo_ontology: 25,
  demo_knot: 30,
  demo_bluel: 30,
  demo_librainy: 35,
  demo_moonlang: 35,
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
    case 'dev_quiz':
      return clamp((activityData?.responses?.length ?? 0) / QUIZZES.length, 0, 1);
    case 'roleplay':
    case 'dev_roleplay':
      return clamp((activityData?.completedScenarioIds?.length ?? 0) / ROLEPLAY_SCENARIOS.length, 0, 1);
    case 'pattern':
    case 'dev_pattern':
      return clamp((Object.keys(activityData?.reflections ?? {}).length || 0) / PATTERN_CARDS[0].situations.length, 0, 1);
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

  const total = ACTIVITIES.reduce((sum, activity) => sum + getActivityProgress(activity.id, state.activityData[activity.id]), 0);
  return Math.round((total / ACTIVITIES.length) * 100);
}

export function roundPercent(value, total) {
  if (!total) {
    return 0;
  }
  return Math.round((value / total) * 100);
}
