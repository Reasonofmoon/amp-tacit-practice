import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ReportAIWorkbench from './ReportAIWorkbench';

describe('ReportAIWorkbench', () => {
  it('renders local prompts without provider or API key controls', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });

    render(
      <ReportAIWorkbench
        state={{ activityData: {}, profile: { name: '문 원장' } }}
        activeJourney="director"
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: '로컬 프롬프트 작업실' })).toBeInTheDocument();
    expect(screen.queryByText('글로벌 AI 설정')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/API 키 입력/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText('AI에게 프롬프트 보내기')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: '프롬프트 템플릿 복사' })[0]);
    expect(writeText).toHaveBeenCalledTimes(1);
  });
});
