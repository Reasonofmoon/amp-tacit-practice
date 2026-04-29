import { useState } from 'react';
import { motion } from 'framer-motion';
import { QUIZZES } from '../data/quizzes';
import { DEV_QUIZZES } from '../data/developerQuizzes';
import { useTimer } from '../hooks/useTimer';

function normalizeQuiz(rawQuiz) {
  if (!rawQuiz) {
    return null;
  }

  const normalizedOptions = rawQuiz.options.map((option) =>
    typeof option === 'string'
      ? { text: option, isCorrect: false, insight: rawQuiz.insight }
      : option,
  );
  const answerIndex = typeof rawQuiz.answer === 'number'
    ? rawQuiz.answer
    : normalizedOptions.findIndex((option) => option.isCorrect);
  const answer = answerIndex >= 0 ? answerIndex : 0;

  return {
    id: rawQuiz.id ?? rawQuiz.q ?? rawQuiz.scenario,
    q: rawQuiz.q ?? rawQuiz.scenario,
    options: normalizedOptions.map((option) => option.text),
    answer,
    insight: rawQuiz.insight ?? normalizedOptions[answer]?.insight ?? '',
  };
}

export default function QuickQuizActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const targetQuizzes = (isDev ? DEV_QUIZZES : QUIZZES).map(normalizeQuiz).filter(Boolean);
  
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState(data?.responses ?? []);
  const [confidence, setConfidence] = useState(50);
  const [strategy, setStrategy] = useState(null); // '직관적 판단' vs '논리적 소거'
  const [phase, setPhase] = useState('strategy'); // 'strategy' -> 'quiz' -> 'feedback' -> 'result'
  
  const question = targetQuizzes[current];
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
    if (phase !== 'quiz') {
      return;
    }
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
    if (current >= targetQuizzes.length - 1) {
      setPhase('result');
      return;
    }
    setCurrent(c => c + 1);
    setConfidence(50);
    setStrategy(null);
    setPhase('strategy');
  };

  const finishQuiz = () => {
    const correctResponses = responses.filter((r) => r.correct);
    const correctCount = correctResponses.length;
    const totalTime = responses.reduce((sum, r) => sum + (r.timeSpent ?? 0), 0);
    const confidenceAvg = responses.length > 0
      ? responses.reduce((a, b) => a + b.confidence, 0) / responses.length
      : 0;

    // 정답 문항의 insight 만 모아 — 발견 카드 / 프롬프트 선물의 컨텍스트로 사용.
    const insights = correctResponses
      .map((r) => targetQuizzes[r.qIndex]?.insight)
      .filter(Boolean);

    // 문항별 사용자 응답 상세 — 프롬프트 선물에 그대로 인용해 워크북 재구성에 필요한
    // 컨텍스트를 AI에 제공.
    const responseDetails = responses.map((r) => {
      const q = targetQuizzes[r.qIndex];
      return {
        question: q?.q ?? '',
        userAnswer: r.selected >= 0 ? (q?.options[r.selected] ?? '') : '시간 초과',
        correctAnswer: q?.options[q?.answer] ?? '',
        isCorrect: r.correct,
        insight: q?.insight ?? '',
        confidence: r.confidence,
        timeSpent: r.timeSpent,
      };
    });

    complete({
      activityData: {
        responses,
        responseDetails,
        correctCount,
        totalTime,
        insights,
        finished: true,
      },
      bonusXp: correctCount * 15,
      metrics: {
        quizTime: totalTime,
        quizCorrect: correctCount,
        confidenceAvg,
      },
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
              {Math.round((correctCount / targetQuizzes.length) * 100)}점
            </div>
            <p style={{ color: 'var(--text-muted)' }}>총 {targetQuizzes.length}문제 중 {correctCount}문제 정답</p>
            <button className="btn btn-primary" onClick={finishQuiz} style={{ width: '100%' }}>매뉴얼에 페이지 채우고 홈으로</button>
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
            <div className="progress-fill" style={{ width: `${((current) / targetQuizzes.length) * 100}%` }} />
          </div>
          <span>{targetQuizzes.length}</span>
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
            <div className="strategy-overlay" style={{ background: 'var(--bg-card)', border: '2px solid var(--primary)', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ color: 'var(--primary)' }}>문제 풀이 전략 선택</h3>
              <p style={{ color: 'var(--text-main)', marginBottom: '16px' }}>이 문제를 어떤 방식으로 접근하시겠습니까?</p>
              <div className="strategy-cards">
                <div className="strategy-card" onClick={() => handleStrategySelect('직관적 선택')} style={{ background: 'var(--bg-app)' }}>
                  <h4 style={{ color: 'var(--text-main)' }}>⚡ 직관적 선택</h4>
                  <p style={{ color: 'var(--text-muted)' }}>경험에 비추어 바로 떠오르는 답을 고릅니다.</p>
                </div>
                <div className="strategy-card" onClick={() => handleStrategySelect('논리적 소거')} style={{ background: 'var(--bg-app)' }}>
                  <h4 style={{ color: 'var(--text-main)' }}>🧠 논리적 소거방식</h4>
                  <p style={{ color: 'var(--text-muted)' }}>오답을 하나씩 지워가며 신중하게 선택합니다.</p>
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
                  }

                  return (
                    <button 
                      key={idx} 
                      className={btnClass}
                      onClick={() => phase === 'quiz' && handleAnswer(idx)}
                      disabled={phase === 'feedback'}
                      style={{ 
                        borderColor: isAnswer ? 'var(--success)' : isSelected && !isAnswer ? 'var(--danger)' : '',
                        opacity: phase === 'feedback' && !isAnswer && !isSelected ? 0.6 : 1,
                        background: isSelected && !isAnswer ? '#FEF2F2' : '',
                        color: isSelected && !isAnswer ? 'var(--danger)' : 'var(--text-main)',
                        cursor: phase === 'feedback' ? 'default' : 'pointer'
                      }}
                    >
                      <span className="choice-number" style={{
                        background: isAnswer ? 'var(--success)' : isSelected && !isAnswer ? 'var(--danger)' : '',
                        color: isAnswer || isSelected ? 'white' : '',
                        borderColor: isAnswer ? 'var(--success)' : isSelected && !isAnswer ? 'var(--danger)' : ''
                      }}>{idx + 1}</span>
                      <span style={{ fontWeight: isAnswer || isSelected ? 700 : 500 }}>{opt}</span>
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
                    {responses[current]?.correct ? '정답입니다 — 한 줄이 매뉴얼에 새겨졌어요 (+15 페이지)' : '아쉽습니다 — 다음 문장에서 다시 가다듬어 보세요.'}
                  </h3>
                  <p style={{ marginTop: '8px', color: 'var(--text-main)', fontWeight: 500 }}>{question.insight}</p>
                  <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={nextQuestion}>
                    {current >= targetQuizzes.length - 1 ? '결과 보기' : '다음 문제'}
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
