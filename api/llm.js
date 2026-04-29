const PROVIDER_ENV_KEYS = {
  gemini: 'GEMINI_API_KEY',
  openai: 'OPENAI_API_KEY',
  claude: 'ANTHROPIC_API_KEY',
};

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

async function callGemini(apiKey, messages, model) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `Gemini ${response.status}`);
  }
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOpenAI(apiKey, messages, model) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenAI ${response.status}`);
  }
  return data?.choices?.[0]?.message?.content || '';
}

async function callClaude(apiKey, messages, model) {
  const systemMsg = messages.find((msg) => msg.role === 'system');
  const chatMessages = messages
    .filter((msg) => msg.role !== 'system')
    .map((msg) => ({ role: msg.role, content: msg.content }));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemMsg?.content || '',
      messages: chatMessages.length > 0 ? chatMessages : [{ role: 'user', content: messages[0]?.content || '' }],
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `Claude ${response.status}`);
  }
  return data?.content?.[0]?.text || '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const { providerId, modelId, messages } = await readBody(req);
    const envKey = PROVIDER_ENV_KEYS[providerId];
    const apiKey = envKey ? process.env[envKey] : '';

    if (!envKey || !apiKey) {
      return json(res, 400, { error: 'Provider API key is not configured on the server.' });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return json(res, 400, { error: 'messages must be a non-empty array.' });
    }

    const text = providerId === 'gemini'
      ? await callGemini(apiKey, messages, modelId)
      : providerId === 'openai'
        ? await callOpenAI(apiKey, messages, modelId)
        : await callClaude(apiKey, messages, modelId);

    return json(res, 200, { text });
  } catch (error) {
    return json(res, 500, { error: error.message || 'LLM proxy failed.' });
  }
}
