import { describe, expect, it } from 'vitest';
import {
  createPrincipleDefaultData,
  DEV_PRINCIPLES,
  getPrinciplePrerequisite,
  getPrincipleSpeakerNotes,
  isPrinciplePracticeReady,
  isPrincipleUnlocked,
  listPrincipleIds,
} from './developerPrinciples';
import { DEV_ACTIVITIES } from './developerActivities';
import { JOURNEY_GUIDES } from './journeyGuides';
import { DISCOVERY_CARDS } from './discoveryCards';

const EXPECTED = [
  'dev_info_flow',
  'dev_output_close',
  'dev_prompt_asset',
  'dev_harness_design',
  'dev_verify_loop',
  'dev_domain_moat',
  'dev_public_loop',
];

function fillReady(id) {
  const d = createPrincipleDefaultData(id);
  switch (id) {
    case 'dev_info_flow':
      return {
        ...d,
        sources: 'newsletter + github',
        bottlenecks: 'no weekly review',
        loop: { collect: 'rss box', refine: 'product fit', store: 'obsidian', reuse: 'fri review' },
        weeklyCadence: 'daily 10m',
      };
    case 'dev_output_close':
      return {
        ...d,
        auditRows: [
          { item: 'video A', trace: 'none', when: 'y', closed: false },
          { item: 'article B', trace: 'highlight', when: 'y', closed: false },
          { item: 'meeting C', trace: 'notes', when: 'y', closed: true },
        ],
        contract: { form: 'video->3 lines', deadline: '24h', minSize: '3 lines' },
        checklist: { closedOne: true, storePath: 'inbox', weeklyGoal: '5' },
      };
    case 'dev_prompt_asset':
      return {
        ...d,
        candidate: 'weekly summary request',
        promotion: {
          name: 'weekly-report',
          slots: '{period}',
          shape: 'H2 x3',
          check: 'has numbers\nkeeps jargon',
        },
        storage: { location: '스킬 파일', keyword: 'weekly' },
        executed: true,
      };
    case 'dev_harness_design':
      return {
        ...d,
        target: { task: 'daily briefing', output: 'post' },
        roles: [
          { role: '설계자', does: 'topics', produces: 'list' },
          { role: '실행자', does: 'draft', produces: 'md' },
          { role: '검사자', does: 'check', produces: 'ok' },
        ],
        steps: [
          { name: 'collect', procedure: 'rss', doneWhen: '10' },
          { name: 'curate', procedure: 'pick3', doneWhen: 'table' },
          { name: 'publish', procedure: 'hexo', doneWhen: 'url' },
        ],
        boundary: { never1: 'no source', never2: 'no auto deploy', humanGate: 'final approve' },
      };
    case 'dev_verify_loop':
      return {
        ...d,
        target: { step: 'curate', failureMode: 'no source' },
        rubric: {
          format: { item: '3 rows', how: 'count' },
          fact: { item: 'url', how: 'exists' },
          intent: { item: 'action', how: 'todo' },
        },
        gate: { passCount: '2/3', hardFail: 'zero source' },
        retry: [
          { kind: '형식 깨짐', change: 'force template', max: '2' },
          { kind: '사실 부족', change: 'split source step', max: '2' },
          { kind: '의도 이탈', change: 'reinject persona', max: '1' },
        ],
        log: {
          path: 'verify-log',
          fields: { input: true, broken: true, changed: true, result: false },
          when: 'friday',
        },
      };
    case 'dev_domain_moat':
      return {
        ...d,
        probes: { wrongness: 'shallow policy takes', privateData: 'fail logs', reps: '', bilingual: '' },
        narrowing: { field: 'edu', audience: 'parents', constraint: '2028 reform' },
        selfTest: { q1: true, q2: true, q3: true },
        plan: { form: 'news x3', perWeek: '3' },
      };
    case 'dev_public_loop':
      return {
        ...d,
        firstPublic: 'domain map',
        levers: {
          cadence: '주 1회',
          firstDate: '2026-08-01',
          channel: '팀 채널',
          invite: '틀린 부분이 보이면 알려주세요. 고쳐서 다시 올리겠습니다.',
        },
        ship: { posted: true, where: '#ai-lab', inviteAttached: true },
        weekPlan: { ...d.weekPlan, calendarRegistered: true },
      };
    default:
      return d;
  }
}

describe('developer principles series', () => {
  it('exposes seven principle ids in order', () => {
    expect(listPrincipleIds()).toEqual(EXPECTED);
  });

  it('pins principles at the top of DEV_ACTIVITIES (S1)', () => {
    expect(DEV_ACTIVITIES.slice(0, 7).map((a) => a.id)).toEqual(EXPECTED);
  });

  it('wires demoOrder ①→⑦', () => {
    expect(JOURNEY_GUIDES.developer.demoOrder.map((s) => s.activityId)).toEqual(EXPECTED);
  });

  it('has live anchors and debrief for each principle', () => {
    for (const principle of DEV_PRINCIPLES) {
      expect((principle.liveExamples ?? []).length).toBeGreaterThan(0);
      expect(principle.debrief?.length).toBeGreaterThanOrEqual(3);
      expect(principle.practice?.kind).toBeTruthy();
    }
  });

  it('marks filled worksheets as practice-ready', () => {
    for (const id of EXPECTED) {
      expect(isPrinciplePracticeReady(id, fillReady(id))).toBe(true);
    }
  });

  it('unlocks System Owner when all seven principles are completed', () => {
    const card = DISCOVERY_CARDS.find((c) => c.id === 'system_owner');
    expect(card).toBeTruthy();
    expect(card.condition({ completed: EXPECTED })).toBe(true);
    expect(card.condition({ completed: EXPECTED.slice(0, 6) })).toBe(false);
  });

  it('locks principles until the previous one is completed', () => {
    expect(isPrincipleUnlocked('dev_info_flow', [])).toBe(true);
    expect(isPrincipleUnlocked('dev_output_close', [])).toBe(false);
    expect(isPrincipleUnlocked('dev_output_close', ['dev_info_flow'])).toBe(true);
    expect(getPrinciplePrerequisite('dev_prompt_asset')).toBe('dev_output_close');
    expect(isPrincipleUnlocked('dev_quiz', [])).toBe(true);
  });

  it('bypasses principle locks in presenter mode', () => {
    expect(isPrincipleUnlocked('dev_public_loop', [], { presenterMode: true })).toBe(true);
    expect(isPrincipleUnlocked('dev_output_close', [], { presenterMode: true })).toBe(true);
  });

  it('provides speaker notes for each principle', () => {
    for (const id of EXPECTED) {
      expect(getPrincipleSpeakerNotes(id).length).toBeGreaterThan(0);
    }
  });
});
