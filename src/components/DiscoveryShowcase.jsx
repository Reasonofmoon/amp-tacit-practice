import { buildDiscoveryView } from '../data/discoveryCards';

// 리포트에 한 줄로 모이는 "발견 카드 거울". 잠금/해제 모두 보여주되
// 잠긴 카드는 흐리게 표시하고 해제 조건만 살짝 흘려준다.
export default function DiscoveryShowcase({ state }) {
  const cards = buildDiscoveryView(state, state.badges ?? []);
  const unlockedCount = cards.filter((card) => card.unlocked).length;

  return (
    <article className="report-paper-card discovery-showcase-card">
      <div className="section-heading">
        <div>
          <span className="flow-eyebrow-tag" style={{ background: 'var(--lavender-wash)', borderColor: 'var(--lavender)', color: '#5B3EA6' }}>
            🪞 DISCOVERY CARDS
          </span>
          <h3 style={{ fontSize: '1.3rem', marginTop: '8px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>
            나에 대한 발견 — {unlockedCount} / {cards.length} 장
          </h3>
          <p style={{ color: 'var(--ink-500)', fontSize: '0.88rem', marginTop: '4px' }}>
            메달이 아닌 거울입니다. 당신의 답변에서 자동으로 추출된, 당신을 설명하는 데이터 한 줄.
          </p>
        </div>
      </div>

      <div className="discovery-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`discovery-card ${card.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="discovery-card-head">
              <span className="discovery-card-icon" aria-hidden="true">{card.icon}</span>
              <span className="discovery-card-name">{card.name}</span>
            </div>
            <p className="discovery-card-desc">{card.desc}</p>
            {card.unlocked ? (
              <p className="discovery-card-evidence">{card.evidenceText}</p>
            ) : (
              <p className="discovery-card-locked-hint">🔒 활동을 더 채우면 잠금 해제됩니다.</p>
            )}
            {card.benchmark && card.unlocked && (
              <p className="discovery-card-benchmark">{card.benchmark}</p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
