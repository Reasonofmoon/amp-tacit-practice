// 가상 베테랑 표본의 답변/판단 패턴 통계.
// 익명 비교 채널 (Octalysis #5 사회적 영향) 작동을 위한 기준선.
// 표본은 가상이지만 비율과 상대 위치 감각이 학원장 직군에 그럴듯하게 설정되어 있다.
//
// ※ 실제 사용자 표본이 쌓이면 이 값을 실측치로 교체하면 된다 (구조는 그대로).
export const BENCHMARK_SAMPLE = {
  totalRespondents: 84,
  cohortLabel: '12년차 영어/수학 학원장',
  collectedAt: '2026-Q1',
};

// 답변 평균 길이 (글자/문항 단위) 분포
export const ANSWER_LENGTH_BENCHMARK = {
  rookie:  { tier: '3년차 미만', mean: 28, p50: 22, p90: 55 },
  mid:     { tier: '3~9년차',    mean: 41, p50: 38, p90: 78 },
  veteran: { tier: '10년차 이상', mean: 67, p50: 60, p90: 124 },
};

// 위기 시나리오 답변 (압박 상황의 단서 포착력)
export const CRISIS_BENCHMARK = {
  completionRate: 0.34,       // 위기 3개 모두 작성하는 베테랑 비율
  avgAnswerLength: 78,
  topQuartileLength: 124,
};

// 퀴즈 (즉시 판단 속도 + 정확도)
export const QUIZ_BENCHMARK = {
  timeSeconds: { mean: 252, p10: 126, p90: 468 }, // 평균 4분 12초
  accuracy:    { mean: 0.62, p10: 0.30, p90: 0.85 },
};

// 역할극 — 응답 스타일 분포
export const ROLEPLAY_STYLE_BENCHMARK = {
  '신뢰 구축형': 17,   // % of veterans
  '균형 조율형': 56,
  '즉흥 대응형': 27,
};

// 키워드 사용 패턴 (1000자당 빈도)
export const KEYWORD_BENCHMARK = {
  relationship: { words: ['관계', '신뢰', '학부모', '학생', '강사'], mean: 4.8, p90: 12 },
  data:         { words: ['점수', '데이터', '숫자', '통계', '결과', '지표'], mean: 1.6, p90: 5.2 },
  sensory:      { words: ['표정', '느낌', '직감', '눈치', '분위기', '톤', '침묵'], mean: 2.3, p90: 7.0 },
  action:       { words: ['바로', '즉시', '먼저', '시작', '실행', '확인'], mean: 3.2, p90: 8.1 },
};

// 활동 완료 분포
export const COMPLETION_BENCHMARK = {
  median: 4,
  p25: 2,
  p75: 7,
  ninePlus: 0.12, // 9개 이상 완료한 원장 비율
};

// 5개 axis 별 베테랑 평균 점수 — 레이더 overlay 기준선
// counseling, teaching, management, crisis, leadership
export const AXIS_BENCHMARK = {
  counseling: 64,
  teaching:   58,
  management: 52,
  crisis:     49,
  leadership: 45,
};
