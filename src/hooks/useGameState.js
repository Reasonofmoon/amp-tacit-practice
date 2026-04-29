import { useEffect, useMemo, useState } from 'react';
import { ACTIVITIES } from '../data/activities';
import { DISCOVERY_CARDS, buildDiscoveryView, evaluateDiscoveries } from '../data/discoveryCards';
import { parseStoredGameState } from '../schemas/gameState';
import { ACTIVITY_XP, getComboMultiplier, getLevelInfo, getNextLevel, getOverallProgress } from '../utils/scoring';

const STORAGE_KEY = 'tacit-game-state';

export function createDefaultState() {
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
      timeline: { placedEvents: {}, insight: '' },
      autopilot: { answers: {} },
      crisis: { answers: {}, completedScenarios: 0 },
      transfer: { answers: {} },
      seci: { step: 0, tacit: '', prompt: '', generatedPrompts: [], completed: false },
      gallery: { posts: [] },
      quiz: { responses: [], correctCount: 0, totalTime: null, bestCombo: 0, insights: [], finished: false },
      roleplay: { scenarioProgress: {}, completedScenarioIds: [], totalScore: 0, maxScore: 0, style: null, insights: [] },
      pattern: { matches: {}, reflections: {} },
      noticing: { cues: ['', '', ''], interp: '', resp: '', insight: '' },
      cdm: {
        intuition: { risk: 3, feeling: '', action: '' },
        timeline: ['', '', '', ''],
        probeAns: {},
        aarAns: {},
        card: { cue: '', interpret: '', action: '', boundary: '', alt: '' },
        insight: '',
      },
      // Developer Journey
      dev_timeline: { placedEvents: {}, insight: '' },
      dev_autopilot: { answers: {} },
      dev_crisis: { answers: {}, completedScenarios: 0 },
      dev_transfer: { answers: {} },
      dev_seci: { step: 0, tacit: '', prompt: '', generatedPrompts: [], completed: false },
      dev_gallery: { posts: [] },
      dev_quiz: { responses: [], correctCount: 0, totalTime: null, bestCombo: 0, insights: [], finished: false },
      dev_roleplay: { scenarioProgress: {}, completedScenarioIds: [], totalScore: 0, maxScore: 0, style: null, insights: [] },
      dev_pattern: { matches: {}, reflections: {} },
      dev_noticing: { cues: ['', '', ''], interp: '', resp: '', insight: '' },
      dev_cdm: {
        intuition: { risk: 3, feeling: '', action: '' },
        timeline: ['', '', '', ''],
        probeAns: {},
        aarAns: {},
        card: { cue: '', interpret: '', action: '', boundary: '', alt: '' },
        insight: '',
      },
    },
  };
}

function mergeRecord(baseRecord = {}, savedRecord = {}) {
  return { ...baseRecord, ...(savedRecord ?? {}) };
}

