// 활동 완료 직후 띄울 "데이터로 본 당신" 1~2줄.
// 두 번째 활동을 시작할 동기를 만들기 위한 마이크로 거울.
// 데이터가 없는 활동(showcase 데모 등)은 가벼운 nudge 카피로 대체.
import { ANSWER_LENGTH_BENCHMARK, QUIZ_BENCHMARK, ROLEPLAY_STYLE_BENCHMARK } from '../data/benchmarks';

function collectStrings(value, bucket) {
  if (!value) return;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed && trimmed !== 'Skipped') bucket.push(trimmed);
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

function avgAnswerLength(data) {
  const strings = [];
  collectStrings(data, strings);
  if (strings.length === 0) return null;
  const total = strings.reduce((sum, s) => sum + s.length, 0);
  return { avg: Math.round(total / strings.length), count: strings.length };
}

function tierForLength(len) {
  const v = ANSWER_LENGTH_BENCHMARK.veteran;
  if (len >= v.p90) return { label: '상위 10%', tone: 'positive' };
  if (len >= v.mean) return { label: '상위 25%', tone: 'positive' };
  if (len >= ANSWER_LENGTH_BENCHMARK.mid.mean) return { label: '중간 수준', tone: 'neutral' };
  return { label: '도입 단계', tone: 'neutral' };
}

function fmtMinSec(seconds) {
  if (!seconds) return '0초';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
}

const NUDGE_CARDS = {
  // Showcase demos는 답변 데이터가 없어 다음 단계 권유로 대체
  showcaseNudge: {
    title: '✨ 첫 데모를 봤습니다',
    line: '이제 한 줄을 직접 적어볼 차례. 다음 활동에서 당신의 답변과 베테랑 평균을 비교해 보여드립니다.',
    tone: 'neutral',
  },
  default: {
    title: '🪞 데이터로 본 당신',
    line: '활동을 더 채울수록 당신만의 패턴이 또렷해집니다.',
    tone: 'neutral',
  },
};

