import { useEffect, useMemo, useState } from 'react';
import { ACTIVITIES } from '../data/activities';
import { BADGES } from '../data/badges';
import { ACTIVITY_XP, getComboMultiplier, getLevelInfo, getNextLevel, getOverallProgress } from '../utils/scoring';

const STORAGE_KEY = 'tacit-game-state';

function createDefaultState() {
  return {
    version: 1,
    xp: 0,
    completed: [],
    badges: [],
    combo: 0,
    maxCombo: 0,
    onboardingSeen: false,
    profile: {
      name: '',
      career: '',
      academy: '',
    },
    leaderboard: [],
    metrics: {
      crisisAll: false,
      transferAll: false,
      quizTime: null,
      quizCorrect: 0,
      roleplayScore: 0,
      patternCount: 0,
      completionCount: 0,
      lastCompletedId: null,
    },
    activityData: {
      timeline: { entries: {} },
      autopilot: { answers: {} },
      crisis: { answers: {}, completedScenarios: 0 },
      transfer: { answers: {} },
      seci: { step: 0, tacit: '', prompt: '', generatedPrompts: [], completed: false },
      gallery: { posts: [] },
      quiz: { responses: [], correctCount: 0, totalTime: null, bestCombo: 0, insights: [], finished: false },
      roleplay: { scenarioProgress: {}, completedScenarioIds: [], totalScore: 0, maxScore: 0, style: null, insights: [] },
      pattern: { matches: {}, reflections: {} },
    },
  };
}

function mergeRecord(baseRecord = {}, savedRecord = {}) {
  return { ...baseRecord, ...(savedRecord ?? {}) };
}

function mergeState(savedState) {
  const base = createDefaultState();
  if (!savedState || typeof savedState !== "object") {
    return base;
  }

  return {
    ...base,
    ...savedState,
    profile: mergeRecord(base.profile, savedState.profile),
    metrics: mergeRecord(base.metrics, savedState.metrics),
    activityData: {
      ...base.activityData,
      ...savedState.activityData,
      timeline: { ...base.activityData.timeline, ...savedState.activityData?.timeline, entries: mergeRecord(base.activityData.timeline.entries, savedState.activityData?.timeline?.entries) },
      autopilot: { ...base.activityData.autopilot, ...savedState.activityData?.autopilot, answers: mergeRecord(base.activityData.autopilot.answers, savedState.activityData?.autopilot?.answers) },
      crisis: { ...base.activityData.crisis, ...savedState.activityData?.crisis, answers: mergeRecord(base.activityData.crisis.answers, savedState.activityData?.crisis?.answers) },
      transfer: { ...base.activityData.transfer, ...savedState.activityData?.transfer, answers: mergeRecord(base.activityData.transfer.answers, savedState.activityData?.transfer?.answers) },
      seci: mergeRecord(base.activityData.seci, savedState.activityData?.seci),
      gallery: { ...base.activityData.gallery, ...savedState.activityData?.gallery, posts: [...(savedState.activityData?.gallery?.posts ?? base.activityData.gallery.posts)] },
      quiz: { ...base.activityData.quiz, ...savedState.activityData?.quiz, responses: [...(savedState.activityData?.quiz?.responses ?? base.activityData.quiz.responses)], insights: [...(savedState.activityData?.quiz?.insights ?? base.activityData.quiz.insights)] },
      roleplay: {
        ...base.activityData.roleplay,
        ...savedState.activityData?.roleplay,
        scenarioProgress: mergeRecord(base.activityData.roleplay.scenarioProgress, savedState.activityData?.roleplay?.scenarioProgress),
        completedScenarioIds: [...(savedState.activityData?.roleplay?.completedScenarioIds ?? base.activityData.roleplay.completedScenarioIds)],
        insights: [...(savedState.activityData?.roleplay?.insights ?? base.activityData.roleplay.insights)],
      },
      pattern: {
        ...base.activityData.pattern,
        ...savedState.activityData?.pattern,
        matches: mergeRecord(base.activityData.pattern.matches, savedState.activityData?.pattern?.matches),
        reflections: mergeRecord(base.activityData.pattern.reflections, savedState.activityData?.pattern?.reflections),
      },
    },
    completed: [...new Set(savedState.completed ?? base.completed)],
    badges: [...new Set(savedState.badges ?? base.badges)],
    leaderboard: [...(savedState.leaderboard ?? base.leaderboard)].slice(0, 8),
  };
}

function readStoredState() {
  if (typeof window === 'undefined') {
    return createDefaultState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? mergeState(JSON.parse(raw)) : createDefaultState();
  } catch {
    return createDefaultState();
  }
}

function normalizeBadgeState(state) {
  const completed = new Set(state.completed);
  const crisisAll = state.metrics.crisisAll || (state.activityData.crisis.completedScenarios ?? 0) >= 3;
  const transferAll = state.metrics.transferAll || Object.keys(state.activityData.transfer.answers ?? {}).length >= 6;

  return {
    ...state,
    completed,
    crisisAll,
    transferAll,
    quizTime: state.metrics.quizTime,
  };
}

function evaluateBadges(state) {
  const badgeState = normalizeBadgeState(state);
  return BADGES.filter((badge) => badge.condition(badgeState)).map((badge) => badge.id);
}

