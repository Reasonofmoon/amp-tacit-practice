// "발견 카드 (Discovery Cards)" — 시상식 메달이었던 BADGES 를 자기 데이터 거울로 교체.
// 각 카드는 (1) 정체성 한 단어, (2) 정체성 한 줄 desc, (3) 데이터 기반 evidence 1줄을 갖는다.
// 잠금이 풀리면 원장은 "내가 이런 사람이구나"를 본인 답변으로 마주한다.
// W6: evidence 라인이 익명 베테랑 표본(N=84)과의 비교를 함께 노출한다.

import {
  compareAnswerLength,
  compareCrisisCompletion,
  compareKeywordDensity,
  compareQuizTime,
  compareRoleplayStyle,
} from '../utils/benchmark';

function collectStrings(value, bucket) {
  if (!value) return;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed) bucket.push(trimmed);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => collectStrings(entry, bucket));
    return;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((entry) => collectStrings(entry, bucket));
  }
}

function countMatches(text, words) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  return words.reduce((sum, word) => {
    const re = new RegExp(word.toLowerCase(), 'g');
    return sum + (lower.match(re)?.length ?? 0);
  }, 0);
}

function buildEvidenceContext(state) {
  const allStrings = [];
  collectStrings(state.activityData ?? {}, allStrings);
  const fullText = allStrings.join(' ');

  return {
    fullText,
    totalChars: fullText.length,
    keywordCount(words) {
      return countMatches(fullText, words);
    },
    activityAvgLength(activityId) {
      const data = state.activityData?.[activityId];
      const strings = [];
      collectStrings(data, strings);
      if (strings.length === 0) return 0;
      const total = strings.reduce((sum, s) => sum + s.length, 0);
      return Math.round(total / strings.length);
    },
    totalCharCount() {
      return fullText.length;
    },
    answerStringCount() {
      return allStrings.length;
    },
  };
}

