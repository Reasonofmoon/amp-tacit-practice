import { useMemo, useState } from 'react';
import { Copy, Check, ExternalLink, Gift, Sparkles } from 'lucide-react';
import ModalOverlay from './ModalOverlay';

// Practical safe budget for URL query params across browsers/services.
// ChatGPT/Claude silently truncate beyond ~6KB; many gateways/CDNs cap at 8KB.
const SAFE_URL_BUDGET = 6000;

// Each "Open in X" click ALWAYS copies the prompt to clipboard first, then opens
// the service. Deep links are used opportunistically (some services auto-fill the
// composer when present), but we never rely on them — clipboard fallback is the
// guaranteed path. This avoids "I clicked but nothing was input" problems caused
// by auth redirects, parameter changes, or undocumented length limits.
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
  gemini: {
    label: 'Gemini',
    // Gemini는 안정적인 prompt query 파라미터를 공개하지 않음
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

function pickUrlForTarget(prompt, target) {
  if (!target) return null;
  if (target.deepLink) {
    const url = target.deepLink(prompt);
    if (url.length <= SAFE_URL_BUDGET) return url;
  }
  return target.homeLink;
}

// Always-copy + open. Single click is enough — even if the service drops the
// deep link, the prompt is already in clipboard ready to paste.
async function copyAndOpen(prompt, targetKey, onAfter) {
  const target = TARGETS[targetKey];
  if (!target) return;
  await copyToClipboard(prompt);
  const url = pickUrlForTarget(prompt, target);
  window.open(url, '_blank', 'noopener,noreferrer');
  onAfter?.(target.label);
}

export default function PromptGiftModal({ open, onClose, gift, activityTitle, microInsight, nextStep, appRootRef }) {
  const [copied, setCopied] = useState(false);
  const [openedLabel, setOpenedLabel] = useState(null);

  const tooLong = useMemo(() => {
    if (!gift) return false;
    return gift.prompt.length > SAFE_URL_BUDGET / 1.5; // 인코딩 후 6KB 넘을 가능성 있을 때
  }, [gift]);

  if (!gift) return null;

  const announce = (label) => {
    setOpenedLabel(label);
    window.setTimeout(() => setOpenedLabel(null), 5200);
  };

  const handleCopy = async () => {
    await copyToClipboard(gift.prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleOpenChatGPT = () => copyAndOpen(gift.prompt, 'chatgpt', announce);
  const handleOpenClaude = () => copyAndOpen(gift.prompt, 'claude', announce);
  const handleOpenGemini = () => copyAndOpen(gift.prompt, 'gemini', announce);

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

      {microInsight && (
        <div className={`prompt-gift-mirror tone-${microInsight.tone ?? 'neutral'}`}>
          <span className="prompt-gift-mirror-title">{microInsight.title}</span>
          <p>{microInsight.line}</p>
        </div>
      )}

      <div className="prompt-gift-usecase">
        <span className="prompt-gift-usecase-label">📍 어디서 쓰나요</span>
        <p>{gift.useCase}</p>
      </div>

      <div className="prompt-gift-codebox" role="region" aria-label="프롬프트 본문">
        <pre>{gift.prompt}</pre>
      </div>

      <ol className="prompt-gift-steps" aria-label="간단 가이드">
        <li><strong>한 번 클릭</strong> — 자동으로 복사되고 새 창이 열려요</li>
        <li><strong>입력창에서 Ctrl+V</strong> — 자동 입력이 안 되면 붙여넣기</li>
        <li><strong>실행</strong> — 결과를 받아 학원 자료로 사용 ✨</li>
      </ol>

      <div className="prompt-gift-actions">
        <button
          type="button"
          className="btn-gift-primary"
          onClick={handleCopy}
          aria-label="프롬프트 클립보드 복사"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {copied ? '복사 완료' : '클립보드에 복사만'}
        </button>
        <button
          type="button"
          className="btn-gift-secondary"
          onClick={handleOpenChatGPT}
          aria-label="복사 후 ChatGPT 새 창 열기"
        >
          <Copy size={14} aria-hidden="true" />
          <ExternalLink size={16} /> 복사 + ChatGPT 열기
        </button>
        <button
          type="button"
          className="btn-gift-secondary"
          onClick={handleOpenClaude}
          aria-label="복사 후 Claude 새 창 열기"
        >
          <Copy size={14} aria-hidden="true" />
          <ExternalLink size={16} /> 복사 + Claude 열기
        </button>
        <button
          type="button"
          className="btn-gift-secondary"
          onClick={handleOpenGemini}
          aria-label="복사 후 Gemini 새 창 열기"
        >
          <Copy size={14} aria-hidden="true" />
          <ExternalLink size={16} /> 복사 + Gemini 열기
        </button>
      </div>

      {openedLabel && (
        <p className="prompt-gift-warn" role="status" aria-live="polite">
          ✅ 프롬프트가 자동으로 클립보드에 복사됐고 {openedLabel} 창이 열렸습니다.
          입력창이 자동 채워지지 않으면 <strong>Ctrl+V</strong> (Mac은 <strong>⌘+V</strong>) 로 붙여넣어 주세요.
        </p>
      )}

      {tooLong && !openedLabel && (
        <p className="prompt-gift-warn" role="note">
          ℹ️ 긴 프롬프트라 URL 자동 입력이 안 될 수 있습니다. 클릭하면 자동으로 복사되니, 열린 창에서 Ctrl+V 로 붙여넣어 주세요.
        </p>
      )}

      {nextStep && (
        <div className="prompt-gift-nextstep" role="note">
          <span className="prompt-gift-nextstep-eyebrow">📄 다음 마일스톤</span>
          <p>{nextStep.line}</p>
          {nextStep.cta && (
            <button type="button" className="btn-gift-secondary prompt-gift-nextstep-cta" onClick={nextStep.onClick}>
              {nextStep.cta} →
            </button>
          )}
        </div>
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
