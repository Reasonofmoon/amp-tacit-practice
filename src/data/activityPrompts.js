// Activity-specific prompt gifts.
// Each completed activity rewards the user with a ChatGPT/Claude-ready
// prompt that turns their answers into an immediate practical artifact.

const truncate = (text, max = 600) => {
  if (!text) return '';
  const trimmed = String(text).trim();
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
};

const collect = (record) =>
  Object.values(record ?? {})
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)
    .join('\n- ');

const flattenAnswers = (record) =>
  Object.entries(record ?? {})
    .map(([key, value]) => {
      if (Array.isArray(value)) return `- [${key}] ${value.filter(Boolean).join(' / ')}`;
      if (value && typeof value === 'object') return `- [${key}] ${JSON.stringify(value)}`;
      return value ? `- [${key}] ${String(value).trim()}` : '';
    })
    .filter(Boolean)
    .join('\n');

const fallback = (text, placeholder) => (text && text.trim() ? text.trim() : placeholder);

// Gift template factory.
// Returns { emoji, title, useCase, prompt, payoff }
//
// payoff: one short line shown ABOVE the prompt that hypes what the user gets back
// useCase: where to paste it (ChatGPT/Claude/Cursor 등) and what it does in 한 줄
function makeGift({ emoji, title, useCase, payoff, prompt }) {
  return { emoji, title, useCase, payoff, prompt: prompt.trim() };
}

