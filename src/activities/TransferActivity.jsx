import { useMemo, useState } from 'react';
import ActivityShell from '../components/ActivityShell';

const TRANSFER_QUESTIONS = [
  '첫 학부모 상담 전에 반드시 준비해야 할 것 3가지',
  '레벨테스트 결과를 볼 때 숫자 외에 꼭 봐야 할 것',
  '수업 첫날 학생의 마음을 여는 나만의 방법',
  '학부모 불만이 왔을 때 절대 하면 안 되는 말',
  '퇴원 위험 신호를 가장 빨리 알아차리는 법',
  '강사에게 피드백할 때 나만의 원칙',
];

export default function TransferActivity({ data, onSave, onComplete, onBack }) {
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
    onSave({ answers: nextAnswers });
    return nextAnswers;
  };

  const handleSelect = (index) => {
    setSelected(index);
    setDraft(answers[index] ?? '');
  };

  return (
    <ActivityShell
      title="신입에게 전수하기"
      desc="교과서적 조언 말고, 실제로는 이렇게 한다는 기준을 정리합니다. 6문항 모두 쓰면 완료됩니다."
      icon="🎓"
      color="#EC4899"
      time="5분"
      onBack={onBack}
      actions={
        <button
          type="button"
          className="primary-button"
          disabled={answerCount < 6}
          onClick={() => {
            const nextAnswers = commitCurrent();
            onComplete({ activityData: { answers: nextAnswers }, metrics: { transferAll: true } });
          }}
          aria-label="신입 전수 활동 완료"
        >
          전수 활동 완료
        </button>
      }
    >
      <div className="question-grid">
        {TRANSFER_QUESTIONS.map((question, index) => (
          <button
            key={question}
            type="button"
            className={`question-card ${selected === index ? 'is-active' : ''} ${answers[index]?.trim() ? 'is-filled' : ''}`}
            onClick={() => handleSelect(index)}
            aria-label={`${question} 열기`}
          >
            {answers[index]?.trim() ? '✅ ' : ''}
            {question}
          </button>
        ))}
      </div>

      <div className="glass-panel inner-panel">
        <p className="eyebrow">MENTOR NOTE</p>
        <h3>{TRANSFER_QUESTIONS[selected]}</h3>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="예: 첫 상담 전에 최근 시험지와 틀리는 유형 3개를 먼저 분류합니다."
          aria-label="전수 노하우 입력"
        />
        <div className="button-row">
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              commitCurrent();
              if (selected > 0) {
                handleSelect(selected - 1);
              }
            }}
            aria-label="이전 전수 항목"
          >
            이전
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              commitCurrent();
              if (selected < TRANSFER_QUESTIONS.length - 1) {
                handleSelect(selected + 1);
              }
            }}
            aria-label="현재 전수 항목 저장"
          >
            저장하고 다음
          </button>
        </div>
      </div>

      <div className="insight-banner">
        <strong>{answerCount}/6 전수 완료</strong>
        <p>막상 가르치려 할 때 떠오르는 순서와 기준이 진짜 현장 노하우입니다.</p>
      </div>
    </ActivityShell>
  );
}
