export const DEV_QUIZZES = [
  {
    id: 'q1_agent_hallucination',
    scenario: "AI 코딩 에이전트(예: Claude)가 있지도 않은 API 메서드를 계속 호출하며 고집을 부린다.",
    options: [
      { id: 'a', text: '"이 메서드는 없어. 다시 짜줘"라고 반복 프롬프팅', isCorrect: false, insight: '과거 컨텍스트가 꼬인 상태에서는 계속 잘못된 기억을 바탕으로 대답할 확률이 매우 높습니다.' },
      { id: 'b', text: '방금 발생한 에러 로그 전체를 복사해서 "이 오류를 고치기 위해 네 과정을 되짚어봐"라고 지시한다.', isCorrect: true, insight: 'AI의 환각을 끊으려면 객관적인 에러 로그(Ground Truth)를 주입하고 메타인지를 강제해야 합니다.' },
      { id: 'c', text: '에이전트를 끄고 내가 직접 코딩한다.', isCorrect: false, insight: '가장 빠를 수 있으나 에이전트 협업의 암묵지(디버깅)는 아닙니다.' }
    ]
  },
  {
    id: 'q2_legacy_refactor',
    scenario: "1000줄짜리 레거시 컴포넌트를 리팩토링해야 한다. AI에게 지시할 첫 마디는?",
    options: [
      { id: 'a', text: '"이 코드 전체를 최신 문법으로 리팩토링해줘."', isCorrect: false, insight: '한 번에 너무 큰 덩어리를 맡기면 논리적 오류나 UI 깨짐을 감지하기 어렵습니다.' },
      { id: 'b', text: '"코드의 상태(state) 목록과 의존성 배열을 먼저 정리해서 마크다운으로 추출해줘."', isCorrect: true, insight: '설계(Design)와 구현(Implementation)을 분리하여 AI가 구조를 먼저 파악하도록 유도하는 아키텍트의 프롬프팅입니다.' },
      { id: 'c', text: '"이 중 useEffect로 바꿀 수 있는 부분만 찾아줘."', isCorrect: false, insight: '부분 모듈화는 좋으나 전체 구조의 의존성을 고려하지 않으면 버그가 생깁니다.' }
    ]
  },
  {
    id: 'q3_context_window',
    scenario: "여러 개의 파일을 넘나드는 버그를 디버깅할 때, 효과적인 프롬프팅 전략은?",
    options: [
      { id: 'a', text: '모든 소스 코드를 파일명 구분 없이 하나의 텍스트로 합쳐서 던진다.', isCorrect: false, insight: 'AI가 파일 간의 경계를 잃고 변수명을 혼동할 위험을 높입니다.' },
      { id: 'b', text: '필요한 함수만 발췌하지 말고 무조건 전체 프로젝트를 압축해서 올린다.', isCorrect: false, insight: '컨텍스트 윈도우 낭비이며, 주의력(Attention) 분산으로 답변 퀄리티가 떨어집니다.' },
      { id: 'c', text: '핵심 파일의 경로와 내용을 명시하고 시스템의 데이터 흐름(Data Flow)을 우선 요약하게 한다.', isCorrect: true, insight: '에이전트에게 전체 맵을 그리게 한 뒤, 특정 파일을 찾아보게 만드는 것이 가장 정확합니다.' }
    ]
  }
];
