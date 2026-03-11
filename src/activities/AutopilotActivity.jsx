import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AUTOPILOT_PROMPTS = [
  { area: '학부모 상담', q: '학부모가 "우리 아이 성적이 안 올라요"라고 할 때, 당신이 가장 먼저 하는 것은?', hint: '점수보다 먼저 보는 것이 있다면 그것이 암묵지입니다.' },
  { area: '반 편성', q: '새 학기 반편성을 할 때, 레벨테스트 점수 외에 무의식적으로 고려하는 것은?', hint: '친구 관계, 성격 조합, 학부모 요청처럼 숫자 밖의 기준을 떠올려보세요.' },
  { area: '위험 학생 감지', q: '"이 학생 곧 그만두겠다"는 느낌은 어떤 신호로 옵니까?', hint: '출결, 표정, 숙제 패턴 등 당신만의 안테나가 있습니다.' },
  { area: '수업 관찰', q: '좋은 수업과 나쁜 수업을 교실 문 밖에서도 구분할 수 있습니까? 어떻게?', hint: '소리, 분위기, 학생 자세 같은 문장 밖의 감각을 적어보세요.' },
  { area: '마케팅 타이밍', q: '"지금이 홍보할 때다"라는 감각은 어디서 옵니까?', hint: '시즌, 경쟁학원 동향, 학부모 문의 패턴을 떠올려보세요.' },
  { area: '강사 채용', q: '이력서가 완벽한데도 "이 사람은 아니다"라고 느낀 적이 있습니까? 그 기준은?', hint: '눈빛, 말투, 아이를 보는 태도 같은 기준이 숨어 있을 수 있습니다.' },
];

const DEV_AUTOPILOT_PROMPTS = [
  { area: '에이전트 선택', q: '특정 버그를 만났을 때, 코드 치는 LLM 대신 검색/분석 특화 에이전트를 부르게 되는 직관적 기준은?', hint: '코드의 양? 에러 로그의 형태? 당신만의 기준이 있습니다.' },
  { area: '디버깅 시작점', q: '에러 화면만 보고도 "아 이건 OOO 문제다"라고 파일부터 열어보는 감각은 어디서 옵니까?', hint: '에러 메시지의 첫 단어, 특정 파일명 등 직관적 패스파인딩을 떠올려보세요.' },
  { area: '프롬프트 작성', q: 'AI에게 코딩을 시킬 때, 무의식적으로 항상 맨 마지막에 덧붙이는 필수 제약조건은?', hint: '예: "기존 코드는 지우지 마", "console.log 빼고 해줘" 등' },
  { area: '의존성 충돌', q: 'npm install 에러 텍스트 더미 속에서, 1초 만에 "범인" 라이브러리를 찾아내는 안목은?', hint: '버전 숫자? peer dependencies? 로그의 특정 색상?' },
  { area: '배포 타이밍', q: '로컬 테스트는 다 통과했지만 "지금 배포하면 무조건 터진다"고 멈칫하게 되는 순간은 언제입니까?', hint: '금요일 오후, 특정 환경변수, 관련 라이브러리 업데이트 직후 등' },
  { area: '코드 냄새', q: '다른 팀원의 코드나 AI가 짠 코드를 리뷰할 때, 10초 만에 "이건 엎어야겠다"고 느끼는 징후는?', hint: '중첩된 if문 깊이, useEffect 내의 렌더 함수, 변수명 짓는 방식 등' },
];

export default function AutopilotActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const targetPrompts = isDev ? DEV_AUTOPILOT_PROMPTS : AUTOPILOT_PROMPTS;
  
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(data?.answers ?? {});
  const [draft, setDraft] = useState(data?.answers?.[0] ?? '');

  const answeredCount = useMemo(
    () => Object.values(answers).filter((value) => typeof value === 'string' && value.trim()).length,
    [answers],
  );

  const handleMove = (index) => {
    setCurrent(index);
    setDraft(answers[index] ?? '');
  };

  const commitCurrent = () => {
    const nextAnswers = {
      ...answers,
      [current]: draft.trim(),
    };

    setAnswers(nextAnswers);
    saveData({ answers: nextAnswers });
    return nextAnswers;
  };

  const handleNext = () => {
    commitCurrent();
    if (current < targetPrompts.length - 1) {
      handleMove(current + 1);
    }
  };

  const handlePrev = () => {
    commitCurrent();
    if (current > 0) {
      handleMove(current - 1);
    }
  };

  const prompt = targetPrompts[current];

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div className="workspace-progress">
          <span>Q{current + 1}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((current) / targetPrompts.length) * 100}%` }} />
          </div>
          <span>{targetPrompts.length}</span>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>중단하기</button>
      </header>

      <div className="workspace-content" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={current}
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <span className="tag" style={{ marginBottom: '16px', background: 'var(--layer-b)', color: 'white' }}>Mission {current + 1} : {prompt.area}</span>
            <h2 className="question-title">{prompt.q}</h2>
            
            <div className="card" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary-light)', marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-main)', fontWeight: 500, fontSize: '0.95rem' }}>💡 힌트: {prompt.hint}</p>
            </div>

            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="직관적으로 떠오르는 반응을 즉시 적어보세요."
              className="epic-textarea"
              style={{ 
                width: '100%', 
                minHeight: '200px', 
                padding: '24px', 
                fontSize: '1.125rem',
                borderRadius: '16px',
                border: '2px solid var(--border)',
                outline: 'none',
                resize: 'none',
                transition: 'border-color 0.2s',
                lineHeight: 1.6,
                background: 'white',
                color: 'var(--text-main)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
              <button 
                className="btn btn-ghost" 
                onClick={handlePrev} 
                disabled={current === 0}
              >
                ← 이전
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {answeredCount} / 6 완료
                </span>
                {current < targetPrompts.length - 1 ? (
                  <button className="btn btn-primary" onClick={handleNext}>
                    저장하고 다음 →
                  </button>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    disabled={answeredCount < 4}
                    onClick={() => {
                       const nextAnswers = commitCurrent();
                       complete({ activityData: { answers: nextAnswers }, bonusXp: answeredCount >= 6 ? 20 : 10 });
                    }}
                    style={{ background: answeredCount >= 4 ? 'var(--success)' : 'var(--border)', color: answeredCount >= 4 ? 'white' : 'var(--text-muted)' }}
                  >
                    데이터 추출 완료
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
