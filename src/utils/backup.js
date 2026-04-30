// localStorage 게임 상태를 JSON 파일로 백업·복원.
// (다기기 동기화 1단계 — 계정/서버 없이 사용자가 직접 파일을 옮긴다)
//
// 클라우드 변형은 backupClient.js 참조 (서버 옵션이 켜져 있을 때만 활성).

import { parseStoredGameState } from '../schemas/gameState';

const STORAGE_KEY = 'tacit-game-state';
const BACKUP_VERSION = 1;

// 익스포트할 때 가독성 좋은 파일명 만들기.
function makeFilename() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  return `tacit-knowledge-backup-${yyyy}${mm}${dd}-${hh}${mi}.json`;
}

export function buildBackupPayload(rawState) {
  // 파일은 schemaVersion + 본문 + 메타데이터를 같이 담는다.
  return {
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'tacit-knowledge',
    state: rawState,
  };
}

export function exportToFile(rawState) {
  const payload = buildBackupPayload(rawState);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = makeFilename();
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// 사용자가 업로드한 JSON을 검증해서 state를 돌려준다.
// 형식이 맞지 않거나 schema 검증 실패면 에러 던짐.
export function parseBackupText(text) {
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error('백업 파일이 올바른 JSON 형식이 아닙니다.');
  }

  if (payload?.app !== 'tacit-knowledge') {
    throw new Error('이 파일은 Tacit KnowledgeLab 백업 파일이 아닙니다.');
  }
  if (typeof payload.backupVersion !== 'number') {
    throw new Error('백업 버전 정보가 없습니다.');
  }
  if (payload.backupVersion > BACKUP_VERSION) {
    throw new Error(`이 백업은 더 최신 버전(v${payload.backupVersion})입니다. 앱을 먼저 업데이트해 주세요.`);
  }

  const validated = parseStoredGameState(payload.state);
  if (!validated) {
    throw new Error('백업 파일의 게임 상태 검증에 실패했습니다. 손상된 파일일 수 있습니다.');
  }
  return validated;
}

// 검증된 state를 localStorage에 직접 기록 → 다음 페이지 새로고침에서 반영.
export function restoreFromState(state) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// File 객체에서 텍스트 읽어 parseBackupText로 검증.
export async function readBackupFile(file) {
  if (!file) throw new Error('파일이 선택되지 않았습니다.');
  const text = await file.text();
  return parseBackupText(text);
}
