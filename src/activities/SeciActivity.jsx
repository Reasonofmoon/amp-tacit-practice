import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPromptFromTacit } from '../utils/promptGenerator';

function buildGeneratedPrompts(tacit) {
  if (!tacit.trim()) {
    return [];
  }

  return [
    createPromptFromTacit(tacit),
    `다음 암묵지를 학부모 설명회 발표안으로 바꿔줘: ${tacit}`,
    `다음 운영 감각을 체크리스트 + 경고 신호 + 실행 문장으로 구조화해줘: ${tacit}`,
  ];
}

const STEPS = [
  { id: 'step-1', label: '1. 암묵지 언어화 (표출화)' },
  { id: 'step-2', label: '2. AI 프롬프트 변환 (연결화)' },
  { id: 'step-3', label: '3. 자산화 완료 (내면화)' }
];

export default function SeciActivity({ data, saveData, complete, onBack }) {
  const [step, setStep] = useState(data?.step ?? 0);
  const [tacit, setTacit] = useState(data?.tacit ?? '');
  const generatedPrompts = useMemo(() => buildGeneratedPrompts(tacit), [tacit]);
  const prompt = generatedPrompts[0] ?? '';

  const persist = (nextStep = step, nextTacit = tacit) => {
    saveData({
      step: nextStep,
      tacit: nextTacit,
      prompt: createPromptFromTacit(nextTacit),
      generatedPrompts: buildGeneratedPrompts(nextTacit),
      completed: nextStep === 2,
    });
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: 'var(--secondary)', color: 'white' }}>Final Stage: SECI Master</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>암묵지 AI 자산화 실습</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>머릿속 감각을 AI가 읽을 수 있는 프롬프트로 전환하여 영구적인 자산으로 만듭니다.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        <div className="split-left" style={{ flex: '0 0 280px' }}>
          <h3 style={{ marginBottom: '16px' }}>SECI 변환 사이클</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            {/* Vertical Line Connector */}
            <div style={{ position: 'absolute', top: '20px', bottom: '20px', left: '15px', width: '2px', background: 'var(--border)', zIndex: 0 }} />
            
            {STEPS.map((s, index) => {
              const isActive = step === index;
              const isPast = step > index;
              const color = isPast ? 'var(--success)' : isActive ? 'var(--secondary)' : 'var(--text-muted)';
              const bg = isPast ? 'var(--success-light)' : isActive ? 'var(--secondary)' : 'var(--bg-body)';
              const textColor = isActive ? 'white' : color;

              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1, opacity: isActive || isPast ? 1 : 0.5 }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', background: bg, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${isActive || isPast ? color : 'var(--border)'}`,
                    color: textColor, fontWeight: 'bold', fontSize: '0.875rem',
                    transition: 'all 0.3s'
                  }}>
                    {isPast ? '✓' : index + 1}
                  </div>
                  <strong style={{ color: isActive ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.95rem' }}>{s.label}</strong>
                </div>
              );
            })}
          </div>
        </div>

        <div className="split-right" style={{ paddingLeft: '32px' }}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>1단계: 직관적 암묵지 발굴</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>앞선 활동에서 깨달은 나만의 운영 감각이나 노하우를 한 문장으로 적어보세요.</p>
                <textarea
                  value={tacit}
                  onChange={(event) => {
                    setTacit(event.target.value);
                    persist(step, event.target.value);
                  }}
                  placeholder="예: 퇴원 위험 학생은 성적 하락보다 숙제 제출 패턴이 엉킬 때 먼저 감지됩니다."
                  style={{ 
                    width: '100%', minHeight: '150px', padding: '20px', fontSize: '1.1rem',
                    borderRadius: '12px', border: '2px solid var(--border)', outline: 'none', resize: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--secondary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
                <button 
                  className="btn btn-primary" 
                  style={{ marginTop: '24px', background: 'var(--secondary)', width: '100%' }}
                  disabled={!tacit.trim()}
                  onClick={() => {
                    const nextStep = 1;
                    setStep(nextStep);
                    persist(nextStep, tacit);
                  }}
                >
                  AI 프롬프트 변환 엔진 가동 🚀
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>2단계: 구조화된 프롬프트 도출</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>AI가 즉각적으로 이해하고 시스템화 할 수 있는 형태로 변환되었습니다.</p>
                
                <div style={{ background: '#2D3748', color: '#E2E8F0', padding: '24px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.6, overflowX: 'auto', marginBottom: '24px' }}>
                  {prompt}
                </div>
                
                <h4 style={{ marginBottom: '12px', fontSize: '1rem' }}>활용 가능한 확장 프롬프트:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                  {generatedPrompts.slice(1).map((item, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: 'var(--bg-body)', borderRadius: '8px', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
                      💡 {item}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button className="btn btn-ghost" onClick={() => setStep(0)}>다시 작성하기</button>
                  <button 
                    className="btn btn-primary" 
                    style={{ background: 'var(--success)', flex: 1 }}
                    onClick={() => {
                      const nextStep = 2;
                      setStep(nextStep);
                      persist(nextStep, tacit);
                    }}
                  >
                    이해했습니다, 다음으로 →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🧬</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>SECI 사이클이 완성되었습니다!</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                  개인의 추상적인 암묵지(Socialization)를 
                  구체적인 문장으로 표출(Externalization)하고, 
                  AI 프롬프트로 연결(Combination)하여 
                  새로운 자산으로 내면화(Internalization)했습니다.
                </p>
                <button 
                  className="btn btn-primary" 
                  style={{ background: 'var(--primary-dark)', padding: '16px 32px', fontSize: '1.1rem' }}
                  onClick={() => complete({ activityData: { step, tacit, prompt, generatedPrompts, completed: true }, bonusXp: 50 })}
                >
                  SECI 마스터 수료 및 XP 획득 ✨
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
