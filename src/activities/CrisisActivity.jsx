import { useMemo, useState } from 'react';
import ActivityShell from '../components/ActivityShell';

const CRISIS_SCENARIOS = [
  { id: 'parent-call', title: '학부모 항의 전화', desc: '저녁 9시, 화난 학부모가 전화를 걸어왔습니다.', prompts: ['가장 먼저 한 말은?', '그 다음 확인한 것은?', '최종적으로 어떻게 마무리했나요?'] },
  { id: 'teacher-quit', title: '핵심 강사 돌연 퇴사', desc: '수업 시작 1주일 전, 가장 인기 있는 강사가 갑자기 그만둡니다.', prompts: ['24시간 안에 한 일 3가지는?', '학부모에게 어떻게 알렸나요?', '이 경험 이후 바꾼 것은?'] },
  { id: 'enrollment-drop', title: '등록생 급감', desc: '2월인데 신규 등록이 작년의 절반입니다. 주변에 새 학원이 생겼습니다.', prompts: ['가장 먼저 분석한 것은?', '기존 학부모에게 한 행동은?', '3개월 후 결과는?'] },
];

function createScenarioAnswers(previousAnswers, scenarioId, promptIndex, value) {
  const current = [...(previousAnswers[scenarioId] ?? Array(3).fill(''))];
  current[promptIndex] = value;
  return {
    ...previousAnswers,
    [scenarioId]: current,
  };
}

function countCompletedScenarios(answerMap) {
  return CRISIS_SCENARIOS.filter((scenario) => (answerMap[scenario.id] ?? []).every((value) => typeof value === 'string' && value.trim())).length;
}

export default function CrisisActivity({ data, onSave, onComplete, onBack }) {
  const [selectedId, setSelectedId] = useState(CRISIS_SCENARIOS[0].id);
  const [answers, setAnswers] = useState(data?.answers ?? {});

  const completedScenarios = useMemo(() => countCompletedScenarios(answers), [answers]);

  const selectedScenario = CRISIS_SCENARIOS.find((scenario) => scenario.id === selectedId) ?? CRISIS_SCENARIOS[0];

  return (
    <ActivityShell
      title="위기의 순간 리플레이"
      desc="세 가지 위기를 다시 떠올리고, 그때의 즉각적 판단을 말로 복기합니다. 세 시나리오를 모두 쓰면 완료됩니다."
      icon="⚡"
      color="#F59E0B"
      time="5분"
      onBack={onBack}
      actions={
        <button
          type="button"
          className="primary-button"
          disabled={completedScenarios < 3}
          onClick={() => onComplete({ activityData: { answers, completedScenarios }, metrics: { crisisAll: true } })}
          aria-label="위기 리플레이 완료"
        >
          위기 리플레이 완료
        </button>
      }
    >
      <div className="scenario-list">
        {CRISIS_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            className={`scenario-card ${selectedId === scenario.id ? 'is-active' : ''} ${(answers[scenario.id] ?? []).every((value) => value?.trim()) ? 'is-filled' : ''}`}
            onClick={() => setSelectedId(scenario.id)}
            aria-label={`${scenario.title} 시나리오 열기`}
          >
            <strong>{scenario.title}</strong>
            <span>{scenario.desc}</span>
          </button>
        ))}
      </div>

      <div className="glass-panel inner-panel">
        <p className="eyebrow">CRISIS LOG</p>
        <h3>{selectedScenario.title}</h3>
        <p className="muted-copy">{selectedScenario.desc}</p>
        <div className="stack-list">
          {selectedScenario.prompts.map((prompt, index) => (
            <label key={prompt} className="prompt-block">
              <span>{prompt}</span>
              <textarea
                value={answers[selectedScenario.id]?.[index] ?? ''}
                onChange={(event) => {
                  const nextAnswers = createScenarioAnswers(answers, selectedScenario.id, index, event.target.value);
                  setAnswers(nextAnswers);
                  onSave({ answers: nextAnswers, completedScenarios: countCompletedScenarios(nextAnswers) });
                }}
                placeholder="그 순간 실제로 했던 대응을 적어보세요."
                aria-label={`${selectedScenario.title} 질문 ${index + 1}`}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="insight-banner">
        <strong>{completedScenarios}/3 시나리오 완성</strong>
        <p>위기 때 즉각적으로 튀어나오는 대응은 대부분 경험이 응축된 판단 프레임입니다.</p>
      </div>
    </ActivityShell>
  );
}
