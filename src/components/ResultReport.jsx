import { Suspense, useMemo } from 'react';
import { ACTIVITIES, AXES } from '../data/activities';
import { DEV_ACTIVITIES, DEV_AXES } from '../data/developerActivities';
import { buildSeciMap, buildTopInsights } from '../utils/promptGenerator';
import { getActivityProgress } from '../utils/scoring';
import { lazyWithRetry } from '../utils/lazyWithRetry';

const ReportRadarCard = lazyWithRetry(() => import('./ReportRadarCard'), 'ReportRadarCard');
const KnowledgeGraph = lazyWithRetry(() => import('./KnowledgeGraph'), 'KnowledgeGraph');

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

function ReportSectionFallback() {
  return (
    <div className="card" style={{ minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      필요한 리포트 모듈을 불러오는 중입니다.
    </div>
  );
}

export default function ResultReport({ state, levelInfo, activeJourney = 'director', onOpenAIWorkbench }) {
  const isDev = activeJourney === 'developer';

  const axisScores = useMemo(() => buildAxisScores(state, isDev), [state, isDev]);
  const topInsights = useMemo(() => buildTopInsights(state.activityData), [state.activityData]);
  const seciMap = useMemo(() => buildSeciMap(state.activityData), [state.activityData]);

  const profileName = state.profile.name?.trim() || (isDev ? '익명 개발자' : '익명 원장');
  const career = state.profile.career?.trim() || '경력 미입력';
  const academy = state.profile.academy?.trim() || '우리 학원';
  const seciSections = [
    {
      key: 'socialization',
      icon: '🌱',
      title: 'S · 공유화',
      empty: '갤러리 공유가 여기에 모입니다.',
      accent: '#22C55E',
      tint: 'rgba(34, 197, 94, 0.12)',
    },
    {
      key: 'externalization',
      icon: '🗣️',
      title: 'E · 표출화',
      empty: '위기/전수 답변이 여기에 모입니다.',
      accent: '#8B5CF6',
      tint: 'rgba(139, 92, 246, 0.12)',
    },
    {
      key: 'combination',
      icon: '🔗',
      title: 'C · 연결화',
      empty: 'SECI 활동의 프롬프트가 여기에 표시됩니다.',
      accent: '#0EA5E9',
      tint: 'rgba(14, 165, 233, 0.12)',
    },
    {
      key: 'internalization',
      icon: '🧠',
      title: 'I · 내면화',
      empty: '퀴즈와 역할극 인사이트가 여기에 축적됩니다.',
      accent: '#F59E0B',
      tint: 'rgba(245, 158, 11, 0.14)',
    },
  ];

  const seciCardStyle = {
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
    padding: '24px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(148, 163, 184, 0.22)',
    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
  };

  const seciCardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.24)',
    paddingBottom: '12px',
  };

  const seciIconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    flexShrink: 0,
  };

  const seciListStyle = {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '0.95rem',
    color: '#334155',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    lineHeight: '1.7',
    fontWeight: 500,
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

        <Suspense fallback={<ReportSectionFallback />}>
          <ReportRadarCard axisScores={axisScores} isDev={isDev} />
        </Suspense>
      </div>

      <article className="card" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ marginBottom: '16px' }}>
          <p className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>KNOWLEDGE GRAPH</p>
          <h3 style={{ fontSize: '1.25rem' }}>🕸️ 암묵지 지식그래프</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>인사이트 간 연결을 시각적으로 탐색하세요 — 노드를 드래그하거나 호버하면 상세 정보가 표시됩니다</p>
        </div>
        <Suspense fallback={<ReportSectionFallback />}>
          <KnowledgeGraph axisScores={axisScores} activityData={state.activityData} isDev={isDev} />
        </Suspense>
      </article>

      <article className="glass-panel report-card" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <p className="eyebrow">AI WORKBENCH</p>
            <h3>AI 실행 워크벤치</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
              리포트 본문과 실행 패널을 완전히 분리했습니다. 필요할 때 전용 모달에서 실행하세요.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={onOpenAIWorkbench}>
            AI 워크벤치 열기
          </button>
        </div>
        <div style={{ padding: '20px 0', color: 'var(--text-muted)' }}>
          리포트 화면은 읽기 전용으로 유지하고, 프롬프트 실행과 모델 선택은 별도 실행 공간에서 처리합니다.
        </div>
      </article>

      <div className="report-grid">
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
            marginTop: '24px',
          }}>
            {seciSections.map((section) => {
              const items = seciMap[section.key];

              return (
                <div key={section.key} style={{ ...seciCardStyle, borderTop: `4px solid ${section.accent}` }}>
                  <div style={seciCardHeaderStyle}>
                    <span style={{ ...seciIconStyle, background: section.tint }}>{section.icon}</span>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>{section.title}</h4>
                  </div>
                  <ul style={seciListStyle}>
                    {items.length ? items.map((item) => <li key={item}>{item}</li>) : <li>{section.empty}</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