export function mergeState(savedState) {
  const base = createDefaultState();
  const parsedState = parseStoredGameState(savedState);
  if (!parsedState) {
    return base;
  }
  savedState = parsedState;

  return {
    ...base,
    ...savedState,
    profile: mergeRecord(base.profile, savedState.profile),
    metrics: mergeRecord(base.metrics, savedState.metrics),
    activityData: {
      ...base.activityData,
      ...savedState.activityData,
      timeline: {
        ...base.activityData.timeline,
        ...savedState.activityData?.timeline,
        placedEvents: mergeRecord(
          base.activityData.timeline.placedEvents,
          savedState.activityData?.timeline?.placedEvents
            ?? savedState.activityData?.timeline?.entries,
        ),
      },
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
      noticing: mergeRecord(base.activityData.noticing, savedState.activityData?.noticing),
      cdm: {
        ...base.activityData.cdm,
        ...savedState.activityData?.cdm,
        intuition: mergeRecord(base.activityData.cdm.intuition, savedState.activityData?.cdm?.intuition),
        probeAns: mergeRecord(base.activityData.cdm.probeAns, savedState.activityData?.cdm?.probeAns),
        aarAns: mergeRecord(base.activityData.cdm.aarAns, savedState.activityData?.cdm?.aarAns),
        card: mergeRecord(base.activityData.cdm.card, savedState.activityData?.cdm?.card),
        timeline: [...(savedState.activityData?.cdm?.timeline ?? base.activityData.cdm.timeline)],
      },
      
      // Developer Journey Merges
      dev_timeline: {
        ...base.activityData.dev_timeline,
        ...savedState.activityData?.dev_timeline,
        placedEvents: mergeRecord(
          base.activityData.dev_timeline.placedEvents,
          savedState.activityData?.dev_timeline?.placedEvents
            ?? savedState.activityData?.dev_timeline?.entries,
        ),
      },
      dev_autopilot: { ...base.activityData.dev_autopilot, ...savedState.activityData?.dev_autopilot, answers: mergeRecord(base.activityData.dev_autopilot.answers, savedState.activityData?.dev_autopilot?.answers) },
      dev_crisis: { ...base.activityData.dev_crisis, ...savedState.activityData?.dev_crisis, answers: mergeRecord(base.activityData.dev_crisis.answers, savedState.activityData?.dev_crisis?.answers) },
      dev_transfer: { ...base.activityData.dev_transfer, ...savedState.activityData?.dev_transfer, answers: mergeRecord(base.activityData.dev_transfer.answers, savedState.activityData?.dev_transfer?.answers) },
      dev_seci: mergeRecord(base.activityData.dev_seci, savedState.activityData?.dev_seci),
      dev_gallery: { ...base.activityData.dev_gallery, ...savedState.activityData?.dev_gallery, posts: [...(savedState.activityData?.dev_gallery?.posts ?? base.activityData.dev_gallery.posts)] },
      dev_quiz: { ...base.activityData.dev_quiz, ...savedState.activityData?.dev_quiz, responses: [...(savedState.activityData?.dev_quiz?.responses ?? base.activityData.dev_quiz.responses)], insights: [...(savedState.activityData?.dev_quiz?.insights ?? base.activityData.dev_quiz.insights)] },
      dev_roleplay: {
        ...base.activityData.dev_roleplay,
        ...savedState.activityData?.dev_roleplay,
        scenarioProgress: mergeRecord(base.activityData.dev_roleplay.scenarioProgress, savedState.activityData?.dev_roleplay?.scenarioProgress),
        completedScenarioIds: [...(savedState.activityData?.dev_roleplay?.completedScenarioIds ?? base.activityData.dev_roleplay.completedScenarioIds)],
        insights: [...(savedState.activityData?.dev_roleplay?.insights ?? base.activityData.dev_roleplay.insights)],
      },
      dev_pattern: {
        ...base.activityData.dev_pattern,
        ...savedState.activityData?.dev_pattern,
        matches: mergeRecord(base.activityData.dev_pattern.matches, savedState.activityData?.dev_pattern?.matches),
        reflections: mergeRecord(base.activityData.dev_pattern.reflections, savedState.activityData?.dev_pattern?.reflections),
      },
      dev_noticing: mergeRecord(base.activityData.dev_noticing, savedState.activityData?.dev_noticing),
      dev_cdm: {
        ...base.activityData.dev_cdm,
        ...savedState.activityData?.dev_cdm,
        intuition: mergeRecord(base.activityData.dev_cdm.intuition, savedState.activityData?.dev_cdm?.intuition),
        probeAns: mergeRecord(base.activityData.dev_cdm.probeAns, savedState.activityData?.dev_cdm?.probeAns),
        aarAns: mergeRecord(base.activityData.dev_cdm.aarAns, savedState.activityData?.dev_cdm?.aarAns),
        card: mergeRecord(base.activityData.dev_cdm.card, savedState.activityData?.dev_cdm?.card),
        timeline: [...(savedState.activityData?.dev_cdm?.timeline ?? base.activityData.dev_cdm.timeline)],
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
  const completed = state.completed;
  const crisisAll = state.metrics.crisisAll || (state.activityData.crisis.completedScenarios ?? 0) >= 3;
  const transferAll = state.metrics.transferAll || Object.keys(state.activityData.transfer.answers ?? {}).length >= 6;

  // Discovery card conditions read state.metrics.crisisAll/transferAll/quizTime,
  // so keep both shapes available.
  return {
    ...state,
    completed,
    crisisAll,
    transferAll,
    quizTime: state.metrics.quizTime,
    metrics: {
      ...state.metrics,
      crisisAll,
      transferAll,
    },
  };
}

function evaluateBadges(state) {
  const normalized = normalizeBadgeState(state);
  return evaluateDiscoveries(normalized);
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
  const unlockedBadges = DISCOVERY_CARDS.filter((card) => state.badges.includes(card.id));

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

      // Only newly unlocked discovery cards trigger celebration.
      // Build evidence text using the *next* state so the data line is fresh.
      const normalizedNext = normalizeBadgeState(nextState);
      const newIds = badgeIds.filter((badgeId) => !previous.badges.includes(badgeId));
      const newBadges = buildDiscoveryView(normalizedNext, newIds).filter((card) => card.unlocked && newIds.includes(card.id));

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
