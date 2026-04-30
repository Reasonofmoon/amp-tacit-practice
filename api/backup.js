// 코드 기반 익명 클라우드 백업.
//
// POST /api/backup — { state } → { code: "ABC123" }   (30일 TTL)
// GET  /api/backup?code=ABC123 → { state }
//
// 인증 없음. 6자리 코드가 secret 역할. 사용자가 이걸 다른 기기로 옮긴다.
// 코드는 alphanumeric 6자리(36^6 ≈ 22억 조합) — brute force 방지를 위해
// rate limit 권장 (배포 단계에서 추가).

const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30일
const MAX_BYTES = 200 * 1024; // 200KB — localStorage 정도면 충분

// ─── In-memory 저장소 ────────────────
const memoryMap = new Map(); // code → { state, expiresAt }

const memoryStore = {
  async set(code, value) {
    memoryMap.set(code, value);
    // GC: 만료된 항목 한 번 청소
    const now = Date.now();
    for (const [k, v] of memoryMap) if (v.expiresAt < now) memoryMap.delete(k);
  },
  async get(code) {
    const entry = memoryMap.get(code);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      memoryMap.delete(code);
      return null;
    }
    return entry;
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
  const ttlSec = Math.floor(TTL_MS / 1000);
  return {
    async set(code, value) {
      const payload = encodeURIComponent(JSON.stringify(value));
      await kvFetch(`/set/backup:${code}/${payload}?EX=${ttlSec}`, 'POST');
    },
    async get(code) {
      const data = await kvFetch(`/get/backup:${code}`);
      if (!data?.result) return null;
      try { return JSON.parse(data.result); } catch { return null; }
    },
  };
}

const store = makeKvStore() || memoryStore;

function makeCode() {
  // alphanumeric (36진수) 6자리 — 약 22억 조합
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // I, O, 0, 1 제외 (혼동 방지)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ─── HTTP helpers ───────────────────
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
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BYTES) throw new Error('payload too large');
    chunks.push(chunk);
  }
  if (chunks.length === 0) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, null);

  if (req.method === 'POST') {
    try {
      const body = await readBody(req);
      const state = body?.state;
      if (!state || typeof state !== 'object') {
        return json(res, 400, { error: 'state 필드가 필요합니다.' });
      }
      // 충돌 회피 — 한 번 더 충돌하면 간단히 대체 코드 시도
      let code = makeCode();
      const existing = await store.get(code);
      if (existing) code = makeCode();
      await store.set(code, { state, expiresAt: Date.now() + TTL_MS });
      return json(res, 200, { code, ttlMs: TTL_MS });
    } catch (err) {
      const msg = err?.message ?? 'backup failed';
      const status = msg === 'payload too large' ? 413 : 500;
      return json(res, status, { error: msg });
    }
  }

  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, 'http://x');
      const code = (url.searchParams.get('code') || '').toUpperCase().trim();
      if (!/^[A-Z2-9]{6}$/.test(code)) {
        return json(res, 400, { error: '6자리 영숫자 코드만 허용됩니다.' });
      }
      const entry = await store.get(code);
      if (!entry) return json(res, 404, { error: '코드를 찾지 못했습니다 (만료되었거나 잘못된 코드).' });
      return json(res, 200, { state: entry.state });
    } catch (err) {
      return json(res, 500, { error: err?.message ?? 'restore failed' });
    }
  }

  return json(res, 405, { error: 'method not allowed' });
}
