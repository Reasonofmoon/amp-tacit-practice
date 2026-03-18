import { useState, useRef, useEffect, useCallback } from 'react';
import { PROVIDERS, getStoredApiKey, saveApiKey, clearApiKey, callLLM } from '../utils/llmClient';

const PROVIDER_ORDER = ['gemini', 'openai', 'claude'];

/**
 * Minimal Markdown → HTML renderer for LLM responses.
 * Handles: headings, bold, lists, code blocks, inline code, paragraphs.
 */
function renderMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const html = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  for (const line of lines) {
    // Code block toggle
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        html.push(`<pre class="ai-code-block"><code>${codeBuffer.join('\n')}</code></pre>`);
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      codeBuffer.push(escapeHtml(line));
      continue;
    }

    let processed = line;

    // Headings
    if (/^####\s/.test(processed)) {
      html.push(`<h6 class="ai-md-h4">${processInline(processed.replace(/^####\s/, ''))}</h6>`);
      continue;
    }
    if (/^###\s/.test(processed)) {
      html.push(`<h5 class="ai-md-h3">${processInline(processed.replace(/^###\s/, ''))}</h5>`);
      continue;
    }
    if (/^##\s/.test(processed)) {
      html.push(`<h4 class="ai-md-h2">${processInline(processed.replace(/^##\s/, ''))}</h4>`);
      continue;
    }
    if (/^#\s/.test(processed)) {
      html.push(`<h3 class="ai-md-h1">${processInline(processed.replace(/^#\s/, ''))}</h3>`);
      continue;
    }

    // List items
    if (/^[-*]\s/.test(processed.trim())) {
      html.push(`<li class="ai-md-li">${processInline(processed.trim().replace(/^[-*]\s/, ''))}</li>`);
      continue;
    }
    if (/^\d+\.\s/.test(processed.trim())) {
      html.push(`<li class="ai-md-li">${processInline(processed.trim().replace(/^\d+\.\s/, ''))}</li>`);
      continue;
    }

    // Empty line → spacer
    if (processed.trim() === '') {
      html.push('<div class="ai-md-spacer"></div>');
      continue;
    }

    // Regular paragraph
    html.push(`<p class="ai-md-p">${processInline(processed)}</p>`);
  }

  // Close unclosed code block
  if (inCodeBlock && codeBuffer.length) {
    html.push(`<pre class="ai-code-block"><code>${codeBuffer.join('\n')}</code></pre>`);
  }

  return html.join('');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function processInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="ai-inline-code">$1</code>');
}

export default function AIChatPanel({ prompt }) {
  const [activeProvider, setActiveProvider] = useState('gemini');
  const [apiKeys, setApiKeys] = useState(() => {
    const keys = {};
    PROVIDER_ORDER.forEach((id) => { keys[id] = getStoredApiKey(id); });
    return keys;
  });
  const [selectedModels, setSelectedModels] = useState(() => {
    const models = {};
    PROVIDER_ORDER.forEach((id) => { models[id] = PROVIDERS[id].defaultModel; });
    return models;
  });
  const [showKey, setShowKey] = useState(false);
  const [messages, setMessages] = useState([]); // { role, content, provider }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [followUp, setFollowUp] = useState('');
  const responseRef = useRef(null);

  const provider = PROVIDERS[activeProvider];
  const currentKey = apiKeys[activeProvider] || '';
  const currentModel = selectedModels[activeProvider];
  const currentModelInfo = provider.models.find((m) => m.id === currentModel) || provider.models[0];

  const handleKeyChange = useCallback((value) => {
    setApiKeys((prev) => ({ ...prev, [activeProvider]: value }));
  }, [activeProvider]);

  const handleKeySave = useCallback(() => {
    saveApiKey(activeProvider, apiKeys[activeProvider]);
  }, [activeProvider, apiKeys]);

  const handleKeyClear = useCallback(() => {
    clearApiKey(activeProvider);
    setApiKeys((prev) => ({ ...prev, [activeProvider]: '' }));
  }, [activeProvider]);

  // Scroll to latest response
  useEffect(() => {
    if (responseRef.current && messages.length > 0) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (loading) return;
    setError('');
    setLoading(true);

    // Build conversation for API
    const conversation = [
      { role: 'user', content: prompt },
    ];

    // Add existing conversation history
    messages.forEach((msg) => {
      conversation.push({ role: msg.role, content: msg.content });
    });

    // If there's a follow-up question, add it
    const userMessage = followUp.trim();
    if (messages.length > 0 && userMessage) {
      conversation.push({ role: 'user', content: userMessage });
    }

    const result = await callLLM(activeProvider, currentKey, conversation, currentModel);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    const newMessages = [...messages];
    if (messages.length > 0 && userMessage) {
      newMessages.push({ role: 'user', content: userMessage, provider: activeProvider });
    }
    newMessages.push({ role: 'assistant', content: result.text, provider: activeProvider });

    setMessages(newMessages);
    setFollowUp('');
    setLoading(false);
  }, [loading, prompt, messages, followUp, activeProvider, currentKey, currentModel]);

  const handleFollowUpKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([]);
    setError('');
    setFollowUp('');
  };

  return (
    <div className="ai-chat-panel">
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
              onClick={() => { setActiveProvider(id); setError(''); }}
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

      {/* Send Button */}
      <button
        type="button"
        className="ai-send-btn"
        style={{ '--provider-color': provider.color }}
        disabled={loading || !currentKey}
        onClick={handleSend}
        aria-label="AI에게 프롬프트 보내기"
      >
        {loading ? (
          <>
            <span className="ai-spinner" />
            <span>{currentModelInfo.label}로 전송 중...</span>
          </>
        ) : (
          <>
            <span>{provider.icon}</span>
            <span>{messages.length > 0 ? `${currentModelInfo.label}에 추가 질문하기` : `${currentModelInfo.label}로 보내기`}</span>
            <span>→</span>
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="ai-error" role="alert">
          {error}
        </div>
      )}

      {/* Conversation */}
      {messages.length > 0 && (
        <div className="ai-conversation" ref={responseRef}>
          <div className="ai-conv-header">
            <span className="tag" style={{ background: provider.color, color: 'white' }}>
              {provider.icon} {provider.name} RESPONSE
            </span>
            <button type="button" className="btn btn-sm btn-ghost" onClick={handleReset} aria-label="대화 초기화">
              🔄 초기화
            </button>
          </div>

          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message ai-message-${msg.role}`}>
              {msg.role === 'user' && (
                <div className="ai-user-bubble">
                  <span className="ai-user-label">추가 질문</span>
                  <p>{msg.content}</p>
                </div>
              )}
              {msg.role === 'assistant' && (
                <div
                  className="ai-response-body"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              )}
            </div>
          ))}

          {/* Follow-up Input */}
          <div className="ai-followup">
            <input
              type="text"
              className="ai-followup-input"
              placeholder="추가 질문을 입력하세요... (Enter로 전송)"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={handleFollowUpKeyDown}
              disabled={loading}
              aria-label="추가 질문 입력"
            />
            <button
              type="button"
              className="ai-followup-btn"
              onClick={handleSend}
              disabled={loading || !followUp.trim()}
              style={{ '--provider-color': provider.color }}
            >
              {loading ? '⏳' : '↑'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