function buildLeaderboard(state, activityId, levelInfo, previousLeaderboard) {
  const entry = {
    id: `${activityId}-${Date.now()}`,
    name: state.profile.name?.trim() || '익명 원장',
    academy: state.profile.academy?.trim() || '우리 학원',
    xp: state.xp,
    level: `${levelInfo.icon} ${levelInfo.title}`,
    completedCount: state.completed.length,
    badgeCount: state.badges.length,
    timestamp: Date.now(),
  };

  return [entry, ...(previousLeaderboard ?? [])]
    .sort((left, right) => right.xp - left.xp || right.timestamp - left.timestamp)
    .slice(0, 8);
}

function emptyCelebration() {
  return {
    xpGain: null,
    levelUp: null,
    badges: [],
    combo: null,
  };
}

export function useGameState() {
  const [state, setState] = useState(readStoredState);
  const [celebration, setCelebration] = useState(emptyCelebration);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const hasCelebration = celebration.xpGain || celebration.levelUp || celebration.badges.length || celebration.combo;
    if (!hasCelebration) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setCelebration(emptyCelebration());
    }, 3200);

    return () => window.clearTimeout(timerId);
  }, [celebration]);

  const levelInfo = useMemo(() => getLevelInfo(state.xp), [state.xp]);
  const nextLevel = useMemo(() => getNextLevel(state.xp), [state.xp]);
  const progressPercent = useMemo(() => getOverallProgress(state), [state]);
  const completionPercent = Math.round((state.completed.length / ACTIVITIES.length) * 100);
  const unlockedBadges = BADGES.filter((badge) => state.badges.includes(badge.id));

  const updateProfile = (partialProfile) => {
    setState((previous) => ({
      ...previous,
      profile: {
        ...previous.profile,
        ...partialProfile,
      },
    }));
  };

  const setOnboardingSeen = () => {
    setState((previous) => ({
      ...previous,
      onboardingSeen: true,
    }));
  };

  const saveActivityData = (activityId, nextValue) => {
    setState((previous) => {
      const currentValue = previous.activityData[activityId] ?? {};
      const resolvedValue =
        typeof nextValue === 'function'
          ? nextValue(currentValue)
          : {
              ...currentValue,
              ...nextValue,
            };

      return {
        ...previous,
        activityData: {
          ...previous.activityData,
          [activityId]: resolvedValue,
        },
      };
    });
  };

  const completeActivity = (activityId, options = {}) => {
    let nextCelebration = emptyCelebration();

    setState((previous) => {
      const alreadyCompleted = previous.completed.includes(activityId);
      const previousActivityData = previous.activityData[activityId] ?? {};
      const mergedActivityData = options.activityData
        ? {
            ...previousActivityData,
            ...options.activityData,
          }
        : previousActivityData;

      const nextCompleted = alreadyCompleted ? previous.completed : [...previous.completed, activityId];
      const nextCombo = alreadyCompleted ? previous.combo : previous.combo + 1;
      const xpBase = alreadyCompleted ? 0 : (ACTIVITY_XP[activityId] ?? 0) + (options.bonusXp ?? 0);
      const multiplier = getComboMultiplier(nextCombo);
      const xpGain = alreadyCompleted ? 0 : Math.round(xpBase * multiplier);
      const nextXp = previous.xp + xpGain;
      const levelBefore = getLevelInfo(previous.xp);
      const levelAfter = getLevelInfo(nextXp);

      const nextState = {
        ...previous,
        xp: nextXp,
        completed: nextCompleted,
        combo: nextCombo,
        maxCombo: Math.max(previous.maxCombo, nextCombo),
        metrics: {
          ...previous.metrics,
          ...options.metrics,
          completionCount: nextCompleted.length,
          lastCompletedId: activityId,
        },
        activityData: {
          ...previous.activityData,
          [activityId]: mergedActivityData,
        },
      };

      const badgeIds = evaluateBadges(nextState);
      nextState.badges = badgeIds;
      nextState.leaderboard = alreadyCompleted ? previous.leaderboard : buildLeaderboard(nextState, activityId, levelAfter, previous.leaderboard);

      const newBadges = badgeIds
        .filter((badgeId) => !previous.badges.includes(badgeId))
        .map((badgeId) => BADGES.find((badge) => badge.id === badgeId))
        .filter(Boolean);

      nextCelebration = {
        xpGain: xpGain > 0 ? { amount: xpGain, at: Date.now(), activityId } : null,
        levelUp: levelAfter.level > levelBefore.level ? { from: levelBefore, to: levelAfter, at: Date.now() } : null,
        badges: newBadges,
        combo: !alreadyCompleted && nextCombo > 1 ? { count: nextCombo, multiplier, at: Date.now() } : null,
      };

      return nextState;
    });

    setCelebration(nextCelebration);
  };

  return {
    state,
    levelInfo,
    nextLevel,
    progressPercent,
    completionPercent,
    unlockedBadges,
    celebration,
    updateProfile,
    setOnboardingSeen,
    saveActivityData,
    completeActivity,
    isReportUnlocked: state.completed.length >= ACTIVITIES.length,
  };
}
