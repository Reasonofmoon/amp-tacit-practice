import { AXIS_BENCHMARK, BENCHMARK_SAMPLE } from '../data/benchmarks';

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
  // Veteran-average overlay (only meaningful for the director profile axes)
  const showBenchmark = !isDev && axisScores.every((axis) => typeof AXIS_BENCHMARK[axis.key] === 'number');
  const benchmarkPolygon = showBenchmark
    ? buildPolygonPoints(axisScores, (axis) => ((AXIS_BENCHMARK[axis.key] ?? 0) / 100) * gridRadius)
    : null;

  return (
    <article className="report-paper-card">
      <div style={{ marginBottom: '20px' }}>
        <p className="eyebrow">RADAR MAP</p>
        <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--ink-900)', marginTop: '4px' }}>발견된 암묵지 영역</h3>
        {showBenchmark && (
          <div className="radar-legend">
            <span className="radar-legend-dot user" /> 당신
            <span className="radar-legend-dot vet" /> {BENCHMARK_SAMPLE.cohortLabel} 평균 (N={BENCHMARK_SAMPLE.totalRespondents})
          </div>
        )}
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

          {benchmarkPolygon && (
            <polygon
              points={benchmarkPolygon}
              fill="none"
              stroke="var(--ink-500)"
              strokeWidth="1.5"
              strokeDasharray="5 4"
              opacity="0.7"
            />
          )}

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '18px' }}>
        {axisScores.map((axis) => {
          const benchmark = AXIS_BENCHMARK[axis.key];
          const diff = typeof benchmark === 'number' ? axis.score - benchmark : null;
          return (
            <div
              key={axis.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'var(--paper-100)',
                border: '1px solid var(--paper-300)',
                borderRadius: '10px',
                fontSize: '0.88rem',
              }}
            >
              <span style={{ color: 'var(--ink-700)', fontWeight: 500 }}>{axis.label}</span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <strong style={{ color: 'var(--ink-blue-deep)', fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{axis.score}</strong>
                {showBenchmark && typeof benchmark === 'number' && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: diff > 0 ? 'var(--sage)' : diff < 0 ? 'var(--coral)' : 'var(--ink-500)',
                      fontWeight: 700,
                    }}
                  >
                    {diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '±0'} vs 평균
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
