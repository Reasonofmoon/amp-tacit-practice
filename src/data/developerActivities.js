export const DEV_ACTIVITIES = [
  // --- Layer A: 기초 진단 (4개) ---
  {
    id: 'dev_quiz',
    title: '프롬프트 엔지니어링 (Prompting)',
    subtitle: '에러 퀴즈와 디버깅을 해결할 정확한 프롬프트를 설계합니다',
    icon: '💬',
    color: '#8B5CF6',
    time: '5분',
    axis: { debugging: 2, automation: 1 },
  },
  {
    id: 'dev_pattern',
    title: '자바스크립트 (JavaScript)',
    subtitle: '비동기 처리와 웹 프론트엔드 패턴들을 연결합니다',
    icon: '🟨',
    color: '#F59E0B',
    time: '5분',
    axis: { architecture: 1, optimization: 2 },
  },
  {
    id: 'dev_noticing',
    title: '파이썬 코드 (Python)',
    subtitle: '단서 포착 훈련을 통해 파이썬 스크립트 디버깅 감각을 기릅니다',
    icon: '🐍',
    color: '#10B981',
    time: '5분',
    axis: { debugging: 2, optimization: 1 },
  },
  {
    id: 'dev_autopilot',
    title: '앱스스크립트 (Apps Script)',
    subtitle: '백오피스 자동화를 위한 구글 워크스페이스 연동 패턴을 탐지합니다',
    icon: '⚙️',
    color: '#0EA5E9',
    time: '4분',
    axis: { automation: 2, architecture: 1 },
  },

  // --- Layer B: 심화 발굴 (4개) ---
  {
    id: 'dev_seci',
    title: '앱시트 (AppSheet)',
    subtitle: '로우코드 아키텍처를 시각화하여 팀원과 지식을 공유합니다',
    icon: '📊',
    color: '#6366F1',
    time: '5분',
    axis: { architecture: 2, automation: 1 },
  },
  {
    id: 'dev_timeline',
    title: '웹앱 (React / Next.js)',
    subtitle: '웹앱 프로젝트의 Vercel 배포 및 빌드 파이프라인(타임라인)을 구성합니다',
    icon: '🌐',
    color: '#14B8A6',
    time: '5분',
    axis: { architecture: 2, optimization: 1 },
  },
  {
    id: 'dev_transfer',
    title: '모바일 앱 (iOS / Android Native)',
    subtitle: 'Expo/React Native 환경의 네이티브 빌드 노하우를 전수합니다',
    icon: '📱',
    color: '#EC4899',
    time: '5분',
    axis: { architecture: 2, debugging: 1 },
  },
  {
    id: 'dev_crisis',
    title: '로컬 데스크톱 앱 (Local App)',
    subtitle: '로컬 환경 및 패키징(Electron/PyInstaller) 의존성 장애를 극복합니다',
    icon: '💻',
    color: '#F43F5E',
    time: '5분',
    axis: { crisis: 3, debugging: 1 },
  },

  // --- Layer C: 패턴 응용 (3개) ---
  {
    id: 'dev_roleplay',
    title: '클로드 코드 (Claude Code)',
    subtitle: 'CLI 환경에서 클로드 코드 에이전트를 오케스트레이션합니다',
    icon: '⌨️',
    color: '#F97316',
    time: '6분',
    axis: { automation: 2, architecture: 1 },
  },
  {
    id: 'dev_gallery',
    title: '오픈소스 에이전트 & 오픈클로',
    subtitle: '서로의 오픈소스 에이전트 적용 사례와 오픈클로 활용법을 나눕니다',
    icon: '🤖',
    color: '#22C55E',
    time: '3분',
    axis: { automation: 1, optimization: 1 },
  },
  {
    id: 'dev_cdm',
    title: '에이전트 스킬스 (Agent Skills)',
    subtitle: '문제 해결 과정을 복기하여 재사용 가능한 에이전트 스킬로 제작합니다',
    icon: '🛠️',
    color: '#D946EF',
    time: '15분',
    axis: { crisis: 2, architecture: 2, automation: 2 },
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
