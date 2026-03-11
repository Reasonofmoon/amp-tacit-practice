import { useState } from 'react';
import { motion } from 'framer-motion';
import { PATTERN_CARDS } from '../data/patternCards';
import { DEV_PATTERN_CARDS } from '../data/developerPatternCards';

export default function PatternMatchActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const targetCards = isDev ? DEV_PATTERN_CARDS[0] : PATTERN_CARDS[0];
  
  const [matches, setMatches] = useState(data?.matches ?? {});
  const [selectedSituation, setSelectedSituation] = useState(null);

  const matchedCount = Object.keys(matches).length;
  
  const handleSelectSituation = (id) => {
    setSelectedSituation(selectedSituation === id ? null : id);
  };

  const handleSelectResponse = (responseId) => {
    if (!selectedSituation) return;
    
    const nextMatches = { ...matches, [selectedSituation]: responseId };
    setMatches(nextMatches);
    saveData({ matches: nextMatches });
    setSelectedSituation(null); // Reset selection after match
  };

  const handleRemoveMatch = (situationId) => {
    const nextMatches = { ...matches };
    delete nextMatches[situationId];
    setMatches(nextMatches);
    saveData({ matches: nextMatches });
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px' }}>Layer B: Deepening</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>패턴 짝맞추기</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>왼쪽의 <strong>상황</strong>을 선택하고, 오른쪽에서 가장 적절한 <strong>대응 프레임</strong>을 선택해 짝을 맞춰보세요.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        <div className="split-left">
          <h3 style={{ marginBottom: '16px' }}>상황 (Situations)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {targetCards.situations.map((sit) => {
              const isMatched = matches[sit.id];
              const isSelected = selectedSituation === sit.id;
              
              if (isMatched) {
                const response = targetCards.responses.find(r => r.id === matches[sit.id]);
                return (
                  <div key={sit.id} className="card" style={{ borderColor: 'var(--primary)', background: 'var(--primary-light)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--primary)' }}>매칭 완료</span>
                      <button className="btn btn-ghost" style={{ padding: '4px' }} onClick={() => handleRemoveMatch(sit.id)}>해제</button>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{sit.icon} {sit.text}</p>
                    <div style={{ textAlign: 'center', color: 'var(--primary)' }}>↓</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--primary-hover)', fontWeight: 600 }}>{response?.icon} {response?.text}</p>
                  </div>
                );
              }

              return (
                <button
                  key={sit.id}
                  className={`choice-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectSituation(sit.id)}
                  style={{ padding: '16px', borderStyle: isSelected ? 'solid' : 'dashed' }}
                >
                  <span className="choice-number">{sit.icon}</span>
                  <span style={{ flex: 1, fontSize: '0.95rem' }}>{sit.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="split-right" style={{ paddingLeft: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>대응 프레임 (Responses)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {targetCards.responses.map((res) => {
              const isAlreadyMatched = Object.values(matches).includes(res.id);
              
              return (
                <button
                  key={res.id}
                  className={`choice-btn ${isAlreadyMatched ? 'disabled' : ''}`}
                  disabled={isAlreadyMatched || !selectedSituation}
                  onClick={() => handleSelectResponse(res.id)}
                  style={{ 
                    padding: '16px', 
                    opacity: isAlreadyMatched ? 0.5 : 1,
                    cursor: isAlreadyMatched ? 'not-allowed' : (selectedSituation ? 'pointer' : 'default'),
                    borderStyle: selectedSituation && !isAlreadyMatched ? 'solid' : 'dashed'
                  }}
                >
                  <span className="choice-number">{res.icon}</span>
                  <span style={{ flex: 1, fontSize: '0.95rem' }}>{res.text}</span>
                </button>
              );
            })}
          </div>

          <div className="confidence-module" style={{ marginTop: 'auto' }}>
            <p>총 {targetCards.situations.length}개 중 {matchedCount}개 매칭 완료</p>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={matchedCount < targetCards.situations.length}
              onClick={() => complete({ activityData: { matches }, bonusXp: 20 })}
            >
              매칭 완료 및 결과 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
