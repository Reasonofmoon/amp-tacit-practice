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

export function buildPromptPack(activityData, profile, isDev = false) {
  const keywords = extractKeywords(activityData, 10);
  const coreKeywords = keywords.length > 0 ? keywords.join(', ') : '데이터 기반 상담, 행동 관찰, 신뢰 관계 구축, 강사 피드백, 위기 대응 리더십, 시스템화';
  const coachName = profile?.name?.trim() || '익명의 원장';
  const career = profile?.career?.trim() || '경력 미입력';
  const academy = profile?.academy?.trim() || '우리 학원';

  const insights = [];
  Object.values(activityData || {}).forEach(data => {
    if (data && data.insight && data.insight !== 'Skipped') {
      insights.push(data.insight);
    }
  });
  const customInsightsText = insights.length > 0 ? insights.join('\n- ') : "특별한 추가 인사이트 없음";

  if (isDev) {
    const devPrompt = `[역할 부여: 시니어 AI/프롬프트 엔지니어]
당신은 Agentic 프레임워크와 LLM 파이프라인 설계의 대가입니다.
아래 제공된 '암묵지 추출 데이터'를 분석하여, 개발 과정의 병목을 해결하고 에이전트 시스템을 스케일업할 수 있는 [AI 개발 역량 진단 및 시스템 아키텍처 처방 리포트]를 작성해주세요.

[분석 대상 데이터]
- 개발자명: ${coachName}
- 경력: ${career}
- 주특기 분야: ${academy}
- 발견된 핵심 문제해결 키워드: ${coreKeywords}
- 현장 인사이트(Insights):
- ${customInsightsText}

[출력 형식 및 필수 포함 내용]
다음 4가지 섹션을 마크다운 양식으로 상세히 출력하세요.

1. 🔍 Agentic 역량 진단 (Diagnosis)
- 제공된 키워드를 기반으로 개발자의 현재 'AI 오케스트레이션 레벨' 진단 (1~5단계 중 평가)
- 강점 자산: 가장 시스템화(스킬화/도구화) 가치가 높은 직관적 디버깅/판단 노하우 2가지 분석
- 병목 리스크: 휴먼 개입(매뉴얼 프롬프팅) 의존도가 높아 파이프라인 병목이 되는 영역 1가지

2. 💊 맞춤형 AI/시스템 도입 처방 및 플랜 (Prescription & Roadmap)
- [도구화 전략]: 직관을 코드로 변환하는 구체적 제안 (예: MCP 서버 도구, 자동 분류 에이전트 등)
- [오류 억제]: 환각이나 무한 루프를 막기 위한 'Safe-guard' 프롬프트/가드레일 설계
- [로드맵 시각화]: 위 처방을 3단계(즉시 스크립트 / 통합 파이프라인 / 자동화 봇)로 구성해 시각화하세요.

3. 🃏 핵심 암묵지 도구 카드 (Tool/Skill Specification Card)
발견된 노하우 중 1가지를 선정하여 Agent가 사용할 '도구(Tool/Skill)' 명세서로 변환하세요.
- [Trigger(단서)]: 언제 이 도구를 호출해야 하는가?
- [Input(입력)]: 도구가 필요로 하는 컨텍스트와 파라미터는?
- [Logic(동작)]: 도구가 내부적으로 수행하는 검증 로직은?
- [Boundary(제약)]: 이 도구가 절대 수정해서는 안 되는 영역은?

4. 🧪 단서 라이브러리 및 현장 적용 퀘스트 (Cue Library & Field Quest)
- [단서 라이브러리]: 에러 로그나 코드 리뷰 시 즉시 감지해야 할 위험 징후 패턴 3가지 기록
- [작은 실험 퀘스트]: 다음 스프린트에 당장 적용해볼 수 있는 '프롬프트 분할/시스템화 실험' 1개 제안`;
    return [devPrompt];
  }

  const masterPrompt = `[역할 부여: Enterprise AX/DX 컨설턴트 AI]
당신은 최고 수준의 교육 비즈니스 디지털 전환(DX) 및 AI 전환(AX) 전략 컨설턴트입니다.
아래 제공된 원장님의 '암묵지 추출 데이터'를 분석하여, 학원 운영 체계를 자동화하고 스케일업할 수 있는 [기업수준 AX/DX 역량 진단 및 처방 리포트]를 작성해주세요.

[분석 대상 데이터]
- 원장명: ${coachName}
- 경력: ${career}
- 학원명: ${academy}
- 발견된 핵심 암묵지 키워드: ${coreKeywords}
- 원장님의 현장 인사이트(Insights):
- ${customInsightsText}

[출력 형식 및 필수 포함 내용]
다음 4가지 섹션을 마크다운 양식으로 상세히 출력하세요.

1. 🔍 AX/DX 역량 진단 (Diagnosis)
- 제공된 키워드를 기반으로 원장님의 현재 '시스템화 레벨' 진단 (1~5단계 중 평가)
- 강점 자산: AI나 IT 시스템으로 자동화했을 때 비즈니스 파급력이 가장 큰 노하우 2가지 분석
- 병목 리스크: 휴먼 의존도가 높아 빠른 시스템화가 시급한 영역 1가지

2. 💊 맞춤형 AI/시스템 도입 처방 및 플랜 (Prescription & Roadmap)
- [운영 효율화]: 원장님만의 노하우를 반영한 자동화 시스템 제안 (예: 학부모 상담 챗봇 시나리오, 이탈 방지 트리거 등)
- [조직 세팅]: 신입 강사도 일관된 퀄리티를 낼 수 있게 돕는 표준작업절차(SOP) 구축 플랜
- [로드맵 시각화]: 위 처방을 3단계(즉시 도입 / 3개월 내 / 6개월 고도화)로 구성하고, 마크다운 표 또는 Mermaid.js 문법으로 시각화하세요.

3. 🃏 핵심 암묵지 카드 (Tacit Knowledge Card)
발견된 노하우 중 가장 중요한 1가지를 선정하여 다음 구조의 '암묵지 카드'로 도출하세요.
- [단서(Cue)]: 이 상황에서 무엇을 보고/듣고/느끼는가? (추상적이지 않은 구체적 행동 단서)
- [해석(Interpretation)]: 그 단서를 바탕으로 어떤 가설을 세우는가?
- [행동(Action)]: 어떤 행동을 즉시 취하는가?
- [근거(Reason)]: 그렇게 행동하는 핵심 이유는 무엇인가?
- [경계조건/금기(Boundary)]: 언제 이 행동을 하면 안 되는가? (초보가 흔히 하는 맹목적 실수)
- [대안(Alternative)]: 제약이 있을 때(예: 시간 부족) 선택할 수 있는 차선책 1가지

4. 🧪 단서 라이브러리 및 현장 적용 퀘스트 (Cue Library & Field Quest)
- [단서 라이브러리]: 신입 강사가 현장에서 즉시 감지해야 할 위험/기회 단서(말투, 표정, 침묵 등) 3가지 기록
- [작은 실험 퀘스트]: 다음 주 당장 학원 현장에서 1분 만에 실행해볼 수 있는 '작은 행동 변화(실험)' 1개 제안 (예: 상담 오프닝 첫 문장 바꾸기)`;

  return [masterPrompt];
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
