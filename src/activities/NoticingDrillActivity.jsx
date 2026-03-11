import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLEPLAY_SCENARIOS } from '../data/scenarios';
import { DEV_ROLEPLAY_SCENARIOS } from '../data/developerScenarios';
import ActivityFooter from '../components/ActivityFooter';

export default function NoticingDrillActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const targetScenarios = isDev ? DEV_ROLEPLAY_SCENARIOS : ROLEPLAY_SCENARIOS;
  
  const [step, setStep] = useState(0);
  const [cues, setCues] = useState(['', '', '']);
  const [interp, setInterp] = useState('');
  const [resp, setResp] = useState('');

  const scenario = targetScenarios[1]; // Changed sc to scenario and used targetScenarios
  const stimulus = scenario.steps[0].message; // Used scenario instead of sc

  const handleNext = () => { // Renamed original handleNext to handleNextStep
    if (step < 3) setStep(step + 1);
  };

  const handleComplete = (insight = '') => {
    complete({ ...data, cues, interp, resp, insight });
  };

  const handleAutoFill = () => {
    setCues(['눈을 피함', '필기량 급감', '단답형 대답']);
    setInterp('학업 외 관계 스트레스이거나 레벨 부적응일 가능성 높음');
    setResp('수업 후 1:1로 가볍게 무거운 표정의 원인을 묻는다');
    setStep(3);
  };

  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="activity-workspace">
      <div className="workspace-header">
        <div className="workspace-progress">
          <span>Step {Math.min(step + 1, 3)} / 3</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(Math.min(step + 1, 3) / 3) * 100}%` }} />
          </div>
        </div>
        <button className="btn btn-ghost" onClick={onBack}>← 나가기</button>
      </div>

      <div className="workspace-content">
        <div className="split-view">
          <div className="split-left">
            <h2 className="question-title">👁️ 전문가적 보기 훈련<br/><span style={{fontSize:'1rem', color:'var(--text-muted)'}}>Noticing → Interpreting → Responding</span></h2>
            <div className="card" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)', marginBottom: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{scenario.icon}</span> {/* Used scenario instead of sc */}
                <span style={{ fontWeight: 700, color: 'var(--primary-hover)', fontFamily: 'var(--font-mono)' }}>{scenario.title}</span> {/* Used scenario instead of sc */}
              </div>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.6 }}>"{stimulus}"</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className={`choice-btn ${step >= 0 ? 'selected' : ''}`} style={{ padding: '16px', cursor: 'default' }}>
                <div className="choice-number">1</div>
                <div>관찰 (Noticing)</div>
              </div>
              <div className={`choice-btn ${step >= 1 ? 'selected' : ''}`} style={{ padding: '16px', cursor: 'default' }}>
                <div className="choice-number">2</div>
                <div>해석 (Interpreting)</div>
              </div>
              <div className={`choice-btn ${step >= 2 ? 'selected' : ''}`} style={{ padding: '16px', cursor: 'default' }}>
                <div className="choice-number">3</div>
                <div>행동 (Responding)</div>
              </div>
            </div>
          </div>

          <div className="split-right">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="step0" variants={variants} initial="hidden" animate="visible" exit="exit" className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ color: 'var(--primary)' }}>Step 1. 관찰 (해석 금지!)</h3>
                    <button className="btn btn-sm btn-outline" onClick={handleAutoFill}>🪄 마법봉 (자동 채움)</button>
                  </div>
                  <p style={{ marginBottom: 24, fontSize: '0.875rem' }}>눈으로 본 사실만 3가지 적으세요. "왜 그런 행동을 했는지" 추측하는 것은 금지입니다.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                    {cues.map((c, i) => (
                      <input
                        key={i}
                        value={c}
                        onChange={(e) => {
                          const n = [...cues];
                          n[i] = e.target.value;
                          setCues(n);
                        }}
                        placeholder={`포착한 단서 ${i + 1}`}
                        style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem' }}
                      />
                    ))}
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 24 }} onClick={handleNext} disabled={cues.filter(c => c.trim()).length < 2}>
                    다음 단계 →
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step1" variants={variants} initial="hidden" animate="visible" exit="exit" className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: 'var(--layer-c)', marginBottom: 8 }}>Step 2. 해석 (Interpreting)</h3>
                  <p style={{ marginBottom: 16, fontSize: '0.875rem' }}>앞서 찾은 단서들을 종합하여 가설을 세워보세요.</p>
                  
                  <div style={{ background: 'var(--bg-app)', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <strong>단서 요약:</strong> {cues.filter(c => c).join(' / ')}
                  </div>

                  <textarea
                    value={interp}
                    onChange={(e) => setInterp(e.target.value)}
                    placeholder="이 단서들이 의미하는 바는 무엇이라고 생각하나요?"
                    style={{ width: '100%', flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem', resize: 'none' }}
                  />

                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 24, background: 'var(--layer-c)' }} onClick={handleNext} disabled={!interp.trim()}>
                    다음 단계 →
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={variants} initial="hidden" animate="visible" exit="exit" className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: 'var(--success)', marginBottom: 8 }}>Step 3. 행동 (Responding)</h3>
                  <p style={{ marginBottom: 24, fontSize: '0.875rem' }}>세워진 가설을 바탕으로 지금 당장 취할 행동을 적어주세요.</p>
                  
                  <textarea
                    value={resp}
                    onChange={(e) => setResp(e.target.value)}
                    placeholder="강사로서 지금 순간 어떻게 반응하시겠습니까?"
                    style={{ width: '100%', flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '1rem', resize: 'none' }}
                  />

                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 24, background: 'var(--success)' }} onClick={handleNext} disabled={!resp.trim()}>
                    결과 보기 ✓
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={variants} initial="hidden" animate="visible" exit="exit" className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 32 }}>🎯</div>
                    <h3 style={{ color: 'var(--success)', margin: 0 }}>Professional Vision 완료</h3>
                  </div>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24, fontSize: '0.9rem' }}>
                    같은 장면을 보고도 초보와 숙련자는 완전히 다른 단서를 포착합니다.<br/>
                    방금 분리해낸 <strong>관찰-해석-행동</strong>의 고리를 아래에 자유롭게 메모 후 완료하세요.
                  </p>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <ActivityFooter 
                      onComplete={handleComplete}
                      onSkip={() => complete({ ...data, cues, interp, resp, insight: 'Skipped' })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
