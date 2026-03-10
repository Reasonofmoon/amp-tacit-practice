# 🎯 CODEX DIRECTIVE — 암묵지 발굴 인터액티브 게이미피케이션 앱

> **Project**: amp-tacit-knowledge  
> **Stack**: Vite + React (JSX, 바닐라 CSS)  
> **Language**: 한국어 UI, 영어 코드  
> **Target User**: 한국 학원 원장, 강사, 교육 콘텐츠 제작자  
> **Design**: Dark theme, Glassmorphism, Micro-animations, Mobile-first

---

## 📋 CONTEXT — 현재 상태

기존 파일 `tacit-knowledge-workshop.jsx` (595줄, 단일 React 컴포넌트)에 6가지 활동이 있음:
1. 🗓️ **나의 1년 타임라인** — 12개월 학원 운영 패턴 기록
2. 🧭 **자동조종 탐지기** — 무의식적 행동 6가지 포착
3. ⚡ **위기의 순간 리플레이** — 위기 판단 3시나리오
4. 🎓 **신입에게 전수하기** — 가르칠 때 보이는 암묵지
5. 🔮 **SECI 변환 실습** — 암묵지→AI 프롬프트 변환
6. 🖼️ **암묵지 갤러리 워크** — 공유 게시판

**암묵지(Tacit Knowledge)**: 경험을 통해 체화되어 말로 설명하기 어려운 전문 지식.  
"그냥 하는 것"이라고 느끼지만 실은 수천 번의 반복이 만든 전문가의 직관.

---

## 🎯 MISSION — 해야 할 일

### Phase 1: 프로젝트 부트스트랩
1. `npx -y create-vite@latest ./ -- --template react` 로 Vite 프로젝트 초기화  
2. 기존 `tacit-knowledge-workshop.jsx`에서 컴포넌트를 분리하여 아래 구조로 마이그레이션
3. **TailwindCSS 사용 금지** — 바닐라 CSS만 사용 (`src/index.css`)

```
src/
├── main.jsx
├── App.jsx
├── index.css                  ← 글로벌 디자인 시스템 (CSS 변수 + 애니메이션)
├── components/
│   ├── Layout.jsx              ← 헤더, XP바, 네비게이션 포함 공통 레이아웃
│   ├── ActivityCard.jsx        ← 활동 선택 카드 (기존 분리)
│   ├── ActivityShell.jsx       ← 활동 공통 쉘 (기존 분리)  
│   ├── GlowOrb.jsx             ← 배경 글로우 이펙트
│   ├── XPBar.jsx               ← 상단 경험치 바 + 레벨 표시
│   ├── Badge.jsx               ← 뱃지 컴포넌트
│   ├── BadgeShowcase.jsx       ← 얻은 뱃지 갤러리
│   ├── Leaderboard.jsx         ← 로컬 리더보드 (localStorage)
│   ├── ResultReport.jsx        ← 최종 암묵지 프로필 리포트
│   ├── ConfettiEffect.jsx      ← 레벨업/뱃지 획득 폭죽 이펙트
│   ├── OnboardingOverlay.jsx   ← 첫 진입 튜토리얼 (3 스텝)
│   └── Timer.jsx               ← 카운트다운 타이머 비주얼
├── activities/
│   ├── TimelineActivity.jsx     ← 기존 마이그레이션
│   ├── AutopilotActivity.jsx    ← 기존 마이그레이션
│   ├── CrisisActivity.jsx       ← 기존 마이그레이션
│   ├── TransferActivity.jsx     ← 기존 마이그레이션
│   ├── SeciActivity.jsx         ← 기존 마이그레이션
│   ├── GalleryActivity.jsx      ← 기존 마이그레이션
│   ├── QuickQuizActivity.jsx    ← 🆕 스피드 퀴즈
│   ├── RolePlayActivity.jsx     ← 🆕 역할극 시뮬레이션 
│   └── PatternMatchActivity.jsx ← 🆕 패턴 매칭 게임
├── data/
│   ├── activities.js            ← ACTIVITIES 배열 + 신규 활동 정의
│   ├── yearEvents.js            ← YEAR_EVENTS, MONTHS
│   ├── quizzes.js               ← 스피드 퀴즈 문항 데이터
│   ├── scenarios.js             ← 역할극 시나리오 + 분기 트리
│   ├── patternCards.js          ← 패턴 매칭 카드 데이터
│   └── badges.js                ← 뱃지 정의 + 해금 조건
├── hooks/
│   ├── useGameState.js          ← XP, 레벨, 뱃지, 완료 상태 (localStorage 연동)
│   └── useTimer.js              ← 카운트다운 타이머 훅
└── utils/
    ├── scoring.js               ← XP 계산, 콤보 보너스, 레벨 판정
    └── promptGenerator.js       ← 사용자 답변 → AI 프롬프트 자동 생성
```

