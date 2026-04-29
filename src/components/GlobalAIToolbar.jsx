import { useState, useCallback } from 'react';
import { PROVIDERS, clearApiKey, isServerProxyEnabled, saveApiKey } from '../utils/llmClient';

const PROVIDER_ORDER = ['gemini', 'openai', 'claude'];

export default function GlobalAIToolbar({ 
  activeProvider, setActiveProvider, 
  apiKeys, setApiKeys, 
  selectedModels, setSelectedModels 
}) {
  const [showKey, setShowKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const provider = PROVIDERS[activeProvider] || Object.values(PROVIDERS)[0];
  const currentKey = apiKeys[activeProvider] || '';
  const currentModel = selectedModels[activeProvider];
  const proxyEnabled = isServerProxyEnabled();

  const handleKeyChange = useCallback((value) => {
    setApiKeys((prev) => ({ ...prev, [activeProvider]: value }));
  }, [activeProvider, setApiKeys]);

  const handleKeySave = useCallback(() => {
    saveApiKey(activeProvider, apiKeys[activeProvider]);
  }, [activeProvider, apiKeys]);

  const handleKeyClear = useCallback(() => {
    clearApiKey(activeProvider);
    setApiKeys((prev) => ({ ...prev, [activeProvider]: '' }));
  }, [activeProvider, setApiKeys]);

  return (
    <div className="ai-chat-panel global-ai-toolbar" style={{ 
      marginBottom: '32px', 
      position: 'sticky', 
      top: '16px', 
      zIndex: 100, 
      boxShadow: 'var(--shadow-xl)', 
      border: '1px solid var(--border-focus)', 
      background: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(16px)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      transition: 'all 0.3s ease-in-out'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: isExpanded ? '1px solid var(--border)' : 'none', 
        paddingBottom: isExpanded ? '16px' : '0', 
        marginBottom: isExpanded ? '20px' : '0',
        transition: 'all 0.3s'
      }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚙️</span> 글로벌 AI 설정
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {isExpanded 
              ? '여기서 설정한 API 키와 모델이 모든 프롬프트 실행기에 공통으로 적용됩니다. 서버 프록시가 켜진 배포에서는 키 입력 없이 실행할 수 있습니다.'
              : `${provider.name} 모델 선택됨 — 프롬프트 실행 준비 완료`}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border)', 
            color: 'var(--text-main)', 
            cursor: 'pointer', 
            borderRadius: '50%', 
            width: '36px',
            height: '36px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          aria-label={isExpanded ? "설정 접기" : "설정 펼치기"}
          title={isExpanded ? "설정 패널 숨기기" : "설정 패널 열기"}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-light)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {isExpanded ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          )}
        </button>
      </div>

      {isExpanded && (
        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          {/* Provider Tabs */}
      <div className="ai-provider-tabs">
        {PROVIDER_ORDER.map((id) => {
          const p = PROVIDERS[id];
          const isActive = activeProvider === id;
          const hasKey = !!apiKeys[id];
          return (
            <button
              key={id}
              type="button"
              className={`ai-provider-tab ${isActive ? 'active' : ''}`}
              style={{ '--provider-color': p.color }}
              onClick={() => setActiveProvider(id)}
              aria-label={`${p.name} 선택`}
            >
              <span className="ai-tab-icon">{p.icon}</span>
              <span className="ai-tab-name">{p.name}</span>
              {hasKey && <span className="ai-tab-badge">✓</span>}
            </button>
          );
        })}
      </div>

      {/* API Key Input */}
      <div className="ai-key-section">
        <div className="ai-key-row">
          <div className="ai-key-input-wrap">
            <input
              type={showKey ? 'text' : 'password'}
              className="ai-key-input"
              placeholder={provider.placeholder}
              value={currentKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              onBlur={handleKeySave}
              aria-label={`${provider.name} API 키 입력`}
            />
            <button
              type="button"
              className="ai-key-toggle"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? '키 숨기기' : '키 보기'}
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          {currentKey && (
            <button type="button" className="ai-key-clear" onClick={handleKeyClear} aria-label="키 삭제">
              ✕
            </button>
          )}
        </div>
        <p className="ai-key-help">
          <a href={provider.helpUrl} target="_blank" rel="noopener noreferrer">
            🔑 {provider.helpText}
          </a>
          <span className="ai-key-note">
            {proxyEnabled ? ' · 서버 프록시 활성화됨: 배포 환경변수의 키를 우선 사용합니다' : ' · 키는 브라우저에만 저장됩니다'}
          </span>
        </p>
      </div>

      {/* Model Selector */}
      <div className="ai-model-selector">
        <span className="ai-model-label">모델 선택</span>
        <div className="ai-model-options">
          {provider.models.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`ai-model-option ${currentModel === m.id ? 'active' : ''}`}
              style={{ '--provider-color': provider.color }}
              onClick={() => setSelectedModels((prev) => ({ ...prev, [activeProvider]: m.id }))}
              aria-label={`${m.label} 모델 선택`}
            >
              <span className="ai-model-badge">{m.badge}</span>
              <span className="ai-model-name">{m.label}</span>
              <span className="ai-model-desc">{m.desc}</span>
            </button>
          ))}
        </div>
      </div>
      
        </div>
      )}
    </div>
  );
}
