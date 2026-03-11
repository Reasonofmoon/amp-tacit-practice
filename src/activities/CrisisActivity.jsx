import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const CRISIS_SCENARIOS = [
  { id: 'parent-call', title: '학부모 항의 전화', desc: '저녁 9시, 화난 학부모가 전화를 걸어왔습니다.', prompts: ['가장 먼저 한 말은?', '그 다음 확인한 것은?', '최종적으로 어떻게 마무리했나요?'] },
  { id: 'teacher-quit', title: '핵심 강사 돌연 퇴사', desc: '수업 시작 1주일 전, 가장 인기 있는 강사가 갑자기 그만둡니다.', prompts: ['24시간 안에 한 일 3가지는?', '학부모에게 어떻게 알렸나요?', '이 경험 이후 바꾼 것은?'] },
  { id: 'enrollment-drop', title: '등록생 급감', desc: '2월인데 신규 등록이 작년의 절반입니다. 주변에 새 학원이 생겼습니다.', prompts: ['가장 먼저 분석한 것은?', '기존 학부모에게 한 행동은?', '3개월 후 결과는?'] },
];

const DEV_CRISIS_SCENARIOS = [
  { id: 'dev-build-fail', title: '패키징 빌드 실패', desc: 'Electron Builder/PyInstaller로 앱을 패키징했는데, 내 컴퓨터에선 되는데 다른 사람 컴퓨터에선 안 켜집니다.', prompts: ['가장 먼저 의심하는 원인은?', '유저에게 어떤 에러 로그/정보를 달라고 요청하나요?', '이후 빌드 파이프라인에 추가한 조치는?'] },
  { id: 'dev-env-crash', title: '환경 변수 증발 사고', desc: '배포된 데스크톱 앱에 .env나 API 키가 누락되어(혹은 노출되어) 핵심 로직이 마비되었습니다.', prompts: ['앱의 확산을 황급히 정지시킨 뒤 한 일 3가지는?', '유저들에게 어떻게 공지했나요?', '이 경험 이후 바꾼 환경변수 관리 아키텍처는?'] },
  { id: 'dev-dependency-hell', title: 'OS 아키텍처 충돌', desc: 'Windows에서는 잘만 도는 앱이 Mac ARM(M1/M2)에서는 네이티브 모듈 에러로 뻗습니다. 출시일은 내일입니다.', prompts: ['가장 먼저 든 생각(판단)은?', '일시적인 우회(Workaround)로 선택한 긴급 조치는?', '이런 데스크톱 앱 파편화에 대한 당신의 궁극적 해결책은?'] },
];

function createScenarioAnswers(previousAnswers, scenarioId, promptIndex, value) {
  const current = [...(previousAnswers[scenarioId] ?? Array(3).fill(''))];
  current[promptIndex] = value;
  return {
    ...previousAnswers,
    [scenarioId]: current,
  };
}

function countCompletedScenarios(answerMap, scenarios) {
  return scenarios.filter((scenario) => (answerMap[scenario.id] ?? []).every((value) => typeof value === 'string' && value.trim())).length;
}

export default function CrisisActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const targetScenarios = isDev ? DEV_CRISIS_SCENARIOS : CRISIS_SCENARIOS;
  
  const [selectedId, setSelectedId] = useState(targetScenarios[0].id);
  const [answers, setAnswers] = useState(data?.answers ?? {});

  const completedScenarios = useMemo(() => countCompletedScenarios(answers, targetScenarios), [answers, targetScenarios]);
  const selectedScenario = targetScenarios.find((scenario) => scenario.id === selectedId) ?? targetScenarios[0];

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: 'var(--warning)', color: 'white' }}>Layer B: Deepening</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>위기의 순간 리플레이</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>세 가지 위기 시나리오를 떠올리고, 즉각적 판단을 입력하세요. 모두 쓰면 완료됩니다.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        <div className="split-left" style={{ flex: '0 0 320px' }}>
          <h3 style={{ marginBottom: '16px' }}>위기 시나리오 선택</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {targetScenarios.map((scenario) => {
              const isFilled = (answers[scenario.id] ?? []).every((value) => value?.trim());
              const isSelected = selectedId === scenario.id;

              return (
                <button
                  key={scenario.id}
                  className={`choice-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedId(scenario.id)}
                  style={{ 
                    padding: '16px', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start',
                    gap: '4px',
                    borderColor: isFilled && !isSelected ? 'var(--success)' : ''
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <strong style={{ fontSize: '1rem' }}>{scenario.title}</strong>
                    {isFilled && <span style={{ color: 'var(--success)', fontSize: '0.875rem' }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 400, textAlign: 'left' }}>{scenario.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="split-right" style={{ paddingLeft: '24px' }}>
          <motion.div
            key={selectedScenario.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card" style={{ marginBottom: '24px', background: 'var(--bg-card-hover)', border: 'none' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{selectedScenario.title} 대응 로그</h3>
              <p style={{ color: 'var(--text-muted)' }}>{selectedScenario.desc}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedScenario.prompts.map((promptText, index) => (
                <div key={index}>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Q. {promptText}</p>
                  <textarea
                    value={answers[selectedScenario.id]?.[index] ?? ''}
                    onChange={(event) => {
                      const nextAnswers = createScenarioAnswers(answers, selectedScenario.id, index, event.target.value);
                      setAnswers(nextAnswers);
                      saveData({ answers: nextAnswers });
                    }}
                    placeholder="그 순간 실제로 했던 대응을 상세히 적어보세요."
                    style={{ 
                      width: '100%', 
                      minHeight: '80px', 
                      padding: '16px', 
                      fontSize: '1rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--warning)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
            </div>

            <div className="confidence-module" style={{ marginTop: '32px', borderColor: 'var(--warning)' }}>
              <p style={{ marginBottom: '16px' }}><strong style={{ color: 'var(--warning)' }}>{completedScenarios} / 3</strong> 시나리오 분석 완료</p>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', background: completedScenarios === 3 ? 'var(--warning)' : 'var(--border)', color: completedScenarios === 3 ? 'white' : 'var(--text-muted)' }}
                disabled={completedScenarios < 3}
                onClick={() => complete({ activityData: { answers }, bonusXp: 30 })}
              >
                위기 리플레이 추출 완료
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
