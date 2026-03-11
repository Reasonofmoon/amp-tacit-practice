const STEPS = [
  {
    title: '암묵지를 플레이처럼 수집합니다',
    desc: '9개의 활동을 돌며 원장님만의 직관을 말로 꺼내고, XP와 뱃지로 진행도를 추적합니다.',
  },
  {
    title: '경험이 바로 프롬프트 자산이 됩니다',
    desc: '답변은 모두 브라우저에 저장되고, 마지막에는 AI 프롬프트 팩과 SECI 리포트로 정리됩니다.',
  },
  {
    title: '프로필을 넣으면 결과 리포트가 더 선명해집니다',
    desc: '이름과 경력을 입력하면 리더보드와 최종 카드에 반영됩니다.',
  },
];

export default function OnboardingOverlay({ open, profile, onChangeProfile, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="overlay-backdrop" role="dialog" aria-modal="true" aria-label="첫 진입 안내">
      <div className="overlay-card glass-panel">
        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '1px', marginBottom: '8px' }}>ONBOARDING</p>
        <h2>암묵지 발굴 워크숍에 오신 것을 환영합니다</h2>
        <div className="overlay-steps">
          {STEPS.map((step, index) => (
            <article key={step.title} className="overlay-step">
              <strong>0{index + 1}</strong>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="overlay-form">
          <label>
            이름
            <input
              value={profile.name}
              onChange={(event) => onChangeProfile({ name: event.target.value })}
              placeholder="예: 김원장"
              aria-label="이름 입력"
            />
          </label>
          <label>
            경력
            <input
              value={profile.career}
              onChange={(event) => onChangeProfile({ career: event.target.value })}
              placeholder="예: 12년차 영어학원 원장"
              aria-label="경력 입력"
            />
          </label>
          <label>
            기관명
            <input
              value={profile.academy}
              onChange={(event) => onChangeProfile({ academy: event.target.value })}
              placeholder="예: 더라이트영어학원"
              aria-label="기관명 입력"
            />
          </label>
        </div>
        <button type="button" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.125rem' }} onClick={onClose} aria-label="온보딩 시작하기">
          시작하기
        </button>
      </div>
    </div>
  );
}
