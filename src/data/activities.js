export const ACTIVITIES = [
  // --- Layer A: 기초 진단 (4개) ---
  {
    id: 'timeline',
    title: '나의 1년 타임라인',
    subtitle: '학원 운영의 12개월을 돌아보며 숨겨진 패턴을 발견합니다',
    icon: '🗓️',
    color: '#10B981',
    time: '5분',
    axis: { management: 3, leadership: 1 },
  },
  {
    id: 'autopilot',
    title: '자동조종 탐지기',
    subtitle: '무의식적으로 하고 있는 것들, 그것이 암묵지입니다',
    icon: '🧭',
    color: '#6366F1',
    time: '4분',
    axis: { counseling: 1, teaching: 1, leadership: 1 },
  },
  {
    id: 'quiz',
    title: '스피드 퀴즈',
    subtitle: '30초 안에 베테랑의 반응을 고르고 암묵지 인사이트를 회수합니다',
    icon: '⏱️',
    color: '#22C55E',
    time: '6분',
    axis: { counseling: 2, teaching: 2, management: 1 },
  },
  {
    id: 'noticing',
    title: '전문가적 보기 훈련',
    subtitle: '관찰, 해석, 행동을 분리하여 현장의 단서를 포착하는 감각을 기릅니다',
    icon: '👁️',
    color: '#14B8A6',
    time: '5분',
    axis: { counseling: 2, leadership: 1 },
  },

  // --- Layer B: 심화 발굴 (4개) ---
  {
    id: 'pattern',
    title: '패턴 매칭 게임',
    subtitle: '상황과 대응을 연결하며 당신만의 판단 프레임을 언어화합니다',
    icon: '🧩',
    color: '#06B6D4',
    time: '5분',
    axis: { management: 2, crisis: 1, leadership: 1 },
  },
  {
    id: 'transfer',
    title: '신입에게 전수하기',
    subtitle: '가르칠 때 비로소 보이는 나만의 현장 노하우를 정리합니다',
    icon: '🎓',
    color: '#EC4899',
    time: '5분',
    axis: { teaching: 2, leadership: 2 },
  },
  {
    id: 'crisis',
    title: '위기의 순간 리플레이',
    subtitle: '위기 상황에서 내린 즉각적 판단 속 숨은 전문성을 복기합니다',
    icon: '⚡',
    color: '#F59E0B',
    time: '5분',
    axis: { counseling: 1, crisis: 3, leadership: 1 },
  },
  {
    id: 'roleplay',
    title: '역할극 시뮬레이션',
    subtitle: '실제 상담과 리더십 상황에서 당신의 선택 패턴을 점검합니다',
    icon: '🎭',
    color: '#F97316',
    time: '6분',
    axis: { counseling: 2, crisis: 1, leadership: 2 },
  },

  // --- Layer C: 패턴 응용 (3개) ---
  {
    id: 'cdm',
    title: '심층 CDM 프로브',
    subtitle: 'Critical Decision Method로 당신의 결정 지점을 파고들어 카드화합니다',
    icon: '🔍',
    color: '#8B5CF6',
    time: '15분',
    axis: { crisis: 2, leadership: 2 },
  },
  {
    id: 'gallery',
    title: '암묵지 갤러리 워크',
    subtitle: '서로의 발견을 공유하고 다른 원장의 통찰에서 영감을 얻습니다',
    icon: '🖼️',
    color: '#0EA5E9',
    time: '3분',
    axis: { counseling: 1, leadership: 1 },
  },
  {
    id: 'seci',
    title: 'SECI 변환 실습',
    subtitle: '발견한 암묵지를 AI 프롬프트로 전환해 재사용 가능하게 만듭니다',
    icon: '🔮',
    color: '#A855F7',
    time: '5분',
    axis: { teaching: 1, management: 1, leadership: 1 },
  },
];

export const AXES = [
  { key: 'counseling', label: '상담' },
  { key: 'teaching', label: '교수법' },
  { key: 'management', label: '경영' },
  { key: 'crisis', label: '위기관리' },
  { key: 'leadership', label: '리더십' },
];

export const HOME_STATS = {
  totalActivities: ACTIVITIES.length,
  totalTime: '44분',
};

export function getActivityById(activityId) {
  return ACTIVITIES.find((activity) => activity.id === activityId);
}