// ─── DIRECTOR JOURNEY (학원 원장) ─────────────────────────
const directorGifts = {
  timeline: (data, profile) => makeGift({
    emoji: '🗓️',
    title: '연간 운영 리듬 마스터플랜',
    useCase: 'ChatGPT/Claude에 붙여넣으면 1년치 운영 리듬과 월별 KPI 표가 한 번에 나옵니다.',
    payoff: '내년 캘린더가 한 페이지로 압축됩니다.',
    prompt: `[역할] 너는 학원 운영을 10년 이상 자문해온 시니어 컨설턴트다.

[입력: ${fallback(profile?.name, '원장')}님이 1년간 겪은 월별 사건]
${truncate(flattenAnswers(data?.placedEvents), 1200) || '- (아직 입력된 사건이 적습니다. 일반적인 영어/수학 학원 1년 흐름을 가정해도 좋다)'}

[원장 인사이트]
${truncate(data?.insight, 400) || '- (자유롭게 채워줘도 좋다)'}

[작업]
1. 위 사건들을 "조용기·전력기·확장기" 3페이즈로 묶고, 페이즈별 핵심 KPI 3개를 표로 정리해줘.
2. 각 페이즈별로 "지금부터 4주 안에 준비해야 할 일 5가지" 체크리스트를 만들어줘.
3. 다음 1년의 월별 캘린더를 마크다운 표로 출력해줘 (열: 월 / 핵심 이벤트 / 미리 준비 / 위험 신호).
4. 마지막에 "이 학원이 지키면 안 되는 금기 3가지"를 구체적 문장으로 적어줘.`,
  }),

  autopilot: (data, profile) => makeGift({
    emoji: '🔍',
    title: '무의식 행동 → 신입 강사 SOP',
    useCase: 'AI에게 붙여넣으면 신입 강사가 따라할 수 있는 표준 행동 매뉴얼이 나옵니다.',
    payoff: '"그냥 했던 것"이 강사 매뉴얼 한 장으로 변환됩니다.',
    prompt: `[역할] 너는 신입 강사 온보딩 매뉴얼을 만드는 교육 트레이너다.

[원장이 무의식적으로 반복하는 행동들]
- ${truncate(collect(data?.answers), 1200) || '(자동조종 답변이 충분치 않다. 합리적 추정으로 보완해도 된다)'}

[작업]
1. 각 행동을 "관찰 가능한 신호 → 즉시 행동 → 그렇게 하는 이유" 구조로 다시 써줘.
2. 신입 강사가 첫 2주 동안 매일 점검할 수 있는 5문항 자가 체크리스트로 변환해줘.
3. 흔히 빠지는 함정 3가지와 회피 신호를 표로 정리해줘.
4. 마지막에 "원장이 자리에 없어도 학원이 같은 결을 유지하기 위한 핵심 원칙 1줄"을 만들어줘.`,
  }),

  crisis: (data, profile) => makeGift({
    emoji: '⚡',
    title: '위기 시나리오 대응 플레이북',
    useCase: 'AI가 즉시 위기별 대응 멘트 + 체크리스트로 변환합니다.',
    payoff: '학원 위기 매뉴얼 v1이 5분 만에 완성됩니다.',
    prompt: `[역할] 너는 학원 위기관리 매뉴얼 작성 전문가다.

[원장의 위기 대응 답변]
${truncate(JSON.stringify(data?.answers ?? {}, null, 2), 1500)}

[작업]
1. 답변에서 공통적으로 발견되는 "원장의 의사결정 원칙 3가지"를 추출해줘.
2. 각 시나리오별로 학부모/강사/원장 3자에게 보낼 메시지 템플릿을 작성해줘 (이모지 없이, 톤은 신뢰·차분).
3. 30분 내 대응 / 24시간 내 대응 / 7일 내 회복 — 3단계 액션 플랜을 표로 정리해줘.
4. 마지막에 "이 위기를 같은 패턴으로 다시 겪지 않기 위한 사전 신호 5가지"를 적어줘.`,
  }),

  transfer: (data, profile) => makeGift({
    emoji: '🎓',
    title: '신입 강사 5분 브리핑 카드',
    useCase: 'AI가 한 장짜리 멘토링 브리핑 카드로 압축해줍니다.',
    payoff: '경험을 손에 쥐여주는 한 장의 카드.',
    prompt: `[역할] 너는 멘토링 카드 디자이너다. 출력은 모두 마크다운 카드 형식으로.

[원장이 신입에게 가르치고 싶은 것]
- ${truncate(collect(data?.answers), 1200) || '(자유롭게 보완해도 좋다)'}

[작업]
다음 4장의 카드를 각각 만들어줘. 각 카드는 200자 이내.
1. **첫 일주일 카드** — 무엇을 보고/듣고/적을 것인가
2. **수업 진입 카드** — 처음 30초 동안의 행동 5가지
3. **학부모 대응 카드** — 절대 피해야 할 말투 3가지 + 대신 쓸 표현
4. **나만의 작은 의식 카드** — 매일 끝에 점검할 한 문장

마지막에 "이 카드를 코팅해서 강사 책상에 두면 좋은 한 마디"를 적어줘.`,
  }),

  seci: (data, profile) => makeGift({
    emoji: '🔮',
    title: 'SECI 변환 — 암묵지 → 자동화 처방',
    useCase: 'AI에 붙여넣으면 운영 자동화 로드맵이 나옵니다.',
    payoff: '"몸에 밴 감각"을 자동화 시스템으로 옮기는 처방전.',
    prompt: `[역할] 너는 AX/DX 컨설턴트다.

[현장 암묵지]
${truncate(data?.tacit, 600) || '(원장의 직관 한 줄을 가정해도 좋다)'}

[원장이 만든 초안 프롬프트]
${truncate(data?.prompt, 600) || '(없음)'}

[작업]
1. 위 암묵지를 "단서·해석·행동·근거·금기·대안" 6필드의 암묵지 카드로 정리해줘.
2. 이 카드를 호출 가능한 AI 도구(스킬)로 변환한 명세서(YAML 형식)를 작성해줘.
3. 즉시 / 3개월 / 6개월 — 3단계 자동화 로드맵을 Mermaid 다이어그램으로 그려줘.
4. 마지막에 신입 강사가 이 도구를 호출하기 위한 트리거 문장 3개를 적어줘.`,
  }),

  gallery: (data, profile) => makeGift({
    emoji: '🖼️',
    title: '동료 원장에게 공유할 인사이트 포스트',
    useCase: '카페·블로그·뉴스레터에 그대로 올릴 수 있는 글로 변환됩니다.',
    payoff: '내 노하우가 같은 업계의 화제거리가 됩니다.',
    prompt: `[역할] 너는 교육 업계 크리에이터의 카피라이터다.

[원장이 갤러리에 공유한 메모]
${truncate((data?.posts ?? []).map((post) => post.text).join('\n- '), 1200) || '(공유 메모를 보완해도 좋다)'}

[작업]
1. 위 메모를 "300자 SNS 짧은 글" / "1500자 블로그 글" 두 버전으로 다시 써줘.
2. 각 버전 끝에 다른 원장이 댓글로 자기 경험을 적게 만드는 질문 1줄을 붙여줘.
3. 마지막에 이 글의 썸네일에 들어갈 키 비주얼 아이디어 3개(이모지/배경색/한 줄 카피)를 제안해줘.`,
  }),

  quiz: (data, profile) => makeGift({
    emoji: '⏱️',
    title: '10초 판단 퀴즈 → 강사 교육 자료',
    useCase: 'AI가 강사 회의 자료/온보딩 워크북 한 묶음으로 변환합니다.',
    payoff: '내가 풀던 퀴즈가 학원 자체 교재가 됩니다.',
    prompt: `[역할] 너는 학원 강사 교육 워크북 디자이너다.

[원장이 풀어본 판단 퀴즈]
- 정답 수: ${data?.correctCount ?? 0}
- 핵심 인사이트들:
- ${truncate((data?.insights ?? []).join('\n- '), 1200) || '(자유롭게 보완)'}

[작업]
1. 위 인사이트를 5문항 강사 교육용 퀴즈로 재구성해줘 (질문 / 4지선다 / 정답 / 해설).
2. 각 문항마다 "신입이 흔히 고르는 오답 함정" 1줄을 추가해줘.
3. 마지막 페이지에 이 퀴즈를 강사 회의에서 5분 안에 진행하는 진행 가이드를 적어줘.`,
  }),

  roleplay: (data, profile) => makeGift({
    emoji: '🎭',
    title: '학부모/강사 대응 스크립트북',
    useCase: 'AI가 상황별 응답 스크립트 모음집으로 만듭니다.',
    payoff: '진짜 통화에서 그대로 읽어도 자연스러운 멘트.',
    prompt: `[역할] 너는 학원 상담사 트레이너다.

[원장의 역할극 답변과 점수]
${truncate(JSON.stringify(data?.scenarioProgress ?? {}, null, 2), 1500)}

[원장의 상담 스타일 진단]
- 스타일: ${data?.style ?? '아직 없음'}
- 핵심 인사이트: ${truncate((data?.insights ?? []).join(' / '), 600) || '(없음)'}

[작업]
1. 시나리오별로 "실제 통화 30초 오프닝 멘트"를 작성해줘 (괄호 안에 보이스톤 지시).
2. 학부모가 화났을 때/감정이 격해졌을 때/이탈을 암시할 때 3가지 분기별 대응 멘트를 표로.
3. 마지막에 신입 강사가 들고 다닐 수 있는 "절대 하지 말 것 5가지" 카드를 만들어줘.`,
  }),

  pattern: (data, profile) => makeGift({
    emoji: '🧩',
    title: '상황 → 대응 결정 트리',
    useCase: 'AI가 의사결정 트리/플로우차트로 변환합니다.',
    payoff: '직관이 그림 한 장으로 보입니다.',
    prompt: `[역할] 너는 의사결정 디자이너다.

[원장의 패턴 매칭]
- 매칭 결과: ${truncate(JSON.stringify(data?.matches ?? {}), 600) || '(없음)'}
- 매칭 이유:
- ${truncate(collect(data?.reflections), 1200) || '(자유롭게 보완)'}

[작업]
1. 위 매칭을 Mermaid flowchart 문법의 결정 트리로 그려줘.
2. 각 분기에서 "다른 원장이라면 흔히 다르게 갈 수 있는 길"을 점선으로 표시해줘.
3. 마지막에 이 결정 트리를 신입에게 가르칠 때 사용할 한 문장 비유를 만들어줘.`,
  }),

  noticing: (data, profile) => makeGift({
    emoji: '👀',
    title: '단서 라이브러리 만들기',
    useCase: 'AI가 신입이 현장에서 즉시 감지해야 할 단서 카드 묶음으로 변환합니다.',
    payoff: '말로 못 가르치던 것이 카드 묶음이 됩니다.',
    prompt: `[역할] 너는 도제식 학습 카드 제작자다.

[원장이 적어둔 단서]
- 본 것: ${truncate((data?.cues ?? []).join(' / '), 400) || '(보완)'}
- 해석: ${truncate(data?.interp, 400) || '(보완)'}
- 행동: ${truncate(data?.resp, 400) || '(보완)'}
- 인사이트: ${truncate(data?.insight, 400) || '(보완)'}

[작업]
1. 위 내용을 "단서 카드 5장" 묶음으로 만들어줘. 각 카드는: 제목 / 보이는 신호 / 그 순간의 해석 / 즉시 행동 / 함정.
2. 카드 5장의 공통 패턴 1줄을 뒤표지에 적어줘.
3. 신입이 이 카드를 매일 1장씩 꺼내볼 수 있게 하는 3분 의식(루틴)을 설계해줘.`,
  }),

  cdm: (data, profile) => makeGift({
    emoji: '🃏',
    title: 'Critical Decision Method 카드 1장',
    useCase: 'AI가 한 번의 결정을 재사용 가능한 의사결정 카드로 만듭니다.',
    payoff: '한 번의 판단이 영구 자산이 됩니다.',
    prompt: `[역할] 너는 인지 작업 분석(CTA) 전문가다.

[원장의 CDM 답변]
${truncate(JSON.stringify(data ?? {}, null, 2), 1800)}

[작업]
1. 위 답변을 "단서·해석·행동·근거·금기·대안" 6필드 의사결정 카드 1장으로 정리해줘.
2. 이 카드의 핵심 휴리스틱을 한 문장 슬로건으로 만들어줘 (예: "표정이 굳기 전에 주제를 바꾼다").
3. 이 카드를 다음 주에 실험할 작은 행동 변화 1개를 제안해줘.
4. 마지막에 "이 카드를 강사들이 카드뉴스로 보고 5초 만에 이해할 수 있게" 디자인 요청서를 한 단락 작성해줘.`,
  }),
};

