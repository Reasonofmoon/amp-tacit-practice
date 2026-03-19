import { useMemo, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ACTIVITIES, AXES } from '../data/activities';
import { DEV_ACTIVITIES, DEV_AXES } from '../data/developerActivities';
import { buildPromptPack, buildSeciMap, buildTopInsights, buildVibeCodingPrompts } from '../utils/promptGenerator';
import { getActivityProgress } from '../utils/scoring';
import { PROVIDERS, getStoredApiKey } from '../utils/llmClient';
import GlobalAIToolbar from './GlobalAIToolbar';
import AITaskRunner from './AITaskRunner';
import KnowledgeGraph from './KnowledgeGraph';

const PROVIDER_ORDER = ['gemini', 'openai', 'claude'];

function buildAxisScores(state, isDev = false) {
  const targetAxes = isDev ? DEV_AXES : AXES;
  const targetActivities = isDev ? DEV_ACTIVITIES : ACTIVITIES;

  return targetAxes.map((axis) => {
    let weightedScore = 0;
    let maxScore = 0;

    targetActivities.forEach((activity) => {
      const weight = activity.axis[axis.key] ?? 0;
      if (!weight) {
        return;
      }

      maxScore += weight;
      weightedScore += weight * getActivityProgress(activity.id, state.activityData[activity.id]);
    });

    return {
      ...axis,
      score: Math.round(maxScore === 0 ? 0 : (weightedScore / maxScore) * 100),
    };
  });
}

