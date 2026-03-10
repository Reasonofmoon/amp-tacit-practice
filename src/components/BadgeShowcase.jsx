import { BADGES } from '../data/badges';
import Badge from './Badge';

export default function BadgeShowcase({ unlockedBadges }) {
  const unlockedIds = new Set(unlockedBadges.map((badge) => badge.id));

  return (
    <section className="glass-panel sub-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">BADGES</p>
          <h3>획득한 뱃지</h3>
        </div>
        <strong>{unlockedBadges.length}/{BADGES.length}</strong>
      </div>
      <div className="badge-grid">
        {BADGES.map((badge) => (
          <Badge key={badge.id} badge={badge} unlocked={unlockedIds.has(badge.id)} />
        ))}
      </div>
    </section>
  );
}
