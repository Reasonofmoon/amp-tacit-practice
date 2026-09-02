import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { useGameState } from './hooks/useGameState';

vi.mock('./hooks/useGameState', () => ({ useGameState: vi.fn() }));
vi.mock('./components/HomeJourneyView', () => ({ default: () => <div>홈 화면</div> }));
vi.mock('./components/Layout', () => ({
  default: ({ children, onGoReport }) => (
    <div>
      <button type="button" onClick={onGoReport}>진단 리포트</button>
      {children}
    </div>
  ),
}));
vi.mock('./components/OnboardingOverlay', () => ({ default: () => null }));
vi.mock('./components/ResultReport', () => ({
  default: ({ onOpenAIWorkbench }) => (
    <section>
      <h1>리포트 화면</h1>
      <button type="button" onClick={onOpenAIWorkbench}>프롬프트 작업실 열기 →</button>
    </section>
  ),
}));
vi.mock('./components/ReportAIWorkbench', () => ({ default: () => <div>프롬프트 작업실 내용</div> }));
vi.mock('./components/PromptGiftModal', () => ({ default: () => null }));
vi.mock('./components/NextStepBeacon', () => ({ default: () => null }));
vi.mock('./components/ChapterPrintLayout', () => ({ default: () => null }));
vi.mock('./components/AutoSaveIndicator', () => ({ default: () => null }));
vi.mock('./components/LensToggle', () => ({ default: () => null }));
vi.mock('./components/ErrorBoundary', () => ({ default: ({ children }) => children }));
vi.mock('./utils/homeFlow', () => ({ buildHomeViewModel: vi.fn(() => ({ journeyGuide: null })) }));
vi.mock('./utils/sound', () => ({ playFanfareSound: vi.fn(), playSuccessSound: vi.fn() }));
vi.mock('./utils/inkBurst', () => ({ triggerInkBurst: vi.fn() }));
vi.mock('./data/developerPrinciples', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    readPresenterMode: vi.fn(() => false),
    writePresenterMode: vi.fn(),
  };
});

const gameState = {
  state: {
    onboardingSeen: true,
    completed: [],
    activityData: {},
    profile: { name: '문 원장' },
    xp: 0,
    badges: [],
    maxCombo: 0,
    metrics: {},
    consent: {},
  },
  levelInfo: { icon: '🌱', title: '견습 원장' },
  nextLevel: null,
  progressPercent: 0,
  completionPercent: 0,
  unlockedBadges: [],
  celebration: null,
  updateProfile: vi.fn(),
  updateConsent: vi.fn(),
  setOnboardingSeen: vi.fn(),
  saveActivityData: vi.fn(),
  completeActivity: vi.fn(),
  resetGameState: vi.fn(),
  isReportUnlocked: false,
};

describe('App prompt studio flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useGameState.mockReturnValue(gameState);
  });

  it('opens the local prompt studio dialog from the report view', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '진단 리포트', exact: true }));
    expect(await screen.findByRole('heading', { name: '리포트 화면', exact: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '프롬프트 작업실 열기 →', exact: true }));

    expect(await screen.findByRole('dialog', { name: '로컬 프롬프트 작업실', exact: true })).toBeInTheDocument();
  });
});
