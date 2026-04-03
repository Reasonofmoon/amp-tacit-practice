import { useState, useRef, useEffect, useCallback } from 'react';
import DOMPurify from 'dompurify';
import { callLLM, PROVIDERS } from '../utils/llmClient';

/**
 * Minimal Markdown → HTML renderer for LLM responses.
 */
function renderMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const html = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  for (const line of lines) {
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

    if (/^[-*]\s/.test(processed.trim())) {
      html.push(`<li class="ai-md-li">${processInline(processed.trim().replace(/^[-*]\s/, ''))}</li>`);
      continue;
    }
    if (/^\d+\.\s/.test(processed.trim())) {
      html.push(`<li class="ai-md-li">${processInline(processed.trim().replace(/^\d+\.\s/, ''))}</li>`);
      continue;
    }

    if (processed.trim() === '') {
      html.push('<div class="ai-md-spacer"></div>');
      continue;
    }

    html.push(`<p class="ai-md-p">${processInline(processed)}</p>`);
  }

  if (inCodeBlock && codeBuffer.length) {
    html.push(`<pre class="ai-code-block"><code>${codeBuffer.join('\n')}</code></pre>`);
  }

  return DOMPurify.sanitize(html.join(''));
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function processInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="ai-inline-code">$1</code>');
}

export default function AITaskRunner({ prompt, activeProvider, currentKey, currentModel }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [followUp, setFollowUp] = useState('');
  const responseRef = useRef(null);

  const provider = PROVIDERS[activeProvider] || Object.values(PROVIDERS)[0];
  const currentModelInfo = provider.models.find((m) => m.id === currentModel) || provider.models[0];

  // Scroll to latest response
  useEffect(() => {
    if (responseRef.current && messages.length > 0) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (loading || !currentKey) return;
    setError('');
    setLoading(true);

    const conversation = [{ role: 'user', content: prompt }];
    
    messages.forEach((msg) => {
      conversation.push({ role: msg.role, content: msg.content });
    });

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
    <div className="ai-chat-panel ai-task-runner">
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
            <span>{currentModelInfo?.label || 'AI'}로 전송 중...</span>
          </>
        ) : !currentKey ? (
          <>
            <span>⚠️</span>
            <span>상단의 Global API Key를 입력해주세요</span>
          </>
        ) : (
          <>
            <span>{provider.icon}</span>
            <span>{messages.length > 0 ? `${currentModelInfo?.label || 'AI'}에 추가 질문하기` : `${currentModelInfo?.label || 'AI'}로 바로 보내기`}</span>
            <span>→</span>
          </>
        )}
      </button>

      {error && (
        <div className="ai-error" role="alert">
          {error}
        </div>
      )}

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