---

### Phase 2: 게이미피케이션 시스템 구현

#### 2-1. XP & 레벨 시스템 (`useGameState.js`)

```javascript
// 레벨 정의
const LEVELS = [
  { level: 1, title: "견습 원장", icon: "🌱", minXP: 0 },
  { level: 2, title: "성장 원장", icon: "🌿", minXP: 100 },
  { level: 3, title: "숙련 원장", icon: "🌳", minXP: 250 },
  { level: 4, title: "마스터 원장", icon: "⭐", minXP: 500 },
  { level: 5, title: "암묵지 장인", icon: "🏆", minXP: 800 },
];

// 활동별 XP
const ACTIVITY_XP = {
  timeline: 40,    autopilot: 50,   crisis: 60,
  transfer: 50,    seci: 70,        gallery: 30,
  quiz: 80,        roleplay: 100,   pattern: 60,
};
```

- `localStorage`에 `tacit-game-state` 키로 저장
- XP 획득 시 `XPBar`에 +XP 플로팅 텍스트 애니메이션
- 레벨업 시 `ConfettiEffect` 트리거 + 화면 중앙 레벨업 카드 표시

#### 2-2. 뱃지 시스템 (`badges.js`)

```javascript
const BADGES = [
  { id: "observer", name: "관찰자", icon: "🔍", desc: "자동조종 탐지기 완료", condition: (state) => state.completed.has("autopilot") },
  { id: "crisis_manager", name: "위기관리자", icon: "⚡", desc: "위기 시나리오 3개 모두 작성", condition: (state) => state.crisisAll },
  { id: "mentor", name: "멘토", icon: "🎓", desc: "전수 6개 완료", condition: (state) => state.transferAll },
  { id: "transformer", name: "변환자", icon: "🔮", desc: "SECI 변환 완료", condition: (state) => state.completed.has("seci") },
  { id: "speedster", name: "스피드스터", icon: "⏱️", desc: "퀴즈 3분 이내 완료", condition: (state) => state.quizTime < 180 },
  { id: "empath", name: "공감자", icon: "💬", desc: "역할극 시나리오 완료", condition: (state) => state.completed.has("roleplay") },
  { id: "pattern_finder", name: "패턴 파인더", icon: "🧩", desc: "패턴 매칭 전체 완료", condition: (state) => state.completed.has("pattern") },
  { id: "master", name: "통찰가", icon: "🎯", desc: "모든 활동 완료", condition: (state) => state.completed.size >= 9 },
];
```

#### 2-3. 콤보 & 스트릭
- 활동을 연속 완료할 때마다 콤보 카운터 증가 (×1.2, ×1.5, ×2.0)
- 콤보 시각 효과: 화면 테두리 글로우 + "🔥 콤보 ×2!" 팝업

---

### Phase 3: 신규 인터액티브 활동 3가지

#### 3-1. ⏱️ 스피드 퀴즈 (`QuickQuizActivity.jsx`)

**형식**: 카운트다운 타이머(30초/문항) + 4지선다  
**10 문항 예시** (quizzes.js에 정의):

