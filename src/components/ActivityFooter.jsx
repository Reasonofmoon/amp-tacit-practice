import { useState } from 'react';
import { playClickSound, playSkipSound } from '../utils/sound';

export default function ActivityFooter({
  placeholder = "이 모듈을 진행하며 느낀 나만의 인사이트나 현장 경험을 메모해주세요.",
  onComplete,
  onSkip,
  onAutoFill,
  disableComplete = false
}) {
  const [insight, setInsight] = useState('');

  const handleComplete = () => {
    onComplete(insight);
  };

  const handleSkip = () => {
    playSkipSound();
    if (onSkip) onSkip();
  };

  const handleAutoFill = () => {
    playClickSound();
    setInsight("현장에서 자주 겪는 상황입니다. 강사 교육 시 이 부분을 매뉴얼화해야겠습니다.");
    if (onAutoFill) onAutoFill();
  };

  return (
    <div className="custom-opinion-block">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ color: 'var(--primary-hover)', fontSize: '0.9rem' }}>💡 나만의 인사이트 기록</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onAutoFill && (
            <button className="btn btn-sm btn-outline" onClick={handleAutoFill} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
              🪄 자동 채움
            </button>
          )}
          {onSkip && (
            <button className="btn btn-sm btn-ghost" onClick={handleSkip} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
              ⏭️ 스킵 (Skip)
            </button>
          )}
        </div>
      </div>
      <textarea
        value={insight}
        onChange={(e) => setInsight(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <button 
        className="btn btn-primary neon-btn" 
        onClick={handleComplete} 
        disabled={disableComplete}
        style={{ width: '100%', marginTop: '12px' }}
      >
        ✨ 이 모듈 완료 및 저장하기
      </button>
    </div>
  );
}
