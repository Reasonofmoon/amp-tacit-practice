import { Suspense, useMemo, useState } from 'react';
import { ACTIVITIES, AXES } from '../data/activities';
import { DEV_ACTIVITIES, DEV_AXES } from '../data/developerActivities';
import { AUTOMATION_ACTIVITIES } from '../data/automationActivities';
import { SHOWCASE_ACTIVITIES } from '../data/showcaseActivities';
import { getActivityPromptGift } from '../data/activityPrompts';
import { buildSeciMap, buildTopInsights } from '../utils/promptGenerator';
import { getActivityProgress } from '../utils/scoring';
import { lazyWithRetry } from '../utils/lazyWithRetry';
import PromptGiftModal from './PromptGiftModal';
import DiscoveryShowcase from './DiscoveryShowcase';
import BenchmarkSection from './BenchmarkSection';
import BackupPanel from './BackupPanel';

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

const ALL_TITLES = (() => {
  const lookup = {};
  [...ACTIVITIES, ...DEV_ACTIVITIES, ...AUTOMATION_ACTIVITIES, ...SHOWCASE_ACTIVITIES].forEach((entry) => {
    if (entry?.id) lookup[entry.id] = entry.title;
  });
  return lookup;
})();

export default function ResultReport({ state, levelInfo, activeJourney = 'director', onOpenAIWorkbench, onUpdateConsent }) {
  const isDev = activeJourney === 'developer';
  const [openGift, setOpenGift] = useState(null);

  const axisScores = useMemo(() => buildAxisScores(state, isDev), [state, isDev]);
  const topInsights = useMemo(() => buildTopInsights(state.activityData), [state.activityData]);
  const seciMap = useMemo(() => buildSeciMap(state.activityData), [state.activityData]);
  const promptBag = useMemo(
    () => state.completed.map((id) => ({
      id,
      title: ALL_TITLES[id] ?? id,
      gift: getActivityPromptGift(id, state.activityData[id], state.profile),
    })),
    [state.completed, state.activityData, state.profile],
  );

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
            현장 노하우 프로필 리포트
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
          <span className="report-xp-stamp-label">매뉴얼에 채운 페이지</span>
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
              <div className="report-stat-tile-label">채운 챕터 수</div>
            </div>
            <div className="report-stat-tile">
              <div className="report-stat-tile-value">{state.badges.length}</div>
              <div className="report-stat-tile-label">발견 카드</div>
            </div>
            <div className="report-stat-tile">
              <div className="report-stat-tile-value">{state.maxCombo}</div>
              <div className="report-stat-tile-label">가장 길었던 흐름</div>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '12px', color: 'var(--ink-900)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span aria-hidden="true">✨</span> 핵심 노하우 Top 3
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
          <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--ink-900)', marginTop: '4px' }}>🕸️ 노하우 지식그래프</h3>
          <p style={{ color: 'var(--ink-500)', fontSize: '0.85rem', marginTop: '4px' }}>
            인사이트 간 연결을 시각적으로 탐색하세요 — 노드를 드래그하거나 호버하면 상세 정보가 표시됩니다
          </p>
        </div>
        <Suspense fallback={<ReportSectionFallback />}>
          <KnowledgeGraph axisScores={axisScores} activityData={state.activityData} isDev={isDev} />
        </Suspense>
      </article>

      <article className="report-paper-card prompt-gift-bag-section" style={{ marginTop: 'var(--space-lg)' }}>
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="flow-eyebrow-tag" style={{ background: 'var(--pink-wash)', borderColor: 'var(--coral)', color: 'var(--coral)' }}>
              🎁 PROMPT GIFT BAG
            </span>
            <h3 style={{ fontSize: '1.3rem', marginTop: '8px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>
              완료한 활동 × {promptBag.length} — 실무용 프롬프트 가방
            </h3>
            <p style={{ color: 'var(--ink-500)', fontSize: '0.88rem', marginTop: '4px' }}>
              지금까지 받은 모든 프롬프트를 한자리에. 카드를 누르면 다시 복사 / ChatGPT / Claude 로 보낼 수 있습니다.
            </p>
          </div>
          {promptBag.length > 0 && (
            <button
              type="button"
              className="btn-paper-primary print-hide"
              onClick={() => {
                document.body.classList.add('print-mode-prompt-bag');
                window.requestAnimationFrame(() => {
                  window.print();
                  window.setTimeout(() => document.body.classList.remove('print-mode-prompt-bag'), 200);
                });
              }}
              aria-label="프롬프트 가방을 PDF로 저장"
            >
              📄 가방 전체 PDF로 저장
            </button>
          )}
        </div>

        {promptBag.length === 0 ? (
          <p className="prompt-gift-bag-empty">아직 완료한 활동이 없습니다. 추천 데모를 1개 마치면 첫 선물이 도착합니다.</p>
        ) : (
          <>
            <div className="prompt-gift-bag print-hide">
              {promptBag.map(({ id, title, gift }) => (
                <button
                  key={id}
                  type="button"
                  className="prompt-gift-bag-card"
                  onClick={() => setOpenGift({ id, title, gift })}
                  aria-label={`${title} 선물 프롬프트 다시 보기`}
                >
                  <span className="prompt-gift-bag-card-head">
                    <span aria-hidden="true">{gift.emoji}</span>
                    <span>{title}</span>
                  </span>
                  <h4 className="prompt-gift-bag-card-title">{gift.title}</h4>
                  {gift.payoff && <p className="prompt-gift-bag-card-payoff">{gift.payoff}</p>}
                </button>
              ))}
            </div>

            {/* Print-only layout: every prompt in full, one per page-break point */}
            <div className="prompt-gift-bag-print" aria-hidden="true">
              <header className="prompt-gift-bag-print-cover">
                <h1>🎁 프롬프트 선물 가방</h1>
                <p>{state.profile.name?.trim() || '익명'} · {state.profile.academy?.trim() || '우리 학원'} · 총 {promptBag.length}개 프롬프트</p>
                <p className="prompt-gift-bag-print-hint">각 프롬프트를 ChatGPT 또는 Claude에 그대로 붙여넣으면 됩니다.</p>
              </header>
              {promptBag.map(({ id, title, gift }, index) => (
                <section key={id} className="prompt-gift-bag-print-card">
                  <p className="prompt-gift-bag-print-eyebrow">#{index + 1} · {title}</p>
                  <h2>{gift.emoji} {gift.title}</h2>
                  {gift.payoff && <p className="prompt-gift-bag-print-payoff">“{gift.payoff}”</p>}
                  <p className="prompt-gift-bag-print-usecase"><strong>📍 어디서 쓰나요</strong> {gift.useCase}</p>
                  <pre>{gift.prompt}</pre>
                </section>
              ))}
            </div>
          </>
        )}
      </article>

      <PromptGiftModal
        open={!!openGift}
        gift={openGift?.gift ?? null}
        activityTitle={openGift?.title ?? ''}
        onClose={() => setOpenGift(null)}
      />

      <article className="report-paper-card" style={{ marginTop: 'var(--space-lg)', background: 'var(--blue-wash)', borderColor: 'var(--ink-blue)' }}>
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <span className="flow-eyebrow-tag" style={{ background: 'var(--paper-50)', borderColor: 'var(--ink-blue)', color: 'var(--ink-blue-deep)' }}>
              AI WORKBENCH
            </span>
            <h3 style={{ fontSize: '1.3rem', marginTop: '12px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>AI 실행 워크벤치 (선택)</h3>
            <p style={{ color: 'var(--ink-700)', fontSize: '0.9rem', marginTop: '4px', maxWidth: '540px' }}>
              위 가방의 프롬프트를 외부 ChatGPT/Claude/Gemini로 보내는 대신, 앱 안에서 바로 실행하고 싶을 때 사용하세요. API 키는 가져오거나 서버 프록시가 켜져 있어야 합니다.
            </p>
          </div>
          <button type="button" className="btn-paper-primary" onClick={onOpenAIWorkbench}>
            AI 워크벤치 열기 →
          </button>
        </div>
      </article>

      <div style={{ marginTop: 'var(--space-lg)' }}>
        <DiscoveryShowcase state={state} />
      </div>

      <div style={{ marginTop: 'var(--space-lg)' }}>
        <BenchmarkSection state={state} consent={state.consent} onUpdateConsent={onUpdateConsent} />
      </div>

      <div style={{ marginTop: 'var(--space-lg)' }}>
        <BackupPanel state={state} />
      </div>

      <div className="report-grid" style={{ marginTop: 'var(--space-lg)' }}>
        <article className="report-paper-card" style={{ gridColumn: '1 / -1' }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">SECI MAP</p>
              <h3 style={{ fontSize: '1.3rem', marginTop: '4px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>지식 전환 흐름</h3>
              <p style={{ color: 'var(--ink-500)', fontSize: '0.85rem', marginTop: '4px' }}>
                네 가지 모드로 현장 노하우가 형식 지식으로 변환되는 과정을 스티커 노트처럼 정리합니다.
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
