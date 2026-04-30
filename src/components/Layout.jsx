import { Home, BarChart2 } from 'lucide-react';
import LogoMark from './LogoMark';
import ManualProgress from './ManualProgress';
import ResumeCard from './ResumeCard';

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
  onPrintChapter,
  onResumeActivity,
  children,
}) {
  const isHome = currentView === 'home';

  const title = activeJourney === 'developer' ? 'AI 개발자의 1년' :
                activeJourney === 'automation' ? '나만의 AI 서기 만들기' :
                activeJourney === 'showcase' ? '현장 노하우가 앱으로 변하는 그 순간' :
                activeJourney === 'promo' ? '키노트 모션 그래픽 갤러리' :
                '학원 원장의 1년';
  const subtitle = activeJourney === 'developer'
    ? '소프트웨어 개발 과정의 현장 노하우(암묵지)를 추출해 시스템 프롬프트로 변환합니다.'
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

            <ResumeCard
              state={state}
              onContinue={onResumeActivity}
              onPrintChapter={onPrintChapter}
              onGoReport={onGoReport}
            />

            {recommendedJourney && (
              <div className="flow-card-paper flow-card-paper--spaced flow-card-paper--hero">
                <div className="flow-card-row">
                  <div className="flow-card-row-text">
                    <span className="flow-eyebrow-tag">1분 안에 첫 가치 체험 ☕</span>
                    <h2 className="flow-title flow-title--spaced">
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

                <div className="flow-grid">
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

            <div className="level-card-paper manual-card-paper">
              <span className="binder-holes">
                <span className="binder-hole" />
                <span className="binder-hole" />
              </span>
              <ManualProgress
                state={state}
                levelInfo={levelInfo}
                nextLevel={nextLevel}
                xpGain={celebration.xpGain}
                onPrintChapter={onPrintChapter}
              />
            </div>
          </section>
        )}

        {celebration.levelUp && (
          <div className="card" role="status" style={{ marginBottom: '24px', borderColor: 'var(--mustard)', backgroundColor: 'var(--yellow-wash)' }}>
            <span className="tag" style={{ background: 'var(--mustard)', color: 'var(--ink-900)', marginBottom: '8px' }}>직책 카드 갱신</span>
            <h3 style={{ color: 'var(--ink-900)', marginBottom: '4px' }}>
              {celebration.levelUp.to.icon} {celebration.levelUp.to.title}
            </h3>
            <p style={{ fontSize: '0.875rem' }}>
              그동안 채운 페이지가 한 묶음이 되어, 위와 같은 카드로 갱신됐습니다. 강사·동료에게 그대로 보여줄 수 있는 정체성입니다.
            </p>
          </div>
        )}

        {celebration.badges.length > 0 && (
          <div className="discovery-celebrations" role="status" aria-live="polite">
            {celebration.badges.map((card) => (
              <article key={card.id} className="discovery-celebration-card">
                <span className="discovery-celebration-eyebrow">🪞 발견 카드 도착</span>
                <div className="discovery-celebration-body">
                  <span className="discovery-celebration-icon" aria-hidden="true">{card.icon}</span>
                  <div className="discovery-celebration-text">
                    <h4>{card.name}</h4>
                    <p className="discovery-celebration-desc">{card.desc}</p>
                    {card.evidenceText && (
                      <p className="discovery-celebration-evidence">{card.evidenceText}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {celebration.combo && (
          <div className="card flow-streak-card" role="status" style={{ marginBottom: '24px', padding: '14px 18px' }}>
            <span className="flow-streak-eyebrow">흐름이 잡혔어요</span>
            <p className="flow-streak-line">
              {celebration.combo.count}개 연속 완료 — 답변이 또렷해지는 중입니다.
              {celebration.combo.multiplier > 1 && (
                <> <span className="flow-streak-bonus">보너스 +{Math.round((celebration.combo.multiplier - 1) * 100)}% 페이지</span></>
              )}
            </p>
          </div>
        )}

        <div className="page-body">
          {children}
        </div>
      </main>
    </div>
  );
}
