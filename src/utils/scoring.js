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
  switch (activityId) {
    case 'timeline':
      return clamp(countFilledValues(activityData?.entries) / 6, 0, 1);
    case 'autopilot':
      return clamp(countFilledValues(activityData?.answers) / 6, 0, 1);
    case 'crisis':
      return clamp((activityData?.completedScenarios ?? 0) / 3, 0, 1);
    case 'transfer':
      return clamp(countFilledValues(activityData?.answers) / 6, 0, 1);
    case 'seci':
      return activityData?.completed ? 1 : 0;
    case 'gallery':
      return clamp((activityData?.posts?.length ?? 0) / 3, 0, 1);
    case 'quiz':
      return clamp((activityData?.responses?.length ?? 0) / QUIZZES.length, 0, 1);
    case 'roleplay':
      return clamp((activityData?.completedScenarioIds?.length ?? 0) / ROLEPLAY_SCENARIOS.length, 0, 1);
    case 'pattern':
      return clamp((Object.keys(activityData?.reflections ?? {}).length || 0) / PATTERN_CARDS[0].situations.length, 0, 1);
    default:
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
