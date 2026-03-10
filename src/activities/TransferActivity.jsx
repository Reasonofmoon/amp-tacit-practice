import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TRANSFER_QUESTIONS = [
  '첫 학부모 상담 전에 반드시 준비해야 할 것 3가지',
  '레벨테스트 결과를 볼 때 숫자 외에 꼭 봐야 할 것',
  '수업 첫날 학생의 마음을 여는 나만의 방법',
  '학부모 불만이 왔을 때 절대 하면 안 되는 말',
  '퇴원 위험 신호를 가장 빨리 알아차리는 법',
  '강사에게 피드백할 때 나만의 원칙',
];

export default function TransferActivity({ data, saveData, complete, onBack }) {
  const [selected, setSelected] = useState(0);
  const [answers, setAnswers] = useState(data?.answers ?? {});
  const [draft, setDraft] = useState(data?.answers?.[0] ?? '');

  const answerCount = useMemo(
    () => Object.values(answers).filter((value) => typeof value === 'string' && value.trim()).length,
    [answers],
  );

  const commitCurrent = () => {
    const nextAnswers = {
      ...answers,
      [selected]: draft.trim(),
    };

    setAnswers(nextAnswers);
    saveData({ answers: nextAnswers });
    return nextAnswers;
  };

  const handleSelect = (index) => {
    commitCurrent();
    setSelected(index);
    setDraft(answers[index] ?? '');
  };

  const handleNext = () => {
    commitCurrent();
    if (selected < TRANSFER_QUESTIONS.length - 1) {
      handleSelect(selected + 1);
    }
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: 'var(--primary)', color: 'white' }}>Layer C: Application</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>신입 원장/강사에게 전수하기</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>교과서적 조언 말고, 실제 현장에서 쓰이는 나만의 원칙을 메뉴얼화합니다.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        <div className="split-left" style={{ flex: '0 0 320px' }}>
          <h3 style={{ marginBottom: '16px' }}>전수 항목 (6개)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {TRANSFER_QUESTIONS.map((question, index) => {
              const isFilled = answers[index]?.trim();
              const isSelected = selected === index;

              return (
                <button
                  key={index}
                  className={`choice-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelect(index)}
                  style={{ 
                    padding: '16px', 
                    textAlign: 'left',
                    borderColor: isFilled && !isSelected ? 'var(--primary)' : '',
                    background: isFilled && !isSelected ? 'var(--primary-light)' : ''
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: isFilled ? 'var(--primary)' : 'var(--bg-card)',
                      color: isFilled ? 'white' : 'var(--text-muted)',
                      border: isFilled ? 'none' : '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {isFilled ? '✓' : index + 1}
                    </div>
                    <span style={{ fontSize: '0.9rem', lineHeight: 1.4, color: isFilled ? 'var(--primary-dark)' : 'var(--text-main)', fontWeight: isSelected ? 600 : 400 }}>
                      {question}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="split-right" style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            >
              <div className="card" style={{ background: 'var(--layer-c)', border: 'none', color: 'white', marginBottom: '24px' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.8, marginBottom: '8px' }}>MENTOR NOTE #{selected + 1}</p>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{TRANSFER_QUESTIONS[selected]}</h3>
              </div>

              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="예: 첫 상담 전에 최근 시험지와 틀리는 유형 3개를 먼저 분류해서 책상에 올려둡니다."
                style={{ 
                  flex: 1,
                  width: '100%', 
                  padding: '24px', 
                  fontSize: '1.1rem',
                  borderRadius: '16px',
                  border: '2px solid var(--border)',
                  outline: 'none',
                  resize: 'none',
                  transition: 'border-color 0.2s',
                  lineHeight: 1.6
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                  진척도: <strong style={{ color: 'var(--primary)' }}>{answerCount}</strong> / 6
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  {selected < TRANSFER_QUESTIONS.length - 1 ? (
                    <button className="btn btn-primary" onClick={handleNext}>
                      메뉴얼 저장하고 다음 →
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary" 
                      disabled={answerCount < 6}
                      onClick={() => {
                        const nextAnswers = commitCurrent();
                        complete({ activityData: { answers: nextAnswers }, bonusXp: 40 });
                      }}
                      style={{ background: answerCount >= 6 ? 'var(--primary)' : 'var(--border)', color: answerCount >= 6 ? 'white' : 'var(--text-muted)' }}
                    >
                      전수 활동 최종 완료
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