```javascript
const QUIZZES = [
  {
    q: "학부모가 '다른 학원 알아보고 있어요'라고 말했을 때, 가장 먼저 해야 할 것은?",
    options: [
      "할인 제안을 한다",
      "아이의 최근 변화를 구체적으로 공유한다",
      "다른 학원의 문제점을 말한다",
      "시간을 달라고 한다"
    ],
    answer: 1,
    insight: "경험 많은 원장은 가격 경쟁이 아닌 '아이에 대한 관심'으로 신뢰를 지킵니다. 이것이 암묵지입니다.",
  },
  {
    q: "수업 중 한 학생이 계속 딴짓을 할 때, 베테랑 강사의 첫 반응은?",
    options: [
      "이름을 불러 주의를 준다",
      "그 학생 옆에 서서 수업을 계속한다",
      "쉬는 시간에 따로 이야기한다",
      "학부모에게 연락한다"
    ],
    answer: 1,
    insight: "'옆에 서기' — 지적하지 않으면서 자연스럽게 집중시키는 기법. 교대에서 안 가르치지만 모든 베테랑이 아는 기술입니다.",
  },
  {
    q: "여름특강 등록이 저조할 때 가장 효과적인 전략은?",
    options: [
      "수강료를 낮춘다",
      "기존 학부모 1:1 전화로 '맞춤 추천'을 한다",
      "전단지를 더 돌린다",
      "SNS 광고 예산을 늘린다"
    ],
    answer: 1,
    insight: "개인화된 1:1 추천 — '민수 어머니, 민수 약한 부분 집중하는 반이 생겼어요.' 이 한마디가 전단지 1000장보다 강력합니다.",
  },
  {
    q: "새 강사 채용 면접에서 가장 중요하게 보는 것은?",
    options: [
      "학력과 전공",
      "교육 경력 연수",
      "모의 수업에서 학생 반응을 관찰하는 태도",
      "급여 협상 태도"
    ],
    answer: 2,
    insight: "이력서의 스펙이 아닌 '학생을 보는 시선' — 이것은 면접관의 수년간 경험이 만든 암묵지적 프레임워크입니다.",
  },
  {
    q: "학부모 설명회에서 가장 효과적인 순서는?",
    options: [
      "커리큘럼 → 성과 → 비전",
      "학생 성과 사례 → 비결 → 다음 학기 계획",
      "학원 소개 → 강사 소개 → Q&A",
      "경쟁 분석 → 차별점 → 등록 안내"
    ],
    answer: 1,
    insight: "'사례 먼저, 시스템 나중' — 구체적 성공 스토리가 신뢰를 만들고, 그 다음 체계를 보여주면 설득력이 생깁니다.",
  },
  {
    q: "학기 중 갑자기 실력이 떨어진 학생의 가장 흔한 원인은?",
    options: [
      "수업 난이도 문제",
      "학교/가정 환경 변화",
      "학습 동기 저하",
      "강사와의 관계"
    ],
    answer: 1,
    insight: "성적 하락의 80%는 학원 밖에서 옵니다. 이혼, 전학, 왕따 — 이걸 먼저 파악하는 원장이 진짜 프로입니다.",
  },
  {
    q: "레벨테스트 결과지를 학부모에게 설명할 때 가장 중요한 것은?",
    options: [
      "점수를 정확히 전달한다",
      "학원 반 배정 기준을 설명한다",
      "아이의 강점을 먼저 말하고 약점은 해결 가능하다고 말한다",
      "다른 학생과 비교해 위치를 알려준다"
    ],
    answer: 2,
    insight: "'강점 먼저' 법칙 — 학부모의 방어벽을 낮추는 핵심 기술. 숫자보다 '할 수 있다'는 메시지가 등록으로 이어집니다.",
  },
  {
    q: "숙제를 안 해오는 학생에 대한 가장 효과적인 접근은?",
    options: [
      "벌칙을 준다",
      "학부모에게 알린다",
      "숙제 양을 줄이고 완료 경험을 먼저 만든다",
      "숙제 안 하면 수업 못 듣게 한다"
    ],
    answer: 2,
    insight: "'작은 성공 경험 쌓기' — 숙제 거부는 능력 부족이 아니라 실패 공포입니다. 할 수 있을 만큼만 주고 성공시키는 것이 암묵지.",
  },
  {
    q: "학원 입구에 들어서는 학부모의 표정으로 알 수 있는 것은?",
    options: [
      "별 의미 없다",
      "오늘의 상담 난이도를 예측할 수 있다",
      "아이의 성적을 짐작할 수 있다",
      "학원 만족도를 알 수 있다"
    ],
    answer: 1,
    insight: "표정 읽기 — 원장의 비언어적 감지 능력. 눈썹 위치, 걸음 속도, 인사 톤으로 '오늘 무거운 이야기가 있겠구나' 를 3초 만에 파악합니다.",
  },
  {
    q: "경쟁 학원이 바로 옆에 생겼을 때 가장 중요한 행동은?",
    options: [
      "수강료를 낮춘다",
      "차별화된 프로그램을 급하게 개발한다",
      "기존 학부모와의 관계를 더 강화한다",
      "경쟁 학원의 약점을 파악한다"
    ],
    answer: 2,
    insight: "관계 자산 — 경쟁에서 이기는 것은 새것이 아니라 '이미 있는 신뢰'입니다. 기존 학부모 10명이 가장 강력한 마케터입니다.",
  },
];
```

**UI 구현 요구사항**:
- 원형 타이머 애니메이션 (SVG circle stroke)
- 정답 시 초록 플래시 + "+15 XP" 플로팅 텍스트
- 오답 시 빨간 흔들림(shake) + insight 카드 슬라이드 표시
- 콤보 카운터 (연속 정답): "🔥 3연속!" 
- 결과 화면: 정답률 + 총 XP + 발견된 암묵지 인사이트 요약

