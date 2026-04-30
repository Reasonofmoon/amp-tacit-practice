import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPromptFromTacit } from '../utils/promptGenerator';

function buildGeneratedPrompts(tacit, isDev) {
  if (!tacit.trim()) {
    return [];
  }

  if (isDev) {
    return [
      `주어진 레거시 로직을 AppSheet의 Google Sheets 데이터 포맷에 맞게 정규화해줘: ${tacit}`,
      `다음 백오피스 수기 업무를 AppSheet Bot Automation으로 자동화하는 구조를 짜줘: ${tacit}`,
      `이 워크플로우를 노코드 툴(AppSheet/Zapier)용 프롬프트 체크리스트로 만들어줘: ${tacit}`,
    ];
  }

  return [
    createPromptFromTacit(tacit),
    `다음 암묵지를 학부모 설명회 발표안으로 바꿔줘: ${tacit}`,
    `다음 운영 감각을 체크리스트 + 경고 신호 + 실행 문장으로 구조화해줘: ${tacit}`,
  ];
}

const STEPS = [
  { id: 'step-1', label: '1. 노하우 언어화 (표출화)' },
  { id: 'step-2', label: '2. AI 프롬프트 변환 (연결화)' },
  { id: 'step-3', label: '3. 자산화 완료 (내면화)' }
];

export default function SeciActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const [step, setStep] = useState(data?.step ?? 0);
  const [tacit, setTacit] = useState(data?.tacit ?? '');
  const generatedPrompts = useMemo(() => buildGeneratedPrompts(tacit, isDev), [tacit, isDev]);
  const prompt = generatedPrompts[0] ?? '';

  const persist = (nextStep = step, nextTacit = tacit) => {
    saveData({
      step: nextStep,
      tacit: nextTacit,
      prompt: generatedPrompts[0] ?? '',
      generatedPrompts: buildGeneratedPrompts(nextTacit, isDev),
      completed: nextStep === 2,
    });
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: 'var(--lavender)', color: 'white', borderColor: 'var(--lavender)' }}>{isDev ? 'Low-Code Automation' : 'Final Stage: SECI Master'}</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>{isDev ? '백오피스 봇 자동화 실습' : '현장 노하우 AI 자산화 실습'}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{isDev ? '반복되는 수기 업무를 AppSheet나 Zapier가 이해할 수 있는 자동화 프롬프트로 전환합니다.' : '머릿속 감각을 AI가 읽을 수 있는 프롬프트로 전환하여 영구적인 자산으로 만듭니다.'}</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        <div className="split-left" style={{ flex: '0 0 280px' }}>
          <h3 style={{ marginBottom: '16px' }}>{isDev ? 'SECI 자동화 사이클' : 'SECI 변환 사이클'}</h3>
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
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{isDev ? '1단계: 레거시 업무 발굴' : '1단계: 현장 노하우 발굴'}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{isDev ? '학원이나 회사에서 매번 복붙하거나 수기로 옮겨 적는 반복 업무를 적어보세요.' : '앞선 활동에서 깨달은 나만의 운영 감각이나 노하우를 한 문장으로 적어보세요.'}</p>
                <textarea
                  value={tacit}
                  onChange={(event) => {
                    setTacit(event.target.value);
                    persist(step, event.target.value);
                  }}
                  placeholder={isDev ? '예: 매일 저녁 구글 폼으로 들어온 상담 신청을 엑셀에 복붙하고 담당자에게 알림을 보냅니다.' : '예: 퇴원 위험 학생은 성적 하락보다 숙제 제출 패턴이 엉킬 때 먼저 감지됩니다.'}
                  style={{ 
                    width: '100%', minHeight: '150px', padding: '20px', fontSize: '1.1rem',
                    borderRadius: '12px', border: '2px solid var(--border)', outline: 'none', resize: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--secondary)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '24px', width: '100%' }}
                  disabled={!tacit.trim()}
                  onClick={() => {
                    const nextStep = 1;
                    setStep(nextStep);
                    persist(nextStep, tacit);
                  }}
                >
                  {isDev ? '노코드 자동화 프롬프트 변환 🚀' : 'AI 프롬프트 변환 엔진 가동 🚀'}
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>{isDev ? '2단계: 노코드 봇 프롬프트 도출' : '2단계: 구조화된 프롬프트 도출'}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{isDev ? '로우코드 플랫폼이 이해하고 자동화 액션을 만들 수 있는 형태로 변환되었습니다.' : 'AI가 즉각적으로 이해하고 시스템화 할 수 있는 형태로 변환되었습니다.'}</p>
                
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
                  {isDev ? (
                    '수동으로 하던 반복 업무(Socialization)를 텍스트로 표출(Externalization)하고, 노코드 봇 구조로 연결(Combination)하여 자동화 자산으로 내면화(Internalization)했습니다.'
                  ) : (
                    '개인의 추상적인 암묵지(Socialization)를 구체적인 문장으로 표출(Externalization)하고, AI 프롬프트로 연결(Combination)하여 새로운 자산으로 내면화(Internalization)했습니다.'
                  )}
                </p>
                <button
                  className="btn btn-primary"
                  style={{ padding: '16px 32px', fontSize: '1.1rem' }}
                  onClick={() => complete({ activityData: { step, tacit, prompt, generatedPrompts, completed: true }, bonusXp: 50 })}
                >
                  {isDev ? '자동화 변환 챕터 닫기 — 매뉴얼에 새기기' : 'SECI 변환 챕터 닫기 — 매뉴얼에 새기기'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
