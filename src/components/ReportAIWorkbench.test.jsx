import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReportAIWorkbench from './ReportAIWorkbench';
import ResultReport from './ResultReport';

vi.mock('./ReportRadarCard', () => ({ default: () => null }));
vi.mock('./KnowledgeGraph', () => ({ default: () => null }));
vi.mock('./PromptGiftModal', () => ({ default: () => null }));
vi.mock('./DiscoveryShowcase', () => ({ default: () => null }));
vi.mock('./BenchmarkSection', () => ({ default: () => null }));
vi.mock('./BackupPanel', () => ({ default: () => null }));

const workbenchState = { activityData: {}, profile: { name: '문 원장' } };
const reportState = {
  completed: [],
  activityData: {},
  profile: { name: '', career: '', academy: '' },
  xp: 0,
  badges: [],
  maxCombo: 0,
  consent: {},
};
const promptStudioCopy = '활동 답변으로 만든 프롬프트를 확인하고 복사해 원하는 AI 도구에서 사용하세요. 앱은 외부 AI를 직접 호출하지 않습니다.';

function renderWorkbench() {
  render(
    <ReportAIWorkbench
      state={workbenchState}
      activeJourney="director"
      onClose={vi.fn()}
    />,
  );
}

describe('ReportAIWorkbench', () => {
  it('renders local prompts without provider or API key controls', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });

    renderWorkbench();

    expect(screen.getByRole('heading', { name: '로컬 프롬프트 작업실' })).toBeInTheDocument();
    expect(screen.queryByText('글로벌 AI 설정')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/API 키 입력/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('AI에게 프롬프트 보내기')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: '프롬프트 템플릿 복사' })[0]);
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it('copies the visible vibe-coding prompt string', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });

    renderWorkbench();

    const vibePrompt = screen.getAllByText(/^\[바이브 코딩 프롬프트\]/)[0].textContent;
    fireEvent.click(screen.getAllByRole('button', { name: '바이브코딩 프롬프트 복사' })[0]);

    expect(writeText).toHaveBeenCalledWith(vibePrompt);
  });

  it('renders the prompt studio entry and invokes its open action', () => {
    const onOpenAIWorkbench = vi.fn();

    render(
      <ResultReport
        state={reportState}
        levelInfo={{ icon: '🌱', title: '견습 원장' }}
        activeJourney="director"
        onOpenAIWorkbench={onOpenAIWorkbench}
        onUpdateConsent={vi.fn()}
      />,
    );

    expect(screen.getByText('PROMPT STUDIO', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '로컬 프롬프트 작업실 (선택)', exact: true })).toBeInTheDocument();
    expect(screen.getByText(promptStudioCopy, { exact: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '프롬프트 작업실 열기 →', exact: true }));

    expect(onOpenAIWorkbench).toHaveBeenCalledTimes(1);
  });
});
