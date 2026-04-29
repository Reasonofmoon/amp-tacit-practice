import { useMemo, useState } from 'react';
import { Copy, Check, ExternalLink, Gift, Sparkles } from 'lucide-react';
import ModalOverlay from './ModalOverlay';

// Practical safe budget for URL query params across browsers/services.
// ChatGPT silently truncates beyond ~6KB; Chrome itself accepts ~32KB but
// many gateways/CDNs cap at 8KB. We treat 6000 chars (encoded) as the line.
const SAFE_URL_BUDGET = 6000;

const TARGETS = {
  chatgpt: {
    label: 'ChatGPT',
    deepLink: (prompt) => `https://chatgpt.com/?prompt=${encodeURIComponent(prompt)}`,
    homeLink: 'https://chatgpt.com/',
  },
  claude: {
    label: 'Claude',
    deepLink: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
    homeLink: 'https://claude.ai/new',
  },
  // Gemini는 안정적인 prompt query 파라미터를 공개하지 않아, 항상 자동 복사 + 홈 열기 흐름.
  gemini: {
    label: 'Gemini',
    deepLink: null,
    homeLink: 'https://gemini.google.com/app',
  },
};

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch { /* noop */ }
    document.body.removeChild(textarea);
    return true;
  }
}

function isPromptUrlSafe(prompt, target) {
  if (!target?.deepLink) return false; // 딥링크 미지원 타겟 — 항상 복사+홈 흐름
  return target.deepLink(prompt).length <= SAFE_URL_BUDGET;
}

async function openExternalAI(prompt, targetKey, onCopiedHint) {
  const target = TARGETS[targetKey];
  if (!target) return;
  if (target.deepLink && isPromptUrlSafe(prompt, target)) {
    window.open(target.deepLink(prompt), '_blank', 'noopener,noreferrer');
    return;
  }
  // 딥링크 미지원이거나 프롬프트가 너무 길 때 — 자동 복사 + 홈 열기
  await copyToClipboard(prompt);
  const reason = !target.deepLink ? 'unsupported' : 'too-long';
  onCopiedHint?.({ label: target.label, reason });
  window.open(target.homeLink, '_blank', 'noopener,noreferrer');
}

export default function PromptGiftModal({ open, onClose, gift, activityTitle, appRootRef }) {
  const [copied, setCopied] = useState(false);
  const [hint, setHint] = useState(null);

  const tooLong = useMemo(
    () => (gift ? !isPromptUrlSafe(gift.prompt, TARGETS.chatgpt) : false),
    [gift],
  );

  if (!gift) return null;

  const showHint = ({ label, reason } = {}) => {
    const message = reason === 'unsupported'
      ? `${label}는 URL로 직접 입력하지 않습니다. 자동으로 복사했으니, 열린 창의 입력창에 붙여넣기(Ctrl+V) 해주세요.`
      : `${label}는 직접 열리지 않을 만큼 프롬프트가 깁니다. 자동으로 복사했으니, 열린 창의 입력창에 붙여넣기(Ctrl+V) 해주세요.`;
    setHint(message);
    window.setTimeout(() => setHint(null), 5200);
  };

  const handleCopy = async () => {
    await copyToClipboard(gift.prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleOpenChatGPT = () => openExternalAI(gift.prompt, 'chatgpt', showHint);
  const handleOpenClaude = () => openExternalAI(gift.prompt, 'claude', showHint);
  const handleOpenGemini = () => openExternalAI(gift.prompt, 'gemini', showHint);

  return (
    <ModalOverlay
      open={open}
      onClose={onClose}
      appRootRef={appRootRef}
      ariaLabel="프롬프트 선물 도착"
      closeOnBackdrop={true}
      panelClassName="prompt-gift-panel"
    >
      <div className="prompt-gift-ribbon" aria-hidden="true">
        <Gift size={16} />
        <span>프롬프트 선물 도착</span>
        <Sparkles size={14} />
      </div>

      <div className="prompt-gift-header">
        <span className="prompt-gift-emoji" aria-hidden="true">{gift.emoji}</span>
        <div className="prompt-gift-headings">
          <p className="prompt-gift-eyebrow">{activityTitle ? `${activityTitle} 완료 보상` : '완료 보상'}</p>
          <h2 className="prompt-gift-title">{gift.title}</h2>
          {gift.payoff && <p className="prompt-gift-payoff">“{gift.payoff}”</p>}
        </div>
      </div>

      <div className="prompt-gift-usecase">
        <span className="prompt-gift-usecase-label">📍 어디서 쓰나요</span>
        <p>{gift.useCase}</p>
      </div>

      <div className="prompt-gift-codebox" role="region" aria-label="프롬프트 본문">
        <pre>{gift.prompt}</pre>
      </div>

      <ol className="prompt-gift-steps" aria-label="3단계 가이드">
        <li><strong>STEP 1.</strong> 복사하기 →</li>
        <li><strong>STEP 2.</strong> ChatGPT/Claude 열기 →</li>
        <li><strong>STEP 3.</strong> 붙여넣고 결과 받기 ✨</li>
      </ol>

      <div className="prompt-gift-actions">
        <button
          type="button"
          className="btn-gift-primary"
          onClick={handleCopy}
          aria-label="프롬프트 복사"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? '복사됐어요 — 이제 STEP 2로!' : '① 복사하기 (한 번 클릭)'}
        </button>
        <button
          type="button"
          className="btn-gift-secondary"
          onClick={handleOpenChatGPT}
        >
          <ExternalLink size={16} /> ② ChatGPT에서 열기
        </button>
        <button
          type="button"
          className="btn-gift-secondary"
          onClick={handleOpenClaude}
        >
          <ExternalLink size={16} /> ② Claude에서 열기
        </button>
        <button
          type="button"
          className="btn-gift-secondary"
          onClick={handleOpenGemini}
        >
          <ExternalLink size={16} /> ② Gemini에서 열기
        </button>
      </div>

      {tooLong && (
        <p className="prompt-gift-warn" role="note">
          ⚠️ 이 프롬프트는 길어서 URL로 직접 전달되지 않습니다. 위 ① 복사 버튼을 먼저 누르고 → 새로 열린 창에 붙여넣어 주세요.
        </p>
      )}
      {hint && (
        <p className="prompt-gift-warn" role="status" aria-live="polite">{hint}</p>
      )}

      <div className="prompt-gift-footer">
        <span>🎒 이 프롬프트는 자동으로 <strong>리포트 가방</strong>에 저장됐습니다.</span>
        <button type="button" className="btn-gift-ghost" onClick={onClose}>
          홈으로 돌아가기 →
        </button>
      </div>
    </ModalOverlay>
  );
}