---

#### 3-2. 🎭 역할극 시뮬레이션 (`RolePlayActivity.jsx`)

**형식**: 채팅 버블 UI + 선택지 3~4개  
**3가지 시나리오** (scenarios.js에 정의):

```javascript
const ROLEPLAY_SCENARIOS = [
  {
    id: "parent_call",
    title: "학부모 전화 상담",
    icon: "📱",
    desc: "밤 9시, 화난 학부모에게서 전화가 왔습니다",
    steps: [
      {
        npc: "학부모",
        message: "원장님, 우리 지훈이가 오늘 수업에서 선생님한테 무시당했다고 울면서 왔어요. 어떻게 된 거예요?",
        choices: [
          { text: "\"어머니, 먼저 지훈이가 많이 속상했겠네요. 구체적으로 어떤 상황이었는지 말씀해주시겠어요?\"", score: 3, insight: "공감 우선 — 사실 확인 전에 감정부터 받아주는 것이 베테랑의 첫 수입니다." },
          { text: "\"그런 일이 있었나요? 확인해보고 연락드리겠습니다.\"", score: 1, insight: "사실 확인도 중요하지만, 감정이 고조된 상태에서 '나중에'는 불신을 키웁니다." },
          { text: "\"선생님이 그러셨을 리가 없는데요. 오해가 있는 것 같습니다.\"", score: 0, insight: "방어는 최악의 선택입니다. 학부모는 '내 아이를 안 믿는다'로 받아들입니다." },
        ]
      },
      {
        npc: "학부모",
        message: "지훈이가 발표하려고 손 들었는데, 선생님이 계속 다른 애만 시켰대요. 3번이나요.",
        choices: [
          { text: "\"세 번이나 그랬다면 지훈이가 정말 실망했겠어요. 내일 수업 시작 전에 선생님, 지훈이, 저 셋이 잠깐 이야기하는 시간을 만들겠습니다.\"", score: 3, insight: "구체적 해결 약속 — '확인해보겠다'가 아니라 '내일 이런 자리를 만들겠다'는 실행 계획이 신뢰를 만듭니다." },
          { text: "\"강사한테 확인하고 조치하겠습니다.\"", score: 1, insight: "조치 약속은 있지만 구체성이 부족합니다. '언제, 어떻게'가 빠져있습니다." },
          { text: "아이들이 많다 보면 그럴 수 있는데, 앞으로 주의하겠습니다.\"", score: 0, insight: "일반화는 감정을 무시하는 것과 같습니다. '우리 아이'가 중요한 학부모에게 '아이들'은 의미 없습니다." },
        ]
      }
    ]
  },
  {
    id: "new_teacher",
    title: "신입 강사 첫날",
    icon: "👩‍🏫",
    desc: "오늘 새 영어 강사의 첫 출근일. 오리엔테이션을 진행합니다.",
    steps: [
      {
        npc: "신입 강사",
        message: "원장님, 저 오늘부터 잘 부탁드립니다! 교재랑 커리큘럼 자료 주시면 열심히 준비할게요.",
        choices: [
          { text: "\"먼저 오늘 하루는 수업 참관만 하세요. 교재보다 중요한 건 아이들의 이름과 성격을 파악하는 거예요.\"", score: 3, insight: "'아이 먼저, 교재 나중' — 교재는 며칠이면 파악하지만, 아이와의 관계 형성은 첫날에 결정됩니다." },
          { text: "\"네 교재 여기 있고, 이번 주 커리큘럼이에요. 궁금한 거 있으면 물어보세요.\"", score: 1, insight: "자료 전달은 기본이지만, 신입에게 필요한 것은 '무엇을'이 아니라 '어떻게'입니다." },
          { text: "\"우리 학원 규칙부터 설명할게요. 출퇴근, 복장, 보고 양식...\"", score: 0, insight: "규칙 먼저는 일방적입니다. 첫날에 문화를 느끼게 하는 것이 장기 근속으로 이어집니다." },
        ]
      },
      {
        npc: "신입 강사",
        message: "수업 참관했는데, 민호라는 학생이 계속 딴짓하더라고요. 어떻게 해야 하나요?",
        choices: [
          { text: "\"민호는 집중 시간이 짧은 대신, 흥미 있는 주제면 폭발적이에요. 공룡을 좋아해요. 예문에 공룡을 넣어보세요.\"", score: 3, insight: "학생별 '트리거'를 아는 것 — 이것이 매뉴얼 어디에도 없는, 오래 지켜본 사람만 아는 암묵지입니다." },
          { text: "\"딴짓하면 이름 불러서 주의 주세요.\"", score: 1, insight: "표면적 대응입니다. 근본 원인(흥미 부재)을 해결하지 않으면 반복됩니다." },
          { text: "\"민호 학부모한테 연락해서 가정에서도 관리해달라고 하세요.\"", score: 0, insight: "첫날부터 학부모 연락은 강사-학생 관계 형성을 포기하는 것과 같습니다." },
        ]
      }
    ]
  },
  {
    id: "enrollment_crisis",
    title: "등록생 급감 대응",
    icon: "📉",
    desc: "2월인데 신규 등록이 작년의 절반. 옆에 대형 프랜차이즈 학원이 오픈했습니다.",
    steps: [
      {
        npc: "부원장",
        message: "원장님, 이번 달 신규 등록이 12명밖에 안 됩니다. 작년엔 28명이었는데... 옆에 새 학원 영향인 것 같아요. 어떻게 하시겠어요?",
        choices: [
          { text: "\"먼저 지난 3개월 퇴원/신규 데이터를 뽑아보자. 그리고 기존 학부모 20분에게 오늘 안에 전화하자 — 아이 안부 전화로.\"", score: 3, insight: "데이터 + 관계 동시 작동 — 감으로 움직이지 않고 숫자를 보되, 행동은 '관계 강화'부터. 이것이 위기관리의 암묵지." },
          { text: "\"수강료를 한시적으로 20% 할인하자.\"", score: 0, insight: "가격 경쟁은 대형 프랜차이즈와 싸우는 최악의 전략입니다. 그들은 더 낮출 수 있습니다." },
          { text: "\"새 프로그램을 급하게 만들어서 차별화하자.\"", score: 1, insight: "차별화 시도는 좋지만 급조된 프로그램은 품질 문제를 낳습니다. 먼저 기존 강점을 확인해야." },
        ]
      },
      {
        npc: "부원장",
        message: "전화해봤더니 학부모 5분이 '새 학원 체험 수업 가봤다'고 하시더라고요. 어떡하죠?",
        choices: [
          { text: "\"좋아, 솔직한 정보를 줬으니 우리도 솔직하게. '우리 학원에서 아이가 올해 이만큼 성장했다'는 개인별 리포트를 만들어서 이번 주 안에 보내자.\"", score: 3, insight: "개인 성장 증거 — 대형 학원이 절대 할 수 없는 것은 '이 아이를 이만큼 지켜봤다'는 증거입니다." },
          { text: "\"새 학원 정보를 더 수집하자. 뭘 하는지 알아야 대응하지.\"", score: 1, insight: "경쟁사 분석도 필요하지만, 에너지의 80%는 내부 강점에 써야 합니다." },
          { text: "\"체험 가본 학부모는 어차피 마음이 떠난 거니까, 신규 유입에 집중하자.\"", score: 0, insight: "기존 학부모를 포기하는 것은 최악입니다. 이탈 방어가 신규 유입보다 5배 효율적입니다." },
        ]
      }
    ]
  }
];
```

