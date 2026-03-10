import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ActivityShell from '../components/ActivityShell';
import Timer from '../components/Timer';
import { QUIZZES } from '../data/quizzes';
import { useTimer } from '../hooks/useTimer';
import { calculateQuizBonus, roundPercent } from '../utils/scoring';

export default function QuickQuizActivity({ data, onSave, onComplete, onBack }) {
  const savedResponses = data?.responses ?? [];
  const [responses, setResponses] = useState(savedResponses);
  const [current, setCurrent] = useState(Math.min(savedResponses.length, QUIZZES.length - 1));
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(data?.finished ? 'result' : 'playing');
  const [streak, setStreak] = useState(data?.currentStreak ?? 0);
  const [bestCombo, setBestCombo] = useState(data?.bestCombo ?? 0);
  const [startedAt] = useState(() => data?.startedAt ?? Date.now());
  const [completedTime, setCompletedTime] = useState(data?.totalTime ?? null);
  const timeoutHandlerRef = useRef(() => {});

  const handleTimeout = useCallback(() => {
    timeoutHandlerRef.current();
  }, []);

  const { timeLeft, pause, reset } = useTimer({
    duration: 30,
    autoStart: status === 'playing',
    onExpire: handleTimeout,
  });

  const question = QUIZZES[current];
  const correctCount = useMemo(() => responses.filter((response) => response.correct).length, [responses]);
  const totalBonus = useMemo(() => calculateQuizBonus(correctCount, bestCombo), [bestCombo, correctCount]);
  const totalTime = completedTime ?? data?.totalTime ?? 0;
  const insights = useMemo(() => [...new Set(responses.map((response) => response.insight).filter(Boolean))], [responses]);

  const goNext = useCallback(() => {
    setFeedback(null);
    if (current >= QUIZZES.length - 1) {
      const nextTotalTime = Math.round((Date.now() - startedAt) / 1000);
      setCompletedTime(nextTotalTime);
      setStatus('result');
      pause();
      onSave({
        responses,
        correctCount,
        totalTime: nextTotalTime,
        bestCombo,
        currentStreak: streak,
        insights,
        finished: true,
        startedAt,
      });
      return;
    }

    setCurrent((previous) => previous + 1);
    reset(30, true);
  }, [bestCombo, correctCount, current, insights, onSave, pause, reset, responses, startedAt, streak]);

  const registerAnswer = useCallback(
    (selectedOption, expired = false) => {
      if (status !== 'playing' || feedback) {
        return;
      }

      const selectedQuestion = QUIZZES[current];
      const isCorrect = !expired && selectedOption === selectedQuestion.answer;
      const nextStreak = isCorrect ? streak + 1 : 0;
      const nextBestCombo = Math.max(bestCombo, nextStreak);
      const nextResponses = [
        ...responses,
        {
          questionIndex: current,
          selectedOption,
          correct: isCorrect,
          insight: selectedQuestion.insight,
          timeSpent: 30 - Math.round(timeLeft),
        },
      ];

      setResponses(nextResponses);
      setStreak(nextStreak);
      setBestCombo(nextBestCombo);
      setFeedback({
        correct: isCorrect,
        insight: selectedQuestion.insight,
        earnedXp: isCorrect ? 15 : 0,
        expired,
      });
      pause();
      onSave({
        responses: nextResponses,
        correctCount: nextResponses.filter((response) => response.correct).length,
        bestCombo: nextBestCombo,
        currentStreak: nextStreak,
        insights: [...new Set(nextResponses.map((response) => response.insight).filter(Boolean))],
        finished: false,
        startedAt,
      });
    },
    [bestCombo, current, feedback, onSave, pause, responses, startedAt, status, streak, timeLeft],
  );

  useEffect(() => {
    timeoutHandlerRef.current = () => registerAnswer(-1, true);
  }, [registerAnswer]);

  return (
    <ActivityShell
      title="스피드 퀴즈"
      desc="문항당 30초 안에 베테랑의 반응을 고르세요. 정답마다 +15 XP가 쌓이고, 연속 정답은 콤보를 만듭니다."
      icon="⏱️"
      color="#22C55E"
      time="6분"
      onBack={onBack}
      actions={
        status === 'result' ? (
          <button
            type="button"
            className="primary-button"
            onClick={() =>
              onComplete({
                activityData: {
                  responses,
                  correctCount,
                  totalTime,
                  bestCombo,
                  insights,
                  finished: true,
                },
                bonusXp: totalBonus,
                metrics: {
                  quizTime: totalTime,
                  quizCorrect: correctCount,
                },
              })
            }
            aria-label="퀴즈 완료하고 XP 받기"
          >
            퀴즈 완료하고 XP 받기
          </button>
        ) : null
      }
    >
      {status === 'playing' ? (
        <div className={`quiz-stage ${feedback?.correct ? 'is-correct' : ''} ${feedback && !feedback.correct ? 'is-wrong' : ''}`}>
          <div className="quiz-header">
            <Timer duration={30} timeLeft={timeLeft} label="남은 시간" />
            <div className="quiz-stats">
              <strong>{current + 1}/{QUIZZES.length}</strong>
              <span>정답 {correctCount}개</span>
              <span>🔥 {Math.max(streak, 1)}연속</span>
            </div>
          </div>
          <div className="glass-panel inner-panel">
            <p className="eyebrow">SPEED QUESTION</p>
            <h3>{question.q}</h3>
            <div className="option-list">
              {question.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  className={`option-card ${feedback && index === question.answer ? 'is-answer' : ''}`}
                  onClick={() => registerAnswer(index)}
                  disabled={Boolean(feedback)}
                  aria-label={`${index + 1}번 선택지`}
                >
                  <span>{index + 1}</span>
                  <p>{option}</p>
                </button>
              ))}
            </div>
            {feedback ? (
              <div className={`feedback-card ${feedback.correct ? 'is-correct' : 'is-wrong'}`}>
                <strong>{feedback.correct ? `정답! +${feedback.earnedXp} XP` : feedback.expired ? '시간 초과' : '아쉽습니다'}</strong>
                <p>{feedback.insight}</p>
                <button type="button" className="ghost-button" onClick={goNext} aria-label="다음 문제로 이동">
                  {current === QUIZZES.length - 1 ? '결과 보기' : '다음 문제'}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="quiz-result">
          <div className="score-ring">
            <strong>{roundPercent(correctCount, QUIZZES.length)}%</strong>
            <span>정답률</span>
          </div>
          <div className="result-metrics">
            <article>
              <strong>{correctCount}</strong>
              <span>정답 수</span>
            </article>
            <article>
              <strong>{bestCombo}</strong>
              <span>최고 콤보</span>
            </article>
            <article>
              <strong>{totalBonus}</strong>
              <span>보너스 XP</span>
            </article>
            <article>
              <strong>{totalTime}s</strong>
              <span>총 소요</span>
            </article>
          </div>
          <div className="insight-list">
            {insights.slice(0, 4).map((insight) => (
              <article key={insight} className="insight-card">
                {insight}
              </article>
            ))}
          </div>
        </div>
      )}
    </ActivityShell>
  );
}
