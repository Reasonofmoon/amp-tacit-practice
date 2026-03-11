import { Brain, Home, BarChart2 } from 'lucide-react';
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
  isDev,
  onToggleJourney,
  children,
}) {
  const isHome = currentView === 'home';

  const title = isDev ? "AI 개발자의 1년" : "학원 원장의 1년";
  const subtitle = isDev 
    ? "소프트웨어 개발 과정에서 발생하는 암묵지 패턴을 추출하여 시스템 프롬프트로 변환합니다."
    : "무의식적 운영 감각을 문장과 선택의 데이터로 끌어올리고, AI가 재사용할 수 있는 형태로 변환합니다.";

  return (
    <div className="app-shell">
      {/* SaaS Style Header */}
      <header className="app-header">
        <div className="logo-wrap" onClick={onGoHome} role="button" tabIndex={0}>
          <Brain size={24} strokeWidth={2.5} />
          <span>Tacit KnowledgeLab</span>
        </div>
        
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
          <div className="hero-shell" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <span className="tag" style={{ marginBottom: '16px' }}>Diagnostic Platform</span>
            <h1>{title}</h1>
            <p style={{ marginTop: '12px', fontSize: '1.1rem', maxWidth: '600px', margin: '12px auto 0' }}>
              {subtitle}
            </p>
            
            {/* Journey Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: 'var(--space-lg)' }}>
              <button 
                className={`btn ${!isDev ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onToggleJourney('director')}
              >
                🎓 원장 여정
              </button>
              <button 
                className={`btn ${isDev ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onToggleJourney('developer')}
              >
                💻 개발자 여정
              </button>
            </div>
            
            <div style={{ marginTop: '32px', maxWidth: '400px', margin: '32px auto 0' }}>
              <XPBar xp={state.xp} levelInfo={levelInfo} nextLevel={nextLevel} xpGain={celebration.xpGain} />
            </div>
          </div>
        )}

        {/* Celebrations */}
        {celebration.levelUp && (
          <div className="card" style={{ marginBottom: '24px', borderColor: 'var(--primary)', backgroundColor: 'var(--primary-light)' }} role="status">
            <span className="tag" style={{ background: 'var(--primary)', color: 'white', marginBottom: '8px' }}>LEVEL UP</span>
            <h3 style={{ color: 'var(--primary-hover)', marginBottom: '4px' }}>
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
                  <h4 style={{ fontWeight: 600, color: 'var(--text-main)' }}>{badge.name}</h4>
                  <p style={{ fontSize: '0.875rem' }}>{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {celebration.combo && (
          <div className="card" style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--warning)', borderColor: 'var(--warning)', padding: '12px' }}>
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
