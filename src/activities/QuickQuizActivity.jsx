import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QUIZZES } from '../data/quizzes';
import { useTimer } from '../hooks/useTimer';

export default function QuickQuizActivity({ data, saveData, complete, onBack }) {
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState(data?.responses ?? []);
  const [confidence, setConfidence] = useState(50);
  const [strategy, setStrategy] = useState(null); // '직관적 판단' vs '논리적 소거'
  const [phase, setPhase] = useState('strategy'); // 'strategy' -> 'quiz' -> 'feedback' -> 'result'
  
  const question = QUIZZES[current];
  const { timeLeft, pause, reset } = useTimer({
    duration: 30,
    autoStart: phase === 'quiz',
    onExpire: () => handleAnswer(-1, true)
  });

  const handleStrategySelect = (strat) => {
    setStrategy(strat);
    setPhase('quiz');
    reset(30, true);
  };

  const handleAnswer = (selectedOptionIndex, expired = false) => {
    pause();
    const isCorrect = !expired && selectedOptionIndex === question.answer;
    
    const newResponse = {
      qIndex: current,
      selected: selectedOptionIndex,
      correct: isCorrect,
      confidence,
      strategy,
      timeSpent: 30 - timeLeft
    };
    
    const newResponses = [...responses, newResponse];
    setResponses(newResponses);
    saveData({ responses: newResponses });
    setPhase('feedback');
  };

  const nextQuestion = () => {
    if (current >= QUIZZES.length - 1) {
      setPhase('result');
      return;
    }
    setCurrent(c => c + 1);
    setConfidence(50);
    setStrategy(null);
    setPhase('strategy');
  };

  const finishQuiz = () => {
    const correctCount = responses.filter(r => r.correct).length;
    complete({ 
      activityData: { responses, correctCount }, 
      bonusXp: correctCount * 15,
      metrics: { confidenceAvg: responses.reduce((a, b) => a + b.confidence, 0) / responses.length }
    });
  };

  if (phase === 'result') {
    const correctCount = responses.filter(r => r.correct).length;
    return (
      <div className="activity-workspace">
        <header className="workspace-header">
           <h2 className="question-title" style={{ marginBottom: 0 }}>진단 리포트</h2>
           <button className="btn btn-ghost" onClick={finishQuiz}>수납 및 종료</button>
        </header>
        <div className="workspace-content" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div className="radar-container" style={{ flexDirection: 'column', gap: '24px' }}>
            <h3>진단 완료!</h3>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>
              {Math.round((correctCount / QUIZZES.length) * 100)}점
            </div>
            <p style={{ color: 'var(--text-muted)' }}>총 {QUIZZES.length}문제 중 {correctCount}문제 정답</p>
            <button className="btn btn-primary" onClick={finishQuiz} style={{ width: '100%' }}>XP 받고 메인으로</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div className="workspace-progress">
          <span>Q{current + 1}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((current) / QUIZZES.length) * 100}%` }} />
          </div>
          <span>{QUIZZES.length}</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <strong style={{ color: timeLeft < 10 ? 'var(--danger)' : 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
             남은 시간: {Math.ceil(timeLeft)}초
          </strong>
          <button type="button" className="btn btn-ghost" onClick={onBack}>중단</button>
        </div>
      </header>

      <div className="workspace-content">
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          
          {phase === 'strategy' && (
            <div className="strategy-overlay">
              <h3>문제 풀이 전략 선택</h3>
              <p>이 문제를 어떤 방식으로 접근하시겠습니까?</p>
              <div className="strategy-cards">
                <div className="strategy-card" onClick={() => handleStrategySelect('직관적 선택')}>
                  <h4>⚡ 직관적 선택</h4>
                  <p>경험에 비추어 바로 떠오르는 답을 고릅니다.</p>
                </div>
                <div className="strategy-card" onClick={() => handleStrategySelect('논리적 소거')}>
                  <h4>🧠 논리적 소거방식</h4>
                  <p>오답을 하나씩 지워가며 신중하게 선택합니다.</p>
                </div>
              </div>
            </div>
          )}

          {(phase === 'quiz' || phase === 'feedback') && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <span className="tag" style={{ marginBottom: '16px' }}>Layer C: Application</span>
              <h2 className="question-title">{question.q}</h2>
              
              <div className="choice-grid">
                {question.options.map((opt, idx) => {
                  const isSelected = phase === 'feedback' && responses[current]?.selected === idx;
                  const isAnswer = phase === 'feedback' && question.answer === idx;
                  
                  let btnClass = 'choice-btn';
                  if (phase === 'feedback') {
                    if (isAnswer) btnClass += ' selected'; // Highlight correct answer
                    else if (isSelected && !isAnswer) btnClass += ' disabled'; // Highlight wrong selection vaguely
                  }

                  return (
                    <button 
                      key={idx} 
                      className={btnClass}
                      onClick={() => phase === 'quiz' && handleAnswer(idx)}
                      disabled={phase === 'feedback'}
                      style={{ borderColor: isAnswer ? 'var(--success)' : isSelected ? 'var(--danger)' : '' }}
                    >
                      <span className="choice-number">{idx + 1}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {phase === 'quiz' && (
                <div className="confidence-module">
                  <p>이 문제에 대한 확신도: {confidence}%</p>
                  <div className="slider-container">
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>낮음</span>
                    <input 
                      type="range" 
                      min="0" max="100" step="10" 
                      value={confidence} 
                      onChange={(e) => setConfidence(Number(e.target.value))} 
                    />
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>높음</span>
                  </div>
                </div>
              )}

              {phase === 'feedback' && (
                <div className="card" style={{ marginTop: '24px', background: responses[current]?.correct ? 'var(--primary-light)' : '#FEF2F2', borderColor: responses[current]?.correct ? 'var(--primary)' : 'var(--danger)' }}>
                  <h3 style={{ color: responses[current]?.correct ? 'var(--primary-hover)' : 'var(--danger)' }}>
                    {responses[current]?.correct ? '정답입니다! (+15 XP)' : '아쉽습니다.'}
                  </h3>
                  <p style={{ marginTop: '8px', color: 'var(--text-main)', fontWeight: 500 }}>{question.insight}</p>
                  <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={nextQuestion}>
                    {current >= QUIZZES.length - 1 ? '결과 보기' : '다음 문제'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
