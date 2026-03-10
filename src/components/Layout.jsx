import { HOME_STATS } from '../data/activities';
import GlowOrb from './GlowOrb';
import XPBar from './XPBar';

export default function Layout({
  currentView,
  state,
  levelInfo,
  nextLevel,
  celebration,
  onGoHome,
  onGoReport,
  showReportButton,
  children,
}) {
  const isHome = currentView === 'home';

  return (
    <div className="app-shell">
      <GlowOrb color="#6366F1" size={360} top="-80px" left="-120px" delay={0} />
      <GlowOrb color="#10B981" size={300} top="35%" right="-80px" delay={1.5} />
      <GlowOrb color="#F59E0B" size={240} bottom="-40px" left="10%" delay={3} />

      <div className="app-frame">
        <header className="hero-shell">
          <div className="hero-nav">
            <button type="button" className="nav-link" onClick={onGoHome} aria-label="홈으로 이동">
              홈
            </button>
            {showReportButton ? (
              <button type="button" className="nav-link is-active" onClick={onGoReport} aria-label="결과 리포트 보기">
                결과 리포트
              </button>
            ) : null}
          </div>
          <div className="hero-copy">
            <p className="eyebrow">KOREA AMP · TACIT KNOWLEDGE GAME</p>
            <h1>{isHome ? '학원 원장의 1년' : '암묵지 발굴 인터랙티브 랩'}</h1>
            <p>무의식적 운영 감각을 문장과 선택의 데이터로 끌어올리고, AI가 재사용할 수 있는 형태로 변환합니다.</p>
          </div>
          <div className="hero-stats glass-panel">
            <article>
              <strong>{state.completed.length}</strong>
              <span>완료 활동</span>
            </article>
            <article>
              <strong>{HOME_STATS.totalActivities}</strong>
              <span>전체 활동</span>
            </article>
            <article>
              <strong>{HOME_STATS.totalTime}</strong>
              <span>예상 시간</span>
            </article>
          </div>
          <XPBar xp={state.xp} levelInfo={levelInfo} nextLevel={nextLevel} xpGain={celebration.xpGain} />
        </header>

        {celebration.levelUp ? (
          <div className="levelup-card glass-panel" role="status" aria-live="polite">
            <span className="levelup-label">LEVEL UP</span>
            <strong>
              {celebration.levelUp.to.icon} {celebration.levelUp.to.title}
            </strong>
            <p>{celebration.levelUp.to.level}레벨에 도달했습니다. 암묵지 프로필이 한 단계 진화했습니다.</p>
          </div>
        ) : null}

        {celebration.badges.length ? (
          <div className="badge-toast-stack" role="status" aria-live="polite">
            {celebration.badges.map((badge) => (
              <div key={badge.id} className="badge-toast">
                <span>{badge.icon}</span>
                <div>
                  <strong>{badge.name}</strong>
                  <p>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {celebration.combo ? (
          <div className="combo-toast" role="status" aria-live="polite">
            🔥 콤보 ×{celebration.combo.multiplier.toFixed(1).replace('.0', '')}
          </div>
        ) : null}

        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
