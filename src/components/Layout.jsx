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
  children,
}) {
  const isHome = currentView === 'home';

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
          <div className="hero-shell">
            <span className="tag" style={{ marginBottom: '16px' }}>Diagnostic Platform</span>
            <h1>학원 원장의 1년</h1>
            <p style={{ marginTop: '12px', fontSize: '1.1rem' }}>
              무의식적 운영 감각을 문장과 선택의 데이터로 끌어올리고, AI가 재사용할 수 있는 형태로 변환합니다.
            </p>
            
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
