/**
 * LLM Client — Multi-provider API abstraction
 * Supports: OpenAI (ChatGPT), Google Gemini, Anthropic Claude
 * All calls are made directly from the browser (client-side).
 */

const STORAGE_PREFIX = 'tacit-llm-key-';

export const PROVIDERS = {
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    icon: '✨',
    color: '#4285F4',
    placeholder: 'AIzaSy...',
    defaultModel: 'gemini-2.5-flash',
    models: [
      { id: 'gemini-2.5-pro',   label: '2.5 Pro',   badge: '🏆 최신 플래그십', desc: '최고 성능, 복잡한 추론' },
      { id: 'gemini-2.5-flash', label: '2.5 Flash',  badge: '⚡ 추천',       desc: '빠르고 똑똑한 범용 모델' },
      { id: 'gemini-2.0-flash', label: '2.0 Flash',  badge: '💰 경제적',     desc: '안정적이고 저렴한 표준 모델' },
    ],
    helpUrl: 'https://aistudio.google.com/apikey',
    helpText: 'Google AI Studio에서 무료 API 키를 발급받으세요',
  },
  openai: {
    id: 'openai',
    name: 'ChatGPT',
    icon: '🤖',
    color: '#10A37F',
    placeholder: 'sk-proj-...',
    defaultModel: 'gpt-4o',
    models: [
      { id: 'gpt-4o',          label: 'GPT-4o',      badge: '🏆 플래그십',  desc: '최신 멀티모달 플래그십' },
      { id: 'gpt-4o-mini',     label: 'GPT-4o mini',  badge: '💰 경제적',   desc: '빠르고 저렴한 범용 모델' },
      { id: 'o3-mini',         label: 'o3-mini',      badge: '🧠 추론 특화', desc: '수학·코딩 추론에 최적화' },
    ],
    helpUrl: 'https://platform.openai.com/api-keys',
    helpText: 'OpenAI Platform에서 API 키를 발급받으세요',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    icon: '🧠',
    color: '#D97706',
    placeholder: 'sk-ant-...',
    defaultModel: 'claude-sonnet-4-20250514',
    models: [
      { id: 'claude-opus-4-20250514',    label: 'Opus 4',     badge: '🏆 최고 성능', desc: '최강 지능, 복잡한 작업에 최적' },
      { id: 'claude-sonnet-4-20250514',  label: 'Sonnet 4',   badge: '⚡ 추천',      desc: '성능과 속도의 최적 균형' },
      { id: 'claude-3-5-haiku-20241022', label: 'Haiku 3.5',  badge: '💰 경제적',    desc: '빠르고 저렴한 경량 모델' },
    ],
    helpUrl: 'https://console.anthropic.com/settings/keys',
    helpText: 'Anthropic Console에서 API 키를 발급받으세요',
  },
};

/* ─── API Key Management (localStorage) ─── */

export function getStoredApiKey(providerId) {
  try {
    return localStorage.getItem(STORAGE_PREFIX + providerId) || '';
  } catch {
    return '';
  }
}

export function saveApiKey(providerId, key) {
  try {
    if (key) {
      localStorage.setItem(STORAGE_PREFIX + providerId, key.trim());
    } else {
      localStorage.removeItem(STORAGE_PREFIX + providerId);
    }
  } catch {
    // localStorage unavailable
  }
}

export function clearApiKey(providerId) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + providerId);
  } catch {
    // noop
  }
}

/* ─── API Call Abstraction ─── */

/**
 * Call an LLM provider with the given messages.
 * @param {string} providerId - 'openai' | 'gemini' | 'claude'
 * @param {string} apiKey - The user's API key
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @param {string} [modelId] - Optional specific model ID to use
 * @returns {Promise<{text: string, error: string|null}>}
 */
