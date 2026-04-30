// 클라우드 백업 — /api/backup 통신 (서버 활성화 시).
const ENDPOINT = import.meta.env.VITE_BACKUP_ENDPOINT || '/api/backup';
const ENABLED = import.meta.env.VITE_BACKUP_ENABLED === 'true' || false;

export function isBackupServerEnabled() {
  return ENABLED;
}

export async function uploadBackup(state) {
  if (!ENABLED) throw new Error('클라우드 백업이 비활성화되어 있습니다.');
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `백업 실패 (${res.status})`);
  return data; // { code, ttlMs }
}

export async function downloadBackup(code) {
  if (!ENABLED) throw new Error('클라우드 백업이 비활성화되어 있습니다.');
  const cleanCode = String(code || '').toUpperCase().trim();
  if (!/^[A-Z2-9]{6}$/.test(cleanCode)) {
    throw new Error('6자리 영숫자 코드만 입력 가능합니다 (I, O, 0, 1 제외).');
  }
  const res = await fetch(`${ENDPOINT}?code=${encodeURIComponent(cleanCode)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `복원 실패 (${res.status})`);
  return data?.state ?? null;
}
