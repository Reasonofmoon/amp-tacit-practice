import React from 'react';
import { SHOWCASE_ACTIVITIES, SHOWCASE_LEVELS } from '../data/showcaseActivities';
import { getActivityProgress } from '../utils/scoring';
import ActivityCard from './ActivityCard';

export default function HomeJourneyView({
  activeJourney,
  state,
  homeView,
  onStartRecommendedDemo,
  onGoReport,
  onOpenQr,
  onSelectActivity,
}) {
  const {
    journeyGuide,
    journeyActivities,
    completedJourneyCount,
    recommendedActivity,
    lastCompletedActivity,
    lastCompletedPreview,
  } = homeView;

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className="card"
        style={{
          maxWidth: '920px',
          margin: '0 auto var(--space-lg)',
          textAlign: 'left',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.86))',
          borderColor: 'rgba(148,163,184,0.18)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: '1 1 360px' }}>
            <span className="tag" style={{ marginBottom: '10px' }}>RECOMMENDED FLOW</span>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.55rem' }}>
              {recommendedActivity ? `${recommendedActivity.title}부터 시작하세요` : '지금 보고 싶은 여정을 선택하세요'}
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
              {recommendedActivity
                ? `${recommendedActivity.subtitle} 활동을 첫 진입점으로 추천합니다. 첫 성공 직후에는 실제 추출 문장을 홈에서 바로 확인할 수 있습니다.`
                : '현재 여정은 둘러보기 모드입니다. 직접 탐색하거나 다른 여정을 선택해 첫 데모를 시작하세요.'}
            </p>
          </div>
          <div style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-primary neon-btn"
              onClick={onStartRecommendedDemo}
              style={{ padding: '16px 20px', fontSize: '1.05rem' }}
            >
              {journeyGuide.ctaLabel}
            </button>
            {state.completed.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onGoReport}
                style={{ padding: '14px 18px' }}
              >
                내 결과 미리보기
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '18px' }}>
          {journeyGuide.quickSteps.map((step, index) => (
            <div
              key={step.title}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(148,163,184,0.14)',
              }}
            >
              <strong style={{ display: 'block', marginBottom: '4px', color: '#F8FAFC' }}>{index + 1}. {step.title}</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{step.detail}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '18px',
            padding: '16px 18px',
            borderRadius: '14px',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.22)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ color: '#FCD34D' }}>첫 완료 후 실제 문장 미리보기</strong>
            {lastCompletedActivity && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                마지막 반영 활동: {lastCompletedActivity.title}
              </span>
            )}
          </div>
          <p style={{ margin: '10px 0 0', color: '#F8FAFC', lineHeight: 1.7, fontSize: '1rem' }}>
            “{lastCompletedPreview ?? journeyGuide.previewFallback}”
          </p>
        </div>
      </div>

      {journeyGuide.demoOrder.length > 0 && (
        <div
          className="card"
          style={{
            maxWidth: '920px',
            margin: '0 auto var(--space-lg)',
            textAlign: 'left',
            borderColor: 'rgba(99,102,241,0.18)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(15,23,42,0.08))',
          }}
        >
          <span className="tag" style={{ marginBottom: '12px' }}>GUIDED DEMO</span>
          <h3 style={{ margin: '0 0 8px' }}>발표용 진행 순서</h3>
          <p style={{ margin: '0 0 16px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            시연 흐름과 발표 멘트를 한 번에 정리했습니다. 추천 순서대로 보여주면 설명 부담이 줄어듭니다.
          </p>

          <div style={{ display: 'grid', gap: '12px' }}>
            {journeyGuide.demoOrder.map((step, index) => (
              <div
                key={step.activityId}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(148,163,184,0.12)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <strong>{index + 1}. {step.label}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{step.audienceOutcome}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.presenterLine}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {lastCompletedActivity && (
        <div
          className="card"
          style={{
            maxWidth: '920px',
            margin: '0 auto var(--space-lg)',
            textAlign: 'left',
            borderColor: 'rgba(16,185,129,0.28)',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(14,165,233,0.06))',
          }}
        >
          <span className="tag" style={{ marginBottom: '10px', background: 'rgba(16,185,129,0.18)', color: '#10B981' }}>
            LIVE PREVIEW
          </span>
          <h3 style={{ margin: '0 0 8px' }}>{lastCompletedActivity.title} 결과가 리포트에 반영되었습니다</h3>
          <p style={{ margin: '0 0 14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            마지막 완료 항목을 기준으로 진행도가 갱신되었습니다. 지금 리포트에서 축적된 XP와 핵심 통찰을 바로 확인할 수 있습니다.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={onGoReport}>
              내 결과 자세히 보기
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              현재 여정 진행도 {completedJourneyCount} / {journeyActivities.length || 0}
            </span>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: 'var(--space-md)', fontSize: '1.8rem' }}>직접 둘러보기</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
        추천 경로 외에도 전체 활동을 자유롭게 열 수 있습니다.
      </p>

      {activeJourney === 'showcase' && (() => {
        const total = SHOWCASE_ACTIVITIES.length;
        const done = SHOWCASE_ACTIVITIES.filter((activity) => state.completed.includes(activity.id)).length;
        return (
          <div style={{ maxWidth: '600px', margin: '0 auto var(--space-lg)', padding: '16px 24px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>🎯 시연 진행률</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{done} / {total} 완료</span>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(done / total) * 100}%`, borderRadius: '4px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        );
      })()}

      <div className="monopoly-board">
        {journeyActivities.map((activity, index) => {
          const isCompleted = state.completed.includes(activity.id);

          let bridgeSlide = null;
          if (activeJourney === 'showcase') {
            const level = SHOWCASE_LEVELS.find((item) => item.ids[0] === activity.id);
            if (level) {
              bridgeSlide = (
                <div key={`bridge-${level.level}`} style={{
                  width: '100%', flexBasis: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '12px', padding: '12px 24px', margin: '8px 0',
                  borderRadius: '12px', background: `${level.color}10`, border: `1px dashed ${level.color}40`,
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{level.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ fontSize: '0.85rem', color: level.color, letterSpacing: '1px' }}>{level.label}</strong>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{level.title}</p>
                  </div>
                </div>
              );
            }
          }

          return (
            <React.Fragment key={activity.id}>
              {bridgeSlide}
              <div className="monopoly-node">
                <ActivityCard
                  activity={activity}
                  index={index}
                  completed={isCompleted}
                  progress={getActivityProgress(activity.id, state.activityData[activity.id])}
                  onClick={() => onSelectActivity(activity.id)}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {activeJourney === 'showcase' && (
          <button
            className="btn btn-ghost"
            onClick={onOpenQr}
            style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            📱 청중 참여 QR코드 보기
          </button>
        )}
        <button
          className="btn btn-primary neon-btn"
          onClick={onGoReport}
          disabled={state.completed.length === 0}
          style={{ padding: '16px 32px', fontSize: '1.25rem', opacity: state.completed.length === 0 ? 0.5 : 1 }}
        >
          {state.completed.length > 0 ? '최종 진단 리포트 & 프롬프트 발급받기 →' : '추천 데모를 1개 이상 완료하면 리포트를 볼 수 있습니다'}
        </button>
      </div>
    </div>
  );
}