**UI 구현 요구사항**:
- 좌측(NPC)과 우측(사용자 선택) 채팅 버블
- 선택지 클릭 시 결과 인사이트 카드가 슬라이드업
- 점수에 따라 버블 색상 변화 (녹색 3점, 노랑 1점, 빨강 0점)
- 시나리오 완료 시 총점 + "당신의 상담 스타일" 분석

---

#### 3-3. 🧩 패턴 매칭 게임 (`PatternMatchActivity.jsx`)

**형식**: 좌측 "상황 카드" + 우측 "대응 카드" → 클릭으로 매칭 (드래그 대신 클릭 매칭)  

```javascript
const PATTERN_CARDS = [
  {
    situations: [
      { id: "s1", text: "신규 등록이 급감", icon: "📉" },
      { id: "s2", text: "핵심 강사가 퇴사", icon: "👋" },
      { id: "s3", text: "학부모 불만 폭주", icon: "😤" },
      { id: "s4", text: "학생이 갑자기 성적 하락", icon: "📊" },
      { id: "s5", text: "경쟁 학원이 오픈", icon: "🏢" },
      { id: "s6", text: "여름특강 미달", icon: "☀️" },
    ],
    responses: [
      { id: "r1", text: "기존 학부모 1:1 전화 상담", icon: "📱" },
      { id: "r2", text: "강사 코어팀 긴급 회의", icon: "🤝" },
      { id: "r3", text: "불만 학부모 개별 면담", icon: "☕" },
      { id: "r4", text: "학생 가정환경 파악", icon: "🏠" },
      { id: "r5", text: "우리 학원 고유 강점 어필", icon: "💎" },
      { id: "r6", text: "맞춤형 소규모 반 개설", icon: "👥" },
    ]
  }
];
```

