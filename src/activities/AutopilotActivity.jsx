import { useMemo, useState } from 'react';
import ActivityShell from '../components/ActivityShell';

const AUTOPILOT_PROMPTS = [
  { area: '학부모 상담', q: '학부모가 "우리 아이 성적이 안 올라요"라고 할 때, 당신이 가장 먼저 하는 것은?', hint: '점수보다 먼저 보는 것이 있다면 그것이 암묵지입니다.' },
  { area: '반 편성', q: '새 학기 반편성을 할 때, 레벨테스트 점수 외에 무의식적으로 고려하는 것은?', hint: '친구 관계, 성격 조합, 학부모 요청처럼 숫자 밖의 기준을 떠올려보세요.' },
  { area: '위험 학생 감지', q: '"이 학생 곧 그만두겠다"는 느낌은 어떤 신호로 옵니까?', hint: '출결, 표정, 숙제 패턴 등 당신만의 안테나가 있습니다.' },
  { area: '수업 관찰', q: '좋은 수업과 나쁜 수업을 교실 문 밖에서도 구분할 수 있습니까? 어떻게?', hint: '소리, 분위기, 학생 자세 같은 문장 밖의 감각을 적어보세요.' },
  { area: '마케팅 타이밍', q: '"지금이 홍보할 때다"라는 감각은 어디서 옵니까?', hint: '시즌, 경쟁학원 동향, 학부모 문의 패턴을 떠올려보세요.' },
  { area: '강사 채용', q: '이력서가 완벽한데도 "이 사람은 아니다"라고 느낀 적이 있습니까? 그 기준은?', hint: '눈빛, 말투, 아이를 보는 태도 같은 기준이 숨어 있을 수 있습니다.' },
];

export default function AutopilotActivity({ data, onSave, onComplete, onBack }) {
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
    onSave({ answers: nextAnswers });
    return nextAnswers;
  };

  const prompt = AUTOPILOT_PROMPTS[current];

  return (
    <ActivityShell
      title="자동조종 탐지기"
      desc="6가지 상황에서 당신이 '그냥' 하는 것을 붙잡아 문장으로 바꿉니다. 4개 이상 답하면 완료할 수 있습니다."
      icon="🧭"
      color="#6366F1"
      time="4분"
      onBack={onBack}
      actions={
        <button
          type="button"
          className="primary-button"
          disabled={answeredCount < 4}
          onClick={() => {
            const nextAnswers = commitCurrent();
            onComplete({ activityData: { answers: nextAnswers }, bonusXp: answeredCount >= 6 ? 10 : 0 });
          }}
          aria-label="자동조종 탐지기 완료"
        >
          자동조종 탐지 완료
        </button>
      }
    >
      <div className="step-dots">
        {AUTOPILOT_PROMPTS.map((item, index) => (
          <button
            key={item.area}
            type="button"
            className={`step-dot ${current === index ? 'is-active' : ''} ${answers[index]?.trim() ? 'is-filled' : ''}`}
            onClick={() => handleMove(index)}
            aria-label={`${item.area} 질문으로 이동`}
          />
        ))}
      </div>

      <div className="glass-panel inner-panel">
        <p className="eyebrow">{current + 1}/6 · {prompt.area}</p>
        <h3>{prompt.q}</h3>
        <p className="hint-copy">💡 {prompt.hint}</p>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="당신의 자동조종 반응을 적어보세요."
          aria-label="자동조종 답변 입력"
        />
        <div className="button-row">
          <button
            type="button"
            className="ghost-button"
            disabled={current === 0}
            onClick={() => {
              commitCurrent();
              handleMove(current - 1);
            }}
            aria-label="이전 질문으로 이동"
          >
            이전
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              commitCurrent();
              if (current < AUTOPILOT_PROMPTS.length - 1) {
                handleMove(current + 1);
              }
            }}
            aria-label="현재 답변 저장"
          >
            {current < AUTOPILOT_PROMPTS.length - 1 ? '저장하고 다음' : '답변 저장'}
          </button>
        </div>
      </div>

      <div className="insight-banner">
        <strong>{answeredCount}개 포착됨</strong>
        <p>무의식적 순서, 질문, 기준은 이미 현장에서 검증된 직관입니다.</p>
      </div>
    </ActivityShell>
  );
}
