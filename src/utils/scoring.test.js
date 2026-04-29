import { describe, expect, it } from 'vitest';
import { DEV_PATTERN_CARDS } from '../data/developerPatternCards';
import { DEV_QUIZZES } from '../data/developerQuizzes';
import { DEV_ROLEPLAY_SCENARIOS } from '../data/developerScenarios';
import { SHOWCASE_ACTIVITIES } from '../data/showcaseActivities';
import { ACTIVITY_XP, getActivityProgress, getJourneyProgress } from './scoring';

describe('scoring', () => {
  it('uses developer-specific quiz length', () => {
    const responses = DEV_QUIZZES.map((_, index) => ({ qIndex: index, correct: true }));

    expect(getActivityProgress('dev_quiz', { responses })).toBe(1);
  });

  it('uses developer-specific roleplay scenario length', () => {
    const completedScenarioIds = DEV_ROLEPLAY_SCENARIOS.map((scenario) => scenario.id);

    expect(getActivityProgress('dev_roleplay', { completedScenarioIds })).toBe(1);
  });

  it('uses developer-specific pattern card length', () => {
    const reflections = Object.fromEntries(
      DEV_PATTERN_CARDS[0].situations.map((situation) => [situation.id, 'done']),
    );

    expect(getActivityProgress('dev_pattern', { reflections })).toBe(1);
  });

  it('includes every showcase activity in XP rewards', () => {
    const missingRewardIds = SHOWCASE_ACTIVITIES
      .map((activity) => activity.id)
      .filter((activityId) => typeof ACTIVITY_XP[activityId] !== 'number');

    expect(missingRewardIds).toEqual([]);
  });

  it('calculates journey progress from the supplied activity list', () => {
    const state = {
      activityData: {
        demo_readmaster: { isChecked: true },
      },
    };

    expect(getJourneyProgress(state, SHOWCASE_ACTIVITIES)).toBeGreaterThan(0);
  });
});