export const DISCOVERY_CARDS = [
  {
    id: 'observer',  // ID 보존 — localStorage badges 호환
    name: '관찰 우선형',
    icon: '👁️',
    desc: '데이터보다 표정·태도·침묵 같은 비언어 단서를 먼저 본다.',
    benchmark: '신입 강사보다 비언어 키워드를 평균 3배 더 자주 사용합니다.',
    condition: (state) => state.completed.includes('autopilot') || state.completed.includes('noticing')
                       || state.completed.includes('dev_autopilot') || state.completed.includes('dev_noticing'),
    evidence: (state, ctx) => {
      const non = ctx.keywordCount(['표정', '태도', '눈빛', '느낌', '분위기', '톤', '침묵', '눈치']);
      const num = ctx.keywordCount(['점수', '데이터', '숫자', '통계', '결과', '지표']);
      const sensoryCmp = compareKeywordDensity(ctx.totalChars, non, 'sensory');
      const ratio = num === 0 ? `${non}회 vs 0회` : `${non} : ${num}`;
      const compareLine = sensoryCmp
        ? sensoryCmp.aboveTopDecile
          ? ` 베테랑 상위 10% 패턴(1000자당 ${sensoryCmp.userPer1k}회)입니다.`
          : sensoryCmp.aboveAverage
          ? ` 베테랑 평균(1000자당 ${sensoryCmp.cohortMean}회)보다 ${sensoryCmp.ratioVsMean}배 높은 빈도.`
          : ''
        : '';
      return `당신의 답변에서 비언어 단서가 ${non}회, 숫자 키워드가 ${num}회 등장합니다 (${ratio}).${compareLine}`;
    },
  },
  {
    id: 'crisis_manager',
    name: '위기 침착형',
    icon: '🪨',
    desc: '압박이 높을수록 단서를 더 또렷하게 보고 길게 적는다.',
    benchmark: '위기 답변 평균 길이 80자 이상은 베테랑(10년+) 패턴.',
    condition: (state) => state.metrics?.crisisAll || (state.activityData?.crisis?.completedScenarios ?? 0) >= 3,
    evidence: (state, ctx) => {
      const len = ctx.activityAvgLength('crisis');
      const cmp = compareAnswerLength(len, 'veteran');
      const completionCmp = compareCrisisCompletion(state.metrics?.crisisAll);
      return `위기 답변 평균 ${len}자 — 베테랑 평균(${cmp.cohortMean}자) 대비 ${cmp.label}.${completionCmp.rare ? ` 위기 3개를 모두 작성하는 베테랑은 ${completionCmp.cohortRatePercent}%뿐입니다.` : ''}`;
    },
  },
  {
    id: 'mentor',
    name: '전수 본능형',
    icon: '✋',
    desc: '경험을 후배가 그대로 따라할 수 있는 형태로 풀어 쓴다.',
    benchmark: '전수 6항목 모두 작성하는 원장은 약 18%.',
    condition: (state) => {
      const filled = Object.values(state.activityData?.transfer?.answers ?? {})
        .filter((value) => typeof value === 'string' && value.trim()).length;
      return state.metrics?.transferAll || filled >= 6;
    },
    evidence: (state) => {
      const filled = Object.values(state.activityData?.transfer?.answers ?? {})
        .filter((value) => typeof value === 'string' && value.trim()).length;
      return `신입 전수 항목 ${filled}/6개를 모두 문장으로 적었습니다 — 매뉴얼화 본능이 강합니다.`;
    },
  },
  {
    id: 'transformer',
    name: '시스템 전환자',
    icon: '🔧',
    desc: '직관을 시스템·도구·프롬프트로 옮기는 손을 가졌다.',
    benchmark: 'SECI 변환을 끝까지 마치는 원장은 약 26%.',
    condition: (state) => state.completed.includes('seci') || state.completed.includes('dev_seci'),
    evidence: (state) => {
      const main = state.activityData?.seci?.prompt ? 1 : 0;
      const generated = (state.activityData?.seci?.generatedPrompts ?? []).length;
      return `자기 직관에서 ${Math.max(main + generated, 1)}개의 AI 프롬프트를 만들어냈습니다.`;
    },
  },
  {
    id: 'speedster',
    name: '즉시 판단형',
    icon: '⏱️',
    desc: '깊이보다 속도가 무기 — 짧은 시간에 결정한다.',
    benchmark: '퀴즈 3분 이내 완료자는 약 20%.',
    condition: (state) => {
      const t = state.metrics?.quizTime;
      return typeof t === 'number' && t > 0 && t < 180;
    },
    evidence: (state) => {
      const t = state.metrics?.quizTime ?? 0;
      const m = Math.floor(t / 60);
      const s = Math.round(t % 60);
      const cmp = compareQuizTime(t);
      const cohortMin = Math.floor((cmp?.cohortMean ?? 0) / 60);
      const cohortSec = Math.round((cmp?.cohortMean ?? 0) % 60);
      return `퀴즈 ${m}분 ${s}초 만에 완료 — 베테랑 평균(${cohortMin}분 ${cohortSec}초) 대비 ${cmp?.label ?? '빠른 편'} 속도.`;
    },
  },
  {
    id: 'empath',
    name: '관계 우선형',
    icon: '🪞',
    desc: '갈등 상황에서 사실 확인보다 감정을 먼저 받는다.',
    benchmark: "'감정 먼저' 응답을 70% 이상 고르면 신뢰 구축형 상담 스타일.",
    condition: (state) => state.completed.includes('roleplay') || state.completed.includes('dev_roleplay'),
    evidence: (state) => {
      const score = state.activityData?.roleplay?.totalScore ?? 0;
      const max = state.activityData?.roleplay?.maxScore ?? 1;
      const pct = Math.round((score / Math.max(max, 1)) * 100);
      const tone = pct >= 70 ? '주로' : pct >= 40 ? '절반 가까이' : '일부';
      const styleTitle = state.activityData?.roleplay?.style?.title;
      const styleCmp = compareRoleplayStyle(styleTitle);
      const styleLine = styleCmp ? ` 같은 '${styleTitle}' 패턴은 12년차 원장 ${styleCmp.matchPercent}%만이 보입니다.` : '';
      return `역할극 점수 ${pct}% — '감정 먼저' 선택을 ${tone} 골랐습니다.${styleLine}`;
    },
  },
  {
    id: 'pattern_finder',
    name: '연결 사고형',
    icon: '🪢',
    desc: '단편적 사건들 사이에서 반복되는 패턴을 본다.',
    benchmark: '패턴마다 자기 언어로 이유를 적는 원장은 약 22%.',
    condition: (state) => state.completed.includes('pattern') || state.completed.includes('dev_pattern'),
    evidence: (state) => {
      const directorReflections = Object.keys(state.activityData?.pattern?.reflections ?? {}).length;
      const devReflections = Object.keys(state.activityData?.dev_pattern?.reflections ?? {}).length;
      const reflections = Math.max(directorReflections, devReflections);
      return `상황 → 대응 매칭 ${reflections}건마다 자기 언어로 이유를 적었습니다.`;
    },
  },
  {
    id: 'master',
    name: '백서 작가형',
    icon: '🪶',
    desc: '한 챕터에 머무르지 않고 학원 전체 백서를 짠다.',
    benchmark: '9개 이상 활동을 가로지르는 원장은 약 12%.',
    condition: (state) => state.completed.length >= 9,
    evidence: (state) => `${state.completed.length}개 활동을 가로질러 매뉴얼을 채웠습니다 — 다중 챕터 동시 진행 패턴.`,
  },
];

// useGameState 가 호출하는 평가 함수.
// 매칭된 카드 ID 배열을 돌려준다. (storage 키 state.badges 그대로 호환)
export function evaluateDiscoveries(state) {
  return DISCOVERY_CARDS.filter((card) => {
    try { return card.condition(state); } catch { return false; }
  }).map((card) => card.id);
}

// 잠금 해제된 카드들에 evidence 문장을 채워서 표시용 객체로 반환.
export function buildDiscoveryView(state, unlockedIds) {
  const ctx = buildEvidenceContext(state);
  const ids = new Set(unlockedIds);
  return DISCOVERY_CARDS.map((card) => ({
    ...card,
    unlocked: ids.has(card.id),
    evidenceText: ids.has(card.id) ? safeEvidence(card, state, ctx) : null,
  }));
}

function safeEvidence(card, state, ctx) {
  try { return card.evidence(state, ctx); } catch { return card.desc; }
}

// Backward-compat alias — 기존 import 처는 점진적으로 정리.
export const BADGES = DISCOVERY_CARDS;
