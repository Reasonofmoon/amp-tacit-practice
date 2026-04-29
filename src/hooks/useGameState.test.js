import { describe, expect, it } from 'vitest';
import { createDefaultState, mergeState } from './useGameState';

describe('game state migration', () => {
  it('falls back to the default state for invalid persisted data', () => {
    expect(mergeState(null)).toEqual(createDefaultState());
    expect(mergeState('broken')).toEqual(createDefaultState());
  });

  it('keeps compatible saved fields while restoring missing defaults', () => {
    const state = mergeState({
      xp: 120,
      completed: ['demo_gidoboard'],
      profile: { name: 'Moon' },
      activityData: {
        dev_quiz: { responses: [{ qIndex: 0, correct: true }] },
      },
    });

    expect(state.xp).toBe(120);
    expect(state.completed).toEqual(['demo_gidoboard']);
    expect(state.profile).toMatchObject({ name: 'Moon', career: '', academy: '' });
    expect(state.activityData.dev_quiz.responses).toHaveLength(1);
    expect(state.activityData.timeline).toBeDefined();
  });
});
