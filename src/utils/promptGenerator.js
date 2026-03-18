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

/**
 * Build Vibe Coding prompts — convert tacit knowledge into ready-to-paste
 * development prompts for AI coding tools (Claude Code, Cursor, Gemini Canvas, etc.)
 *
 * @param {object} activityData
 * @param {object} profile
 * @param {boolean} isDev
 * @param {Array<{key: string, label: string, score: number}>} axisScores — radar map scores
 */
export function buildVibeCodingPrompts(activityData, profile, isDev = false, axisScores = []) {
  const keywords = extractKeywords(activityData, 10);
  const coreKeywords = keywords.length > 0 ? keywords.join(', ') : '자동화, 데이터 관리, 사용자 경험, 반복 업무 제거, 보고서 생성';
  const name = profile?.name?.trim() || (isDev ? '개발자' : '원장님');
  const career = profile?.career?.trim() || '경력 미입력';
  const field = profile?.academy?.trim() || (isDev ? '소프트웨어 개발' : '교육 현장');

  const insights = [];
  Object.values(activityData || {}).forEach((data) => {
    if (data && data.insight && data.insight !== 'Skipped') {
      insights.push(data.insight);
    }
  });
  const insightsText = insights.length > 0
    ? insights.map((i, idx) => `  ${idx + 1}. ${i}`).join('\n')
    : '  - 아직 추출된 인사이트가 없습니다.';

  // ─── Axis-to-App Recommendation Mapping ───
  const EDU_APP_MAP = {
    counseling: {
      label: '상담',
      app: '학부모 상담 도우미',
      desc: '상담 시나리오 생성, 상담 기록 관리, 대응 멘트 템플릿을 제공하는 상담 보조 웹앱',
      features: '상담 유형별 멘트 추천, 상담 이력 저장/검색, 학부모 감정 분석 기반 응대 가이드',
    },
    teaching: {
      label: '교수법',
      app: '수업 설계 어시스턴트',
      desc: '커리큘럼 자동 생성, 수업 자료 편집, 학생 수준별 맞춤 활동을 설계하는 도구',
      features: '주차별 커리큘럼 자동 배치, 난이도별 활동 추천, 워크시트 PDF 생성',
    },
    management: {
      label: '경영/운영',
      app: '학원 일정·할일 관리 대시보드',
      desc: '학원 스케줄, 강사/학생 배치, 수납 현황, 할 일 관리를 한눈에 볼 수 있는 대시보드',
      features: '월별 캘린더 + 투두리스트, 강사 스케줄 자동 배정, 수납 알림 텔레그램/카카오 연동',
    },
    crisis: {
      label: '위기관리',
      app: '위기 대응 프로토콜 매니저',
      desc: '학원 위기 상황별 대응 매뉴얼, 이탈 방지 알림, 사고 기록 시스템',
      features: '위기 유형별 체크리스트, 학생 이탈 조기 경고, 사건 타임라인 기록 및 리포트',
    },
    leadership: {
      label: '리더십',
      app: '강사 온보딩 & 성장 트래커',
      desc: '신입 강사 교육 진도, SOP 체크리스트, 피드백 기록을 관리하는 도구',
      features: 'SOP 체크리스트 자동 생성, 멘토링 세션 기록, 강사별 성장 대시보드',
    },
  };

  const DEV_APP_MAP = {
    debugging: {
      label: '디버깅',
      app: '에러 분석 & 디버그 어시스턴트',
      desc: '에러 로그를 붙여넣으면 원인 분석, 해결 방안, 유사 이슈를 자동 제안하는 도구',
      features: '에러 스택트레이스 파싱, 원인/해결 패턴 DB, 코드 수정 diff 자동 생성',
    },
    architecture: {
      label: '아키텍처',
      app: '시스템 설계 비주얼라이저',
      desc: '프로젝트 구조, 데이터 플로우, API 관계를 Mermaid 다이어그램으로 자동 생성하는 도구',
      features: '폴더 구조 → 아키텍처 다이어그램, API 엔드포인트 목록 생성, 의존성 그래프',
    },
    automation: {
      label: '자동화/AI',
      app: 'AI 파이프라인 빌더',
      desc: '반복 작업(빌드, 테스트, 배포, 리포트)를 자동화 워크플로우로 구성하는 비주얼 빌더',
      features: '드래그앤드롭 파이프라인 설계, cron 스케줄링, 슬랙/디스코드 알림 연동',
    },
    crisis: {
      label: '장애대응',
      app: '인시던트 대시보드 & 런북',
      desc: '서비스 장애 탐지, 런북(대응 절차) 자동 실행, 포스트모템 리포트 생성 도구',
      features: '서비스 상태 모니터링, 장애 타임라인 기록, 런북 자동 실행, Slack 알림',
    },
    optimization: {
      label: '최적화',
      app: '성능 프로파일링 대시보드',
      desc: '웹 앱 성능 지표(Core Web Vitals), 번들 사이즈, 렌더링 병목을 시각화하는 도구',
      features: 'Lighthouse 점수 추적, 번들 분석 차트, 비포/애프터 비교 뷰',
    },
  };

  const appMap = isDev ? DEV_APP_MAP : EDU_APP_MAP;

  // Sort axis scores to find weak areas
  const sorted = [...axisScores].sort((a, b) => a.score - b.score);
  const weakest = sorted[0] || { key: Object.keys(appMap)[0], label: '미진단', score: 0 };
  const secondWeakest = sorted[1] || sorted[0] || weakest;
  const strongest = sorted[sorted.length - 1] || weakest;

  const primaryApp = appMap[weakest.key] || Object.values(appMap)[0];
  const secondaryApp = appMap[secondWeakest.key] || Object.values(appMap)[1];

  const scoreReport = axisScores.length > 0
    ? axisScores.map((a) => `  - ${a.label}: ${a.score}점`).join('\n')
    : '  - 레이더 점수 데이터 없음';

  // Prompt 1: 즉시 실행 — Personalized Quick-Ship App
  const quickShip = `[바이브 코딩 프롬프트] 맞춤형 자동화 도구 즉시 개발

⚠️ 이 프롬프트는 "${name}"님의 암묵지 분석 결과를 기반으로 자동 생성되었습니다.
"${weakest.label}" 영역(${weakest.score}점)이 가장 보완이 필요하여, 이를 강화하는 "${primaryApp.app}"을 제안합니다.

[사용자 프로필]
- 이름: ${name}
- 경력: ${career}
- 분야: ${field}

[암묵지 레이더맵 진단 결과]
${scoreReport}
→ 가장 약한 영역: ${weakest.label} (${weakest.score}점)
→ 가장 강한 영역: ${strongest.label} (${strongest.score}점)

[추출된 핵심 역량 키워드]
${coreKeywords}

[현장에서 발견된 인사이트]
${insightsText}

[개발 요구사항: "${primaryApp.app}"]
${primaryApp.desc}

핵심 기능:
${primaryApp.features}

기술 요구사항:
1. 기술 스택: Vite + React (또는 순수 HTML/CSS/JS Single-File)
2. 디자인: 모던 SaaS 스타일 (다크 모드 / 글래스모피즘 / 부드러운 애니메이션)
3. 한국어 UI, 모바일 반응형
4. localStorage로 데이터 영속성 확보
5. 바로 실행 가능한 완전한 코드를 제공해주세요.`;

  // Prompt 2: 솔루션 아키텍처 — Weakness-Driven System Design
  const solutionArch = `[바이브 코딩 프롬프트] 약점 보완 솔루션 아키텍처 설계

${name}님의 암묵지 분석 결과, "${weakest.label}"(${weakest.score}점)과 "${secondWeakest.label}"(${secondWeakest.score}점) 영역의 체계화가 필요합니다.
이 두 영역을 한 번에 해결하는 통합 솔루션을 설계하고 MVP를 개발해주세요.

[사용자 프로필]
- 이름: ${name}
- 경력: ${career}
- 분야: ${field}

[암묵지 레이더맵 진단 결과]
${scoreReport}

[보완 대상 영역 2가지]
1. "${weakest.label}" → 추천: ${primaryApp.app}
   (${primaryApp.desc})
2. "${secondWeakest.label}" → 추천: ${secondaryApp.app}
   (${secondaryApp.desc})

[추출된 핵심 역량 키워드]
${coreKeywords}

[현장에서 발견된 인사이트]
${insightsText}

[설계 요구사항]

1단계 — 통합 분석:
- 위 두 영역의 공통 업무 흐름을 찾아 하나의 통합 시스템으로 설계하세요.
- ${name}님의 강점인 "${strongest.label}"(${strongest.score}점) 영역의 노하우를 시스템의 핵심 로직으로 활용하세요.

2단계 — 아키텍처 설계:
- Mermaid.js 다이어그램으로 시스템 구조를 시각화하세요.
- 기술 스택: Next.js + Supabase (또는 GAS + Spreadsheet)
- 데이터 모델, API 엔드포인트, UI 화면 목록을 정리하세요.

3단계 — MVP 개발:
- 가장 임팩트가 큰 기능 1가지의 동작하는 코드를 개발하세요.
- 대시보드 형태, 한국어 UI, 모던 다크 테마, 반응형 디자인

모든 단계의 산출물을 순서대로 출력하세요.`;

  // Prompt 3: AI 에이전트 스킬 — Strength-Powered Agent Skill
  const agentSkill = `[바이브 코딩 프롬프트] 강점 → AI 에이전트 스킬 변환

${name}님의 가장 강한 영역인 "${strongest.label}"(${strongest.score}점)의 판단 노하우를 AI 에이전트 스킬로 자동화합니다.
이 스킬은 "${weakest.label}"(${weakest.score}점) 영역을 자동으로 보조합니다.

[사용자 프로필]
- 이름: ${name}
- 경력: ${career}
- 분야: ${field}

[암묵지 레이더맵 진단 결과]
${scoreReport}
→ 스킬화 대상 강점: ${strongest.label} (${strongest.score}점)
→ 자동 보조 대상: ${weakest.label} (${weakest.score}점)

[추출된 핵심 역량 키워드]
${coreKeywords}

[현장에서 발견된 인사이트]
${insightsText}

[작업 지시]

STEP 1: 스킬 명세서 (SKILL.md)
"${strongest.label}" 영역의 노하우를 아래 형식의 AI 에이전트 스킬로 변환하세요:
\`\`\`yaml
---
name: [스킬 이름]
description: [한 줄 설명]
triggers: [이 스킬이 호출되어야 하는 상황 키워드 목록]
---
\`\`\`
본문에는:
- [Trigger]: 스킬을 발동시키는 구체적 조건/단서
- [Input]: 필요한 입력 데이터
- [Logic]: 판단 로직 (if-then-else)
- [Output]: 최종 출력물
- [Boundary]: 작동 제한 조건
- [Fallback]: 대안 행동

STEP 2: 자동화 스크립트 개발
스킬 명세서를 기반으로 실제 동작하는 Python 또는 JavaScript 스크립트를 개발하세요.
이 스크립트가 "${weakest.label}" 영역의 업무를 자동으로 보조하도록 설계하세요.

STEP 3: 테스트 시나리오 3가지
현장에서 올바르게 작동하는지 검증할 테스트 케이스를 작성하세요.

모든 STEP의 완전한 코드를 제공해주세요.`;

  return [
    { icon: '🚀', label: '즉시 실행', desc: `"${weakest.label}" 보완 — ${primaryApp.app}`, prompt: quickShip },
    { icon: '🏗️', label: '솔루션 설계', desc: `"${weakest.label}" + "${secondWeakest.label}" 통합 시스템`, prompt: solutionArch },
    { icon: '🤖', label: 'AI 스킬', desc: `"${strongest.label}" 강점을 에이전트 스킬로 변환`, prompt: agentSkill },
  ];
}
