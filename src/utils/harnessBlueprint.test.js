import { describe, expect, it } from 'vitest';
import {
  HARNESS_TIERS,
  buildAcademyHarnessBlueprint,
  createAcademyHarnessPrompt,
} from './harnessBlueprint';

describe('harnessBlueprint (REA Track 5: #028 Codex CLI & #030 Sidecar)', () => {
  it('synthesizes local tacit answers into a 3-tier academy management harness blueprint', () => {
    const blueprint = buildAcademyHarnessBlueprint({
      autopilot: {
        trigger: '수업 시작 5분 전 학생 표정과 숙제 펼치는 속도로 컨디션을 즉시 파악한다.',
      },
      transfer: {
        checklist: '상담 전 최근 3회 단원평가 오답 유형과 출결 기록을 한 줄 요약으로 먼저 제시한다.',
      },
      crisis: {
        turningPoint: '퇴원 문의가 오면 강사가 즉시 답하지 않고 원장 승인 게이트를 거쳐 2시간 내 전화한다.',
      },
    });

    expect(blueprint.lectureTitle).toBe('학원 경영의 하네스를 설계하는 법');
    expect(blueprint.tiers).toHaveLength(3);
    expect(blueprint.tiers[0].id).toBe(HARNESS_TIERS[0].id);
    expect(blueprint.tiers[0].extractedTacitRule).toContain('숙제 펼치는 속도');
    expect(blueprint.tiers[1].extractedTacitRule).toContain('한 줄 요약');
    expect(blueprint.tiers[2].extractedTacitRule).toContain('원장 승인 게이트');
    expect(blueprint.promptPack).toContain('[핵심 원칙: 학원 경영의 3단계 하네스]');
  });

  it('generates a local prompt pack without calling any external API', () => {
    const blueprint = buildAcademyHarnessBlueprint({});
    const prompt = createAcademyHarnessPrompt(blueprint.tiers);
    expect(prompt).toContain('표준 운영 절차(SOP)');
    expect(prompt).toContain('3단계 승인 게이트');
  });
});
