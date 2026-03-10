import { useMemo, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ACTIVITIES, AXES } from '../data/activities';
import { buildPromptPack, buildSeciMap, buildTopInsights } from '../utils/promptGenerator';
import { getActivityProgress } from '../utils/scoring';

function buildAxisScores(state) {
  return AXES.map((axis) => {
    let weightedScore = 0;
    let maxScore = 0;

    ACTIVITIES.forEach((activity) => {
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

export default function ResultReport({ state, levelInfo }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const axisScores = useMemo(() => buildAxisScores(state), [state]);
  const promptPack = useMemo(() => buildPromptPack(state.activityData, state.profile), [state.activityData, state.profile]);
  const topInsights = useMemo(() => buildTopInsights(state.activityData), [state.activityData]);
  const seciMap = useMemo(() => buildSeciMap(state.activityData), [state.activityData]);

  const profileName = state.profile.name?.trim() || '익명 원장';
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

  return (
    <section className="report-shell">
      <div className="section-heading report-heading">
        <div>
          <span className="tag" style={{ marginBottom: '8px' }}>FINAL DIAGNOSTIC</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>암묵지 프로필 리포트</h2>
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
                <Radar name="원장님" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
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

      <div className="report-grid">
        <article className="glass-panel report-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PROMPT PACK</p>
              <h3>AI 프롬프트 팩</h3>
            </div>
          </div>
          <div className="prompt-list">
            {promptPack.map((prompt, index) => (
              <article key={prompt} className="prompt-card">
                <p>{prompt}</p>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => handleCopy(prompt, index)}
                  aria-label={`프롬프트 ${index + 1} 복사`}
                >
                  {copiedIndex === index ? '복사됨' : '복사'}
                </button>
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
          <div className="seci-grid">
            <div>
              <h4>S · 공유화</h4>
              <ul>{seciMap.socialization.length ? seciMap.socialization.map((item) => <li key={item}>{item}</li>) : <li>갤러리 공유가 여기에 모입니다.</li>}</ul>
            </div>
            <div>
              <h4>E · 표출화</h4>
              <ul>{seciMap.externalization.length ? seciMap.externalization.map((item) => <li key={item}>{item}</li>) : <li>위기/전수 답변이 여기에 모입니다.</li>}</ul>
            </div>
            <div>
              <h4>C · 연결화</h4>
              <ul>{seciMap.combination.length ? seciMap.combination.map((item) => <li key={item}>{item}</li>) : <li>SECI 활동의 프롬프트가 여기에 표시됩니다.</li>}</ul>
            </div>
            <div>
              <h4>I · 내면화</h4>
              <ul>{seciMap.internalization.length ? seciMap.internalization.map((item) => <li key={item}>{item}</li>) : <li>퀴즈와 역할극 인사이트가 여기에 축적됩니다.</li>}</ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
