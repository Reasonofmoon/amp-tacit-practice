// 클라이언트 ↔ /api/benchmark 통신.
// 제출은 fire-and-forget, 조회는 24시간 캐시 + 메모리.

const ENDPOINT = import.meta.env.VITE_BENCHMARK_ENDPOINT || '/api/benchmark';
const ENABLED = import.meta.env.VITE_BENCHMARK_ENABLED === 'true' || false;
const CACHE_KEY = 'tacit-benchmark-cache-v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

let memoryCache = null;

export function isBenchmarkServerEnabled() {
  return ENABLED;
}

// fire-and-forget — 실패해도 silent. 사용자 경험에 영향 없음.
export function submitBenchmarkSnapshot(snapshot) {
  if (!snapshot || !ENABLED) return;
  if (typeof fetch === 'undefined') return;
  try {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snapshot }),
      keepalive: true, // 페이지 닫혀도 송신
    }).catch(() => {});
  } catch {
    // ignore — 네트워크/CSP 등 어떤 실패든 사용자에게 노출 X
  }
}

function readCache() {
  if (memoryCache) return memoryCache;
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - (parsed?.fetchedAt ?? 0) > CACHE_TTL_MS) return null;
    memoryCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(payload) {
  memoryCache = payload;
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* noop */
  }
}

// 최신 집계를 가져온다. 24h 캐시 만료 전이면 캐시 반환.
// 서버가 ready: false 또는 endpoint 부재일 때 null 반환 → static fallback 사용.
export async function fetchLiveBenchmark({ force = false } = {}) {
  if (!ENABLED) return null;

  if (!force) {
    const cached = readCache();
    if (cached?.data?.ready) return cached.data;
  }

  try {
    const res = await fetch(ENDPOINT, { method: 'GET' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.ready) return null;
    writeCache({ fetchedAt: Date.now(), data });
    return data;
  } catch {
    return null;
  }
}
