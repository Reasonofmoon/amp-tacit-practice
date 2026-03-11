export const DEV_ROLEPLAY_SCENARIOS = [
  {
    id: 'agent_handoff',
    title: '에이전트 핸드오프 설계',
    icon: '🤖',
    desc: '다중 에이전트(CX, SY, AG) 간의 컨텍스트 전달 상황',
    steps: [
      {
        npc: '기획 요건',
        message: '"현재 시스템의 문제를 분석하고(CX), 아키텍처를 설계한 뒤(SY), 실제 코드를 작성(AG)해야 합니다. 이 3단계를 어떻게 연결하시겠습니까?"',
        choices: [
          { text: '[단일 에이전트에 모두 프롬프팅] "너는 기획자이자 설계자이자 개발자야. 문제 분석부터 코드 작성까지 한 번에 해줘."', score: 0, insight: '단일 컨텍스트가 폭발하여 환각(Hallucination) 리스크가 극대화됩니다.' },
          { text: '[마크다운 아티팩트 기반 핸드오프] "CX가 분석 결과를 ARTIFACT.md로 저장하고, SY가 그것을 읽어 DESIGN.md를 만들면, AG가 DESIGN.md를 읽고 코딩하게 합니다."', score: 3, insight: '명시적 파일시스템을 Bus(전달망)로 사용하는 베테랑의 다중 에이전트 워크플로우 설계입니다.' },
          { text: '[메모리 주입] "System Prompt에 세 에이전트의 페르소나를 모두 합쳐서 넣습니다."', score: 1, insight: '에이전트 간의 역할 경계가 모호해져 제대로 된 검증(Verify) 단계가 생략될 위험이 있습니다.' },
        ],
      },
    ],
  },
  {
    id: 'infinite_loop',
    title: '무한 루프 에러 디버깅',
    icon: '🚨',
    desc: 'Claude Code가 동일한 에러를 반복하며 무한 루프에 빠진 상황',
    steps: [
      {
        npc: '터미널 로그',
        message: '[터미널 시스템] "Attempt 14: Failed to run build command. Linter error persists in index.tsx... Retrying..."',
        choices: [
          { text: '[강제 종료 후 재실행] 터미널을 끄고 다시 Claude Code를 실행하여 동일한 프롬프트를 넣는다.', score: 0, insight: '근본 원인 파악 없이 맥락만 초기화시키는 초보적인 디버깅 방식입니다.' },
          { text: '[오류 무시 명령어] "--no-verify 또는 eslint-disable을 추가하여 강제로 푸시한다."', score: 1, insight: '당장의 루프는 벗어나지만 기술 부채를 유발하는 위험한 경계조건입니다.' },
          { text: '[정지 후 컨텍스트 점검] 프로세스를 일시정지하고, 최근 수정된 파일의 Diff와 Agent가 파악한 Rule(규칙)을 대조하여 잘못된 Instruction을 교정한다.', score: 3, insight: '현상을 관찰(Noticing)하고 에이전트의 "잘못된 내부 상태"를 가설링(Interpreting)하여 프롬프트를 수정하는 숙련된 행동입니다.' },
        ],
      },
    ],
  },
  {
    id: 'prompt_bloat',
    title: '프롬프트 비대화 방어',
    icon: '📝',
    desc: '새로운 기능을 추가할 때마다 프롬프트가 끝없이 길어지는 상황',
    steps: [
      {
        npc: '팀원 코드 리뷰',
        message: '"이 액티비티를 추가하려면 기존 시스템 프롬프트에 50줄짜리 JSON 구조 설명과 예외 처리 규칙 10개를 더 넣어야 할 것 같아요."',
        choices: [
          { text: '[그대로 추가] "네, AI가 정확히 하려면 어쩔 수 없죠. 그냥 다 붙여넣으세요."', score: 1, insight: 'Token 한도는 넘지 않겠지만, Attention이 분산되어 오히려 핵심 지시사항을 무시하게 됩니다.' },
          { text: '[구조적 분리 및 RAG 단서 제공] "공통 구조는 SKILL.md로 빼고, 프롬프트에는 \'이 작업은 [파일명] 스킬을 참고하세요\'라는 단서명령만 남깁시다."', score: 3, insight: '프롬프트를 "명령(Prompt)"과 "지식(Knowledge/Skill)"으로 분리하여 인지 부하를 줄이는 시니어의 구조적 접근성입니다.' },
          { text: '[기존 기능 삭제] "프롬프트가 너무 길어지면 안 되니 기존 기능 중 덜 중요한 옵션을 삭제합시다."', score: 0, insight: '비대화를 막으려다 제품의 기능성을 떨어뜨리는 수동적인 회피입니다.' },
        ],
      },
    ],
  },
];
