import { useMemo, useState } from 'react';
import ActivityShell from '../components/ActivityShell';
import { ROLEPLAY_SCENARIOS } from '../data/scenarios';
import { calculateRoleplayBonus, calculateRoleplayStyle } from '../utils/scoring';

function getScenarioState(progressMap, scenarioId) {
  return progressMap[scenarioId] ?? {
    stepIndex: 0,
    responses: [],
    complete: false,
  };
}

function buildProgressSnapshot(progressMap) {
  const completedScenarioIds = ROLEPLAY_SCENARIOS.filter((scenario) => getScenarioState(progressMap, scenario.id).complete).map((scenario) => scenario.id);
  const allResponses = ROLEPLAY_SCENARIOS.flatMap((scenario) => getScenarioState(progressMap, scenario.id).responses);
  const totalScore = allResponses.reduce((sum, response) => sum + response.score, 0);
  const maxScore = ROLEPLAY_SCENARIOS.reduce((sum, scenario) => sum + scenario.steps.length * 3, 0);
  const insights = [...new Set(allResponses.map((response) => response.insight).filter(Boolean))];
  const style = calculateRoleplayStyle(totalScore, maxScore);

  return {
    completedScenarioIds,
    totalScore,
    maxScore,
    style,
    insights,
  };
}

export default function RolePlayActivity({ data, onSave, onComplete, onBack }) {
  const [scenarioProgress, setScenarioProgress] = useState(data?.scenarioProgress ?? {});
  const [selectedId, setSelectedId] = useState(data?.completedScenarioIds?.[0] ?? ROLEPLAY_SCENARIOS[0].id);
  const [feedback, setFeedback] = useState(null);

  const snapshot = useMemo(() => buildProgressSnapshot(scenarioProgress), [scenarioProgress]);
  const selectedScenario = ROLEPLAY_SCENARIOS.find((scenario) => scenario.id === selectedId) ?? ROLEPLAY_SCENARIOS[0];
  const currentState = getScenarioState(scenarioProgress, selectedId);
  const currentStep = selectedScenario.steps[currentState.stepIndex];

  const persist = (nextProgress) => {
    const nextSnapshot = buildProgressSnapshot(nextProgress);
    onSave({
      scenarioProgress: nextProgress,
      ...nextSnapshot,
    });
  };

  const handleChoice = (choice, choiceIndex) => {
    if (feedback || currentState.complete) {
      return;
    }

    const nextScenarioState = {
      stepIndex: currentState.stepIndex + 1,
      responses: [
        ...currentState.responses,
        {
          choiceIndex,
          text: choice.text,
          score: choice.score,
          insight: choice.insight,
        },
      ],
      complete: currentState.stepIndex + 1 >= selectedScenario.steps.length,
    };

    const nextProgress = {
      ...scenarioProgress,
      [selectedId]: nextScenarioState,
    };

    setScenarioProgress(nextProgress);
    setFeedback(choice);
    persist(nextProgress);
  };

  return (
    <ActivityShell
      title="역할극 시뮬레이션"
      desc="세 가지 상황에서 상담과 리더십 선택을 해보세요. 시나리오를 모두 완료하면 당신의 상담 스타일이 분석됩니다."
      icon="🎭"
      color="#F97316"
      time="6분"
      onBack={onBack}
      actions={
        snapshot.completedScenarioIds.length === ROLEPLAY_SCENARIOS.length ? (
          <button
            type="button"
            className="primary-button"
            onClick={() =>
              onComplete({
                activityData: {
                  scenarioProgress,
                  ...snapshot,
                },
                bonusXp: calculateRoleplayBonus(snapshot.totalScore),
                metrics: {
                  roleplayScore: snapshot.totalScore,
                },
              })
            }
            aria-label="역할극 활동 완료"
          >
            역할극 완료하고 XP 받기
          </button>
        ) : null
      }
    >
      <div className="scenario-tabs">
        {ROLEPLAY_SCENARIOS.map((scenario) => {
          const complete = snapshot.completedScenarioIds.includes(scenario.id);
          return (
            <button
              key={scenario.id}
              type="button"
              className={`scenario-tab ${selectedId === scenario.id ? 'is-active' : ''} ${complete ? 'is-filled' : ''}`}
              onClick={() => {
                setSelectedId(scenario.id);
                setFeedback(null);
              }}
              aria-label={`${scenario.title} 역할극 열기`}
            >
              <span>{scenario.icon}</span>
              <div>
                <strong>{scenario.title}</strong>
                <p>{scenario.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="roleplay-shell">
        <div className="chat-thread glass-panel inner-panel">
          {selectedScenario.steps.map((step, index) => {
            const response = currentState.responses[index];
            const isCurrent = index === currentState.stepIndex && !currentState.complete;

            return (
              <div key={`${selectedScenario.id}-${step.message}`} className="chat-block">
                <article className="chat-bubble is-npc">
                  <strong>{step.npc}</strong>
                  <p>{step.message}</p>
                </article>
                {response ? (
                  <article className={`chat-bubble is-user score-${response.score}`}>
                    <strong>당신의 선택</strong>
                    <p>{response.text}</p>
                  </article>
                ) : null}
                {isCurrent ? <div className="chat-pulse">현재 선택 단계</div> : null}
              </div>
            );
          })}
        </div>

        <div className="glass-panel inner-panel">
          <p className="eyebrow">CHOICES</p>
          {currentState.complete ? (
            <div className="style-card">
              <strong>이 시나리오를 완료했습니다</strong>
              <p>다른 시나리오를 선택하거나 아래 스타일 분석을 확인해보세요.</p>
            </div>
          ) : (
            <>
              <h3>{currentStep?.message}</h3>
              <div className="option-list">
                {currentStep?.choices.map((choice, index) => (
                  <button
                    key={choice.text}
                    type="button"
                    className="option-card"
                    onClick={() => handleChoice(choice, index)}
                    disabled={Boolean(feedback)}
                    aria-label={`${index + 1}번 선택지`}
                  >
                    <p>{choice.text}</p>
                  </button>
                ))}
              </div>
              {feedback ? (
                <div className={`feedback-card score-${feedback.score}`}>
                  <strong>{feedback.score === 3 ? '좋은 선택입니다' : feedback.score === 1 ? '부분적으로 괜찮습니다' : '관계 손상이 생길 수 있습니다'}</strong>
                  <p>{feedback.insight}</p>
                  <button type="button" className="ghost-button" onClick={() => setFeedback(null)} aria-label="다음 선택으로 이동">
                    계속하기
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className={`style-card is-${snapshot.style.tone}`}>
        <strong>당신의 상담 스타일: {snapshot.style.title}</strong>
        <p>{snapshot.style.desc}</p>
        <span>총점 {snapshot.totalScore}/{snapshot.maxScore}</span>
      </div>
    </ActivityShell>
  );
}
