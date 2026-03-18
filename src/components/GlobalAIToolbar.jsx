import { useState, useCallback } from 'react';
import { PROVIDERS, saveApiKey, clearApiKey } from '../utils/llmClient';

const PROVIDER_ORDER = ['gemini', 'openai', 'claude'];

export default function GlobalAIToolbar({ 
  activeProvider, setActiveProvider, 
  apiKeys, setApiKeys, 
  selectedModels, setSelectedModels 
}) {
  const [showKey, setShowKey] = useState(false);
  const provider = PROVIDERS[activeProvider] || Object.values(PROVIDERS)[0];
  const currentKey = apiKeys[activeProvider] || '';
  const currentModel = selectedModels[activeProvider];

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
    <div className="ai-chat-panel global-ai-toolbar" style={{ marginBottom: '24px', position: 'sticky', top: '16px', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid var(--border)', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(12px)' }}>
      <div style={{ padding: '0 20px 16px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', margin: '16px 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚙️</span> 글로벌 AI 설정
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
          여기서 설정한 API 키와 모델이 모든 프롬프트 실행기(Vibe Coding, 솔루션 설계 등)에 공통으로 적용됩니다.
        </p>
      </div>

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
          <span className="ai-key-note"> · 키는 브라우저에만 저장됩니다 (서버 전송 없음)</span>
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
  );
}
