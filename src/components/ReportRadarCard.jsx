function polarToCartesian(cx, cy, radius, angle) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function buildPolygonPoints(items, radiusAccessor) {
  const total = items.length;
  return items.map((item, index) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const point = polarToCartesian(160, 160, radiusAccessor(item), angle);
    return `${point.x},${point.y}`;
  }).join(' ');
}

export default function ReportRadarCard({ axisScores, isDev }) {
  const levels = [25, 50, 75, 100];
  const axisCount = axisScores.length || 1;
  const labelRadius = 126;
  const gridRadius = 96;
  const profilePolygon = buildPolygonPoints(axisScores, (axis) => (axis.score / 100) * gridRadius);
  const gridPolygons = levels.map((level) => buildPolygonPoints(axisScores, () => (level / 100) * gridRadius));

  return (
    <article className="card">
      <div style={{ marginBottom: '24px' }}>
        <p className="eyebrow" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>RADAR MAP</p>
        <h3 style={{ fontSize: '1.25rem' }}>발견된 암묵지 영역</h3>
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <svg viewBox="0 0 320 320" style={{ width: '100%', maxWidth: '320px', height: 'auto', overflow: 'visible' }} role="img" aria-label={`${isDev ? '개발자' : '원장'} 역량 레이더 차트`}>
          <defs>
            <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          {gridPolygons.map((points, index) => (
            <polygon key={levels[index]} points={points} fill="none" stroke="var(--border)" strokeWidth="1" />
          ))}

          {axisScores.map((axis, index) => {
            const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2;
            const axisPoint = polarToCartesian(160, 160, gridRadius, angle);
            const labelPoint = polarToCartesian(160, 160, labelRadius, angle);
            return (
              <g key={axis.key}>
                <line x1="160" y1="160" x2={axisPoint.x} y2={axisPoint.y} stroke="var(--border)" strokeWidth="1" />
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor={labelPoint.x < 145 ? 'end' : labelPoint.x > 175 ? 'start' : 'middle'}
                  dominantBaseline={labelPoint.y < 150 ? 'auto' : 'middle'}
                  fill="var(--text-muted)"
                  fontSize="12"
                  fontWeight="600"
                >
                  {axis.label}
                </text>
              </g>
            );
          })}

          <polygon points={profilePolygon} fill="url(#radarFill)" stroke="var(--primary)" strokeWidth="2.5" />

          {axisScores.map((axis, index) => {
            const angle = (Math.PI * 2 * index) / axisCount - Math.PI / 2;
            const point = polarToCartesian(160, 160, (axis.score / 100) * gridRadius, angle);
            return (
              <g key={`${axis.key}-point`}>
                <circle cx={point.x} cy={point.y} r="4.5" fill="var(--primary)" />
                <circle cx={point.x} cy={point.y} r="2" fill="white" />
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '16px' }}>
        {axisScores.map((axis) => (
          <div key={axis.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-app)', borderRadius: '6px', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{axis.label}</span>
            <strong style={{ color: 'var(--text-main)' }}>{axis.score}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}
