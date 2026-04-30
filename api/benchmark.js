// Anonymous benchmark submission + aggregation endpoint.
//
// POST /api/benchmark  — accept anonymized stat snapshot from client
// GET  /api/benchmark  — return aggregated benchmark (mean / p10 / p50 / p90)
//
// PRIVACY:
//   - Never receives names, profile fields, free-text answers, or IPs.
//   - Only numeric/categorical metrics per activity.
//   - All submissions are unauthenticated and independent.
//
// STORAGE:
//   - This file ships with an in-memory ring buffer (fine for dev, single
//     instance demos, or Vercel during a single warm period).
//   - Production deployments should swap the `store` interface for Vercel
//     KV / Upstash / Postgres. The interface is one method:
//        store.append(activityId, snapshot)
//        store.list(activityId) → snapshot[]
//   - When KV envs are detected (KV_REST_API_URL + KV_REST_API_TOKEN),
//     the handler will use Vercel KV. Otherwise it falls back to memory.

const MAX_PER_ACTIVITY = 1000;
const MIN_FOR_PUBLISH = 5; // Below this, GET returns 204 — client uses static fallback.
const SCHEMA_VERSION = 1;

// ─── Schema validation ───────────────────────────────────────
// Each snapshot is a small typed payload. Anything else is dropped.
const SUPPORTED_ACTIVITIES = new Set([
  'quiz', 'dev_quiz',
  'roleplay', 'dev_roleplay',
  'crisis', 'dev_crisis',
  'transfer', 'dev_transfer',
  'autopilot', 'dev_autopilot',
  'noticing', 'dev_noticing',
  'cdm', 'dev_cdm',
  'pattern', 'dev_pattern',
  'gallery', 'dev_gallery',
  'seci', 'dev_seci',
  'timeline', 'dev_timeline',
]);

function sanitizeNumber(value, { min = 0, max = 100000 } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}

function sanitizeString(value, max = 40) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function sanitizeSnapshot(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const activityId = sanitizeString(raw.activityId, 32);
  if (!activityId || !SUPPORTED_ACTIVITIES.has(activityId)) return null;

  const safe = { activityId, t: Date.now() };

  // numeric fields — only allow whitelisted keys
  const numericKeys = ['answerLengthMean', 'answerCount', 'timeSec', 'accuracy', 'scoreRatio', 'completedScenarios', 'totalChars'];
  for (const key of numericKeys) {
    if (raw[key] != null) {
      const n = sanitizeNumber(raw[key], { min: 0, max: key === 'totalChars' ? 50000 : 10000 });
      if (n != null) safe[key] = n;
    }
  }

  // categorical fields — only known small enums
  if (raw.styleTitle) {
    const allowed = ['신뢰 구축형', '균형 조율형', '즉흥 대응형'];
    const trimmed = sanitizeString(raw.styleTitle, 16);
    if (trimmed && allowed.includes(trimmed)) safe.styleTitle = trimmed;
  }

  return safe;
}

// ─── Store: in-memory fallback ────────────────────────────────
// In serverless envs each cold-started instance has its own memory; this is
// acceptable for dev / single-instance preview deployments.
const memoryStore = (() => {
  const buckets = new Map(); // activityId → snapshot[]
  return {
    async append(activityId, snapshot) {
      if (!buckets.has(activityId)) buckets.set(activityId, []);
      const arr = buckets.get(activityId);
      arr.push(snapshot);
      if (arr.length > MAX_PER_ACTIVITY) arr.splice(0, arr.length - MAX_PER_ACTIVITY);
    },
    async list(activityId) {
      return buckets.get(activityId) ?? [];
    },
    async listAll() {
      const out = {};
      for (const [k, v] of buckets) out[k] = v;
      return out;
    },
  };
})();

