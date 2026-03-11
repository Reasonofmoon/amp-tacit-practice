import { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLEPLAY_SCENARIOS } from '../data/scenarios';
import { DEV_ROLEPLAY_SCENARIOS } from '../data/developerScenarios';
import { calculateRoleplayBonus, calculateRoleplayStyle } from '../utils/scoring';

function getScenarioState(progressMap, scenarioId) {
  return progressMap[scenarioId] ?? {
    stepIndex: 0,
    responses: [],
    complete: false,
  };
}

function buildProgressSnapshot(progressMap, targetScenarios) {
  const completedScenarioIds = targetScenarios.filter((scenario) => getScenarioState(progressMap, scenario.id).complete).map((scenario) => scenario.id);
  const allResponses = targetScenarios.flatMap((scenario) => getScenarioState(progressMap, scenario.id).responses);
  const totalScore = allResponses.reduce((sum, response) => sum + response.score, 0);
  const maxScore = targetScenarios.reduce((sum, scenario) => sum + scenario.steps.length * 3, 0);
  const insights = [...new Set(allResponses.map((response) => response.insight).filter(Boolean))];
  const style = calculateRoleplayStyle(totalScore, maxScore);

  return {
    completedScenarioIds,
    totalScore,
    maxScore,
    style,
    insights,
  };
}

