/**
 * Developer Journey — "AI 시대에 뒤쳐지지 않는 7가지 방법"
 * Principles sit at the top of DEV_ACTIVITIES (S1). Stack labs stay below.
 * Schema drives DevPrincipleActivity (explain + practice).
 */

export const PRINCIPLE_SERIES = {
  id: 'ai-era-survival',
  title: 'AI 시대에 뒤쳐지지 않는 7가지 방법',
  subtitle: '도구 나열이 아니라, 정보가 흐르고 닫히고 검증되며 공개되는 시스템을 짓는다.',
};

function filled(value, min = 2) {
  return typeof value === 'string' && value.trim().length >= min;
}

function pathGet(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

/** Shared default shell for every principle activityData entry. */
export function createPrincipleDefaultData(principleId) {
  const base = {
    step: 'explain',
    explainRead: false,
    finished: false,
    insight: '',
    fields: {},
  };
  switch (principleId) {
    case 'dev_info_flow':
      return {
        ...base,
        sources: '',
        bottlenecks: '',
        loop: { collect: '', refine: '', store: '', reuse: '' },
        weeklyCadence: '',
      };
    case 'dev_output_close':
      return {
        ...base,
        auditRows: [
          { item: '', when: '', trace: '', closed: false },
          { item: '', when: '', trace: '', closed: false },
          { item: '', when: '', trace: '', closed: false },
        ],
        contract: { form: '', deadline: '', minSize: '' },
        checklist: { closedOne: false, storePath: '', weeklyGoal: '' },
      };
    case 'dev_prompt_asset':
      return {
        ...base,
        candidate: '',
        promotion: { name: '', slots: '', shape: '', check: '' },
        storage: { location: '', keyword: '' },
        executed: false,
        checkPassed: null,
        fixNote: '',
      };
    case 'dev_harness_design':
      return {
        ...base,
        target: { task: '', output: '' },
        roles: [
          { role: '설계자', does: '', produces: '' },
          { role: '실행자', does: '', produces: '' },
          { role: '검사자', does: '', produces: '' },
        ],
        steps: [
          { name: '', procedure: '', doneWhen: '' },
          { name: '', procedure: '', doneWhen: '' },
          { name: '', procedure: '', doneWhen: '' },
        ],
        boundary: { never1: '', never2: '', humanGate: '' },
        decomp: { tool: false, skill: false, subagent: false, subagentNone: false },
      };
    case 'dev_verify_loop':
      return {
        ...base,
        target: { step: '', failureMode: '' },
        rubric: {
          format: { item: '', how: '' },
          fact: { item: '', how: '' },
          intent: { item: '', how: '' },
        },
        gate: { total: '', passCount: '', hardFail: '' },
        retry: [
          { kind: '형식 깨짐', change: '', max: '' },
          { kind: '사실 부족', change: '', max: '' },
          { kind: '의도 이탈', change: '', max: '' },
        ],
        log: { path: '', fields: { input: false, broken: false, changed: false, result: false }, when: '' },
      };
    case 'dev_domain_moat':
      return {
        ...base,
        probes: { wrongness: '', privateData: '', reps: '', bilingual: '' },
        narrowing: { field: '', audience: '', constraint: '' },
        selfTest: { q1: null, q2: null, q3: null },
        plan: { form: '', perWeek: '', renewContract: false },
      };
    case 'dev_public_loop':
      return {
        ...base,
        firstPublic: '',
        levers: {
          cadence: '',
          firstDate: '',
          channel: '',
          url: '',
          invite: '틀린 부분이 보이면 알려주세요. 고쳐서 다시 올리겠습니다.',
        },
        ship: {
          posted: false,
          where: '',
          inviteAttached: false,
          nextDate: '',
        },
        weekPlan: {
          w1: '정보 흐름 맵',
          w2: '산출물 계약',
          w3: '절차 1개',
          w4: '하네스 설계도',
          w5: '검증 루브릭',
          w6: '도메인 좌표',
          w7: '회고 — 6주간 무엇이 깨졌는가',
          calendarRegistered: false,
        },
      };
    default:
      return base;
  }
}

export function isPrinciplePracticeReady(principleId, data = {}) {
  switch (principleId) {
    case 'dev_info_flow': {
      const loop = data.loop ?? {};
      const loopFilled = [loop.collect, loop.refine, loop.store, loop.reuse].filter((v) => filled(v, 4)).length;
      return filled(data.sources, 8) && filled(data.bottlenecks, 4) && loopFilled >= 3 && filled(data.weeklyCadence, 4);
    }
    case 'dev_output_close': {
      const rows = data.auditRows ?? [];
      const audits = rows.filter((r) => filled(r.item, 2) && filled(r.trace, 1)).length >= 3;
      const c = data.contract ?? {};
      return audits && filled(c.form) && filled(c.deadline) && filled(c.minSize) && data.checklist?.closedOne === true;
    }
    case 'dev_prompt_asset': {
      const p = data.promotion ?? {};
      const checkLines = String(p.check ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      return (
        filled(data.candidate, 4)
        && filled(p.name, 2)
        && filled(p.slots, 2)
        && filled(p.shape, 4)
        && checkLines.length >= 2
        && filled(data.storage?.location, 2)
        && data.executed === true
      );
    }
    case 'dev_harness_design': {
      const roles = (data.roles ?? []).filter((r) => filled(r.does) && filled(r.produces));
      const steps = (data.steps ?? []).filter((s) => filled(s.name) && filled(s.doneWhen));
      const b = data.boundary ?? {};
      return (
        filled(data.target?.task)
        && filled(data.target?.output)
        && roles.length === 3
        && steps.length >= 3
        && filled(b.never1)
        && filled(b.never2)
        && filled(b.humanGate)
      );
    }
    case 'dev_verify_loop': {
      const r = data.rubric ?? {};
      const logFields = data.log?.fields ?? {};
      const logCount = ['input', 'broken', 'changed', 'result'].filter((k) => logFields[k]).length;
      const retries = (data.retry ?? []).filter((row) => filled(row.change, 4));
      const softRetry = retries.every((row) => !/프롬프트.*(자세|길게|구체)/.test(row.change ?? ''));
      return (
        filled(data.target?.step)
        && filled(data.target?.failureMode)
        && filled(r.format?.item)
        && filled(r.fact?.item)
        && filled(r.intent?.item)
        && filled(data.gate?.passCount, 1)
        && filled(data.gate?.hardFail)
        && retries.length >= 3
        && softRetry
        && filled(data.log?.path)
        && logCount >= 3
      );
    }
    case 'dev_domain_moat': {
      const probes = data.probes ?? {};
      const probeCount = Object.values(probes).filter((v) => filled(v, 2)).length;
      const n = data.narrowing ?? {};
      const st = data.selfTest ?? {};
      return (
        probeCount >= 2
        && filled(n.field)
        && filled(n.audience)
        && filled(n.constraint)
        && st.q1 != null
        && st.q2 != null
        && st.q3 != null
        && filled(data.plan?.form)
        && filled(String(data.plan?.perWeek ?? ''), 1)
      );
    }
    case 'dev_public_loop': {
      const L = data.levers ?? {};
      const ship = data.ship ?? {};
      // Spec: full complete needs cadence + firstDate + channel + invite + published + url + schedule.
      // Partial: published alone still allows finish with lower bonus (handled in UI).
      return (
        filled(data.firstPublic, 2)
        && filled(L.cadence, 2)
        && filled(L.firstDate, 2)
        && filled(L.channel, 2)
        && filled(L.invite, 8)
        && ship.posted === true
        && filled(ship.where, 2)
        && data.weekPlan?.calendarRegistered === true
      );
    }
    default:
      return false;
  }
}

export function getPrincipleProgress(principleId, data = {}) {
  if (data?.finished) return 1;
  if (isPrinciplePracticeReady(principleId, data)) return 0.95;
  const explainBoost = data?.explainRead || data?.step === 'practice' ? 0.15 : 0;
  // coarse fill ratio by serializing non-empty string leaves
  const blob = JSON.stringify(data ?? {});
  const rough = Math.min(0.75, (blob.match(/"[^"]{4,}"/g) ?? []).length / 20);
  return Math.min(1, explainBoost + rough);
}

export const DEV_PRINCIPLES = [
  {
    id: 'dev_info_flow',
    n: 1,
    title: '정보가 나를 통해 흐르는 시스템을 구축하라',
    shortTitle: '정보 흐름 시스템',
    subtitle: '읽기만 하는 사람은 뒤처진다. 수집→정제→저장→재사용 루프를 가진 사람이 남는다.',
    icon: '🌊',
    color: '#0EA5E9',
    time: '8분',
    xp: 100,
    axis: { architecture: 2, automation: 2, optimization: 1 },
    seriesId: 'ai-era-survival',
    tag: '원칙 #1',
    enemy: '많이 저장하면 내 것이 된다',
    myth: { wrong: '많이 저장하면 내 것이 된다', right: '흐르게 만들어야 내 것이 된다' },
    contrast: {
      left: '고이는 정보',
      right: '흐르는 정보',
      rows: [
        ['북마크만 쌓임', '입구가 정해져 있음'],
        ['다시 못 찾음', '정제 기준이 있음'],
        ['채팅에 묻힘', '재사용 트리거가 있음'],
      ],
    },
    liveExamples: [
      {
        label: '실존 사례 · Reasonofmoon Devlog',
        url: 'https://reasonofmoon.github.io/',
        blurb: 'AI 뉴스·입시 큐레이션이 매일 수집→정제→발행→검증으로 흐르는 Hexo + 에이전트 스킬 루프',
      },
    ],
    explain: {
      hook: 'AI 시대에 뒤처지는 가장 흔한 이유는 “모델을 안 써서”가 아니라, 정보가 몸에 안 남아서입니다.',
      problem: [
        '피드는 넘치는데 북마크만 늘고, 다음 주에 다시 찾을 수 없다.',
        '좋은 프롬프트·장애 해결·기사 요약이 채팅창에 묻힌다.',
        '같은 조사를 반복한다 — 지식 부채가 아니라 기억 부채.',
      ],
      principle:
        '정보가 나를 “스쳐 지나”가게 두지 말고, 내가 병목이자 정류장이 되게 하라. 수집 입구, 정제 규칙, 저장 위치, 재사용 트리거가 있어야 “흐름”이다.',
      stages: [
        { key: 'collect', label: '수집 Collect', desc: '어디에 정보가 들어오는가?' },
        { key: 'refine', label: '정제 Refine', desc: '무엇을 버리고 남기는가?' },
        { key: 'store', label: '저장 Store', desc: '어디 두면 다시 꺼낼 수 있는가?' },
        { key: 'reuse', label: '재사용 Reuse', desc: '언제 다시 쓰는가?' },
      ],
      antiPatterns: [
        '저장만 하고 검색·연결이 없는 “디지털 창고”',
        '자동화만 만들고 큐레이션 기준이 없는 “쓰레기 파이프”',
        '도구 쇼핑으로 루프 설계를 미루는 것',
      ],
      takeaway: '완벽한 도구보다 “매주 한 번 정보가 나를 통과하는 최소 루프”가 먼저다.',
    },
    practice: {
      kind: 'info_flow',
      intro: '지금 쓰는 도구로 최소 정보 루프 초안을 적습니다.',
      completeHint: '입구·병목·루프 4단계 중 3개 이상·리듬을 채우면 완료할 수 있습니다.',
    },
    debrief: [
      '가장 먼저 고치고 싶은 단계는 어디인가요?',
      '재사용 트리거 없이 저장만 하고 있던 곳이 있나요?',
      '이 루프를 일주일만 돌리면 무엇이 달라질까요?',
    ],
  },
  {
    id: 'dev_output_close',
    n: 2,
    title: '배운 것은 반드시 산출물로 닫아라',
    shortTitle: '산출물로 닫기',
    subtitle: '“이해했다”는 감각은 학습의 증거가 아니다. 꺼낼 수 있어야 배운 것이다.',
    icon: '📦',
    color: '#F59E0B',
    time: '10분',
    xp: 120,
    axis: { architecture: 1, automation: 1, optimization: 2 },
    seriesId: 'ai-era-survival',
    tag: '원칙 #2',
    enemy: '이해했으면 배운 것이다',
    myth: { wrong: '이해했으면 배운 것이다', right: '꺼낼 수 있어야 배운 것이다' },
    contrast: {
      left: '열린 루프',
      right: '닫힌 루프',
      rows: [
        ['영상을 봤다', '노트 1개를 남겼다'],
        ['책을 읽었다', '요약/부작으로 발행했다'],
        ['뉴스를 훑었다', '브리핑 1건을 만들었다'],
        ['흔적: 시청 기록', '흔적: 검색 가능한 문서'],
      ],
    },
    liveExamples: [
      {
        label: 'YouTube Lab · 영상으로 읽기',
        url: 'https://reasonofmoon.github.io/categories/YouTube-Lab/',
        blurb: '영상 소비 → 고정 포맷 노트 발행. 제목 규칙 자체가 계약: 「영상으로 읽기: <원제>」',
      },
      {
        label: '책노트 9부작으로 닫기',
        url: 'https://reasonofmoon.github.io/2026/07/21/book-note-empire-of-ai-part-09-reckoning-formula/',
        blurb: '한 권을 “다 읽었다”로 닫지 않고 닫는 단위를 미리 정해 9개 노드로 남긴 사례',
      },
    ],
    explain: {
      hook: '지난 한 달 본 영상·글·강의 중, 지금 남에게 3분 설명할 수 있는 건 몇 개입니까? 나머지는 사라진 게 아니라 닫히지 않았을 뿐입니다.',
      problem: [
        '소비는 많은데 검색 가능한 흔적이 없다.',
        '“나중에 정리”는 거의 오지 않는다.',
        '완벽주의가 닫기를 막는다.',
      ],
      principle:
        '산출물 최소 계약: ① 형태 고정 ② 시한 고정 ③ 크기 하한. 여기서는 품질이 아니라 닫는가/안 닫는가만 본다. 품질은 원칙 ⑤.',
      stages: [
        { key: 'form', label: '형태 고정', desc: '매번 같은 그릇(템플릿 1개)' },
        { key: 'deadline', label: '시한 고정', desc: '소비 후 24시간 이내 등' },
        { key: 'min', label: '크기 하한', desc: '3줄이어도 닫은 것으로 인정' },
      ],
      antiPatterns: ['노트만 쌓고 안 읽기 → ①의 재사용 문제', 'AI 요약만 하고 내 반론 0줄', '크기 하한 없이 완벽 대기'],
      takeaway: '핵심은 잘 쓰기가 아니라 반드시 쓰기. 닫는 단위를 미리 정하라.',
    },
    practice: {
      kind: 'output_close',
      intro: '최근 7일 소비 3개를 감사하고, 나의 산출물 최소 계약서를 작성합니다.',
      completeHint: '감사표 3행 + 계약 3칸 + “지금 1개 닫음” 체크가 필요합니다.',
    },
    debrief: [
      '열린 루프 3개 중 왜 그 1개를 먼저 닫았나요?',
      '크기 하한은 지킬 수 있을 만큼 낮습니까?',
      '닫기를 방해하는 가장 큰 마찰은 시간·도구·완벽주의 중 무엇인가요?',
    ],
  },
  {
    id: 'dev_prompt_asset',
    n: 3,
    title: '프롬프트를 절차로 바꿔 자산화하라',
    shortTitle: '프롬프트 자산화',
    subtitle: '좋은 프롬프트를 찾는 게임은 끝났다. 이제는 절차를 짓는 게임이다.',
    icon: '🧩',
    color: '#8B5CF6',
    time: '12분',
    xp: 140,
    axis: { automation: 3, architecture: 2 },
    seriesId: 'ai-era-survival',
    tag: '원칙 #3',
    enemy: '좋은 프롬프트를 찾으면 된다',
    myth: { wrong: '좋은 프롬프트를 찾으면 된다', right: '좋은 프롬프트는 절차가 되어야 자산이 된다' },
    contrast: {
      left: '일회성 대화',
      right: '재사용 절차',
      rows: [
        ['그때그때 다시 씀', '이름이 있다'],
        ['결과 들쭉날쭉', '입·출력 형식 고정'],
        ['성공 기준 없음', 'CHECK가 문서에 있음'],
        ['남에게 못 줌', '파일로 건넬 수 있음'],
      ],
    },
    liveExamples: [
      {
        label: 'PCH-Optimizer 운영체제',
        url: 'https://reasonofmoon.github.io/2026/06/22/pch-optimizer-operating-system/',
        blurb: '115 카탈로그 → 8 커널 + 7 유형, CLASSIFY→…→HANDOFF 6단계 파이프라인',
      },
      {
        label: 'concept-explainer 절차 예시',
        url: 'https://reasonofmoon.github.io/2026/06/24/concept-explainer-prompt-terms/',
        blurb: 'SHAPE + CHECK가 명시된 단일 프롬프트의 절차화 형태',
      },
      {
        label: 'Claude Archives → LLM Wiki',
        url: 'https://reasonofmoon.github.io/2026/07/03/claude-archive-llm-wiki-registry/',
        blurb: '478개 중 살아 있는 본문을 11 작업 계열로 정렬 — 문제를 보존하라',
      },
    ],
    explain: {
      hook: 'AI 대화 기록 수백 개 중 다시 꺼낸 건 몇 개입니까? 478개 파일 중 본문이 산 것은 7개였던 사례처럼, 형태가 없으면 자산이 아닙니다.',
      problem: ['대화는 쌓이지만 재사용이 안 된다', '성공이 우연에 의존한다', '남에게 전달이 불가능하다'],
      principle: 'NAME → SLOT → SHAPE → CHECK. 두 번 쓸 것 같으면 그 자리에서 절차로 만들어라.',
      stages: [
        { key: 'name', label: 'NAME', desc: '이름을 붙인다 — 부를 수 있어야 재사용된다' },
        { key: 'slot', label: 'SLOT', desc: '변하는 부분을 뚫는다 — {주제}{대상}{길이}' },
        { key: 'shape', label: 'SHAPE', desc: '출력 형태를 고정한다' },
        { key: 'check', label: 'CHECK', desc: '성공 기준을 적는다' },
      ],
      antiPatterns: ['문장만 저장하고 문제 정의는 버림', '세 번째에야 템플릿화', 'CHECK 없이 SHAPE만'],
      takeaway: '문장을 저장하는 게 아니라 문제를 저장한다. 통과하면 스킬(도구)이 된다.',
    },
    practice: {
      kind: 'prompt_asset',
      intro: '최근 두 번 이상 비슷하게 쓴 요청 1개를 NAME·SLOT·SHAPE·CHECK로 승격합니다.',
      completeHint: '후보 1문장 + 4단계 + 저장 위치 + 1회 실행 체크가 필요합니다.',
    },
    debrief: [
      'SLOT을 뚫으며 “사실은 안 변하는 값”을 발견했나요?',
      'CHECK 작성이 SHAPE보다 어려웠나요?',
      '이 절차를 파일로 건네면 남이 그대로 쓸 수 있나요?',
    ],
  },
  {
    id: 'dev_harness_design',
    n: 4,
    title: '위임하지 말고, 하네스를 설계하라',
    shortTitle: '하네스 설계',
    subtitle: '말을 잘 타는 법은 말에게 부탁하는 게 아니라, 고삐를 쥐는 것이다.',
    icon: '🪢',
    color: '#EC4899',
    time: '14분',
    xp: 180,
    axis: { architecture: 3, automation: 2, crisis: 1 },
    seriesId: 'ai-era-survival',
    tag: '원칙 #4',
    enemy: 'AI가 알아서 해줄 것이다',
    myth: { wrong: 'AI가 알아서 잘 해주면 된다 (방목)', right: 'AI가 벗어날 수 없는 길을 만든다 (하네스)' },
    contrast: {
      left: '방목 (위임)',
      right: '하네스 (구조)',
      rows: [
        ['“잘 좀 해줘”', '역할·입력·산출·경계 문서화'],
        ['실패 시 다시 부탁', '어느 단계에서 깨졌는지 보임'],
        ['프롬프트가 길어진다', '프롬프트가 쪼개진다'],
      ],
    },
    liveExamples: [
      {
        label: '고삐를 쥔 손: 하네스에 관하여',
        url: 'https://reasonofmoon.github.io/2026/07/09/hand-on-the-reins-ai-harness/',
        blurb: '힘(AI) · 방향(하네스) · 책임(인간)',
      },
      {
        label: 'Tool / Skill / Subagent 분해',
        url: 'https://reasonofmoon.github.io/2026/07/03/video-note-tool-skill-or-subagent-decomposing-an-agent-that-outgrew-its-prompt/',
        blurb: '프롬프트가 A4 2장을 넘기면 분해 신호',
      },
      {
        label: 'Excalidraw 시각화 하네스',
        url: 'https://reasonofmoon.github.io/2026/07/03/excalidraw-prompt-visual-harness/',
        blurb: '생각 → 손그림 다이어그램 — 역할 분할 + 절차 배선 + 경계',
      },
      {
        label: 'Story Graph 창작 하네스',
        url: 'https://reasonofmoon.github.io/2026/07/03/storyboard-generation-story-graph-harness/',
        blurb: '스토리보드 생성기는 이미지 생성기가 아니다',
      },
    ],
    explain: {
      hook: '프롬프트가 A4 세 장이 됐다면 프롬프트 부족이 아니라, 프롬프트가 감당할 크기를 넘었다는 신호입니다.',
      problem: ['실패해도 어디가 깨졌는지 모른다', '규모를 키울수록 프롬프트만 길어진다', '경계 미선언 구간에서 사고 발생'],
      principle: '하네스 3부품: 역할 분할(WHO) · 절차 배선(HOW) · 경계 선언(WHERE). 사고는 거의 항상 안 적은 영역에서 난다.',
      stages: [
        { key: 'who', label: '역할 분할', desc: '설계자 / 실행자 / 검사자' },
        { key: 'how', label: '절차 배선', desc: '입력 → 단계들 → 산출' },
        { key: 'where', label: '경계 선언', desc: '하지 말 것 + 인간 개입 지점' },
      ],
      antiPatterns: ['역할 없이 한 프롬프트에 전부', '경계 없이 “알아서”', 'Tool/Skill/Subagent 구분 없이 비대화'],
      takeaway: '힘은 이미 와 있다. 없는 것은 방향이다. 하네스는 소프트웨어가 아니라 계약서에 가깝다.',
    },
    practice: {
      kind: 'harness_design',
      intro: '반복 업무 1개를 골라 역할 3 · 단계 ≥3 · 경계 3줄을 설계합니다.',
      completeHint: '대상·역할 3·단계 3·경계 3칸이 모두 필요합니다. 경계는 완료 게이트입니다.',
    },
    debrief: [
      '역할 3개 중 지금까지 당신이 쥐고 있던 것은?',
      '경계 선언에서 새로 본 위험이 있었나요?',
      '가장 먼저 깨질 단계는? (원칙 ⑤ 입력)',
    ],
  },
  {
    id: 'dev_verify_loop',
    n: 5,
    title: '출력이 아니라 검증 루프를 설계하라',
    shortTitle: '검증 루프',
    subtitle: '그럴듯함은 정확함의 증거가 아니다. 통과 기준을 미리 적지 않으면 판정이 아니라 안심이다.',
    icon: '✅',
    color: '#10B981',
    time: '14분',
    xp: 180,
    axis: { crisis: 2, architecture: 2, debugging: 2 },
    seriesId: 'ai-era-survival',
    tag: '원칙 #5',
    enemy: '결과물이 그럴듯하면 맞는 것이다',
    myth: {
      wrong: '결과물이 그럴듯하면 맞는 것이다',
      right: '통과 기준을 미리 적어두지 않으면, 판정이 아니라 안심한 것이다',
    },
    contrast: {
      left: '사후 검토',
      right: '사전 게이트',
      rows: [
        ['결과를 보고 판단', '보기 전에 기준을 적음'],
        ['“이 정도면 됐다”', 'N개 중 M개 = 합격'],
        ['재시도가 감', '재시도 조건이 문서화'],
      ],
    },
    liveExamples: [
      {
        label: '진단표 + 검증표',
        url: 'https://reasonofmoon.github.io/2026/06/22/pch-optimizer-diagnostic-rubric/',
        blurb: '좋은 프롬프트는 진단표와 검증표를 함께 가진다',
      },
      {
        label: 'Gemini Spark 30일 안전 설계',
        url: 'https://reasonofmoon.github.io/2026/07/17/gemini-spark-autonomous-workflow-plan/',
        blurb: '승인 경계 · 읽기/쓰기 분리 · 5분 판정 KPI — 더 좋은 중단 조건',
      },
      {
        label: '교육뉴스 RSS 출처 분리',
        url: 'https://reasonofmoon.github.io/2026/06/30/korean-education-news-rss-dashboard/',
        blurb: '검증된 RSS와 공식 링크를 분리 표기 — 정직한 상태 표시',
      },
      {
        label: 'Reward Hacking in Agents',
        url: 'https://reasonofmoon.github.io/2026/07/18/video-note-special-topics-kernels-rl-reward-hacking-agents/',
        blurb: '기준이 허술하면 허술한 기준을 완벽하게 만족시키는 결과물이 나온다',
      },
    ],
    explain: {
      hook: '“오, 좋은데?”는 대개 형식이 깔끔해서입니다. AI가 가장 잘하는 그 느낌을, 게이트로 대체합니다.',
      problem: ['형식층에서만 검증', '실패 시 프롬프트만 더 길게', '리워드 해킹 — 허술한 기준을 완벽 충족'],
      principle: 'RUBRIC · GATE · RETRY · LOG. 불합격 때 무엇을 바꿀지 미리 안 정하면 ④의 A4 세 장으로 회귀한다.',
      stages: [
        { key: 'rubric', label: 'RUBRIC', desc: '형식 / 사실 / 의도 3층 항목' },
        { key: 'gate', label: 'GATE', desc: '합격 개수 + 절대 탈락 조건' },
        { key: 'retry', label: 'RETRY', desc: '구조적 수정 (프롬프트 길게 쓰기 금지)' },
        { key: 'log', label: 'LOG', desc: '실패 기록이 다음 RUBRIC이 된다' },
      ],
      antiPatterns: ['“프롬프트를 더 자세히”가 RETRY 전부인 경우', '의도층 없는 검증', '안 읽는 로그'],
      takeaway: '좋은 에이전트 운영은 더 많은 권한이 아니라 더 좋은 중단 조건이다.',
    },
    practice: {
      kind: 'verify_loop',
      intro: '원칙 ④ 하네스의 한 단계(또는 새 단계)에 게이트를 답니다. RETRY에 “프롬프트 더 자세히”는 금지입니다.',
      completeHint: '검증 지점 + 3층 루브릭 + GATE + RETRY 3행 + LOG가 필요합니다.',
    },
    debrief: [
      '3층 중 기준 작성이 가장 어려웠던 층은?',
      '절대 조건으로 고른 것은 당신이 지키려는 가치입니다.',
      '이 루브릭에 걸렸을 “그냥 넘어간” 결과물이 있나요?',
    ],
  },
  {
    id: 'dev_domain_moat',
    n: 6,
    title: 'AI가 대체할 수 없는 좁은 도메인을 소유하라',
    shortTitle: '도메인 해자',
    subtitle: '범용 능력은 이미 월 구독료다. 값이 매겨지는 건 좁은 쪽이다.',
    icon: '🏰',
    color: '#6366F1',
    time: '12분',
    xp: 150,
    axis: { architecture: 2, optimization: 2, leadership: 1 },
    seriesId: 'ai-era-survival',
    tag: '원칙 #6',
    enemy: '범용 능력을 넓게 키워야 한다',
    myth: { wrong: '범용 능력을 넓게 키워야 안전하다', right: '학습 데이터에 없는 좁은 것을 가져야 안전하다' },
    contrast: {
      left: '넓고 얕게',
      right: '좁고 깊게',
      rows: [
        ['검색되는 지식', '현장에서만 생기는 판단'],
        ['AI가 초안을 더 잘 씀', 'AI가 초안조차 못 씀'],
        ['경쟁자 수만', '경쟁자 수십'],
      ],
    },
    liveExamples: [
      {
        label: 'Domain-Specific Agents',
        url: 'https://reasonofmoon.github.io/2026/07/09/video-note-future-is-domain-specific-agents/',
        blurb: 'Composition over inheritance — 좁히면 싸지고 선명해진다',
      },
      {
        label: '입시뉴스 도메인 시계열',
        url: 'https://reasonofmoon.github.io/2026/07/22/education-news-2026-07-22/',
        blurb: '교육 × 한국 입시 × 제도 변화 — 날짜를 통과해야 생기는 자산',
      },
      {
        label: '에듀프레너 Obsidian 엔진',
        url: 'https://reasonofmoon.github.io/2026/06/24/obsidian-edupreneur-knowledge-engine/',
        blurb: '도메인 + 시스템(①④)의 결합',
      },
    ],
    explain: {
      hook: '“AI가 내 일을 대체할까요?”를 뒤집으면 — 당신이 아는 것 중 인터넷에 안 적힌 게 뭡니까?',
      problem: ['넓게 키우다 검색 가능한 깊이에서 멈춤', '의도층 검증(⑤)의 근거가 없음', '시장을 두려워해 좁히지 못함'],
      principle: '도메인 해자 4탐침: 오답 감각 · 비공개 데이터 · 반복 노출 · 용어 번역력. 좁힘 공식 = 일반 영역 + 특정 대상 + 특정 제약.',
      stages: [
        { key: 'probe', label: '4탐침', desc: '후보는 하나라도 걸리면 충분' },
        { key: 'narrow', label: '좁힘 공식', desc: '영역 + 대상 + 제약' },
        { key: 'test', label: '대체 테스트', desc: 'AI 답의 틀린 지점을 지목할 수 있는가' },
        { key: 'plan', label: '90일 축적', desc: '② 계약을 이 도메인에 연결' },
      ],
      antiPatterns: ['동시에 두 도메인 깊게 파기', '공개 데이터만으로 해자라 착각', '좁힘을 종착점으로 오해'],
      takeaway: '오답 감각이 오는 영역이 당신의 도메인이며, ⑤의 의도층 기준은 거기서만 나온다.',
    },
    practice: {
      kind: 'domain_moat',
      intro: '4탐침으로 후보를 고르고 좁힘 공식으로 좌표를 찍은 뒤, 90일 축적 계획을 적습니다.',
      completeHint: '탐침 2개 이상 + 좁힘 3칸 + 자가 테스트 3문항 + 90일 계획이 필요합니다.',
    },
    debrief: [
      '4탐침 중 답이 가장 빨리 나온 진입점은?',
      '제약을 한 단계 더 좁힌다면?',
      '틀린 지점 지목에 “아니오”면 나쁜 소식일까요, 좋은 소식일까요?',
    ],
  },
  {
    id: 'dev_public_loop',
    n: 7,
    title: '시스템을 공개해 피드백을 복리로 만들어라',
    shortTitle: '공개 루프',
    subtitle: '완성되면 공개하겠다는 계획은, 공개하지 않겠다는 계획이다.',
    icon: '📢',
    color: '#F43F5E',
    time: '12분',
    xp: 200,
    axis: { leadership: 2, automation: 1, architecture: 2 },
    seriesId: 'ai-era-survival',
    tag: '원칙 #7',
    enemy: '완성되면 그때 공개하겠다',
    myth: { wrong: '완성되면 그때 공개하겠다', right: '공개해야 완성으로 밀려간다' },
    contrast: {
      left: '닫힌 개인 루프',
      right: '열린 공개 루프',
      rows: [
        ['피드백 = 나', '피드백 = 나 + 타인 + 시간'],
        ['틀려도 안 들킴', '지적 = 무료 검증'],
        ['성장 = 덧셈', '성장 = 복리'],
      ],
    },
    liveExamples: [
      {
        label: 'Reasonofmoon Devlog (통합 증거)',
        url: 'https://reasonofmoon.github.io/',
        blurb: '①~⑦이 한 사이트에서 돌아가는 실물 — 카테고리·포맷·하네스·검증·도메인·한/영 발행',
      },
      {
        label: 'LLM Atlas Manifesto',
        url: 'https://reasonofmoon.github.io/2026/07/05/llm-atlas-manifesto/',
        blurb: '위키를 넘어 살아있는 지도로 — 공개를 쓰는 행위로',
      },
      {
        label: 'HTML 출력 프롬프트',
        url: 'https://reasonofmoon.github.io/2026/07/03/html-output-prompt-harness/',
        blurb: '답변을 작은 인터페이스로 — 공개 형태 자체를 설계',
      },
    ],
    explain: {
      hook: '지금까지 만든 맵·계약·절차·하네스·게이트·도메인 좌표는 어디에 있습니까? 아무도 반박하지 않는 시스템은 틀린 채로 오래 갑니다.',
      problem: ['완성 대기 = 무기한 연기', '전시는 박수, 공개는 지적', '불규칙 공개는 복리가 안 붙음'],
      principle: '공개 루프 3레버: 발행 주기 고정 · 접근 경로 하나 · 반박 초대. 최소 단위는 팀 채널에 워크시트 1장.',
      stages: [
        { key: 'cadence', label: '발행 주기', desc: '주 1회 > 몰아서 10개' },
        { key: 'path', label: '접근 경로 하나', desc: '작업이 모이는 URL 1개' },
        { key: 'invite', label: '반박 초대', desc: '“틀리면 알려주세요”를 명시' },
      ],
      antiPatterns: ['완성될 때까지 비공개', '반박 초대 없는 전시', '경로가 분산돼 복리 불가'],
      takeaway: '① 흐르게 하고 ② 닫고 ③ 절차로 만들고 ④ 하네스로 묶고 ⑤ 검증하고 ⑥ 좁히고 ⑦ 열 뿐이다.',
    },
    practice: {
      kind: 'public_loop',
      intro: '시리즈 산출물 중 하나를 골라 3레버를 설정하고, 오늘 가능한 최소 공개를 실행 체크합니다.',
      completeHint: '공개 대상 1개 + 3레버 + “지금 공개함” 체크가 필요합니다.',
    },
    debrief: [
      '가장 먼저 공개하기로 한 자산은 왜 그것인가요?',
      '반박 초대 문장을 실제로 붙일 수 있습니까?',
      '다음 발행일까지 막을 마찰 하나는 무엇인가요?',
    ],
  },
];

export function getPrincipleById(id) {
  return DEV_PRINCIPLES.find((p) => p.id === id) ?? null;
}

export function getPrincipleActivityMeta(principle) {
  return {
    id: principle.id,
    title: `${principle.tag} ${principle.shortTitle}`,
    subtitle: principle.subtitle,
    icon: principle.icon,
    color: principle.color,
    time: principle.time,
    axis: principle.axis,
    principle: true,
    seriesId: principle.seriesId,
    n: principle.n,
  };
}

export function listPrincipleIds() {
  return DEV_PRINCIPLES.map((p) => p.id);
}

/** Immediate prerequisite activity id, or null for principle #1 / non-principles. */
export function getPrinciplePrerequisite(id) {
  const ids = listPrincipleIds();
  const index = ids.indexOf(id);
  if (index <= 0) return null;
  return ids[index - 1];
}

/**
 * Principles unlock in order ①→⑦.
 * Non-principle activities are always unlocked.
 * Completing the previous principle unlocks the next.
 * Presenter mode bypasses locks for keynote demos.
 */
export function isPrincipleUnlocked(id, completed = [], options = {}) {
  if (options.presenterMode) return true;
  if (!listPrincipleIds().includes(id)) return true;
  const prereq = getPrinciplePrerequisite(id);
  if (!prereq) return true;
  return completed.includes(prereq);
}

export function getPrincipleLockReason(id, completed = [], options = {}) {
  if (isPrincipleUnlocked(id, completed, options)) return null;
  const prereq = getPrinciplePrerequisite(id);
  const prev = getPrincipleById(prereq);
  return prev
    ? `먼저 ${prev.tag} 「${prev.shortTitle}」을 완료하세요`
    : '이전 원칙을 완료하세요';
}

export const PRESENTER_MODE_STORAGE_KEY = 'tacit-presenter-mode';

export function readPresenterMode() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(PRESENTER_MODE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function writePresenterMode(enabled) {
  if (typeof window === 'undefined') return;
  try {
    if (enabled) {
      window.localStorage.setItem(PRESENTER_MODE_STORAGE_KEY, '1');
    } else {
      window.localStorage.removeItem(PRESENTER_MODE_STORAGE_KEY);
    }
  } catch {
    // ignore quota / private mode
  }
}

/** Presenter-only notes — shown in collapsible “발표 멘트” panel, not student worksheet. */
export const PRINCIPLE_SPEAKER_NOTES = {
  dev_info_flow: [
    'Hook: “모델을 안 써서”가 아니라 “정보가 안 남아서”로 프레임을 잡는다.',
    '4단계(수집·정제·저장·재사용)를 한 슬라이드에 다 던지지 말고, 판서로 하나씩.',
    '앵커 Devlog는 라이브로 열고 “매일 흐르는가”만 보여 준다. 기술 스택 자랑은 금지.',
    '반발 “시간이 없다” → 최소 루프는 주 1회 20분이면 된다.',
  ],
  dev_output_close: [
    '이 원칙은 청중이 가장 뜨끔해하는 지점. 비난 톤 금지 — “저도 그랬습니다”를 한 번 넣는다.',
    'Hook 질문(“3분 설명 가능한 게 몇 개?”) 후 5초 침묵. 채우지 말 것.',
    '새 개념은 2개만: 열린/닫힌 루프, 산출물 최소 계약.',
    '“시간이 없다” → 크기 하한을 3줄로 즉시 낮춰 보여 준다. 품질은 ⑤로 미룬다.',
  ],
  dev_prompt_asset: [
    'Hook의 478→7 숫자를 앵커(LLM Wiki)에서 반드시 회수한다. 열고 안 닫으면 ② 위반.',
    'NAME→SLOT→SHAPE→CHECK는 판서로 하나씩. 한 슬라이드에 4개 동시 금지.',
    '비개발 청중에게 SLOT = “메일 템플릿의 [고객명]” 비유.',
    '스킬 파일 포맷 세부는 ④로 이관. 여기서는 절차 승격만.',
  ],
  dev_harness_design: [
    '시리즈 난이도 정점. 중간 1회 손들기 체크(“여기까지 따라오셨나요”).',
    '핵심 개념 3개: 역할 / 배선 / 경계. Tool·Skill·Subagent는 짧은 휴지 후 별도.',
    '앵커 3종은 각 30초. 깊이 들어가면 시간 붕괴.',
    '실습 15분 지점 안내: “경계 선언 칸 비어 있으면 지금 채우세요.”',
  ],
  dev_verify_loop: [
    '④에서 “가장 먼저 깨질 단계”라고 적은 것을 재료로 시작한다.',
    '겸손 구간: 강연자 본인의 검증 실패 사례 1개 필수. 없으면 설교가 된다.',
    '3층(형식·사실·의도)은 아래에서 위로 판서.',
    'Reward Hacking: AI가 나쁜 게 아니라 기준이 허술하다는 프레임 유지.',
  ],
  dev_domain_moat: [
    '④⑤ 직후 회복 구간. 톤을 낮추고 성찰형으로. 새 도구를 꺼내지 말 것.',
    'Hook 위축 방지: “없는 게 아니라 안 꺼내본 것”을 먼저 못 박는다.',
    '오답 감각은 강연자 본인 사례 1개로 설명.',
    '좁힘 공식은 청중 1명에게 즉석 적용하면 몰입도가 오른다.',
  ],
  dev_public_loop: [
    '시리즈 클로징. 새 정보 최소화, ①~⑦ 회수와 연결에 시간을 쓴다.',
    '앵커 사이트는 스크린샷이 아니라 브라우저 라이브.',
    '①~⑦ 매핑표를 한 줄씩 천천히 읽는다.',
    'CTA는 오늘 실행 가능 크기: 팀 채널에 워크시트 1장. 마무리 후 침묵 3초.',
  ],
};

export function getPrincipleSpeakerNotes(id) {
  const principle = getPrincipleById(id);
  return principle?.speakerNotes ?? PRINCIPLE_SPEAKER_NOTES[id] ?? [];
}

// silence unused helper warning in some bundlers
export { pathGet };
