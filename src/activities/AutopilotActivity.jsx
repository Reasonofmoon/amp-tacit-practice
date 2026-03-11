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
  { area: '권한 및 인증', q: '구글 워크스페이스(Drive/Sheets) API 권한 에러 해결 시 1순위로 확인하는 것은?', hint: 'Manifest 파일(appsscript.json)의 oauthScopes 배열이나 Cloud Project 연동 여부를 떠올려보세요.' },
  { area: '대용량 데이터 처리', q: '수만 줄의 시트 데이터를 반복문으로 돌릴 때, 6분 Time Limit 에러를 회피하는 당신만의 직관은?', hint: 'getValues() 배치 처리, Continuation Token, 릴레이 트리거 등의 회피 패턴을 적어보세요.' },
  { area: '캐싱 및 배포', q: 'Apps Script 웹앱 로직을 수정했는데 브라우저에서 반영이 안 될 때 느끼는 "아, 역시" 하는 순간은?', hint: '새 버전으로 재배포(Manage Deployments), 브라우저 캐시 무효화, /dev URL로의 전환 등을 떠올려보세요.' },
  { area: '백그라운드 디버깅', q: '시간 구동(Time-driven) 트리거로 돌아가는 코드가 오작동할 때 에러를 추적하는 노하우는?', hint: 'Logger.log 한계, Stackdriver(GCP) 에러 리포팅, 이메일/슬랙 알림 훅 스니펫 등을 적어보세요.' },
  { area: '사용자 UI 설계', q: 'HTML Service로 커스텀 폼을 만들 때, 기존 구글 폼(Google Forms) 대신 굳이 이걸 쓰는 결정적 이유는?', hint: 'doGet/doPost 활용, 실시간 시트 데이터 양방향 바인딩, Bootstrap/Tailwind CSS 연동 등을 떠올려보세요.' },
  { area: 'LLM API 결합', q: 'Apps Script 내에서 외부 AI API(OpenAI/Gemini) 엔드포인트를 호출할 때 가장 신경 쓰이는 제약사항은?', hint: 'UrlFetchApp의 100MB 페이로드 제한, 대기 타임아웃, API 키 프로퍼티 은닉(PropertiesService) 등을 떠올려보세요.' },
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
