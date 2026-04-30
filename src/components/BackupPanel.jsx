import { useRef, useState } from 'react';
import { Download, Upload, Cloud, CloudDownload } from 'lucide-react';
import { exportToFile, readBackupFile, restoreFromState } from '../utils/backup';
import { downloadBackup, isBackupServerEnabled, uploadBackup } from '../utils/backupClient';

// 리포트에 다는 백업 패널.
// (1) 파일 모드 — 항상 사용 가능. 기기 간 동기화는 사용자가 직접 파일 옮김.
// (2) 클라우드 모드 — VITE_BACKUP_ENABLED=true 일 때만. 6자리 코드로 30일 TTL 백업.
export default function BackupPanel({ state }) {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState(null); // { tone, message }
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState('');
  const [restoreCode, setRestoreCode] = useState('');
  const cloudOn = isBackupServerEnabled();

  const showStatus = (tone, message) => {
    setStatus({ tone, message });
    window.setTimeout(() => setStatus(null), 5500);
  };

  const handleExport = () => {
    try {
      exportToFile(state);
      showStatus('positive', '✓ 백업 파일이 다운로드되었습니다. 다른 기기로 옮길 때 사용하세요.');
    } catch (err) {
      showStatus('caution', `백업 실패: ${err?.message ?? '알 수 없는 오류'}`);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      const restored = await readBackupFile(file);
      const ok = window.confirm(
        '백업 파일이 검증되었습니다. 현재 진행 상황을 백업으로 덮어쓸까요?\n(현재 진행도가 사라집니다 — 미리 내려받기를 권합니다)'
      );
      if (!ok) {
        showStatus('neutral', '복원 취소됨.');
        return;
      }
      restoreFromState(restored);
      showStatus('positive', '✓ 복원 완료! 페이지를 새로고침하면 반영됩니다.');
      window.setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      showStatus('caution', `복원 실패: ${err?.message ?? '알 수 없는 오류'}`);
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCloudUpload = async () => {
    try {
      setBusy(true);
      const result = await uploadBackup(state);
      setCode(result.code);
      showStatus('positive', `✓ 클라우드 백업 완료. 코드: ${result.code} (30일 보관)`);
    } catch (err) {
      showStatus('caution', `백업 실패: ${err?.message ?? '알 수 없는 오류'}`);
    } finally {
      setBusy(false);
    }
  };

  const handleCloudRestore = async () => {
    if (!restoreCode.trim()) {
      showStatus('caution', '복원할 6자리 코드를 입력해 주세요.');
      return;
    }
    try {
      setBusy(true);
      const restored = await downloadBackup(restoreCode);
      if (!restored) {
        showStatus('caution', '코드를 찾지 못했습니다.');
        return;
      }
      const ok = window.confirm(
        '코드 복원 데이터가 검증되었습니다. 현재 진행 상황을 백업으로 덮어쓸까요?'
      );
      if (!ok) {
        showStatus('neutral', '복원 취소됨.');
        return;
      }
      restoreFromState(restored);
      showStatus('positive', '✓ 복원 완료! 페이지를 새로고침하면 반영됩니다.');
      window.setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      showStatus('caution', `복원 실패: ${err?.message ?? '알 수 없는 오류'}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="report-paper-card backup-panel">
      <div className="section-heading">
        <div>
          <span className="flow-eyebrow-tag" style={{ background: 'var(--paper-100)', borderColor: 'var(--paper-400)', color: 'var(--ink-700)' }}>
            💾 BACKUP & RESTORE
          </span>
          <h3 style={{ fontSize: '1.3rem', marginTop: '8px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>
            기기 간 동기화 — 백업 / 복원
          </h3>
          <p style={{ color: 'var(--ink-500)', fontSize: '0.86rem', marginTop: '4px' }}>
            모든 진행도는 평소 브라우저 안에만 저장됩니다. 다른 기기로 옮기거나 백업하려면 아래에서 파일/코드로 내보내세요.
          </p>
        </div>
      </div>

      <div className="backup-mode">
        <h4 className="backup-mode-title">📁 파일로 백업</h4>
        <p className="backup-mode-desc">
          모든 진행도(답변·발견 카드·선물 가방 등)를 JSON 파일 한 개로 다운로드합니다. 다른 기기에서 같은 파일을 업로드하면 그대로 복원됩니다.
        </p>
        <div className="backup-actions">
          <button type="button" className="btn-paper-primary" onClick={handleExport} disabled={busy}>
            <Download size={16} aria-hidden="true" /> 백업 파일 다운로드
          </button>
          <button type="button" className="btn-paper-outline" onClick={handleImportClick} disabled={busy}>
            <Upload size={16} aria-hidden="true" /> 백업 파일에서 복원
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      {cloudOn && (
        <div className="backup-mode">
          <h4 className="backup-mode-title">☁️ 코드로 클라우드 백업 (30일)</h4>
          <p className="backup-mode-desc">
            6자리 코드를 받아 다른 기기에서 입력하면 복원됩니다. 계정 가입 없이 동작하며, 30일 후 자동 삭제됩니다. 코드를 분실하면 복구 불가.
          </p>
          <div className="backup-actions">
            <button type="button" className="btn-paper-primary" onClick={handleCloudUpload} disabled={busy}>
              <Cloud size={16} aria-hidden="true" /> 클라우드 백업 받기
            </button>
            {code && (
              <span className="backup-code-display" aria-label={`백업 코드 ${code}`}>
                <span>코드</span>
                <strong>{code}</strong>
              </span>
            )}
          </div>
          <div className="backup-actions" style={{ marginTop: '10px' }}>
            <input
              type="text"
              value={restoreCode}
              onChange={(e) => setRestoreCode(e.target.value.toUpperCase())}
              placeholder="복원할 6자리 코드"
              className="backup-code-input"
              maxLength={6}
              aria-label="복원할 6자리 코드"
            />
            <button type="button" className="btn-paper-outline" onClick={handleCloudRestore} disabled={busy || restoreCode.length !== 6}>
              <CloudDownload size={16} aria-hidden="true" /> 코드로 복원
            </button>
          </div>
        </div>
      )}

      {status && (
        <p className={`backup-status tone-${status.tone}`} role="status" aria-live="polite">
          {status.message}
        </p>
      )}
    </article>
  );
}