**핵심**: 정답이 없는 매칭 → 매칭 후 "왜 이 조합?" 서술 입력  
**UI**: 좌우 카드 영역, 연결선 애니메이션, 매칭 완료 시 인사이트 입력 모달

---

### Phase 4: 최종 결과 리포트 (`ResultReport.jsx`)

모든 활동 완료 후 표시되는 종합 리포트:

1. **암묵지 프로필 카드** (카드 형태, 공유 가능)
   - 이름, 경력, 레벨, 총 XP
   - 발견된 암묵지 영역 레이더 차트 (5개 축: 상담, 교수법, 경영, 위기관리, 리더십)
   - 핵심 암묵지 Top 3 요약

2. **AI 프롬프트 팩** (자동 생성)
   - 사용자 답변에서 키워드 추출 → 3~5개 프롬프트 자동 조합
   - 복사 버튼으로 즉시 ChatGPT/Claude에 붙여넣기 가능

3. **SECI 매핑** (시각화)
   - S(공유화): 갤러리 워크에서 공유한 것
   - E(표출화): 위기/전수에서 말로 표현한 것
   - C(연결화): AI 프롬프트로 변환한 것
   - I(내면화): 퀴즈/역할극에서 체화된 것

---

## 🎨 DESIGN SYSTEM — 디자인 사양