// Vercel KV adapter (only used when env keys present).
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

  return {
    async append(activityId, snapshot) {
      // LPUSH + LTRIM keeps a bounded ring of recent snapshots.
      await kvFetch(`/lpush/bench:${encodeURIComponent(activityId)}/${encodeURIComponent(JSON.stringify(snapshot))}`, 'POST');
      await kvFetch(`/ltrim/bench:${encodeURIComponent(activityId)}/0/${MAX_PER_ACTIVITY - 1}`, 'POST');
    },
    async list(activityId) {
      const data = await kvFetch(`/lrange/bench:${encodeURIComponent(activityId)}/0/-1`);
      return (data?.result ?? []).map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
    },
    async listAll() {
      // Not strictly needed for current GET; iterate known activities instead.
      const out = {};
      for (const id of SUPPORTED_ACTIVITIES) {
        out[id] = await this.list(id);
      }
      return out;
    },
  };
}

const store = makeKvStore() || memoryStore;

// ─── Aggregation ──────────────────────────────────────────────
function percentile(sortedValues, p) {
  if (sortedValues.length === 0) return 0;
  const idx = Math.min(sortedValues.length - 1, Math.floor((p / 100) * sortedValues.length));
  return sortedValues[idx];
}

function summarizeNumber(values) {
  if (values.length < MIN_FOR_PUBLISH) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((s, v) => s + v, 0);
  return {
    n: sorted.length,
    mean: Math.round((sum / sorted.length) * 10) / 10,
    p10: percentile(sorted, 10),
    p50: percentile(sorted, 50),
    p90: percentile(sorted, 90),
  };
}

function summarizeCategorical(values) {
  if (values.length < MIN_FOR_PUBLISH) return null;
  const counts = {};
  for (const v of values) counts[v] = (counts[v] ?? 0) + 1;
  const total = values.length;
  const out = {};
  for (const [k, c] of Object.entries(counts)) out[k] = Math.round((c / total) * 100);
  return { n: total, percent: out };
}

async function buildAggregate() {
  const all = await store.listAll();
  const lengthAll = [];
  const quizTimes = [];
  const quizAcc = [];
  const roleplayStyles = [];
  let total = 0;

  for (const [activityId, snapshots] of Object.entries(all)) {
    if (!Array.isArray(snapshots)) continue;
    total += snapshots.length;
    for (const s of snapshots) {
      if (s.answerLengthMean != null) lengthAll.push(s.answerLengthMean);
      if (activityId === 'quiz' || activityId === 'dev_quiz') {
        if (s.timeSec != null) quizTimes.push(s.timeSec);
        if (s.accuracy != null) quizAcc.push(s.accuracy);
      }
      if (activityId === 'roleplay' || activityId === 'dev_roleplay') {
        if (s.styleTitle) roleplayStyles.push(s.styleTitle);
      }
    }
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    totalSubmissions: total,
    metrics: {
      answerLength: summarizeNumber(lengthAll),
      quizTime: summarizeNumber(quizTimes),
      quizAccuracy: summarizeNumber(quizAcc),
      roleplayStyle: summarizeCategorical(roleplayStyles),
    },
  };
}

// ─── HTTP helpers ─────────────────────────────────────────────
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

// ─── Handler ──────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, null);

  if (req.method === 'GET') {
    try {
      const aggregate = await buildAggregate();
      if (aggregate.totalSubmissions < MIN_FOR_PUBLISH) {
        return json(res, 200, { ready: false, totalSubmissions: aggregate.totalSubmissions });
      }
      return json(res, 200, { ready: true, ...aggregate });
    } catch (err) {
      return json(res, 500, { error: err.message ?? 'aggregate failed' });
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req);
      const snapshot = sanitizeSnapshot(body?.snapshot);
      if (!snapshot) return json(res, 400, { error: 'invalid snapshot' });
      await store.append(snapshot.activityId, snapshot);
      return json(res, 204, null);
    } catch (err) {
      return json(res, 500, { error: err.message ?? 'submit failed' });
    }
  }

  return json(res, 405, { error: 'method not allowed' });
}
