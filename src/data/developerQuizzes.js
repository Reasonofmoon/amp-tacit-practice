export const DEV_QUIZZES = [
  {
    id: 'q1_infinite_build',
    scenario: "Vercel 배포 시 'Build Failed: Out of Memory'가 터졌다. 가장 먼저 할 30초 판단은?",
    options: [
      { id: 'a', text: '과거 성공한 커밋으로 롤백 후 원인 찾기', isCorrect: true, insight: '우선 프로덕션을 정상화한 후 디버깅하는 워크플로우를 선택했습니다.' },
      { id: 'b', text: '로컬에서 npm run build 돌려보기', isCorrect: false, insight: '당연히 해봐야 하지만, 운영서버가 다운된 상태라면 롤백이 먼저입니다.' },
      { id: 'c', text: 'Vercel 플랜을 Pro로 업그레이드', isCorrect: false, insight: '근본 원인(메모리 누수나 무거운 청크)을 해결하지 않은 하수의 선택입니다.' }
    ]
  },
  {
    id: 'q2_agent_hallucination',
    scenario: "AI 코딩 에이전트(예: Claude)가 있지도 않은 API 메서드를 계속 호출하며 고집을 부린다.",
    options: [
      { id: 'a', text: '"이 메서드는 없어. 다시 짜줘"라고 반복 프롬프팅', isCorrect: false, insight: '과거 컨텍스트가 꼬인 상태에서는 계속 잘못된 기억을 바탕으로 대답할 확률이 매우 높습니다.' },
      { id: 'b', text: '공식 API 문서를 curl이나 mcp로 긁어서 프롬프트 상단에 박아버린다.', isCorrect: true, insight: 'RAG 패턴: AI의 환각을 끊으려면 "Ground Truth(정답 타겟)" 데이터로 컨텍스트를 덮어씌워야 합니다.' },
      { id: 'c', text: '에이전트를 끄고 내가 직접 코딩한다.', isCorrect: false, insight: '가장 빠를 수 있으나 에이전트 협업의 암묵지(디버깅)는 아닙니다.' }
    ]
  },
  {
    id: 'q3_legacy_refactor',
    scenario: "클래스 컴포넌트로 짜인 1000줄짜리 레거시를 훅스(Hooks)로 리팩토링해야 한다. AI에게 지시할 첫 마디는?",
    options: [
      { id: 'a', text: '"이 코드 전체를 함수형 컴포넌트와 Hooks로 변환해줘."', isCorrect: false, insight: '한 번에 너무 큰 덩어리를 맡기면 논리적 오류나 UI 깨짐을 감지하기 어렵습니다.' },
      { id: 'b', text: '"코드의 상태(state) 목록과 Effect 의존성 배열을 먼저 정리해서 마크다운으로 추출해줘."', isCorrect: true, insight: '설계(Design)와 구현(Implementation)을 분리하여 AI가 구조를 먼저 파악하도록 유도하는 아키텍트의 지시입니다.' },
      { id: 'c', text: '"이 중 useEffect로 바꿀 수 있는 부분만 찾아줘."', isCorrect: false, insight: '부분 모듈화는 좋으나 전체 구조의 의존성을 고려하지 않으면 버그가 생깁니다.' }
    ]
  }
];