### 색상 팔레트
```css
:root {
  --bg-primary: #0B1120;
  --bg-card: rgba(255, 255, 255, 0.03);
  --bg-card-hover: rgba(255, 255, 255, 0.06);
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  --accent-green: #10B981;
  --accent-indigo: #6366F1;
  --accent-amber: #F59E0B;
  --accent-pink: #EC4899;
  --accent-purple: #8B5CF6;
  --accent-teal: #14B8A6;
  --accent-red: #EF4444;
  --glass: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.08);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

### 타이포그래피
- 한국어: `'Noto Sans KR', sans-serif`
- 코드/숫자: `'JetBrains Mono', monospace`
- Font import via Google Fonts CDN

### 애니메이션
- `fadeSlideUp`: 컴포넌트 진입 (opacity + translateY)
- `float`: 배경 GlowOrb 부유
- `pulse`: XP 획득 시 숫자 맥동
- `shake`: 오답 시 카드 흔들림
- `confetti`: 레벨업 시 폭죽
- `slideUp`: 인사이트 카드 아래에서 올라옴

### 반응형
- Desktop: max-width 800px 중앙 정렬 (기존 유지)
- Tablet: 2열 그리드 → 2열 유지
- Mobile (< 640px): 1열 그리드, 패딩 축소

---

## ⚠️ CONSTRAINTS — 제약 조건

1. **외부 API 호출 금지** — 100% 클라이언트사이드, 오프라인 동작 가능
2. **TailwindCSS 사용 금지** — 바닐라 CSS만 사용
3. **localStorage만 사용** — 별도 백엔드/DB 없음
4. **한국어 UI** — 모든 텍스트 한국어, 코드 변수명만 영어
5. **기존 6개 활동 반드시 보존** — 삭제/변경 없이 확장만
6. **접근성**: 모든 인터랙티브 요소에 적절한 aria-label
7. **성능**: 60fps 애니메이션, CSS transform/opacity 위주

---

## 🌍 CROSS-DOMAIN RESEARCH — 타 분야 암묵지 발굴 기법 적용

> 간호학, 군사학, 요리 분야의 검증된 암묵지 추출 기법을 학원 교육에 적용

### Octalysis 8 Core Drives 매핑

| Core Drive | 설명 | 앱 내 적용 |
|---|---|---|
| ① Epic Meaning | 소명감 | "당신의 20년이 후배를 바꿉니다" |
| ② Accomplishment | 성취감 | XP, 레벨, 뱃지 |
| ③ Creativity | 창의적 표현 | 자유 서술, 프롬프트 작성 |
| ④ Ownership | 소유감 | 나만의 암묵지 카드 컬렉션 |
| ⑤ Social Influence | 사회적 비교 | 갤러리 워크, 리더보드 |
| ⑥ Scarcity | 희소 보상 | 히든 뱃지, 시간 제한 퀴즈 |
| ⑦ Unpredictability | 예측 불가 | 랜덤 시나리오, 미스터리 카드 |
| ⑧ Loss Avoidance | 손실 회피 | 스트릭 유지 |

---

### Phase 5: 크로스도메인 신규 활동 4가지 (추가)

#### 5-1. 🎯 감각 캘리브레이션 (`SensoryActivity.jsx`)
**출처**: 간호학 — 숙련 간호사가 환자 표정만 보고 상태를 감지하는 비언어적 직관  
**형식**: 카드 기반 시나리오 판단 (텍스트 카드 + 직감 판단)

```javascript
const SENSORY_CARDS = [
  {
    type: "text_message",
    content: "원장님, 혹시 시간 되실 때 한번 뵐 수 있을까요? 지훈이 관련해서요.",
    question: "이 문자의 긴급도를 직감으로 판단하세요",
    scale: ["🟢 일상적", "🟡 약간 긴장", "🟠 주의 필요", "🔴 긴급"],
    expertAnswer: 2,
    insight: "\"혹시 시간 되실 때\"는 겉으로는 여유 있지만, 학부모가 먼저 연락한다는 것은 이미 고민이 쌓였다는 신호. 베테랑 원장은 이 톤에서 '불만 축적'을 읽습니다."
  },
  {
    type: "student_behavior",
    content: "초등 4학년 민지가 지난 2주간: 숙제 완료율 90%→50%, 쉬는 시간에 혼자 앉아있음, 성적 변화 없음",
    question: "가장 먼저 확인해야 할 것은?",
    options: ["성적 추이", "가정환경 변화", "친구 관계", "건강 상태"],
    expertAnswer: 2,
    insight: "'성적은 아직 안 떨어졌는데 행동이 바뀐다' — 이것은 선행 지표입니다. 12년 경력 원장들은 성적보다 행동 변화를 먼저 봅니다."
  },
  {
    type: "class_observation",
    content: "수업 중 교실 밖에서: 학생들 웃음소리가 많음, 강사 목소리 톤이 높음, 책상 의자 소리 잦음",
    question: "이 수업의 상태 판단?",
    options: ["좋은 수업 — 활기참", "주의 필요 — 통제력 저하", "판단 보류 — 더 관찰 필요"],
    expertAnswer: 1,
    insight: "'웃음 + 높은 톤 + 의자 소리' 조합은 흥분 상태이지 몰입이 아닙니다. 좋은 수업의 소리는 적절한 정적과 집중된 토론의 교차입니다."
  },
  {
    type: "parent_face",
    content: "설명회 날, 한 학부모가 들어오면서: 눈맞춤 회피, 팔짱, 자리에 앉자마자 핸드폰 확인",
    question: "이 학부모의 현재 상태 예측?",
    options: ["관심 없음 — 의무적 참석", "불만 축적 — 따질 준비", "다른 곳과 비교 중", "개인 사정이 있음"],
    expertAnswer: 1,
    insight: "바디랭귀지 3종 세트(눈맞춤 회피 + 방어 자세 + 주의 분산)는 '이미 마음이 떠나있다'는 강한 신호. 설명회 끝나고 1:1 접근이 필요합니다."
  },
];
```

**UI**: 카드 플립 + 직감 판단 → 전문가 평균과 비교 → "당신의 감각은 상위 X%"  
**XP**: 40 XP + 전문가 일치 보너스 20 XP

#### 5-2. 📖 Before → After 스토리텔링 (`StoryActivity.jsx`)
**출처**: 군사학 CDM + 간호학 디브리핑 — 과거 판단 vs 현재 판단 대비를 통한 성장 가시화

**구조**:
1. 상황 카드 제시: "첫 학부모 항의 전화를 받았던 날을 떠올려보세요"
2. **1년차의 나**: 그때 어떻게 대응했나요? (자유 서술)
3. **지금의 나**: 같은 상황이면 지금은 어떻게 할까요? (자유 서술)
4. **AI 비교 분석**: 두 답변의 차이를 시각화 → "성장한 암묵지 영역" 표시

```javascript
const STORY_PROMPTS = [
  { title: "첫 학부모 항의", icon: "📱", situation: "학부모가 처음으로 화를 내며 전화를 걸어왔던 그때" },
  { title: "첫 강사 면접", icon: "🤝", situation: "처음 강사를 직접 면접하고 채용 결정을 내렸던 그때" },
  { title: "첫 퇴원 위기", icon: "💔", situation: "핵심 학생이 처음으로 퇴원 의사를 밝혔던 그때" },
  { title: "첫 경쟁 위기", icon: "⚔️", situation: "근처에 경쟁 학원이 처음 생겼을 때" },
];
```

**XP**: 60 XP (두 답변 모두 작성 시)

#### 5-3. 🧪 도제식 시뮬레이션 (`ApprenticeActivity.jsx`)
**출처**: 요리의 Niteni(관찰) → Nirokke(모방) → Nambahi(자기화) 3단계

**3단계 플로우**:
1. **관찰(Niteni)**: 베테랑 원장의 학부모 상담 스크립트를 읽음
2. **모방(Nirokke)**: 같은 상황에서 자기 방식으로 응답 작성
3. **자기화(Nambahi)**: "당신 방식이 베테랑과 다른 점은?" 비교 + "왜?"

```javascript
const APPRENTICE_SCRIPTS = [
  {
    title: "레벨테스트 결과 상담",
    veteran: "\"어머니, 철수가 문법은 이미 학년 수준을 넘겼어요. 다만 독해에서 추론하는 부분이 약한데, 이건 연습량 문제라 3개월이면 충분히 따라잡습니다. 여기 제가 만든 맞춤 플랜이에요.\"",
    situation: "레벨테스트 결과 문법 85점, 독해 60점인 학생의 어머니가 상담에 왔습니다.",
    analysisPoints: ["강점 먼저 언급했나?", "약점을 해결 가능한 것으로 프레이밍했나?", "구체적 기간과 계획을 제시했나?"]
  },
  {
    title: "퇴원 방어 상담",
    veteran: "\"어머니, 저도 정직하게 말씀드릴게요. 수아가 지난 2개월간 힘들어한 건 사실입니다. 그런데 지난 주부터 변화가 보이기 시작했어요. 여기 보세요, 이 숙제에서 처음으로 스스로 문장을 만들었습니다. 지금 멈추시면 이 작은 불꽃이 꺼집니다.\"",
    situation: "3개월 다닌 학생의 어머니가 '성과가 안 보여서 다른 학원으로 옮기려 한다'고 말합니다.",
    analysisPoints: ["솔직함으로 시작했나?", "구체적 성장 증거를 보여줬나?", "감정적 동기를 건드렸나?"]
  },
];
```

**XP**: 50 XP (3단계 모두 완료 시)

#### 5-4. 🗺️ 지식 고고학 (`ArchaeologyActivity.jsx`)
**출처**: Knowledge Mapping + CTA(Cognitive Task Analysis)

**형식**: 역추적 트리 — 현재의 노하우를 시간순으로 거슬러 올라감

```javascript
const ARCHAEOLOGY_PROMPTS = [
  { depth: 0, q: "당신이 가장 자신 있는 학원 운영 노하우 하나를 적어주세요" },
  { depth: 1, q: "이 노하우를 처음 깨달은 건 언제, 어떤 상황이었나요?" },
  { depth: 2, q: "그 깨달음의 계기가 된 실패나 사건이 있었나요?" },
  { depth: 3, q: "그 실패 전에는 어떻게 하고 있었나요?" },
  { depth: 4, q: "지금 돌아보면, 그때의 실패가 없었다면 이 노하우를 알았을까요?" },
];
```

**UI**: 타임라인 역추적 시각화 (현재 → 과거로 거슬러 올라가는 수직 타임라인)  
  - 각 depth에서 입력한 답변이 노드로 표시
  - 최종 시각화: "경험의 지질층" — 하나의 암묵지가 몇 겹의 경험 위에 쌓였는지 보여줌  
**XP**: 70 XP

---

## ✅ DEFINITION OF DONE

- [ ] `npm run dev`로 로컬 서버 구동 시 정상 작동
- [ ] **13개 활동** 모두 진입/완료 가능 (기존 6 + 신규 7)
- [ ] XP 획득 → 레벨업 → 뱃지 해금 플로우 정상 작동
- [ ] 스피드 퀴즈 타이머 + 콤보 시스템 작동
- [ ] 역할극 대화 분기 + 점수 시스템 작동
- [ ] 패턴 매칭 클릭 + 서술 입력 작동
- [ ] 감각 캘리브레이션 카드 판단 + 전문가 비교
- [ ] Before/After 스토리텔링 + AI 비교
- [ ] 도제식 3단계(관찰→모방→자기화) 플로우
- [ ] 지식 고고학 역추적 타임라인 시각화
- [ ] 모바일 375px 뷰포트에서 깨지지 않음
- [ ] 결과 리포트 + AI 프롬프트 자동 생성 작동
- [ ] 모든 데이터 localStorage에 저장/복원