// ─── DEVELOPER JOURNEY ─────────────────────────
const developerGifts = {
  dev_timeline: () => makeGift({
    emoji: '🗓️',
    title: '개발 1년 회고 → 다음 분기 OKR',
    useCase: 'AI가 1년 회고를 다음 분기 OKR 초안으로 변환합니다.',
    payoff: '연말 회고가 다음 분기 OKR 한 페이지로 압축됩니다.',
    prompt: `[역할] 시니어 엔지니어링 매니저.
[입력] 1년간 발생한 기술 사건들과 학습 키워드를 정리한 데이터를 분석해 다음 분기 OKR 3개를 도출하라.
출력 형식: Objective × 3 / 각 KO 3개 / 회고 인사이트 / 위험 요인.`,
  }),
  dev_autopilot: () => makeGift({
    emoji: '🤖',
    title: '코딩 시 무의식 습관 → AI 페어 프롬프트',
    useCase: 'Cursor/Claude Code의 system prompt로 그대로 사용 가능.',
    payoff: '내 코딩 습관이 AI 짝꿍의 기본 룰셋이 됩니다.',
    prompt: `[역할] 너는 내가 짝코딩하는 시니어 엔지니어다.
[내 무의식 습관]을 system prompt로 변환하라. 출력: Markdown system prompt + 위반 시 차단해야 하는 패턴 5가지.`,
  }),
  dev_crisis: () => makeGift({
    emoji: '🚨',
    title: '인시던트 런북 자동 작성',
    useCase: 'PagerDuty/Slack 런북으로 그대로 붙여넣을 수 있습니다.',
    payoff: '한 번의 장애가 팀 자산이 됩니다.',
    prompt: `[역할] SRE 시니어. [입력 위기 답변]을 표준 인시던트 런북(탐지·완화·근본원인·재발방지·커뮤니케이션 템플릿)으로 작성하라.`,
  }),
  dev_transfer: () => makeGift({
    emoji: '🧑‍🏫',
    title: '주니어 온보딩 30일 플랜',
    useCase: 'Notion/Linear에 그대로 옮길 수 있는 30일 체크리스트.',
    payoff: '신규 입사자 평균 ramp-up 시간이 절반.',
    prompt: `[역할] 엔지니어링 멘토. [입력]을 D+1, D+7, D+30 마일스톤이 있는 온보딩 플랜으로 변환하라.`,
  }),
  dev_seci: () => makeGift({
    emoji: '🛠️',
    title: '직관 → MCP 도구 명세서',
    useCase: 'Cursor/Claude의 MCP/Tool 명세로 사용 가능.',
    payoff: '수동 판단이 자동 호출 도구가 됩니다.',
    prompt: `[역할] AI 에이전트 도구 설계자. [입력 직관]을 YAML 도구 명세 + Python/TS 구현 + 3개 테스트 케이스로 변환하라.`,
  }),
  dev_gallery: () => makeGift({
    emoji: '📝',
    title: '데브 블로그 포스트 초안',
    useCase: 'Medium/dev.to/회사 블로그에 바로 붙여넣을 수 있는 글.',
    payoff: 'PR 한 개가 인터넷 친구를 만듭니다.',
    prompt: `[역할] 테크 블로거. [입력 메모]를 1500자 dev 블로그 포스트(서론·문제·해결·결과·다음 단계)로 작성. 코드 블록 포함.`,
  }),
  dev_quiz: () => makeGift({
    emoji: '🧠',
    title: '주니어 코드 리뷰 퀴즈집',
    useCase: '팀 위클리 미팅 5분 코너로 사용 가능.',
    payoff: '주니어가 매주 1포인트씩 시니어처럼 봅니다.',
    prompt: `[역할] 코드 리뷰 트레이너. [입력 퀴즈 인사이트]를 5문항 코드 리뷰 퀴즈(코드 스니펫·질문·정답·함정 해설)로 변환.`,
  }),
  dev_roleplay: () => makeGift({
    emoji: '💬',
    title: '난감한 PR 리뷰 멘트 모음',
    useCase: 'PR 리뷰 멘트를 곧장 복사해 넣으면 됩니다.',
    payoff: '말이 무거운 리뷰가 빨라집니다.',
    prompt: `[역할] 시니어 리뷰어. [입력 답변]을 PR 코멘트 템플릿 8개(칭찬 2 / 제안 3 / 거절 3)로 변환. 한국어, 톤 차분.`,
  }),
  dev_pattern: () => makeGift({
    emoji: '🧩',
    title: '에러 → 해결책 룰북',
    useCase: 'IDE Snippet으로 그대로 사용 가능.',
    payoff: '같은 에러로 두 번 고생하지 않습니다.',
    prompt: `[역할] 디버그 카드 디자이너. [입력 매칭]을 Mermaid 결정 트리 + 에러별 즉시 명령어 모음으로 변환.`,
  }),
  dev_noticing: () => makeGift({
    emoji: '🚦',
    title: '코드 스멜 단서 카드 5장',
    useCase: '리뷰 회의 보드에 5장 출력해 두세요.',
    payoff: '리팩터 타이밍이 한눈에.',
    prompt: `[역할] 시니어 리뷰어. [입력 cues]를 5장 코드 스멜 카드(보이는 신호 / 즉시 액션 / 함정)로 변환.`,
  }),
  dev_cdm: () => makeGift({
    emoji: '🃏',
    title: '아키텍처 결정 카드(ADR)',
    useCase: 'docs/adr/ 폴더에 그대로 커밋 가능.',
    payoff: '한 번의 결정이 6개월 뒤의 나를 구합니다.',
    prompt: `[역할] 아키텍트. [입력 CDM 답변]을 표준 ADR(컨텍스트·결정·결과·대안·금기) 마크다운으로 정리.`,
  }),
};