export default function RolePlayActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const targetScenarios = isDev ? DEV_ROLEPLAY_SCENARIOS : ROLEPLAY_SCENARIOS;
  
  const [scenarioProgress, setScenarioProgress] = useState(data?.scenarioProgress ?? {});
  const [selectedId, setSelectedId] = useState(data?.completedScenarioIds?.[0] ?? targetScenarios[0].id);
  const [feedback, setFeedback] = useState(null);
  const chatRef = useRef(null);

  const snapshot = useMemo(() => buildProgressSnapshot(scenarioProgress, targetScenarios), [scenarioProgress, targetScenarios]);
  const selectedScenario = targetScenarios.find((scenario) => scenario.id === selectedId) ?? targetScenarios[0];
  const currentState = getScenarioState(scenarioProgress, selectedId);
  const currentStep = selectedScenario.steps[currentState.stepIndex];

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [currentState.responses, feedback]);

  const persist = (nextProgress) => {
    const nextSnapshot = buildProgressSnapshot(nextProgress);
    saveData({
      scenarioProgress: nextProgress,
      ...nextSnapshot,
    });
  };

  const handleChoice = (choice, choiceIndex) => {
    if (feedback || currentState.complete) {
      return;
    }

    const nextScenarioState = {
      stepIndex: currentState.stepIndex,
      responses: [
        ...currentState.responses,
        {
          choiceIndex,
          text: choice.text,
          score: choice.score,
          insight: choice.insight,
        },
      ],
      complete: currentState.stepIndex + 1 >= selectedScenario.steps.length,
    };

    const nextProgress = {
      ...scenarioProgress,
      [selectedId]: nextScenarioState,
    };

    setScenarioProgress(nextProgress);
    setFeedback(choice);
    persist(nextProgress);
  };

  const handleNextStep = () => {
    if (currentState.complete) return;
    
    const nextScenarioState = {
      ...currentState,
      stepIndex: currentState.stepIndex + 1,
    };
    
    const nextProgress = {
      ...scenarioProgress,
      [selectedId]: nextScenarioState,
    };

    setScenarioProgress(nextProgress);
    setFeedback(null);
    persist(nextProgress);
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: 'var(--primary)', color: 'white' }}>Layer C: Application</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>역할극 시뮬레이션</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>위기 상황에서의 대화 선택을 통해 당신의 리더십/상담 스타일을 분석합니다.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        <div className="split-left" style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <h3 style={{ marginBottom: '16px' }}>시뮬레이션 케이스</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {ROLEPLAY_SCENARIOS.map((scenario) => {
                const isComplete = snapshot.completedScenarioIds.includes(scenario.id);
                const isSelected = selectedId === scenario.id;

                return (
                  <button
                    key={scenario.id}
                    className={`choice-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedId(scenario.id);
                      setFeedback(null);
                    }}
                    style={{ 
                      padding: '16px', 
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '8px',
                      background: isComplete && !isSelected ? 'var(--success-light)' : '',
                      border: isComplete && !isSelected ? '1px solid var(--success)' : ''
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem' }}>{scenario.icon}</span>
                      {isComplete && <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓ 완료</span>}
                    </div>
                    <strong>{scenario.title}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'left' }}>{scenario.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg-card-hover)', border: 'none', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h4 style={{ marginBottom: '12px', color: 'var(--text-muted)' }}>현재 스타일 분석</h4>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>
              {snapshot.totalScore === 0 ? '🤔' : snapshot.totalScore > 15 ? '⭐' : '🌱'}
            </div>
            <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>{snapshot.style.title || '분석 중...'}</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', textAlign: 'center', lineHeight: 1.5 }}>
              {snapshot.style.desc || '모든 시나리오를 완료하면 스타일이 분석됩니다.'}
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              누적 스코어: {snapshot.totalScore}/{snapshot.maxScore}
            </div>
          </div>

        </div>

        <div className="split-right" style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          <div 
            ref={chatRef}
            style={{ 
              flex: '1', 
              overflowY: 'auto', 
              padding: '24px', 
              background: 'white', 
              borderRadius: '16px', 
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '24px'
            }}
          >
            <div style={{ textAlign: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
              {selectedScenario.icon} {selectedScenario.title} 시작
            </div>

            {selectedScenario.steps.slice(0, currentState.stepIndex + 1).map((step, index) => {
              const response = currentState.responses[index];
              const isCurrent = index === currentState.stepIndex && !currentState.complete;
              
              if (!isCurrent && !response && index > currentState.stepIndex) return null;

              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* NPC Message */}
                  <div style={{ display: 'flex', gap: '12px', maxWidth: '85%' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--layer-b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>
                      {step.npc.charAt(0)}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>{step.npc}</span>
                      <div style={{ background: 'var(--bg-body)', padding: '12px 16px', borderRadius: '4px 16px 16px 16px', fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-main)', border: '1px solid var(--border)' }}>
                        {step.message}
                      </div>
                    </div>
                  </div>

                  {/* User Response */}
                  {response && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', gap: '12px', maxWidth: '85%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>
                        나
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'block', textAlign: 'right' }}>나의 선택</span>
                        <div style={{ 
                          background: response.score === 3 ? 'var(--primary)' : response.score === 1 ? 'var(--warning)' : 'var(--danger)', 
                          padding: '12px 16px', 
                          borderRadius: '16px 4px 16px 16px', 
                          fontSize: '0.95rem', 
                          lineHeight: 1.5, 
                          color: 'white',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
                        }}>
                          {response.text}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ minHeight: '200px' }}>
            {currentState.complete ? (
              <div className="card" style={{ background: 'var(--success-light)', border: '1px solid var(--success)', textAlign: 'center', padding: '32px' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>✅</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--success-dark)' }}>시나리오 클리어!</strong>
                <p style={{ color: 'var(--text-main)', marginTop: '8px' }}>왼쪽 메뉴에서 다른 시나리오를 선택해주세요.</p>
                {snapshot.completedScenarioIds.length === ROLEPLAY_SCENARIOS.length && (
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: '24px', background: 'var(--success)' }}
                    onClick={() =>
                      complete({
                        activityData: { scenarioProgress, ...snapshot },
                        bonusXp: calculateRoleplayBonus(snapshot.totalScore),
                        metrics: { roleplayScore: snapshot.totalScore },
                      })
                    }
                  >
                    최종 분석 결과 열람 및 활동 완료하기 🚀
                  </button>
                )}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {!feedback ? (
                  <motion.div key="choices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '12px' }}>어떻게 대답하시겠습니까?</p>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {currentStep?.choices.map((choice, index) => (
                        <button
                          key={index}
                          className="choice-btn"
                          style={{ padding: '16px', textAlign: 'left', fontSize: '0.95rem', lineHeight: 1.5 }}
                          onClick={() => handleChoice(choice, index)}
                        >
                          {choice.text}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="feedback" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ 
                    border: `2px solid ${feedback.score === 3 ? 'var(--success)' : feedback.score === 1 ? 'var(--warning)' : 'var(--danger)'}`,
                    background: 'white'
                  }}>
                    <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1.1rem', color: feedback.score === 3 ? 'var(--success)' : feedback.score === 1 ? 'var(--warning-dark)' : 'var(--danger)' }}>
                      {feedback.score === 3 ? '탁월한 선택입니다! 🌟' : feedback.score === 1 ? '무난한 대응입니다 🤔' : '관계 손상 주의 경고 ⚠️'}
                    </strong>
                    <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '24px', fontSize: '0.95rem' }}>
                      {feedback.insight}
                    </p>
                    <button className="btn btn-primary" onClick={handleNextStep} style={{ width: '100%', background: feedback.score === 3 ? 'var(--success)' : feedback.score === 1 ? 'var(--warning)' : 'var(--danger)' }}>
                      다음 대화 이어가기 →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
