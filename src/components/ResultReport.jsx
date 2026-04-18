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
    <div className="report-paper-card" style={{ minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-500)' }}>
      필요한 리포트 모듈을 불러오는 중입니다.
    </div>
  );
}

const SECI_SECTIONS = [
  { key: 'socialization', icon: '🌱', title: 'S · 공유화', empty: '갤러리 공유가 여기에 모입니다.' },
  { key: 'externalization', icon: '🗣️', title: 'E · 표출화', empty: '위기/전수 답변이 여기에 모입니다.' },
  { key: 'combination', icon: '🔗', title: 'C · 연결화', empty: 'SECI 활동의 프롬프트가 여기에 표시됩니다.' },
  { key: 'internalization', icon: '🧠', title: 'I · 내면화', empty: '퀴즈와 역할극 인사이트가 여기에 축적됩니다.' },
];

export default function ResultReport({ state, levelInfo, activeJourney = 'director', onOpenAIWorkbench }) {
  const isDev = activeJourney === 'developer';

  const axisScores = useMemo(() => buildAxisScores(state, isDev), [state, isDev]);
  const topInsights = useMemo(() => buildTopInsights(state.activityData), [state.activityData]);
  const seciMap = useMemo(() => buildSeciMap(state.activityData), [state.activityData]);

  const profileName = state.profile.name?.trim() || (isDev ? '익명 개발자' : '익명 원장');
  const career = state.profile.career?.trim() || '경력 미입력';
  const academy = state.profile.academy?.trim() || '우리 학원';

  return (
    <section className="report-shell">
      <div className="section-heading report-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
        <div>
          <span className="flow-eyebrow-tag" style={{ background: 'var(--pink-wash)', borderColor: 'var(--coral)', color: 'var(--coral)' }}>
            FINAL DIAGNOSTIC
          </span>
          <h2 className="report-heading-display" style={{ marginTop: '12px' }}>
            암묵지 프로필 리포트
          </h2>
          <button
            className="btn-paper-outline print-hide"
            style={{ marginTop: '14px', fontSize: '0.88rem', padding: '8px 16px' }}
            onClick={() => window.print()}
          >
            🖨️ PDF 저장 / 인쇄하기
          </button>
        </div>
        <div className="report-xp-stamp">
          <span className="report-xp-stamp-value">{state.xp}</span>
          <span className="report-xp-stamp-label">Total XP</span>
        </div>
      </div>

      <div className="report-grid">
        <article className="report-paper-card" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed var(--paper-300)', paddingBottom: '16px', gap: '12px' }}>
            <div>
              <p className="eyebrow" style={{ fontSize: '0.72rem' }}>PROFILE CARD</p>
              <h3 style={{ fontSize: '1.45rem', marginTop: '6px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>{profileName}</h3>
              <p style={{ color: 'var(--ink-700)', fontWeight: 500, fontSize: '0.9rem' }}>{career} · {academy}</p>
            </div>
            <div style={{ background: 'var(--blue-wash)', padding: '10px 16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--ink-blue)' }}>
              <div style={{ fontSize: '1.4rem' }}>{levelInfo.icon}</div>
              <strong style={{ color: 'var(--ink-blue-deep)', fontSize: '0.82rem' }}>{levelInfo.title}</strong>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div className="report-stat-tile">
              <div className="report-stat-tile-value">{state.completed.length}</div>
              <div className="report-stat-tile-label">완료 활동</div>
            </div>
            <div className="report-stat-tile">
              <div className="report-stat-tile-value">{state.badges.length}</div>
              <div className="report-stat-tile-label">획득 뱃지</div>
            </div>
            <div className="report-stat-tile">
              <div className="report-stat-tile-value">{state.maxCombo}</div>
              <div className="report-stat-tile-label">최대 콤보</div>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '12px', color: 'var(--ink-900)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span aria-hidden="true">✨</span> 핵심 암묵지 Top 3
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topInsights.length === 0 ? (
                <li style={{ color: 'var(--ink-500)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  활동 답변이 쌓이면 여기에 당신만의 핵심 통찰이 요약됩니다.
                </li>
              ) : null}
              {topInsights.map((insight, idx) => (
                <li key={idx} className="insight-chip">{insight}</li>
              ))}
            </ul>
          </div>
        </article>

        <Suspense fallback={<ReportSectionFallback />}>
          <ReportRadarCard axisScores={axisScores} isDev={isDev} />
        </Suspense>
      </div>

      <article className="report-paper-card" style={{ marginTop: 'var(--space-lg)' }}>
        <div style={{ marginBottom: '18px' }}>
          <p className="eyebrow">KNOWLEDGE GRAPH</p>
          <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--ink-900)', marginTop: '4px' }}>🕸️ 암묵지 지식그래프</h3>
          <p style={{ color: 'var(--ink-500)', fontSize: '0.85rem', marginTop: '4px' }}>
            인사이트 간 연결을 시각적으로 탐색하세요 — 노드를 드래그하거나 호버하면 상세 정보가 표시됩니다
          </p>
        </div>
        <Suspense fallback={<ReportSectionFallback />}>
          <KnowledgeGraph axisScores={axisScores} activityData={state.activityData} isDev={isDev} />
        </Suspense>
      </article>

      <article className="report-paper-card" style={{ marginTop: 'var(--space-lg)', background: 'var(--blue-wash)', borderColor: 'var(--ink-blue)' }}>
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <span className="flow-eyebrow-tag" style={{ background: 'var(--paper-50)', borderColor: 'var(--ink-blue)', color: 'var(--ink-blue-deep)' }}>
              AI WORKBENCH
            </span>
            <h3 style={{ fontSize: '1.3rem', marginTop: '12px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>AI 실행 워크벤치</h3>
            <p style={{ color: 'var(--ink-700)', fontSize: '0.9rem', marginTop: '4px', maxWidth: '540px' }}>
              리포트 본문과 실행 패널을 완전히 분리했습니다. 필요할 때 전용 모달에서 실행하세요.
            </p>
          </div>
          <button type="button" className="btn-paper-primary" onClick={onOpenAIWorkbench}>
            AI 워크벤치 열기 →
          </button>
        </div>
      </article>

      <div className="report-grid" style={{ marginTop: 'var(--space-lg)' }}>
        <article className="report-paper-card" style={{ gridColumn: '1 / -1' }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">SECI MAP</p>
              <h3 style={{ fontSize: '1.3rem', marginTop: '4px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>지식 전환 흐름</h3>
              <p style={{ color: 'var(--ink-500)', fontSize: '0.85rem', marginTop: '4px' }}>
                네 가지 모드로 암묵지가 형식지로 변환되는 과정을 스티커 노트처럼 정리합니다.
              </p>
            </div>
          </div>
          <div
            className="seci-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              marginTop: '24px',
            }}
          >
            {SECI_SECTIONS.map((section) => {
              const items = seciMap[section.key] ?? [];
              return (
                <div key={section.key} className="seci-note" data-variant={section.key}>
                  <div className="seci-note-header">
                    <span className="seci-note-icon">{section.icon}</span>
                    <h4 className="seci-note-title">{section.title}</h4>
                  </div>
                  <ul className="seci-note-list">
                    {items.length ? items.map((item) => <li key={item}>{item}</li>) : <li style={{ fontStyle: 'italic', color: 'var(--ink-500)' }}>{section.empty}</li>}
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
