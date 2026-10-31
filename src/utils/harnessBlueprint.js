/**
 * src/utils/harnessBlueprint.js
 * ─────────────────────────────────────────
 * REA Track 5 (#028 Codex CLI Turn Loop & #030 Sidecar) for Korea University AMP
 * Lecture (2026-11-11): "학원 경영의 하네스를 설계하는 법".
 * Converts extracted tacit knowledge into a 3-Tier Academy Management Harness Blueprint
 * and a locally copyable AI prompt pack (zero external API calls per CONTEXT.md).
 */

export const HARNESS_TIERS = [
  {
    id: 'tier1_auto_sense',
    title: '1단계 · 자동 감지 루프 (Auto-Sense)',
    subtitle: '출결·과제·성적 이상 징후를 사람 개입 없이 상시 포착하는 관측 계층',
  },
  {
    id: 'tier2_sidecar_draft',
    title: '2단계 · 사이드카 초안 생성 (Sidecar Draft)',
    subtitle: '원장의 암묵지 규칙으로 상담 브리핑·월간 리포트 초안을 조립하는 보조 계층',
  },
  {
    id: 'tier3_director_gate',
    title: '3단계 · 원장 승인 게이트 (Human Approval Gate)',
    subtitle: '학부모 발송·퇴원 위기 개입·청구 확정 전 원장이 최종 승인하는 통제 계층',
  },
];

/**
 * Builds a 3-tier academy management harness blueprint from local activity answers.
 * @param {Record<string, any>} activityData
 */
export function buildAcademyHarnessBlueprint(activityData = {}) {
  const autopilotSignal =
    activityData?.autopilot?.trigger ||
    activityData?.timeline?.morningRoutine ||
    '결석·지각 누적 및 단어 시험 급락 신호를 등원 직후 3분 안에 스캔합니다.';

  const sidecarRule =
    activityData?.transfer?.checklist ||
    activityData?.seci?.externalization ||
    '신입 강사도 동일한 품질로 학부모 상담 초안을 작성하도록 핵심 관찰 문장 3개를 표준화합니다.';

  const directorGateRule =
    activityData?.crisis?.turningPoint ||
    activityData?.crisis?.resolution ||
    '성적 하락·퇴원 징후 학생의 알림장 발송 및 상담 확정 전 원장이 마지막 문구와 어조를 직접 승인합니다.';

  const tiers = [
    {
      ...HARNESS_TIERS[0],
      extractedTacitRule: String(autopilotSignal).trim(),
      automationMode: '자동 실행 (Read-Only Telemetry)',
    },
    {
      ...HARNESS_TIERS[1],
      extractedTacitRule: String(sidecarRule).trim(),
      automationMode: '초안 생성 및 비교 (Sidecar Preview)',
    },
    {
      ...HARNESS_TIERS[2],
      extractedTacitRule: String(directorGateRule).trim(),
      automationMode: '원장 최종 승인 필수 (Explicit Approval Gate)',
    },
  ];

  return {
    lectureTitle: '학원 경영의 하네스를 설계하는 법',
    tiers,
    promptPack: createAcademyHarnessPrompt(tiers),
  };
}

/**
 * Generates a locally copyable Korean prompt pack from the 3-tier harness blueprint.
 * Does not call any external AI API (strictly follows CONTEXT.md).
 */
export function createAcademyHarnessPrompt(tiers = []) {
  const lines = tiers.map(
    (tier, idx) => `${idx + 1}. [${tier.title}] ${tier.extractedTacitRule} (${tier.automationMode})`,
  );

  return [
    '[역할] 너는 학원 경영의 암묵지를 운영 하네스(Harness)로 전환하는 교육기관 시스템 설계 코치다.',
    '[핵심 원칙: 학원 경영의 3단계 하네스]',
    ...lines,
    '[요청 작업]',
    '1. 위 3단계 규칙을 우리 학원의 주간 운영 표준 운영 절차(SOP) 표로 정리해줘.',
    '2. 신입 강사가 2단계 사이드카 초안을 검토할 때 반드시 확인할 체크리스트 5개 항목을 만들어줘.',
    '3. 원장이 3단계 승인 게이트에서 30초 안에 판단할 수 있는 최종 승인 기준표를 작성해줘.',
  ].join('\n');
}
