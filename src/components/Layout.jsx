import { Home, BarChart2 } from 'lucide-react';
import LogoMark from './LogoMark';
import XPBar from './XPBar';

const JOURNEY_CHIPS = [
  { key: 'director',   label: '원장 여정',     emoji: '🎓', variant: 'director' },
  { key: 'developer',  label: '개발자 여정',   emoji: '💻', variant: 'developer' },
  { key: 'automation', label: '자동화 실습',   emoji: '🚀', variant: 'automation' },
  { key: 'showcase',   label: '8대 도구 시연', emoji: '✨', variant: 'showcase' },
  { key: 'promo',      label: '모션 갤러리',   emoji: '🎬', variant: 'promo' },
];

export default function Layout({
  currentView,
  state,
  levelInfo,
  nextLevel,
  celebration,
  onGoHome,
  onGoReport,
  showReportButton,
  activeJourney,
  onToggleJourney,
  onStartRecommendedDemo,
  onToggleJourneyPicker,
  showJourneyPicker,
  recommendedJourney,
  children,
}) {
  const isHome = currentView === 'home';

  const title = activeJourney === 'developer' ? 'AI 개발자의 1년' :
                activeJourney === 'automation' ? '나만의 AI 서기 만들기' :
                activeJourney === 'showcase' ? '암묵지가 앱으로 변하는 그 순간' :
                activeJourney === 'promo' ? '키노트 모션 그래픽 갤러리' :
                '학원 원장의 1년';
  const subtitle = activeJourney === 'developer'
    ? '소프트웨어 개발 과정에서 발생하는 암묵지 패턴을 추출하여 시스템 프롬프트로 변환합니다.'
    : activeJourney === 'automation'
    ? '코딩을 몰라도 괜찮습니다. 복사+붙여넣기로 나만의 24시간 AI 비서를 완성해보세요!'
    : activeJourney === 'showcase'
    ? '원장님의 8가지 수업 노하우가 탁월한 웹앱으로 변신하는 과정을 보여드립니다.'
    : activeJourney === 'promo'
    ? 'Remotion으로 제작한 키네틱 타이포그래피 모션 그래픽 세트. 발표에 바로 활용 가능한 12개 영상.'
    : '무의식적 운영 감각을 문장과 선택의 데이터로 끌어올리고, AI가 재사용할 수 있는 형태로 변환합니다.';

  const eyebrowLabel = activeJourney === 'developer' ? 'DEVELOPER LAB'
    : activeJourney === 'automation' ? 'AUTOMATION WORKSHOP'
    : activeJourney === 'showcase' ? 'DIAGNOSTIC PLAYGROUND'
    : activeJourney === 'promo' ? 'MOTION GALLERY'
    : 'DIRECTOR JOURNEY';

  return (
    <div className="app-shell">
      <header className="nav">
        <button
          type="button"
          className="logo"
          onClick={onGoHome}
          aria-label="Tacit KnowledgeLab 홈으로"
        >
          <LogoMark size={32} label="T" />
          <span>Tacit KnowledgeLab</span>
        </button>

        <nav style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn btn-sm ${isHome ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={onGoHome}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
          >
            <Home size={16} /> 홈
          </button>
          {showReportButton && (
            <button
              type="button"
              className={`btn btn-sm ${currentView === 'report' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={onGoReport}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}
            >
              <BarChart2 size={16} /> 진단 리포트
            </button>
          )}
        </nav>
      </header>

      <main className="app-frame">
        {isHome && (
          <section className="hero-paper">
            <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
              <span className="eyebrow">{eyebrowLabel}</span>
              <h1 className="hero-paper-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', lineHeight: 1.15, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>
                {title}
              </h1>
              <p className="lead" style={{ margin: '0 auto', maxWidth: '620px' }}>
                {subtitle}
              </p>
            </div>

            {recommendedJourney && (
              <div className="flow-card-paper" style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '28px' }}>
                  <div style={{ flex: '1 1 320px' }}>
                    <span className="flow-eyebrow-tag">1분 안에 첫 가치 체험 ☕</span>
                    <h2 className="flow-title" style={{ marginTop: '16px' }}>
                      <span className="number">1.</span>
                      {recommendedJourney.headline}
                    </h2>
                    <p className="flow-subtitle">
                      {recommendedJourney.summary}
                    </p>
                  </div>
                  <div className="flow-actions">
                    <button
                      type="button"
                      className="btn-paper-primary"
                      onClick={onStartRecommendedDemo}
                    >
                      {recommendedJourney.ctaLabel ?? '지금 바로 체험하기'} →
                    </button>
                    <button
                      type="button"
                      className="btn-paper-outline"
                      onClick={onToggleJourneyPicker}
                    >
                      {showJourneyPicker ? '간단 모드로 접기' : '천천히 둘러보기'}
                    </button>
                  </div>
                </div>

                <div className="flow-grid" style={{ paddingLeft: '28px' }}>
                  {recommendedJourney.quickSteps.map((step, index) => (
                    <div key={step.title} className="flow-step">
                      <span className="flow-step-index">{index + 1}</span>
                      <strong className="flow-step-title">{step.title}</strong>
                      <span className="flow-step-detail">{step.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showJourneyPicker && (
              <div className="journey-chip-row">
                {JOURNEY_CHIPS.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    className={`journey-chip journey-chip-${chip.variant}${activeJourney === chip.key ? ' active' : ''}`}
                    onClick={() => onToggleJourney(chip.key)}
                  >
                    <span aria-hidden="true">{chip.emoji}</span>
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            <div className="level-card-paper">
              <span className="binder-holes">
                <span className="binder-hole" />
                <span className="binder-hole" />
              </span>
              <XPBar xp={state.xp} levelInfo={levelInfo} nextLevel={nextLevel} xpGain={celebration.xpGain} />
            </div>
          </section>
        )}

        {celebration.levelUp && (
          <div className="card" role="status" style={{ marginBottom: '24px', borderColor: 'var(--mustard)', backgroundColor: 'var(--yellow-wash)' }}>
            <span className="tag" style={{ background: 'var(--mustard)', color: 'var(--ink-900)', marginBottom: '8px' }}>LEVEL UP</span>
            <h3 style={{ color: 'var(--ink-900)', marginBottom: '4px' }}>
              {celebration.levelUp.to.icon} {celebration.levelUp.to.title}
            </h3>
            <p style={{ fontSize: '0.875rem' }}>{celebration.levelUp.to.level}레벨에 도달했습니다. 암묵지 프로필이 한 단계 진화했습니다.</p>
          </div>
        )}

        {celebration.badges.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {celebration.badges.map((badge) => (
              <div key={badge.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
                <span style={{ fontSize: '2rem' }}>{badge.icon}</span>
                <div>
                  <h4 style={{ fontWeight: 600, color: 'var(--ink-900)' }}>{badge.name}</h4>
                  <p style={{ fontSize: '0.875rem' }}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {celebration.combo && (
          <div className="card" style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--mustard)', borderColor: 'var(--mustard)', padding: '12px' }}>
            <strong style={{ fontSize: '1.25rem' }}>🔥 콤보 ×{celebration.combo.multiplier.toFixed(1).replace('.0', '')}</strong>
          </div>
        )}

        <div className="page-body">
          {children}
        </div>
      </main>
    </div>
  );
}
