export const DEV_PATTERN_CARDS = [
  {
    situations: [
      { id: 's1', text: '오래된 React 앱 의존성 파악', icon: '🔍' },
      { id: 's2', text: '프롬프트 비대화/AI 망각 현상', icon: '🧠' },
      { id: 's3', text: '10개 파일에 걸친 반복 단순 작업', icon: '🔁' },
      { id: 's4', text: 'AI가 폐기된 구버전 문법 사용', icon: '👴' },
      { id: 's5', text: '무한 루프 에러 (Claude Code 등)', icon: '🚨' },
      { id: 's6', text: '신규 구조(아키텍처) 통합 요구', icon: '🏗️' },
    ],
    responses: [
      { id: 'r1', text: 'Codebase 스캔 및 Search 에이전트 호출', icon: '🔎' },
      { id: 'r2', text: 'RAG 컨텍스트(Docs) 명시적 강제 주입', icon: '📚' },
      { id: 'r3', text: '정규식/Bash Script 작성 지시로 우회', icon: '⚡' },
      { id: 'r4', text: '공통 지침 분리 후 릴레이 핸드오프', icon: '🤝' },
      { id: 'r5', text: '프로세스 정지 후 가설/맥락 교정', icon: '🛑' },
      { id: 'r6', text: '마크다운 스펙(.md) 작성 후 구현 지시', icon: '📝' },
    ],
  },
];
