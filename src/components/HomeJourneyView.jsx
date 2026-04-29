import React from 'react';
import { Bot, ClipboardCheck, Presentation } from 'lucide-react';
import { SHOWCASE_ACTIVITIES, SHOWCASE_LEVELS } from '../data/showcaseActivities';
import { getActivityProgress } from '../utils/scoring';
import ActivityCard from './ActivityCard';

const MODE_OPTIONS = [
  {
    key: 'director',
    icon: ClipboardCheck,
    title: '진단 시작',
    desc: '원장님의 판단 패턴을 활동 데이터와 리포트로 정리합니다.',
  },
  {
    key: 'automation',
    icon: Bot,
    title: '자동화 실습',
    desc: '복사와 붙여넣기로 AI 비서 자동화 흐름을 따라갑니다.',
  },
  {
    key: 'showcase',
    icon: Presentation,
    title: '쇼케이스 보기',
    desc: '암묵지가 실제 앱으로 바뀐 사례를 발표 모드로 시연합니다.',
  },
];

export default function HomeJourneyView({
  activeJourney,
  state,
  homeView,
  onStartRecommendedDemo,
  onGoReport,
  onOpenQr,
  onSelectActivity,
  onChooseJourney,
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
      <div className="mode-selector" aria-label="앱 사용 목적 선택">
        {MODE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = activeJourney === option.key;

          return (
            <button
              key={option.key}
              type="button"
              className={`mode-card ${active ? 'active' : ''}`}
              onClick={() => onChooseJourney(option.key)}
            >
              <span className="mode-card-icon" aria-hidden="true">
                <Icon size={20} />
              </span>
              <span className="mode-card-body">
                <strong>{option.title}</strong>
                <span>{option.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flow-card-paper" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '28px' }}>
          <div style={{ flex: '1 1 360px' }}>
            <span className="flow-eyebrow-tag">RECOMMENDED FLOW</span>
            <h2 className="flow-title" style={{ marginTop: '16px' }}>
              {recommendedActivity ? `${recommendedActivity.title}부터 시작하세요` : '지금 보고 싶은 여정을 선택하세요'}
            </h2>
            <p className="flow-subtitle">
              {recommendedActivity
                ? `${recommendedActivity.subtitle} 활동을 첫 진입점으로 추천합니다. 첫 성공 직후에는 실제 추출 문장을 홈에서 바로 확인할 수 있습니다.`
                : '현재 여정은 둘러보기 모드입니다. 직접 탐색하거나 다른 여정을 선택해 첫 데모를 시작하세요.'}
            </p>
          </div>
          <div className="flow-actions">
            <button
              type="button"
              className="btn-paper-primary"
              onClick={onStartRecommendedDemo}
            >
              {journeyGuide.ctaLabel} →
            </button>
            {state.completed.length > 0 && (
              <button
                type="button"
                className="btn-paper-outline"
                onClick={onGoReport}
              >
                내 결과 미리보기
              </button>
            )}
          </div>
        </div>

        <div className="flow-grid" style={{ paddingLeft: '28px' }}>
          {journeyGuide.quickSteps.map((step, index) => (
            <div key={step.title} className="flow-step">
              <span className="flow-step-index">{index + 1}</span>
              <strong className="flow-step-title">{step.title}</strong>
              <span className="flow-step-detail">{step.detail}</span>
            </div>
          ))}
        </div>

        <div className="preview-memo" style={{ marginLeft: '28px' }}>
          <div className="preview-memo-title">
            <span>📝 첫 완료 후 실제 문장 미리보기</span>
            {lastCompletedActivity && (
              <span style={{ fontWeight: 500, color: 'var(--ink-500)', fontSize: '12px' }}>
                · 마지막 반영: {lastCompletedActivity.title}
              </span>
            )}
          </div>
          <p className="preview-memo-body">
            {lastCompletedPreview ?? journeyGuide.previewFallback}
          </p>
        </div>
      </div>


      {lastCompletedActivity && (
        <div
          className="card"
          style={{
            maxWidth: '920px',
            margin: '0 auto var(--space-lg)',
            textAlign: 'left',
            borderColor: 'var(--sage)',
            background: 'var(--green-wash)',
          }}
        >
          <span className="tag" style={{ marginBottom: '10px', background: 'var(--sage)', color: '#fff' }}>
            LIVE PREVIEW
          </span>
          <h3 style={{ margin: '0 0 8px' }}>{lastCompletedActivity.title} 결과가 리포트에 반영되었습니다</h3>
          <p style={{ margin: '0 0 14px', color: 'var(--ink-700)', lineHeight: 1.6 }}>
            마지막 완료 항목을 기준으로 진행도가 갱신되었습니다. 지금 리포트에서 채운 매뉴얼 페이지와 핵심 통찰을 바로 확인할 수 있습니다.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <button type="button" className="btn-paper-primary" onClick={onGoReport}>
              내 결과 자세히 보기 →
            </button>
            <span style={{ color: 'var(--ink-500)', fontSize: '0.9rem' }}>
              현재 여정 진행도 {completedJourneyCount} / {journeyActivities.length || 0}
            </span>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: 'var(--space-md)', fontSize: '1.8rem', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>직접 둘러보기</h2>
      <p style={{ color: 'var(--ink-700)', marginBottom: 'var(--space-md)' }}>
        추천 경로 외에도 전체 활동을 자유롭게 열 수 있습니다.
      </p>

      {activeJourney === 'showcase' && (() => {
        const total = SHOWCASE_ACTIVITIES.length;
        const done = SHOWCASE_ACTIVITIES.filter((activity) => state.completed.includes(activity.id)).length;
        return (
          <div style={{ maxWidth: '600px', margin: '0 auto var(--space-lg)', padding: '16px 24px', borderRadius: '16px', background: 'var(--lavender-wash)', border: '1px solid var(--lavender)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5B3EA6' }}>🎯 시연 진행률</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink-900)' }}>{done} / {total} 완료</span>
            </div>
            <div style={{ height: '8px', borderRadius: '4px', background: 'var(--paper-300)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(done / total) * 100}%`, borderRadius: '4px', background: 'linear-gradient(90deg, var(--ink-blue), var(--lavender))', transition: 'width 0.5s ease' }} />
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
          className="btn-paper-primary"
          onClick={onGoReport}
          disabled={state.completed.length === 0}
          style={{ padding: '16px 32px', fontSize: '1.15rem', opacity: state.completed.length === 0 ? 0.5 : 1, cursor: state.completed.length === 0 ? 'not-allowed' : 'pointer' }}
        >
          {state.completed.length > 0 ? '최종 진단 리포트 & 프롬프트 발급받기 →' : '추천 데모를 1개 이상 완료하면 리포트를 볼 수 있습니다'}
        </button>
      </div>
    </div>
  );
}
