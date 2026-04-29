// "학원 운영 매뉴얼"의 8개 챕터.
// 각 챕터의 활동 ID는 director(원장) 기준 canonical id만 적는다.
// dev_* 미러 활동은 chapterProgress 계산에서 자동으로 그룹화된다.
export const CHAPTERS = [
  {
    id: 'ch1',
    n: 1,
    title: '첫인상 & 입학 상담',
    icon: '🚪',
    summary: '신규 학부모/학생을 30초 안에 사로잡는 판단과 첫 멘트.',
    activities: ['timeline', 'demo_readmaster', 'demo_level_test_proto', 'demo_sign_design', 'demo_writing_correction'],
  },
  {
    id: 'ch2',
    n: 2,
    title: '학부모 응대',
    icon: '🤝',
    summary: '전화·상담·항의 상황에서의 톤·순서·금기.',
    activities: ['roleplay'],
  },
  {
    id: 'ch3',
    n: 3,
    title: '수업 운영 & 학생 관찰',
    icon: '👀',
    summary: '교실 안에서 잡아내는 비언어 단서와 즉시 행동.',
    activities: ['noticing', 'autopilot'],
  },
  {
    id: 'ch4',
    n: 4,
    title: '위기 관리',
    icon: '⚡',
    summary: '이탈·항의·강사 퇴사 같은 위기 상황의 대응 패턴.',
    activities: ['crisis', 'pattern'],
  },
  {
    id: 'ch5',
    n: 5,
    title: '강사 양성 & SOP',
    icon: '🎓',
    summary: '신입을 빠르게 자기화시키는 멘토링 카드와 표준작업절차.',
    activities: ['transfer', 'demo_academy_os'],
  },
  {
    id: 'ch6',
    n: 6,
    title: '자동화 & 시스템',
    icon: '⚙️',
    summary: '직관을 시스템·스킬·앱으로 변환해 24시간 작동하게 만들기.',
    activities: ['seci', 'auto_setup', 'auto_script', 'auto_property', 'auto_code', 'auto_trigger', 'demo_app_factory', 'demo_gidoboard'],
  },
  {
    id: 'ch7',
    n: 7,
    title: '의사결정 노하우',
    icon: '🃏',
    summary: '베테랑이 1초 안에 내리는 판단의 단서·해석·근거·금기.',
    activities: ['quiz', 'cdm'],
  },
  {
    id: 'ch8',
    n: 8,
    title: '학원 철학 & 정체성',
    icon: '🏛️',
    summary: '학원만의 어휘·사훈·세계관 — 강사 매뉴얼 첫 페이지.',
    activities: ['gallery', 'demo_showcase_intro', 'demo_sabo_philosophy', 'demo_moonlang', 'demo_ontology', 'demo_knot', 'demo_storyboard_gen', 'demo_bluel', 'demo_librainy'],
  },
];
