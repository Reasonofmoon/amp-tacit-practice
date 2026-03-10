export default function XPBar({ xp, levelInfo, nextLevel, xpGain }) {
  const currentFloor = levelInfo.minXP;
  const currentCeiling = nextLevel.minXP === levelInfo.minXP ? currentFloor + 200 : nextLevel.minXP;
  const progress = currentCeiling === currentFloor ? 1 : (xp - currentFloor) / (currentCeiling - currentFloor);

  return (
    <section className="xp-shell glass-panel">
      <div className="xp-header">
        <div>
          <p className="eyebrow">LEVEL</p>
          <h3>
            <span aria-hidden="true">{levelInfo.icon}</span> {levelInfo.title}
          </h3>
        </div>
        <div className="xp-total">{xp} XP</div>
      </div>
      <div className="xp-track" aria-label="경험치 진행도">
        <span className="xp-fill" style={{ width: `${Math.max(6, progress * 100)}%` }} />
        {xpGain ? (
          <span key={xpGain.at} className="xp-float" aria-hidden="true">
            +{xpGain.amount} XP
          </span>
        ) : null}
      </div>
      <div className="xp-footer">
        <span>현재 레벨 {levelInfo.level}</span>
        <span>
          다음 레벨 {nextLevel.level} · {Math.max(nextLevel.minXP - xp, 0)} XP 남음
        </span>
      </div>
    </section>
  );
}