export default function ResultReport({ state, levelInfo, isDev }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [vibeCopied, setVibeCopied] = useState(null);

  // Global AI State
  const [activeProvider, setActiveProvider] = useState('gemini');
  const [apiKeys, setApiKeys] = useState(() => {
    const keys = {};
    PROVIDER_ORDER.forEach((id) => { keys[id] = getStoredApiKey(id); });
    return keys;
  });
  const [selectedModels, setSelectedModels] = useState(() => {
    const models = {};
    PROVIDER_ORDER.forEach((id) => { models[id] = PROVIDERS[id].defaultModel; });
    return models;
  });

  const axisScores = useMemo(() => buildAxisScores(state, isDev), [state, isDev]);
  const promptPack = useMemo(() => buildPromptPack(state.activityData, state.profile, isDev), [state.activityData, state.profile, isDev]);
  const vibeCodingPrompts = useMemo(() => buildVibeCodingPrompts(state.activityData, state.profile, isDev, axisScores), [state.activityData, state.profile, isDev, axisScores]);
  const topInsights = useMemo(() => buildTopInsights(state.activityData), [state.activityData]);
  const seciMap = useMemo(() => buildSeciMap(state.activityData), [state.activityData]);

  const profileName = state.profile.name?.trim() || (isDev ? '익명 개발자' : '익명 원장');
  const career = state.profile.career?.trim() || '경력 미입력';
  const academy = state.profile.academy?.trim() || '우리 학원';

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1400);
    } catch {
      setCopiedIndex(index);
    }
  };

  const handleVibeCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setVibeCopied(index);
      window.setTimeout(() => setVibeCopied(null), 1400);
    } catch {
      setVibeCopied(index);
    }
  };

  return (
    <section className="report-shell">
      <div className="section-heading report-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="tag" style={{ marginBottom: '8px' }}>FINAL DIAGNOSTIC</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>암묵지 프로필 리포트</h2>
          <button className="btn btn-sm btn-outline print-hide" style={{ marginTop: '12px' }} onClick={() => window.print()}>
            🖨️ PDF 저장 / 인쇄하기
          </button>
        </div>
        <div style={{ textAlign: 'right' }}>
          <strong style={{ fontSize: '2rem', color: 'var(--primary)', lineHeight: 1 }}>{state.xp} XP</strong>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>Total Experience</div>
        </div>
      </div>

      <div className="report-grid">
        <article className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            <div>
              <p className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>PROFILE CARD</p>
              <h3 style={{ fontSize: '1.5rem', marginTop: '4px' }}>{profileName}</h3>
              <p style={{ color: 'var(--text-main)', fontWeight: 500 }}>{career} · {academy}</p>
            </div>
            <div style={{ background: 'var(--primary-light)', padding: '8px 16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>{levelInfo.icon}</div>
              <strong style={{ color: 'var(--primary)', fontSize: '0.875rem' }}>{levelInfo.title}</strong>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{state.completed.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>완료 활동</div>
            </div>
            <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{state.badges.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>획득 뱃지</div>
            </div>
            <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{state.maxCombo}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>최대 콤보</div>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '12px', color: 'var(--text-main)' }}>핵심 암묵지 Top 3</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topInsights.length === 0 ? <li style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>활동 답변이 쌓이면 여기에 당신만의 핵심 통찰이 요약됩니다.</li> : null}
              {topInsights.map((insight, idx) => (
                <li key={idx} style={{ padding: '12px', background: 'var(--bg-app)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)', borderLeft: '3px solid var(--primary)' }}>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="card">
          <div style={{ marginBottom: '24px' }}>
             <p className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>RADAR MAP</p>
             <h3 style={{ fontSize: '1.25rem' }}>발견된 암묵지 영역</h3>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={axisScores}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="label" tick={{ fill: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={isDev ? "개발자님" : "원장님"} dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '16px' }}>
            {axisScores.map((axis) => (
              <div key={axis.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-app)', borderRadius: '6px', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{axis.label}</span>
                <strong style={{ color: 'var(--text-main)' }}>{axis.score}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* ─── KNOWLEDGE GRAPH ─── */}
      <article className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ marginBottom: '16px' }}>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>KNOWLEDGE GRAPH</p>
          <h3 style={{ fontSize: '1.25rem' }}>🕸️ 암묵지 지식그래프</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>인사이트 간 연결을 시각적으로 탐색하세요 — 노드를 드래그하거나 호버하면 상세 정보가 표시됩니다</p>
        </div>
        <KnowledgeGraph axisScores={axisScores} activityData={state.activityData} isDev={isDev} />
      </article>

      <div className="report-grid">
        <GlobalAIToolbar
          activeProvider={activeProvider}
          setActiveProvider={setActiveProvider}
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          selectedModels={selectedModels}
          setSelectedModels={setSelectedModels}
        />

        <article className="glass-panel report-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PROMPT PACK</p>
              <h3>AI 프롬프트 팩</h3>
            </div>
          </div>
          <div className="prompt-list">
            {promptPack.map((prompt, index) => (
              <article key={index} className="prompt-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: 'none', padding: 0 }}>
                <div style={{ 
                  background: 'var(--bg-app)', 
                  color: 'var(--text-main)', 
                  padding: '24px', 
                  borderRadius: '12px', 
                  fontSize: '0.9rem', 
                  lineHeight: '1.6', 
                  whiteSpace: 'pre-wrap',
                  border: '1px solid var(--border)',
                  fontFamily: 'var(--font-mono, monospace)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  {prompt}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                  onClick={() => handleCopy(prompt, index)}
                  aria-label="프롬프트 템플릿 복사"
                >
                  {copiedIndex === index ? '✅ 클립보드에 복사됨' : '📋 전체 프롬프트 복사하기'}
                </button>
                <AITaskRunner 
                  prompt={prompt} 
                  activeProvider={activeProvider}
                  currentKey={apiKeys[activeProvider]}
                  currentModel={selectedModels[activeProvider]}
                />
              </article>
            ))}
          </div>
        </article>

        {/* ─── VIBE CODING SECTION ─── */}
        <article className="glass-panel report-card vibe-coding-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">VIBE CODING</p>
              <h3>🎯 맞춤형 바이브코딩 프롬프트</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                레이더맵 분석 결과 기반 — 약한 영역을 보완하는 앱/솔루션을 AI 코딩 도구로 즉시 개발하세요
              </p>
            </div>
          </div>
          <div className="vibe-prompt-grid">
            {vibeCodingPrompts.map((vp, index) => (
              <article key={index} className="vibe-prompt-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="vibe-prompt-header">
                  <span className="vibe-prompt-icon">{vp.icon}</span>
                  <div>
                    <strong className="vibe-prompt-label">{vp.label}</strong>
                    <p className="vibe-prompt-desc">{vp.desc}</p>
                  </div>
                </div>
                <div style={{
                  background: 'var(--bg-app)',
                  color: 'var(--text-main)',
                  padding: '20px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'var(--font-mono, monospace)',
                  maxHeight: '300px',
                  overflow: 'auto',
                  border: '1px solid var(--border)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  {vp.prompt}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem' }}
                  onClick={() => handleVibeCopy(vp.prompt, index)}
                  aria-label="바이브코딩 프롬프트 복사"
                >
                  {vibeCopied === index ? '✅ 복사됨!' : `📋 ${vp.icon} 프롬프트 복사`}
                </button>
                <AITaskRunner 
                  prompt={vp.prompt} 
                  activeProvider={activeProvider}
                  currentKey={apiKeys[activeProvider]}
                  currentModel={selectedModels[activeProvider]}
                />
              </article>
            ))}
          </div>
        </article>

        <article className="glass-panel report-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SECI MAP</p>
              <h3>지식 전환 흐름</h3>
            </div>
          </div>
          <div className="seci-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '24px', 
            marginTop: '24px' 
          }}>
            <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '1.3rem' }}>🌱</span>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-light)', fontWeight: 600 }}>S · 공유화</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.5' }}>
                {seciMap.socialization.length ? seciMap.socialization.map((item) => <li key={item}>{item}</li>) : <li>갤러리 공유가 여기에 모입니다.</li>}
              </ul>
            </div>
            
            <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '1.3rem' }}>🗣️</span>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-light)', fontWeight: 600 }}>E · 표출화</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.5' }}>
                {seciMap.externalization.length ? seciMap.externalization.map((item) => <li key={item}>{item}</li>) : <li>위기/전수 답변이 여기에 모입니다.</li>}
              </ul>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '1.3rem' }}>🔗</span>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-light)', fontWeight: 600 }}>C · 연결화</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.5' }}>
                {seciMap.combination.length ? seciMap.combination.map((item) => <li key={item}>{item}</li>) : <li>SECI 활동의 프롬프트가 여기에 표시됩니다.</li>}
              </ul>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '1.3rem' }}>🧠</span>
                <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-light)', fontWeight: 600 }}>I · 내면화</h4>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.95rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.5' }}>
                {seciMap.internalization.length ? seciMap.internalization.map((item) => <li key={item}>{item}</li>) : <li>퀴즈와 역할극 인사이트가 여기에 축적됩니다.</li>}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
