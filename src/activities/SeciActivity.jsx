import { useMemo, useState } from 'react';
import ActivityShell from '../components/ActivityShell';
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

export default function SeciActivity({ data, onSave, onComplete, onBack }) {
  const [step, setStep] = useState(data?.step ?? 0);
  const [tacit, setTacit] = useState(data?.tacit ?? '');
  const generatedPrompts = useMemo(() => buildGeneratedPrompts(tacit), [tacit]);
  const prompt = generatedPrompts[0] ?? '';

  const persist = (nextStep = step, nextTacit = tacit) => {
    onSave({
      step: nextStep,
      tacit: nextTacit,
      prompt: createPromptFromTacit(nextTacit),
      generatedPrompts: buildGeneratedPrompts(nextTacit),
      completed: nextStep === 2,
    });
  };

  return (
    <ActivityShell
      title="SECI 변환 실습"
      desc="머릿속 감각을 AI가 읽을 수 있는 프롬프트로 전환합니다."
      icon="🔮"
      color="#8B5CF6"
      time="5분"
      onBack={onBack}
      actions={
        step === 2 ? (
          <button
            type="button"
            className="primary-button"
            onClick={() =>
              onComplete({
                activityData: {
                  step,
                  tacit,
                  prompt,
                  generatedPrompts,
                  completed: true,
                },
              })
            }
            aria-label="SECI 변환 활동 완료"
          >
            SECI 완료하고 XP 받기
          </button>
        ) : null
      }
    >
      <div className="step-tabs">
        {['1. 암묵지 입력', '2. 프롬프트 변환', '3. 결과 이해'].map((label, index) => (
          <div key={label} className={`step-tab ${step === index ? 'is-active' : ''} ${step > index ? 'is-done' : ''}`}>
            {label}
          </div>
        ))}
      </div>

      {step === 0 ? (
        <div className="glass-panel inner-panel">
          <h3>앞선 활동에서 발견한 암묵지를 한 문장으로 적어보세요</h3>
          <textarea
            value={tacit}
            onChange={(event) => {
              setTacit(event.target.value);
              persist(step, event.target.value);
            }}
            placeholder='예: 퇴원 위험 학생은 성적보다 숙제 제출 패턴으로 먼저 감지합니다.'
            aria-label="암묵지 문장 입력"
          />
          <button
            type="button"
            className="primary-button"
            disabled={!tacit.trim()}
            onClick={() => {
              const nextStep = 1;
              setStep(nextStep);
              persist(nextStep, tacit);
            }}
            aria-label="프롬프트 변환 단계로 이동"
          >
            변환하기
          </button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="glass-panel inner-panel">
          <p className="eyebrow">PROMPT OUTPUT</p>
          <h3>AI가 이해할 수 있는 언어로 변환되었습니다</h3>
          <pre className="prompt-preview">{prompt}</pre>
          <div className="prompt-stack">
            {generatedPrompts.slice(1).map((item) => (
              <article key={item} className="prompt-mini-card">
                <p>{item}</p>
              </article>
            ))}
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              const nextStep = 2;
              setStep(nextStep);
              persist(nextStep, tacit);
            }}
            aria-label="결과 이해 단계로 이동"
          >
            이해했습니다
          </button>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="glass-panel inner-panel center-card">
          <div className="celebration-emoji" aria-hidden="true">
            🎉
          </div>
          <h3>SECI 사이클이 완성되었습니다</h3>
          <p>암묵지 → 표출화 → 연결화 → 내면화 흐름이 하나의 프롬프트 자산으로 정리됐습니다.</p>
        </div>
      ) : null}
    </ActivityShell>
  );
}
