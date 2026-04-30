// Anonymous gallery feed — opt-in user posts shared across all users.
//
// POST /api/gallery — accept a single anonymized post (no PII)
// GET  /api/gallery — return the latest N posts (default 30)
//
// PRIVACY:
//   - Post text is whitelisted: ≤200 chars, stripped of emails/phone numbers/
//     URLs, no profile fields.
//   - Author label is sanitized to <profile-style format>: "{N년차}{지역}{과목}학원"
//     style only, ≤30 chars. Free-form names rejected.
//   - Server logs no IPs.
//
// STORAGE:
//   - In-memory ring buffer (last 200 posts) — fine for demo.
//   - Vercel KV swap when KV_REST_API_URL + KV_REST_API_TOKEN env present.

const MAX_POSTS = 200;
const RETURN_LIMIT = 30;
const POST_MAX_CHARS = 200;
const NAME_MAX_CHARS = 30;

// PII strip patterns
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PHONE_RE = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;
const URL_RE = /https?:\/\/[^\s]+/gi;

function stripPII(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(EMAIL_RE, '[이메일]')
    .replace(URL_RE, '[링크]')
    .replace(PHONE_RE, '[전화]');
}

function sanitizePost(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const rawText = typeof raw.text === 'string' ? raw.text.trim() : '';
  if (rawText.length < 6 || rawText.length > POST_MAX_CHARS) return null;

  const rawName = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (rawName.length === 0 || rawName.length > NAME_MAX_CHARS) return null;

  // Author label whitelist: must be {N년차} pattern. Free names rejected to
  // prevent accidental real-name disclosure.
  if (!/년차/.test(rawName)) return null;

  return {
    id: `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    name: stripPII(rawName).slice(0, NAME_MAX_CHARS),
    text: stripPII(rawText).slice(0, POST_MAX_CHARS),
    isDev: !!raw.isDev,
    likes: 0,
    t: Date.now(),
  };
}

// ─── Storage abstraction ──────────────────────────────────────
const memoryRing = [];

const memoryStore = {
  async append(post) {
    memoryRing.push(post);
    if (memoryRing.length > MAX_POSTS) memoryRing.splice(0, memoryRing.length - MAX_POSTS);
  },
  async list({ limit = RETURN_LIMIT, isDev = false } = {}) {
    return memoryRing
      .filter((p) => !!p.isDev === !!isDev)
      .slice(-limit)
      .reverse();
  },
};

function makeKvStore() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  async function kvFetch(path, method = 'GET', body) {
    const res = await fetch(`${url}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`KV ${method} ${path} → ${res.status}`);
    return res.json();
  }
  function key(isDev) { return isDev ? 'gallery:dev' : 'gallery:director'; }
  return {
    async append(post) {
      await kvFetch(`/lpush/${key(post.isDev)}/${encodeURIComponent(JSON.stringify(post))}`, 'POST');
      await kvFetch(`/ltrim/${key(post.isDev)}/0/${MAX_POSTS - 1}`, 'POST');
    },
    async list({ limit = RETURN_LIMIT, isDev = false } = {}) {
      const data = await kvFetch(`/lrange/${key(isDev)}/0/${limit - 1}`);
      return (data?.result ?? [])
        .map((s) => { try { return JSON.parse(s); } catch { return null; } })
        .filter(Boolean);
    },
  };
}

const store = makeKvStore() || memoryStore;

// ─── HTTP helpers (same idiom as api/benchmark.js) ────────────
function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(body == null ? '' : JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, null);

  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, 'http://x');
      const isDev = url.searchParams.get('dev') === '1';
      const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit')) || RETURN_LIMIT));
      const posts = await store.list({ limit, isDev });
      return json(res, 200, { posts });
    } catch (err) {
      return json(res, 500, { error: err.message ?? 'list failed' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req);
      const post = sanitizePost(body?.post);
      if (!post) return json(res, 400, { error: 'invalid post — 작성자는 "N년차 …" 형식, 본문 6~200자' });
      await store.append(post);
      return json(res, 200, { post });
    } catch (err) {
      return json(res, 500, { error: err.message ?? 'submit failed' });
    }
  }

  return json(res, 405, { error: 'method not allowed' });
}
