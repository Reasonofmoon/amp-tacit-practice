export default function Leaderboard({ entries }) {
  return (
    <section className="glass-panel sub-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LOCAL BOARD</p>
          <h3>로컬 리더보드</h3>
        </div>
        <strong>{entries.length}개 기록</strong>
      </div>
      {entries.length === 0 ? (
        <p className="muted-copy">활동을 완료하면 이 기기에서 누적 기록이 저장됩니다.</p>
      ) : (
        <div className="leaderboard-list">
          {entries.map((entry, index) => (
            <article key={entry.id} className="leaderboard-item">
              <div className="leaderboard-rank">{index + 1}</div>
              <div className="leaderboard-main">
                <div className="leaderboard-name">{entry.name}</div>
                <div className="leaderboard-meta">
                  {entry.academy} · {entry.level} · 활동 {entry.completedCount}개
                </div>
              </div>
              <div className="leaderboard-score">{entry.xp} 페이지</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
