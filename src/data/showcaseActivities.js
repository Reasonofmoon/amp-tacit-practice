export const SHOWCASE_ACTIVITIES = [
  { 
    id: "demo_readmaster", 
    title: "1. ReadMaster 진단", 
    subtitle: "읽기 영역 초기 파악 도구 (Lv.1)", 
    icon: "📖", 
    color: "#10B981", 
    time: "3분", 
    difficulty: 1,
    techTags: ["React", "Vercel"],
    url: "https://read-master-academy.vercel.app/", 
    storyText: "학생의 읽기 능력을 초기 진단하여 맞춤형 교육의 첫 단추를 끼우는 원장님의 직관적 파악력",
    speakerNotes: "새 학생이 오면 레벨테스트 전에 이미 느낌이 온다 → 이것이 암묵지. 이 직관을 알고리즘으로 체계화해서 앱에 넣으면, 원장님이 안 계셔도 진단이 된다."
  },
  { 
    id: "demo_pettrip", 
    title: "2. Pet Trip 여행", 
    subtitle: "학습/진로 여정 시각화 (Lv.1)", 
    icon: "🐾", 
    color: "#3B82F6", 
    time: "3분", 
    difficulty: 1,
    techTags: ["React", "Animation", "Vercel"],
    url: "https://pet-trip.vercel.app/", 
    storyText: "학생들의 길고 복잡한 학습 여정을 직관적인 펫 트립으로 시각화하여 강력한 흥미를 유발하는 기획력",
    speakerNotes: "학부모 상담의 난제: '우리 애가 지금 어디쯤이에요?' → 학습 여정을 게임 지도처럼 시각화. 30분 설명이 30초로. 기술이 아니라 기획력이 핵심."
  },
  { 
    id: "demo_smartstart", 
    title: "3. SmartStart 유아", 
    subtitle: "초기 동기부여 기반 교육 (Lv.2)", 
    icon: "🐶", 
    color: "#F59E0B", 
    time: "4분", 
    difficulty: 2,
    techTags: ["React", "AI API", "Gamification"],
    url: "https://smartstart-korea.vercel.app/", 
    storyText: "영어 첫걸음을 떼는 어린 아이들에게 친근한 펫 마스코트로 강력한 학습 동기를 부여하는 교수법",
    speakerNotes: "유아·초등 저학년 핵심 = 동기부여. 스티커·별·캐릭터 도장이 게이미피케이션. 종이 한계 → 앱으로. AI API가 처음 등장하는 단계. API Key 연결만 추가."
  },
  { 
    id: "demo_ontology", 
    title: "4. Edu Ontology", 
    subtitle: "철학적 어휘 네트워크 (Lv.2)", 
    icon: "🌌", 
    color: "#8B5CF6", 
    time: "4분", 
    difficulty: 2,
    techTags: ["React", "Graph Viz", "Vercel"],
    url: "https://eduontology.vercel.app/vocab", 
    storyText: "단순한 암기를 넘어, 단어의 어원과 철학적 본질을 연결하여 깊이 있는 사고력을 확장시키는 에듀 온톨로지망",
    speakerNotes: "tragedy = 그리스어 tragos(염소) + oide(노래). 스토리가 있는 단어는 절대 잊지 않는다. 원장님이 머릿속으로 아시던 연결 고리를 시각적 그래프로 펼쳐놓은 것."
  },
  { 
    id: "demo_knot", 
    title: "5. Knot 노트 앱", 
    subtitle: "학습용 PKM 노트 앱 (Lv.3)", 
    icon: "🔗", 
    color: "#EC4899", 
    time: "5분", 
    difficulty: 3,
    techTags: ["React", "Graph DB", "PKM"],
    url: "https://knot-ebon.vercel.app/", 
    storyText: "파편화된 지식들을 유기적으로 연결하고 확장하여 나만의 지식 생태계를 구축하는 학습용 PKM 시스템",
    speakerNotes: "메모를 어디에 적어두십니까? 나중에 못 찾는 이유: 연결이 안 되어 있으니까. PKM = 메모가 섬이 아니라 대륙의 일부. 후임 선생님 인수인계 시 그래프만 보여주면 됨."
  },
  { 
    id: "demo_bluel", 
    title: "6. BlueL 플랫폼", 
    subtitle: "단계별 실습 학습 플랫폼 (Lv.3)", 
    icon: "🌊", 
    color: "#06B6D4", 
    time: "5분", 
    difficulty: 3,
    techTags: ["Next.js", "AI", "MECE"],
    url: "https://bluel-app.vercel.app/", 
    storyText: "강사의 수업을 정교하게 설계(Blueprint Lecture)하고, 인지적 부하 없이 MECE하게 실습하도록 이끄는 학습 환경",
    speakerNotes: "Blueprint Lecture = 청사진 수업. 좋은 수업은 학생이 직접 해보는 수업. 난이도 조절을 감으로 하는 것이 암묵지. 이 감각이 시스템이 되면 신입도 베테랑처럼 설계 가능."
  },
  { 
    id: "demo_librainy", 
    title: "7. Librainy 도서관", 
    subtitle: "영어도서관 학습 플랫폼 (Lv.4)", 
    icon: "🏰", 
    color: "#F43F5E", 
    time: "6분", 
    difficulty: 4,
    techTags: ["Next.js", "Supabase", "Gemini AI"],
    url: "https://librainy-platform.vercel.app/", 
    storyText: "방대한 원서와 독서 데이터를 한곳에 모아, 가장 체계적이고 몰입감 있는 영어 도서관 경험을 제공하는 에듀테크 생태계",
    speakerNotes: "500권 원서 중 이 학생에게 이 책 → 3초 판단. 20년이 걸린 눈. AR레벨+렉사일+관심사+독서패턴 종합. 기술이 어려운 게 아니라 어떤 데이터를 조합하면 좋은 대시보드가 되는지가 핵심."
  },
  { 
    id: "demo_moonlang", 
    title: "8. MoonLang 수익화", 
    subtitle: "제휴 코드 중개 수익 모델 (Lv.4)", 
    icon: "🚀", 
    color: "#14B8A6", 
    time: "6분", 
    difficulty: 4,
    techTags: ["Next.js", "SEO", "Impact.com"],
    url: "https://tools.moonlang.com/", 
    storyText: "단순한 정보 제공을 넘어, 유용한 AI 툴 정보와 레퍼럴 코드 사이의 중개를 통해 실제 비즈니스 수익 창출이 가능한지 검증하는 실험 모델",
    speakerNotes: "어떤 AI 도구가 진짜 쓸모있는지 아는 안목도 암묵지. 이 안목 자체를 비즈니스로. 교재 추천 사이트 + 제휴 링크 = 암묵지가 월 수입이 됨."
  },
];

// Level grouping for bridge slides
export const SHOWCASE_LEVELS = [
  { level: 1, label: "Level 1", title: "클릭 한 번으로 나만의 홈페이지", color: "#10B981", icon: "🟢", ids: ["demo_readmaster", "demo_pettrip"] },
  { level: 2, label: "Level 2", title: "AI API를 내 앱에 연결하기",    color: "#3B82F6", icon: "🔵", ids: ["demo_smartstart", "demo_ontology"] },
  { level: 3, label: "Level 3", title: "나만의 지식 도구 만들기",      color: "#A855F7", icon: "🟣", ids: ["demo_knot", "demo_bluel"] },
  { level: 4, label: "Level 4", title: "교육 생태계를 통째로 만들기",   color: "#EF4444", icon: "🔴", ids: ["demo_librainy", "demo_moonlang"] },
];