// ─── AUTOMATION JOURNEY ─────────────────────────
const automationGifts = {
  auto_setup: () => makeGift({
    emoji: '🧰',
    title: '내 학원 맞춤 AI 비서 환경설정 가이드',
    useCase: 'ChatGPT에 붙여넣으면 단계별 환경 세팅 가이드가 나옵니다.',
    payoff: '오늘 안에 AI 비서가 가동됩니다.',
    prompt: `[역할] 비개발자도 따라할 수 있는 자동화 코치.
내 학원 상황(원장명/학원명/주요 업무 3가지)에 맞춘 GAS+AI 비서 세팅 가이드를 단계별 체크리스트(스크린샷 위치 표시 포함)로 만들어줘.`,
  }),
  auto_script: () => makeGift({
    emoji: '📜',
    title: 'AI 비서 첫 스크립트 — 자동 답장',
    useCase: 'GAS에 그대로 붙여넣을 수 있는 코드입니다.',
    payoff: '학부모 문자에 5초 안에 답이 나갑니다.',
    prompt: `[역할] GAS 자동화 멘토.
학원장이 받은 학부모 문의 메시지를 카테고리(상담/결제/이탈징후/단순질문) 분류하고 카테고리별 답장 초안을 자동 생성하는 GAS 스크립트를 작성해줘. Gemini API 사용. 한국어 톤은 친절·차분.`,
  }),
  auto_property: () => makeGift({
    emoji: '🪪',
    title: '내 비서 페르소나 정의서',
    useCase: 'AI 비서의 system prompt에 그대로 사용.',
    payoff: '내 학원의 톤앤매너가 AI에게도 깃듭니다.',
    prompt: `[역할] 브랜드 보이스 디자이너.
[학원 정보]를 받아 AI 비서의 페르소나(이름·톤·사용 어휘·금기 표현·자주 쓰는 인사·서명)를 system prompt YAML로 정의해줘.`,
  }),
  auto_code: () => makeGift({
    emoji: '⚙️',
    title: '복붙용 자동화 코드 한 묶음',
    useCase: 'GAS/Make/n8n 어디든 붙여 쓸 수 있는 코드 모음.',
    payoff: '내일 아침 8시에 자동으로 일이 돌아갑니다.',
    prompt: `[역할] No-code 자동화 가이드.
[입력]에 맞춰 학원 운영에 가장 자주 쓰이는 자동화 코드 5개(출석 알림·미납 알림·생일 메시지·이탈 징후 감지·주간 리포트)를 GAS 한 파일에 정리해줘. 변수 위치 주석으로 표시.`,
  }),
  auto_trigger: () => makeGift({
    emoji: '⏰',
    title: '잠든 동안 일하는 트리거 캘린더',
    useCase: 'GAS Trigger / cron 설정 그대로 사용.',
    payoff: '사람이 잠든 시간에도 학원이 돌아갑니다.',
    prompt: `[역할] 자동화 운영자.
[학원 일정]에 맞춰 일/주/월 단위 자동 트리거 스케줄(매일 21시 출석 알림, 매주 금요일 17시 부모 리포트 등)을 표로 정리하고, 각 트리거의 GAS 코드를 한 파일로 모아줘.`,
  }),
};

