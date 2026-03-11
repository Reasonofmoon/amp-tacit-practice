import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROLEPLAY_SCENARIOS } from '../data/scenarios';
import { DEV_ROLEPLAY_SCENARIOS } from '../data/developerScenarios';
import ActivityFooter from '../components/ActivityFooter';

const CDM_PROBES = [
  "그 순간 가장 결정적인 단서 1개는 무엇이었나요?",
  "그 단서는 '사실(관찰)'이었나요, '해석(추측)'이었나요?",
  "다른 선택지 2개는 무엇이었고, 왜 버렸나요?",
  "만약 시간이 절반밖에 없었다면, 무엇이 달라졌을까요?",
  "경력 1년차가 같은 상황에서 흔히 하는 실수는 무엇일까요?",
];

const AAR_QUESTIONS = [
  { label: "의도", q: "원래 목표/기준은 무엇이었나요?" },
  { label: "실제", q: "실제로 무슨 일이 일어났나요?" },
  { label: "차이", q: "의도와 실제의 차이는 왜 발생했나요?" },
  { label: "개선", q: "다음에 유지할 것과 바꿀 것은 무엇인가요?" },
];

export default function CdmSimulatorActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const targetScenarios = isDev ? DEV_ROLEPLAY_SCENARIOS : ROLEPLAY_SCENARIOS;
  
  const [phase, setPhase] = useState(0);
  
  const [intuition, setIntuition] = useState({ risk: 3, feeling: "", action: "" });
  const [timeline, setTimeline] = useState(["", "", "", ""]);
  const [probeAns, setProbeAns] = useState({});
  const [aarAns, setAarAns] = useState({});
  const [card, setCard] = useState({ cue: "", interpret: "", action: "", boundary: "", alt: "" });

  const sc = targetScenarios[2];
  const stimulus = sc.steps[0].message;

  const handleNext = () => setPhase(p => Math.min(p + 1, 5));

  const handleAutoFill = () => {
    if (isDev) {
      setCard({
        cue: "수정된 코드가 다른 스킬과 충돌하며 프롬프트 한계치 도과",
        interpret: "공통 프롬프트에 구겨넣기보다 RAG/분할 아키텍처로 넘어가야 할 한계점 도달",
        action: "신규 기능을 워크플로우(.md)로 분리하고 메인 프롬프트에 참조 지시만 남김",
        boundary: "너무 많은 파일 컨텍스트가 주입된 채로 억지 지시를 강행하려 할 때",
        alt: "기능 축소 후 MVP부터 다시 안정화"
      });
    } else {
      setCard({
        cue: "결강 강사의 카톡 발송 지연 시간",
        interpret: "단순 지각이 아닌 무단 결근 가능성 사전 인지",
        action: "대체 강사 1순위 즉시 투입 및 학부모 안심 문자 초안 작성",
        boundary: "대체 강사의 해당 반 진도 파악이 안 된 경우",
        alt: "원장 본인 직접 투입 및 환불 규정 검토"
      });
    }
  };

  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const phases = ["직관 커밋", "타임라인", "CDM 프로브", "AAR 디브리핑", "카드 제작"];

  return (
    <div className="activity-workspace">
      <div className="workspace-header">
        <div className="workspace-progress">
          <span>Phase {Math.min(phase + 1, 5)} / 5</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(Math.min(phase + 1, 5) / 5) * 100}%` }} />
          </div>
        </div>
        <button className="btn btn-ghost" onClick={onBack}>← 나가기</button>
      </div>

      <div className="workspace-content">
        <div className="split-view">
          <div className="split-left">
            <h2 className="question-title">🔍 심층 CDM 시뮬레이터<br/><span style={{fontSize:'1rem', color:'var(--text-muted)'}}>Critical Decision Method</span></h2>
            
            <div className="card" style={{ background: 'var(--primary-light)', borderColor: 'var(--primary)', marginBottom: 'var(--space-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{sc.icon}</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-hover)', fontFamily: 'var(--font-mono)' }}>{sc.title}</span>
              </div>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.6 }}>"{stimulus}"</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {phases.map((pName, i) => (
                <div key={i} className={`choice-btn ${phase >= i ? 'selected' : ''}`} style={{ padding: '16px', cursor: 'default' }}>
                  <div className="choice-number">{i + 1}</div>
                  <div>{pName}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="split-right">
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div key="phase0" variants={variants} initial="hidden" animate="visible" exit="exit" className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: 'var(--warning)', marginBottom: 8 }}>Phase 1. 직관 커밋</h3>
                  <p style={{ marginBottom: 24, fontSize: '0.875rem' }}>분석하지 마시고 30초 내에 떠오르는 직관적 반응을 기록하세요.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, display: 'block' }}>위험도 평가 (1~5)</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button
                            key={n}
                            onClick={() => setIntuition(prev => ({...prev, risk: n}))}
                            style={{ 
                              width: 48, height: 48, borderRadius: 8, fontWeight: 700, fontSize: '1.125rem',
                              border: `2px solid ${intuition.risk === n ? 'var(--warning)' : 'var(--border)'}`,
                              background: intuition.risk === n ? 'var(--warning)' : 'white',
                              color: intuition.risk === n ? 'white' : 'var(--text-muted)'
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, display: 'block' }}>무슨 느낌이 들었나요?</label>
                      <textarea
                        value={intuition.feeling}
                        onChange={e => setIntuition(prev => ({...prev, feeling: e.target.value}))}
                        placeholder="예: 뒷골이 서늘함, 맘카페 컴플레인 예감"
                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', resize: 'none', height: '80px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, display: 'block' }}>지금 당장 할 행동 1가지는?</label>
                      <textarea
                        value={intuition.action}
                        onChange={e => setIntuition(prev => ({...prev, action: e.target.value}))}
                        placeholder="이유 불문하고 몸이 먼저 반응하는 행동"
                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', resize: 'none', height: '80px' }}
                      />
                    </div>
                  </div>
                  
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 24, background: 'var(--warning)' }} onClick={handleNext} disabled={!intuition.action.trim()}>
                    다음 단계 →
                  </button>
                </motion.div>
              )}

              {phase === 1 && (
                <motion.div key="phase1" variants={variants} initial="hidden" animate="visible" exit="exit" className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: 'var(--layer-c)', marginBottom: 8 }}>Phase 2. 타임라인 리빌딩</h3>
                  <p style={{ marginBottom: 16, fontSize: '0.875rem' }}>의사결정 순간을 4단계 프레임으로 쪼개서 복기합니다.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
                    {["첫 신호 인지", "상황 전개 및 정보 수집", "최종 분기점 (의사결정)", "결과 및 수습"].map((label, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--layer-c)', marginBottom: 4 }}>{i + 1}. {label}</div>
                        <input
                          value={timeline[i]}
                          onChange={(e) => {
                            const newTl = [...timeline];
                            newTl[i] = e.target.value;
                            setTimeline(newTl);
                          }}
                          style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem' }}
                        />
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 24, background: 'var(--layer-c)' }} onClick={handleNext} disabled={timeline.filter(t => t.trim()).length < 2}>
                    다음 단계 →
                  </button>
                </motion.div>
              )}

              {phase === 2 && (
                <motion.div key="phase2" variants={variants} initial="hidden" animate="visible" exit="exit" className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: 'var(--layer-b)', marginBottom: 8 }}>Phase 3. CDM 프로브</h3>
                  <p style={{ marginBottom: 16, fontSize: '0.875rem' }}>결정의 배후에 있는 숨은 판단 근거를 5가지 질문으로 파고듭니다.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflowY: 'auto' }}>
                    {CDM_PROBES.map((probe, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--layer-b)', marginBottom: 6 }}>Q{i + 1}. {probe}</div>
                        <textarea
                          value={probeAns[i] || ""}
                          onChange={(e) => setProbeAns({ ...probeAns, [i]: e.target.value })}
                          rows={2}
                          style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem', resize: 'none' }}
                        />
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 24, background: 'var(--layer-b)' }} onClick={handleNext} disabled={Object.keys(probeAns).length < 3}>
                    다음 단계 →
                  </button>
                </motion.div>
              )}

              {phase === 3 && (
                <motion.div key="phase3" variants={variants} initial="hidden" animate="visible" exit="exit" className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: 'var(--success)', marginBottom: 8 }}>Phase 4. AAR 디브리핑</h3>
                  <p style={{ marginBottom: 16, fontSize: '0.875rem' }}>군 성과분석기법(After-Action Review)으로 원래 의도와 실제 결과를 대조합니다.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, overflowY: 'auto' }}>
                    {AAR_QUESTIONS.map((qObj, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span className="tag" style={{ background: 'var(--success)', color: 'white' }}>{qObj.label}</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>{qObj.q}</span>
                        </div>
                        <textarea
                          value={aarAns[i] || ""}
                          onChange={(e) => setAarAns({ ...aarAns, [i]: e.target.value })}
                          rows={2}
                          style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem', resize: 'none' }}
                        />
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 24, background: 'var(--success)' }} onClick={handleNext} disabled={Object.keys(aarAns).length < 3}>
                    다음 단계 →
                  </button>
                </motion.div>
              )}

              {phase === 4 && (
                <motion.div key="phase4" variants={variants} initial="hidden" animate="visible" exit="exit" className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: '#EC4899', marginBottom: 8 }}>Phase 5. 암묵지 카드 제작</h3>
                  <p style={{ marginBottom: 16, fontSize: '0.875rem' }}>지금까지 도출된 암묵지를 신입 강사도 재사용 가능한 1장의 카드로 압축합니다.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
                    {[
                      { key: "cue", label: "결정적 단서", placeholder: "무엇을 보고 들었는가?" },
                      { key: "interpret", label: "해석 규칙", placeholder: "단서를 어떻게 가설로 연결했는가?" },
                      { key: "action", label: "행동 처방", placeholder: "어떤 조치를 취하는가?" },
                      { key: "boundary", label: "경계조건/금기", placeholder: "언제 이 행동을 하면 안 되는가?" },
                      { key: "alt", label: "대안 1개", placeholder: "불가능할 경우의 플랜 B" }
                    ].map((field) => (
                      <div key={field.key} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 100, fontSize: '0.875rem', fontWeight: 700, color: '#EC4899', paddingTop: 8 }}>{field.label}</div>
                        <input
                          value={card[field.key]}
                          onChange={(e) => setCard({ ...card, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          style={{ flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.875rem' }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <ActivityFooter 
                      onComplete={(insight = '') => complete({ ...data, intuition, timeline, probeAns, aarAns, card, insight })}
                      onSkip={() => complete({ ...data, intuition, timeline, probeAns, aarAns, card, insight: 'Skipped' })}
                      onAutoFill={handleAutoFill}
                      disableComplete={!card.cue.trim() || !card.action.trim()}
                    />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
