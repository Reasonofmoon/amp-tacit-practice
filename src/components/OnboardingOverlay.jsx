import ModalOverlay from './ModalOverlay';

// One screen, one primary action. Profile collection is deferred to the
// report stage where the name actually shows up — no friction at start.
export default function OnboardingOverlay({ open, onClose, onQuickStart, appRootRef }) {
  if (!open) {
    return null;
  }

  return (
    <ModalOverlay
      open={open}
      onClose={onClose}
      appRootRef={appRootRef}
      ariaLabel="첫 진입 안내"
      closeOnBackdrop={false}
      panelClassName="overlay-card onboarding-card"
      panelStyle={{ maxWidth: '520px' }}
    >
      <p className="onboarding-eyebrow">현장 노하우 → 앱 워크숍</p>
      <h2 className="onboarding-title">
        1분이면 첫 결과를 보여드려요
      </h2>
      <p className="onboarding-lead">
        ReadMaster 진단을 한 번 체험해보면, 곧바로 ChatGPT/Claude에 붙여 쓸 수 있는
        <strong> 실무용 프롬프트가 선물</strong>로 도착합니다.
      </p>

      <ol className="onboarding-steps-mini">
        <li><strong>STEP 1.</strong> ReadMaster 1분 체험</li>
        <li><strong>STEP 2.</strong> 프롬프트 선물 받기</li>
        <li><strong>STEP 3.</strong> 결과 리포트 보기</li>
      </ol>

      <button
        type="button"
        className="btn btn-primary onboarding-cta"
        onClick={() => onQuickStart?.('showcase')}
        aria-label="1분 데모 시작 — ReadMaster 열기"
        autoFocus
      >
        🎯 1분 데모 시작 — ReadMaster 열기 →
      </button>

      <button
        type="button"
        className="btn btn-ghost onboarding-skip"
        onClick={onClose}
      >
        먼저 둘러볼게요
      </button>
    </ModalOverlay>
  );
}