// ─── SHOWCASE JOURNEY (라이브 앱 시연) ─────────────────────────
const showcaseGifts = {
  demo_showcase_intro: () => makeGift({
    emoji: '🧠',
    title: '암묵지 → 앱 변환 워크숍 진행대본',
    useCase: 'Notion/PPT 발표 노트로 그대로 사용 가능.',
    payoff: '내일 발표 대본이 한 번에 완성됩니다.',
    prompt: `[역할] 암묵지 워크숍 퍼실리테이터.
"원장의 반복 판단 → 데이터 → 프롬프트 → 화면" 전환을 30분 워크숍 진행대본(오프닝 멘트·전환 멘트·청중 질문 3개·마무리 한마디)으로 작성.`,
  }),
  demo_sign_design: () => makeGift({
    emoji: '🏷️',
    title: '학원 간판/홍보물 카피 10종',
    useCase: '인쇄소·디자이너에게 그대로 전달 가능.',
    payoff: '내일 인쇄해도 부끄럽지 않은 카피 10개.',
    prompt: `[역할] 지역 상권 카피라이터.
[학원 정보]에 맞는 간판/배너/플래카드/엘리베이터 광고 카피 10개를 만들어줘. 각 카피마다 어울리는 색상 팔레트와 폰트 톤도 1줄로.`,
  }),
  demo_readmaster: () => makeGift({
    emoji: '📖',
    title: '신규 학생 첫 진단 멘트 키트',
    useCase: '신규 상담 시 그대로 읽어도 자연스러운 멘트.',
    payoff: '신규 학부모 첫 만남이 30초 안에 마무리됩니다.',
    prompt: `[역할] 학원 입학 상담 시니어.
ReadMaster 진단 결과지를 학부모에게 5분 안에 설명하는 멘트 시나리오를 작성해줘. (1) 강점부터 (2) 약점은 해결가능으로 프레이밍 (3) 다음 단계 제안. 학년별(초등/중등/고등) 3버전.`,
  }),
  demo_writing_correction: () => makeGift({
    emoji: '✍️',
    title: '나만의 첨삭 톤 → 프롬프트',
    useCase: 'Claude/ChatGPT의 첨삭 봇 system prompt로 사용.',
    payoff: '내 빨간펜이 AI 안에서 살아납니다.',
    prompt: `[역할] 영어 첨삭 봇 디자이너.
원장님이 평소 쓰는 첨삭 멘트 패턴을 system prompt로 변환해줘. 칭찬/지적의 비율, 한 번에 고치는 포인트 개수, 학생 자신감 보호 규칙을 명시.`,
  }),
  demo_level_test_proto: () => makeGift({
    emoji: '🧪',
    title: '레벨테스트 결과 → 학부모 설명문',
    useCase: '카톡/문자에 그대로 붙여넣을 수 있는 글.',
    payoff: '학부모가 결과지를 보고 곧장 등록을 결정합니다.',
    prompt: `[역할] 학부모 상담 카피라이터.
레벨테스트 점수(문법/독해/어휘/말하기 4영역)를 입력으로 받아 학부모에게 보낼 카톡 메시지(300자) + 다음 단계 추천 반(2가지) + 등록 클로징 한 줄을 작성해줘.`,
  }),
  demo_academy_os: () => makeGift({
    emoji: '🎛️',
    title: '학원 OS 한 페이지 설계도',
    useCase: 'Notion/스프레드시트에 옮길 수 있는 운영 OS.',
    payoff: '내 학원의 모든 흐름이 한 페이지로 보입니다.',
    prompt: `[역할] 학원 운영 시스템 아키텍트.
입학·수업·평가·이탈방지·회계 5개 트랙을 한 페이지 OS로 설계해줘. 각 트랙당 자동화 가능 항목 3개씩 표시.`,
  }),
  demo_ontology: () => makeGift({
    emoji: '🌌',
    title: '단어 어원 스토리 카드',
    useCase: '수업 보조 자료 / 인스타 콘텐츠 그대로 사용.',
    payoff: '단어 하나가 5분 분량의 스토리텔링이 됩니다.',
    prompt: `[역할] 어원 이야기꾼.
입력으로 받은 단어 5개 각각에 대해 어원·관련 신화/역사·기억 트리거 이미지·예문을 카드 형식으로 만들어줘.`,
  }),
  demo_storyboard_gen: () => makeGift({
    emoji: '🎬',
    title: '수업 설명 스토리보드 6컷',
    useCase: 'PPT/iPad 노트에 그대로 옮길 수 있는 6컷 구성.',
    payoff: '난해한 개념이 6컷 만화처럼 풀립니다.',
    prompt: `[역할] 교육용 스토리보드 작가.
[설명할 개념]을 6컷 스토리보드(한 컷당: 비주얼 / 보이스오버 / 학생 반응 예상)로 만들어줘.`,
  }),
  demo_knot: () => makeGift({
    emoji: '🪢',
    title: '학생-콘텐츠 매듭짓기 가이드',
    useCase: '강사 회의 핸드아웃으로 사용 가능.',
    payoff: '학생이 콘텐츠와 자기 인생을 연결합니다.',
    prompt: `[역할] 의미 만들기 코치.
[학생 정보 + 콘텐츠]를 받아 학생의 일상과 콘텐츠를 잇는 "연결 질문 5개"를 만들어줘. 마지막에 학생이 직접 답변하면서 자기화하도록 유도하는 마무리 활동 1개 추가.`,
  }),
  demo_bluel: () => makeGift({
    emoji: '🔵',
    title: 'Bluel — 영어 교육 마이크로사이트 카피',
    useCase: '랜딩 페이지에 그대로 붙여넣기.',
    payoff: '학원 웹사이트의 첫 화면이 살아납니다.',
    prompt: `[역할] 에듀테크 랜딩 카피라이터.
영어 교육 마이크로사이트의 hero/문제/해결/사회적증거/CTA 5섹션 카피를 작성해줘. 톤은 명확·따뜻.`,
  }),
  demo_librainy: () => makeGift({
    emoji: '📚',
    title: 'Librainy — 학원 추천 도서 큐레이션',
    useCase: '학부모 카톡 그룹/뉴스레터에 그대로 사용.',
    payoff: '독서 지도까지 가능한 학원으로 보입니다.',
    prompt: `[역할] 도서 큐레이터.
[학생 학년/관심사]에 맞는 영어 원서 5권을 큐레이션해줘. 각 책마다 난이도·소요시간·핵심 어휘 10개·토론 질문 3개 포함.`,
  }),
  demo_moonlang: () => makeGift({
    emoji: '🌙',
    title: 'MoonLang — 나만의 학원 언어 체계',
    useCase: '강사 매뉴얼/CI 가이드의 핵심 어휘로 사용.',
    payoff: '학원만의 단어 사전이 만들어집니다.',
    prompt: `[역할] 브랜드 언어학자.
[학원 철학]을 바탕으로 우리 학원만의 핵심 어휘 10개를 정의해줘. 각 어휘는 정의·반의어·사용 예문·금기 표현 4필드.`,
  }),
  demo_gidoboard: () => makeGift({
    emoji: '🛐',
    title: '주간 멘토링 보드 자동 생성',
    useCase: '슬랙/노션 보드에 매주 붙여넣기.',
    payoff: '강사 멘토링이 매주 같은 품질로 굴러갑니다.',
    prompt: `[역할] 멘토링 코디네이터.
이번 주 강사들의 수업 데이터(출석률·과제완료율·학부모 피드백)를 입력으로 받아 강사별 1줄 격려·1줄 도전 과제를 표로 작성. 마지막에 다음 주 운영 관전 포인트 3개 정리.`,
  }),
  demo_sabo_philosophy: () => makeGift({
    emoji: '🧭',
    title: '내 학원의 사훈/철학 한 문장',
    useCase: '입구 액자/모든 매뉴얼 첫 페이지에 사용.',
    payoff: '강사가 흔들릴 때 돌아올 한 문장.',
    prompt: `[역할] 교육 철학 카피라이터.
[원장의 핵심 가치 3개]를 받아 학원 사훈 후보 5개를 만들어줘. 각 사훈마다 신입 강사에게 설명하는 1분 스크립트도.`,
  }),
  demo_app_factory: () => makeGift({
    emoji: '🏭',
    title: '내 학원 앱 공장 백로그',
    useCase: 'Notion DB / Linear에 그대로 옮길 수 있는 백로그.',
    payoff: '앱 하나가 아니라 앱을 만드는 시스템이 생깁니다.',
    prompt: `[역할] 프로덕트 매니저.
[원장 노하우 3개]를 각각 1주일 안에 출시 가능한 미니앱 아이디어로 변환해줘. 각 앱마다: 한 줄 가치제안·핵심 기능 3개·필요한 데이터·런칭 채널·최소 스펙(MVP).`,
  }),
};

// ─── DEFAULT FALLBACK ─────────────────────────
const defaultGift = () => makeGift({
  emoji: '🎁',
  title: '나만의 활동 기록 → 실무 프롬프트',
  useCase: 'AI에 붙여넣으면 답변을 즉시 사용 가능한 결과물로 변환합니다.',
  payoff: '방금 적은 메모가 실무 자료가 됩니다.',
  prompt: `[역할] 너는 학원 운영 코치다.
방금 사용자가 적은 답변을 받아서, 1) 핵심 인사이트 3개 추출 2) 신입에게 전달할 짧은 메시지 3) 다음 주 적용해볼 행동 1개 — 이 3가지를 마크다운으로 정리해줘.`,
});

// Master registry
const GIFT_BUILDERS = {
  ...directorGifts,
  ...developerGifts,
  ...automationGifts,
  ...showcaseGifts,
};

export function getActivityPromptGift(activityId, activityData = {}, profile = {}) {
  const builder = GIFT_BUILDERS[activityId] ?? defaultGift;
  try {
    return builder(activityData, profile);
  } catch {
    return defaultGift();
  }
}

export function listAllPromptGiftIds() {
  return Object.keys(GIFT_BUILDERS);
}
