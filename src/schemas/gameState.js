import { z } from 'zod';

const unknownRecord = z.record(z.string(), z.unknown());

export const profileSchema = z.object({
  name: z.string().catch(''),
  career: z.string().catch(''),
  academy: z.string().catch(''),
}).partial().catch({});

export const metricsSchema = z.object({
  crisisAll: z.boolean().catch(false),
  transferAll: z.boolean().catch(false),
  quizTime: z.number().nullable().catch(null),
  quizCorrect: z.number().catch(0),
  roleplayScore: z.number().catch(0),
  patternCount: z.number().catch(0),
  completionCount: z.number().catch(0),
  lastCompletedId: z.string().nullable().catch(null),
}).partial().catch({});

export const consentSchema = z.object({
  benchmarkOptIn: z.boolean().catch(false),
  optedInAt: z.number().nullable().catch(null),
}).partial().catch({ benchmarkOptIn: false, optedInAt: null });

export const gameStateSchema = z.object({
  version: z.number().catch(1),
  xp: z.number().nonnegative().catch(0),
  completed: z.array(z.string()).catch([]),
  badges: z.array(z.string()).catch([]),
  combo: z.number().nonnegative().catch(0),
  maxCombo: z.number().nonnegative().catch(0),
  onboardingSeen: z.boolean().catch(false),
  profile: profileSchema,
  leaderboard: z.array(unknownRecord).catch([]),
  metrics: metricsSchema,
  activityData: unknownRecord.catch({}),
  consent: consentSchema,
}).passthrough();

export function parseStoredGameState(value) {
  const result = gameStateSchema.safeParse(value);
  return result.success ? result.data : null;
}
