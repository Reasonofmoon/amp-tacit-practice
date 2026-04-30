// /api/gallery 통신. opt-in 사용자만 자기 게시물을 공유 풀에 보낸다.
const ENDPOINT = import.meta.env.VITE_GALLERY_ENDPOINT || '/api/gallery';
const ENABLED = import.meta.env.VITE_GALLERY_ENABLED === 'true' || false;

export function isGalleryServerEnabled() {
  return ENABLED;
}

// 공개 게시. fire-and-forget — 실패하더라도 사용자 흐름엔 영향 없음.
export function publishGalleryPost({ name, text, isDev = false }) {
  if (!ENABLED) return Promise.resolve(null);
  if (!name || !text) return Promise.resolve(null);
  return fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post: { name, text, isDev } }),
    keepalive: true,
  }).then((r) => r.ok ? r.json() : null).catch(() => null);
}

export async function fetchGalleryPosts({ isDev = false, limit = 30 } = {}) {
  if (!ENABLED) return [];
  try {
    const url = `${ENDPOINT}?dev=${isDev ? 1 : 0}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.posts) ? data.posts : [];
  } catch {
    return [];
  }
}