export async function callLLM(providerId, apiKey, messages, modelId) {
  if (!apiKey || !apiKey.trim()) {
    return { text: '', error: 'API 키를 입력해주세요.' };
  }

  const resolvedModel = modelId || PROVIDERS[providerId]?.defaultModel;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout

  try {
    switch (providerId) {
      case 'gemini':
        return await callGemini(apiKey.trim(), messages, controller.signal, resolvedModel);
      case 'openai':
        return await callOpenAI(apiKey.trim(), messages, controller.signal, resolvedModel);
      case 'claude':
        return await callClaude(apiKey.trim(), messages, controller.signal, resolvedModel);
      default:
        return { text: '', error: `알 수 없는 공급자: ${providerId}` };
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return { text: '', error: '⏱️ 요청 시간이 초과되었습니다 (90초). 잠시 후 다시 시도해주세요.' };
    }
    return { text: '', error: `네트워크 오류: ${err.message}` };
  } finally {
    clearTimeout(timeout);
  }
}

/* ─── Gemini ─── */

async function callGemini(apiKey, messages, signal, modelId) {
  // Convert chat messages to Gemini format
  const contents = messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { text: '', error: parseGeminiError(res.status, body) };
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) {
    return { text: '', error: '응답이 비어있습니다. 프롬프트를 확인해주세요.' };
  }
  return { text, error: null };
}

function parseGeminiError(status, body) {
  const msg = body?.error?.message || '';
  if (status === 400 && msg.includes('API_KEY')) return '❌ Gemini API 키가 올바르지 않습니다. Google AI Studio에서 확인해주세요.';
  if (status === 403) return '🔒 API 키의 권한이 부족합니다. Gemini API가 활성화되어 있는지 확인하세요.';
  if (status === 429) return '⏳ 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
  return `Gemini 오류 (${status}): ${msg || '알 수 없는 오류'}`;
}

/* ─── OpenAI ─── */

async function callOpenAI(apiKey, messages, signal, modelId) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
      max_tokens: 4096,
    }),
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { text: '', error: parseOpenAIError(res.status, body) };
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || '';
  if (!text) {
    return { text: '', error: '응답이 비어있습니다.' };
  }
  return { text, error: null };
}

function parseOpenAIError(status, body) {
  const msg = body?.error?.message || '';
  if (status === 401) return '❌ OpenAI API 키가 올바르지 않습니다. 키를 확인해주세요.';
  if (status === 429) return '⏳ 요청 한도를 초과했습니다. 잠시 후 다시 시도하거나 사용량을 확인하세요.';
  if (status === 402 || msg.includes('billing')) return '💳 OpenAI 계정의 결제 정보를 확인해주세요.';
  if (status === 403) return '🔒 이 API 키로는 해당 모델에 접근할 수 없습니다.';
  return `OpenAI 오류 (${status}): ${msg || '알 수 없는 오류'}`;
}

/* ─── Claude (Anthropic) ─── */

async function callClaude(apiKey, messages, signal, modelId) {
  // Separate system message from conversation
  const systemMsg = messages.find((m) => m.role === 'system');
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role, content: m.content }));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 4096,
      system: systemMsg?.content || '',
      messages: chatMessages.length > 0 ? chatMessages : [{ role: 'user', content: messages[0]?.content || '' }],
    }),
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { text: '', error: parseClaudeError(res.status, body) };
  }

  const data = await res.json();
  const text = data?.content?.[0]?.text || '';
  if (!text) {
    return { text: '', error: '응답이 비어있습니다.' };
  }
  return { text, error: null };
}

function parseClaudeError(status, body) {
  const msg = body?.error?.message || '';
  if (status === 401) return '❌ Claude API 키가 올바르지 않습니다. Anthropic Console에서 확인해주세요.';
  if (status === 429) return '⏳ 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
  if (status === 403) return '🔒 Claude API 접근이 거부되었습니다. 브라우저에서 직접 호출이 제한될 수 있습니다.';
  if (status === 400) return `⚠️ 요청 형식 오류: ${msg}`;
  if (status === 0 || msg.includes('CORS') || msg.includes('fetch')) {
    return '🌐 브라우저에서 Claude API 직접 호출이 차단되었습니다. ChatGPT 또는 Gemini를 이용하시거나, 프롬프트를 복사해서 Claude 웹사이트에 붙여넣기 해주세요.';
  }
  return `Claude 오류 (${status}): ${msg || '알 수 없는 오류'}`;
}
