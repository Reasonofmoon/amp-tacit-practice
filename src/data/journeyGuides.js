export const JOURNEY_GUIDES = {
  director: {
    headline: '원장님의 판단 패턴을 30초 안에 보여주는 시작점',
    summary: '가장 이해가 빠른 진입점부터 열고, 답변 하나가 바로 리포트 미리보기에 반영되도록 데모 동선을 압축했습니다.',
    ctaLabel: '원장 데모 시작',
    recommendedActivityId: 'quiz',
    quickSteps: [
      { title: '30초 퀴즈 열기', detail: '첫 반응 속 판단 패턴을 바로 회수합니다.' },
      { title: '첫 답변 남기기', detail: '직관이 문장으로 변하는 순간을 만듭니다.' },
      { title: '리포트 미리보기', detail: '방금 나온 문장이 즉시 결과 카드에 반영됩니다.' },
    ],
    demoOrder: [
      {
        activityId: 'quiz',
        label: '스피드 퀴즈',
        presenterLine: '정답보다 반응 속도가 중요합니다. 빠르게 고른 선택이 원장님의 실제 판단 규칙을 보여줍니다.',
        audienceOutcome: '첫 번째 실제 판단 문장 추출',
      },
      {
        activityId: 'crisis',
        label: '위기의 순간 리플레이',
        presenterLine: '압박이 높아질수록 숨겨진 전문성이 더 선명하게 드러납니다.',
        audienceOutcome: '현장 대응 문장 확보',
      },
      {
        activityId: 'seci',
        label: 'SECI 변환 실습',
        presenterLine: '이제 머릿속 감각을 AI가 재사용할 수 있는 프롬프트 자산으로 바꿉니다.',
        audienceOutcome: '실행 가능한 프롬프트 초안 생성',
      },
    ],
    previewFallback: '첫 반응 패턴이 리포트에 반영되었습니다.',
  },
  developer: {
    headline: 'AI 시대에 뒤쳐지지 않는 7가지 방법',
    summary: '정보 흐름부터 공개 루프까지 7원칙을 설명+실습으로 순서대로 닫습니다. 스택 랩은 원칙 아래에 유지됩니다.',
    ctaLabel: '원칙 #1 시작',
    recommendedActivityId: 'dev_info_flow',
    quickSteps: [
      { title: '원칙 #1 정보 흐름', detail: '수집→정제→저장→재사용 최소 루프를 설계합니다.' },
      { title: '원칙 #2~#5', detail: '닫기 · 절차화 · 하네스 · 검증으로 시스템을 단단히 합니다.' },
      { title: '원칙 #6~#7', detail: '도메인 해자와 공개 루프로 복리를 엽니다.' },
    ],
    demoOrder: [
      {
        activityId: 'dev_info_flow',
        label: '① 정보 흐름 시스템',
        presenterLine: '모델보다 먼저, 정보가 나를 통해 흐르는 최소 루프가 있어야 합니다.',
        audienceOutcome: '정보 루프 초안',
      },
      {
        activityId: 'dev_output_close',
        label: '② 산출물로 닫기',
        presenterLine: '이해했다는 감각이 아니라 꺼낼 수 있는 산출물로 학습을 닫습니다.',
        audienceOutcome: '산출물 최소 계약서',
      },
      {
        activityId: 'dev_prompt_asset',
        label: '③ 프롬프트 자산화',
        presenterLine: '좋은 프롬프트를 찾지 말고, NAME·SLOT·SHAPE·CHECK 절차로 승격합니다.',
        audienceOutcome: '절차 1개',
      },
      {
        activityId: 'dev_harness_design',
        label: '④ 하네스 설계',
        presenterLine: '위임하지 말고 역할·배선·경계를 설계합니다.',
        audienceOutcome: '하네스 1장',
      },
      {
        activityId: 'dev_verify_loop',
        label: '⑤ 검증 루프',
        presenterLine: '그럴듯함이 아니라 사전 게이트로 판정합니다.',
        audienceOutcome: '게이트 1개',
      },
      {
        activityId: 'dev_domain_moat',
        label: '⑥ 도메인 해자',
        presenterLine: '넓고 얕게가 아니라 좁고 깊게 소유할 좌표를 찍습니다.',
        audienceOutcome: '도메인 좌표',
      },
      {
        activityId: 'dev_public_loop',
        label: '⑦ 공개 루프',
        presenterLine: '완성 후가 아니라 공개로 피드백 복리를 엽니다.',
        audienceOutcome: '공개 3레버 + 최소 실행',
      },
    ],
    previewFallback: '원칙 시리즈 초안이 리포트에 반영되었습니다.',
  },
  automation: {
    headline: '복사+붙여넣기 자동화 시연을 가장 짧게 보는 시작점',
    summary: 'AI 비서의 준비 단계를 먼저 보여주고, 이어서 트리거와 배포까지 흐름을 매끄럽게 따라가게 합니다.',
    ctaLabel: '자동화 실습 시작',
    recommendedActivityId: 'auto_setup',
    quickSteps: [
      { title: 'AI 준비하기', detail: '가장 먼저 필요한 외부 준비물을 명확히 보여줍니다.' },
      { title: '코드 붙여넣기 보기', detail: '가장 큰 진입 장벽을 한 번에 넘기게 합니다.' },
      { title: '배포 단계 확인', detail: '자동 실행의 완성 지점을 빠르게 체감합니다.' },
    ],
    demoOrder: [
      {
        activityId: 'auto_setup',
        label: '뇌(AI) 준비하기',
        presenterLine: '자동화는 거창한 개발보다 먼저, AI가 일할 수 있는 최소 준비물부터 갖추면 됩니다.',
        audienceOutcome: '자동화 시작 조건 이해',
      },
      {
        activityId: 'auto_code',
        label: '영혼(코드) 불어넣기',
        presenterLine: '여기서부터는 복사와 붙여넣기만으로도 실제 비서가 동작합니다.',
        audienceOutcome: '동작 가능한 자동화 코드 이미지 형성',
      },
      {
        activityId: 'auto_trigger',
        label: '알람 맞추기 & 배포',
        presenterLine: '트리거를 거는 순간, 사람이 잠든 시간에도 일이 굴러가기 시작합니다.',
        audienceOutcome: '자동 실행 가치 체감',
      },
    ],
    previewFallback: '자동화 준비 단계가 리포트에 반영되었습니다.',
  },
  showcase: {
    headline: '암묵지가 앱으로 변하는 전체 구조를 먼저 잡는 시작점',
    summary: '쇼케이스 소개에서 관점을 잡고, 첫인상 자동화와 진단 도구를 거쳐 철학과 앱 제작 공장까지 단계적으로 확장합니다.',
    ctaLabel: '추천 시연 시작',
    recommendedActivityId: 'demo_showcase_intro',
    quickSteps: [
      { title: '관점 잡기', detail: '앱 목록이 아니라 암묵지 변환 흐름으로 읽습니다.' },
      { title: '초기 사례 보기', detail: '간판, 진단, 첨삭처럼 바로 이해되는 사례로 시작합니다.' },
      { title: '고도화로 확장', detail: '스토리보드, 철학 AI, 앱 공장으로 확장되는 끝을 봅니다.' },
    ],
    demoOrder: [
      {
        activityId: 'demo_showcase_intro',
        label: 'Tacit KnowledgeLab 소개',
        presenterLine: '오늘 보는 것은 앱의 기능 목록이 아니라, 원장의 몸에 밴 판단이 어떻게 화면과 시스템으로 바뀌는지입니다.',
        audienceOutcome: '전체 시연 관점 확보',
      },
      {
        activityId: 'demo_sign_design',
        label: 'Sign Design 자동화',
        presenterLine: '간판과 홍보물의 첫인상 판단도 오래 쌓인 지역 감각과 학부모 심리의 암묵지입니다.',
        audienceOutcome: '첫인상 판단의 자동화 이해',
      },
      {
        activityId: 'demo_readmaster',
        label: 'ReadMaster 진단',
        presenterLine: '새 학생이 오면 레벨테스트 전에 이미 느낌이 옵니다. 그 직관을 진단 앱으로 옮긴 사례입니다.',
        audienceOutcome: '암묵지가 앱으로 변한 첫 사례 체감',
      },
      {
        activityId: 'demo_storyboard_gen',
        label: 'Storyboard Gen',
        presenterLine: '좋은 설명은 정보량이 아니라 순서입니다. 원장의 설명 흐름을 장면 카드로 바꾼 사례입니다.',
        audienceOutcome: '설명 순서의 시스템화 이해',
      },
      {
        activityId: 'demo_app_factory',
        label: 'App Factory',
        presenterLine: '마지막은 앱 하나가 아니라 앱을 계속 만들어내는 구조입니다. 암묵지가 반복 가능한 제품화 파이프라인이 됩니다.',
        audienceOutcome: '앱 제작 공장으로의 확장 이해',
      },
    ],
    previewFallback: '방금 본 시연의 핵심 메시지가 다음 흐름 카드에 반영되었습니다.',
  },
  promo: {
    headline: '발표용 모션 그래픽을 바로 재생하는 갤러리',
    summary: '대표 키네틱 타이포 영상부터 확인한 뒤 전체 클립을 자유롭게 둘러볼 수 있습니다.',
    ctaLabel: '모션 갤러리 보기',
    recommendedActivityId: null,
    quickSteps: [
      { title: '대표 영상 확인', detail: '가장 임팩트가 큰 장면부터 보여줍니다.' },
      { title: '전체 클립 둘러보기', detail: '발표 구조에 맞는 자산을 고릅니다.' },
      { title: '발표 흐름 조합', detail: '오프닝-브리지-클로징 순으로 엮습니다.' },
    ],
    demoOrder: [],
    previewFallback: '모션 그래픽 감상 기록이 반영되었습니다.',
  },
};

export function getJourneyGuide(journey) {
  return JOURNEY_GUIDES[journey] ?? JOURNEY_GUIDES.showcase;
}
