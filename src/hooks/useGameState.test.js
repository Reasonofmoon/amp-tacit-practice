import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createDefaultState, mergeState, useGameState } from './useGameState';

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

  it('resets persisted workshop progress and cached benchmark data', async () => {
    window.localStorage.setItem('tacit-game-state', JSON.stringify({
      xp: 240,
      completed: ['quiz'],
      onboardingSeen: true,
      profile: { name: '테스터' },
    }));
    window.localStorage.setItem('tacit-benchmark-cache-v1', JSON.stringify({ fetchedAt: Date.now() }));

    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.resetGameState();
    });

    await waitFor(() => {
      expect(result.current.state).toEqual(createDefaultState());
      expect(JSON.parse(window.localStorage.getItem('tacit-game-state'))).toEqual(createDefaultState());
    });
    expect(window.localStorage.getItem('tacit-benchmark-cache-v1')).toBeNull();
  });
});
