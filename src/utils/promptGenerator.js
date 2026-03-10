const STOP_WORDS = new Set([
  '그리고',
  '하지만',
  '그래서',
  '정말',
  '항상',
  '먼저',
  '다음',
  '학생',
  '학부모',
  '학원',
  '원장',
  '강사',
  '수업',
  '상황',
  '하는',
  '있습니다',
  '입니다',
  '그것',
  '이것',
  '오늘',
  '이번',
  '나의',
  '당신',
  '이런',
  '그런',
  '에서',
  '으로',
  '에게',
  '대한',
  '완료',
  '작성',
  '응답',
]);

function collectStrings(value, bucket) {
  if (!value) {
    return;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length > 5) {
      bucket.push(trimmed);
    }
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

function tokenize(text) {
  return text
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token) && !/^\d+$/.test(token));
}

function firstSentence(text) {
  return text.split(/[.!?]|다\./)[0].trim();
}

export function createPromptFromTacit(tacit) {
  return `[역할] 너는 경력 20년의 교육기관 운영 코치다.
[암묵지] ${tacit}
[작업]
1. 이 노하우를 신입 강사가 따라할 수 있는 5단계 체크리스트로 바꿔줘.
2. 학부모 상담 문장 예시 3개를 만들어줘.
3. 실행 시 흔히 생기는 실수 3가지와 예방 팁을 알려줘.
4. 바로 현장에서 사용할 수 있는 점검 질문 5개를 정리해줘.`;
}

export function collectTextFragments(activityData) {
  const fragments = [];
  collectStrings(activityData, fragments);
  return fragments;
}

export function extractKeywords(activityData, limit = 6) {
  const counts = new Map();

  collectTextFragments(activityData)
    .flatMap(tokenize)
    .forEach((token) => {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([token]) => token);
}

export function buildPromptPack(activityData, profile) {
  const keywords = extractKeywords(activityData, 8);
  const coreKeywords = keywords.slice(0, 5).join(', ') || '상담, 관찰, 관계, 피드백, 리더십';
  const coachName = profile?.name?.trim() || '익명의 원장';
  const career = profile?.career?.trim() || '경력 미입력';

  return [
    `너는 ${coachName}(${career})의 운영 분신 AI다. 핵심 키워드 ${coreKeywords}를 기반으로 학부모 상담용 스크립트 5개를 만들어줘.`,
    `다음 현장 노하우를 신입 강사 교육 매뉴얼로 바꿔줘: ${coreKeywords}. 실제 수업 전 10분 오리엔테이션 버전으로 써줘.`,
    `한국 학원 운영 맥락에서 ${coreKeywords}가 드러나는 위기 신호를 체크리스트 형태로 정리하고, 즉시 실행할 대응 3단계를 제안해줘.`,
    `${coreKeywords}를 바탕으로 주간 회의 안건, 학부모 공지 문안, 학생 코칭 문장을 각각 3개씩 만들어줘.`,
    `${coreKeywords}를 활용해 ChatGPT 또는 Claude에 바로 넣을 수 있는 프롬프트 체인을 설계해줘. 입력값, 출력 형식, 검증 질문까지 포함해줘.`,
  ];
}

export function buildTopInsights(activityData) {
  const candidates = [];
  const autopilotAnswers = Object.values(activityData?.autopilot?.answers ?? {});
  const transferAnswers = Object.values(activityData?.transfer?.answers ?? {});
  const crisisAnswers = Object.values(activityData?.crisis?.answers ?? {}).flat();
  const quizInsights = activityData?.quiz?.insights ?? [];
  const roleplayInsights = activityData?.roleplay?.insights ?? [];
  const patternReflections = Object.values(activityData?.pattern?.reflections ?? {});

  [...quizInsights, ...roleplayInsights, ...autopilotAnswers, ...transferAnswers, ...crisisAnswers, ...patternReflections]
    .map(firstSentence)
    .filter((sentence) => sentence.length > 8)
    .forEach((sentence) => {
      if (!candidates.includes(sentence)) {
        candidates.push(sentence);
      }
    });

  return candidates.slice(0, 3);
}

export function buildSeciMap(activityData) {
  return {
    socialization: (activityData?.gallery?.posts ?? []).slice(0, 3).map((post) => post.text),
    externalization: [
      ...Object.values(activityData?.crisis?.answers ?? {}).flat(),
      ...Object.values(activityData?.transfer?.answers ?? {}),
    ].filter(Boolean).slice(0, 4),
    combination: [activityData?.seci?.prompt, ...(activityData?.seci?.generatedPrompts ?? [])].filter(Boolean).slice(0, 4),
    internalization: [...(activityData?.quiz?.insights ?? []), ...(activityData?.roleplay?.insights ?? [])].filter(Boolean).slice(0, 4),
  };
}