export function buildMicroInsight(activityId, data, _profile) {
  if (!activityId) return NUDGE_CARDS.default;

  // ── Showcase 데모 (demo_*): 그냥 nudge
  if (activityId.startsWith('demo_')) {
    return NUDGE_CARDS.showcaseNudge;
  }

  // ── Quiz: 정답률 + 속도
  if (activityId === 'quiz' || activityId === 'dev_quiz') {
    const correct = data?.correctCount ?? 0;
    const total = data?.responseDetails?.length || data?.responses?.length || 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const time = data?.totalTime ?? 0;
    const cohortAcc = Math.round(QUIZ_BENCHMARK.accuracy.mean * 100);
    const cohortTime = Math.round(QUIZ_BENCHMARK.timeSeconds.mean);
    const accTone = accuracy >= 70 ? 'positive' : accuracy >= cohortAcc ? 'neutral' : 'caution';
    return {
      title: '🪞 데이터로 본 당신',
      line: `정답률 ${accuracy}% (베테랑 평균 ${cohortAcc}%) · 풀이 시간 ${fmtMinSec(time)} (베테랑 평균 ${fmtMinSec(cohortTime)}).`,
      tone: accTone,
    };
  }

  // ── Roleplay: style + 점수율
  if (activityId === 'roleplay' || activityId === 'dev_roleplay') {
    const score = data?.totalScore ?? 0;
    const max = data?.maxScore ?? 1;
    const ratio = Math.round((score / Math.max(max, 1)) * 100);
    const styleTitle = data?.style?.title;
    const stylePct = styleTitle ? ROLEPLAY_STYLE_BENCHMARK[styleTitle] : null;
    const styleLine = stylePct != null
      ? `'${styleTitle}' 패턴은 12년차 원장 ${stylePct}%만 보이는 결입니다.`
      : '여러 시나리오를 더 풀수록 결이 또렷해집니다.';
    return {
      title: '🪞 데이터로 본 당신',
      line: `점수 ${ratio}%. ${styleLine}`,
      tone: ratio >= 70 ? 'positive' : 'neutral',
    };
  }

  // ── Crisis: 답변 평균 길이 + 시나리오 완료
  if (activityId === 'crisis' || activityId === 'dev_crisis') {
    const stat = avgAnswerLength(data?.answers);
    const completed = data?.completedScenarios ?? 0;
    if (!stat) {
      return { title: '🪞 데이터로 본 당신', line: '시나리오 답변을 채울수록 패턴이 보입니다.', tone: 'neutral' };
    }
    const tier = tierForLength(stat.avg);
    return {
      title: '🪞 데이터로 본 당신',
      line: `위기 답변 평균 ${stat.avg}자 (베테랑 평균 67자) — ${tier.label}. 시나리오 ${completed}/3 완료.`,
      tone: tier.tone,
    };
  }

  // ── Transfer / Autopilot / Noticing / CDM / Pattern : 텍스트 평균 길이
  const textBased = ['transfer', 'autopilot', 'noticing', 'cdm', 'pattern',
                     'dev_transfer', 'dev_autopilot', 'dev_noticing', 'dev_cdm', 'dev_pattern'];
  if (textBased.includes(activityId)) {
    const stat = avgAnswerLength(data);
    if (!stat) {
      return { title: '🪞 데이터로 본 당신', line: '답변을 더 채울수록 데이터가 또렷해집니다.', tone: 'neutral' };
    }
    const tier = tierForLength(stat.avg);
    return {
      title: '🪞 데이터로 본 당신',
      line: `답변 ${stat.count}건 · 평균 ${stat.avg}자 (베테랑 평균 41자) — ${tier.label}.`,
      tone: tier.tone,
    };
  }

  // ── Gallery: 게시 수 + 첫 게시 길이
  if (activityId === 'gallery' || activityId === 'dev_gallery') {
    const posts = data?.posts ?? [];
    const userPosts = posts.filter((p) => !p.isSeed);
    if (userPosts.length === 0) {
      return { title: '🪞 데이터로 본 당신', line: '아직 한 줄도 공유하지 않았어요. 한 줄이 다음 원장에게 영감이 됩니다.', tone: 'neutral' };
    }
    const avg = Math.round(userPosts.reduce((sum, p) => sum + (p.text?.length ?? 0), 0) / userPosts.length);
    return {
      title: '🪞 데이터로 본 당신',
      line: `${userPosts.length}개의 한 줄을 공유했습니다. 평균 ${avg}자 — 베테랑 시드와 같이 묶여 다른 원장에게 보입니다.`,
      tone: 'positive',
    };
  }

  // ── SECI: 프롬프트 생성 수
  if (activityId === 'seci' || activityId === 'dev_seci') {
    const promptCount = (data?.generatedPrompts?.length ?? 0) + (data?.prompt ? 1 : 0);
    return {
      title: '🪞 데이터로 본 당신',
      line: `자기 직관에서 ${promptCount}개 AI 프롬프트를 만들어냈습니다 — 자동화 1단계 통과.`,
      tone: 'positive',
    };
  }

  // ── Timeline
  if (activityId === 'timeline' || activityId === 'dev_timeline') {
    const events = Object.keys(data?.placedEvents ?? {}).length;
    return {
      title: '🪞 데이터로 본 당신',
      line: `1년에 ${events}개 사건을 배치했습니다. 6개 이상이면 운영 리듬이 보이기 시작합니다.`,
      tone: events >= 6 ? 'positive' : 'neutral',
    };
  }

  // ── Automation steps (auto_*): 단순 진척 표시
  if (activityId.startsWith('auto_')) {
    return {
      title: '🪞 자동화 진척',
      line: '한 단계씩 쌓이면 학원에 자동으로 굴러가는 비서가 생깁니다.',
      tone: 'neutral',
    };
  }

  return NUDGE_CARDS.default;
}
