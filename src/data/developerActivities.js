export const DEV_ACTIVITIES = [
  // --- Layer A: 기초 진단 (4개) ---
  {
    id: 'dev_timeline',
    title: '나의 개발 파이프라인 타임라인',
    subtitle: '프로젝트 기획부터 배포까지의 여정을 돌아보며 숨겨진 패턴을 발견합니다',
    icon: '🗓️',
    color: '#10B981',
    time: '5분',
    axis: { architecture: 3, automation: 1 },
  },
  {
    id: 'dev_autopilot',
    title: '개발조종 탐지기',
    subtitle: '무의식적으로 치는 명령어와 디버깅 패턴들, 그것이 암묵지입니다',
    icon: '🧭',
    color: '#6366F1',
    time: '4분',
    axis: { debugging: 1, architecture: 1, automation: 1 },
  },
  {
    id: 'dev_quiz',
    title: '스피드 에러 퀴즈',
    subtitle: '30초 안에 베테랑 개발자의 디버깅 판단을 고르고 인사이트를 회수합니다',
    icon: '⏱️',
    color: '#22C55E',
    time: '6분',
    axis: { debugging: 2, optimization: 2, architecture: 1 },
  },
  {
    id: 'dev_noticing',
    title: '전문가적 코드 보기 훈련',
    subtitle: '에러 로그와 코드 스멜에서 단서를 포착하는 감각을 기릅니다',
    icon: '👁️',
    color: '#14B8A6',
    time: '5분',
    axis: { debugging: 2, optimization: 1 },
  },

  // --- Layer B: 심화 발굴 (4개) ---
  {
    id: 'dev_pattern',
    title: '패턴 매칭 게임 (도구 선택)',
    subtitle: '상황에 맞는 에이전트와 워크플로우를 질의응답으로 연결합니다',
    icon: '🧩',
    color: '#06B6D4',
    time: '5분',
    axis: { automation: 2, architecture: 1, optimization: 1 },
  },
  {
    id: 'dev_transfer',
    title: '신입 AI 에이전트에게 전수하기',
    subtitle: 'AI에게 작업을 지시할 때 비로소 보이는 나만의 코딩 노하우를 정리합니다',
    icon: '🎓',
    color: '#EC4899',
    time: '5분',
    axis: { automation: 2, architecture: 2 },
  },
  {
    id: 'dev_crisis',
    title: '배포 위기의 순간 리플레이',
    subtitle: '프로덕션 에러 상황에서 내린 즉각적 판단 속 숨은 전문성을 복기합니다',
    icon: '⚡',
    color: '#F59E0B',
    time: '5분',
    axis: { debugging: 1, crisis: 3, architecture: 1 },
  },
  {
    id: 'dev_roleplay',
    title: '아키텍처 설계 시뮬레이션',
    subtitle: '실제 시스템 설계 상황에서 당신의 기술 스택 선택 패턴을 점검합니다',
    icon: '🎭',
    color: '#F97316',
    time: '6분',
    axis: { architecture: 2, crisis: 1, automation: 2 },
  },

  // --- Layer C: 패턴 응용 (3개) ---
  {
    id: 'dev_cdm',
    title: '심층 디버깅 CDM 프로브',
    subtitle: 'Critical Decision Method로 당신의 트러블슈팅 지점을 파고들어 카드화합니다',
    icon: '🔍',
    color: '#8B5CF6',
    time: '15분',
    axis: { crisis: 2, architecture: 2 },
  },
  {
    id: 'dev_gallery',
    title: '보일러플레이트 갤러리 워크',
    subtitle: '서로의 모범 사례를 공유하고 다른 개발자의 통찰에서 영감을 얻습니다',
    icon: '🖼️',
    color: '#0EA5E9',
    time: '3분',
    axis: { architecture: 1, automation: 1 },
  },
  {
    id: 'dev_seci',
    title: '프롬프트 컴파일러 실습',
    subtitle: '발견한 개발 암묵지를 AI 프롬프트(SKILL/워크플로우)로 전환해 재사용 가능하게 만듭니다',
    icon: '🔮',
    color: '#A855F7',
    time: '5분',
    axis: { automation: 2, architecture: 1 },
  },
];

export const DEV_AXES = [
  { key: 'debugging', label: '디버깅' },
  { key: 'architecture', label: '아키텍처' },
  { key: 'automation', label: '자동화/AI' },
  { key: 'crisis', label: '장애대응' },
  { key: 'optimization', label: '최적화' },
];

export function getDevActivityById(activityId) {
  return DEV_ACTIVITIES.find((activity) => activity.id === activityId);
}
