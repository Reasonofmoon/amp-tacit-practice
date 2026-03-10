import { useMemo, useState } from 'react';
import { ACTIVITIES, AXES } from '../data/activities';
import { buildPromptPack, buildSeciMap, buildTopInsights } from '../utils/promptGenerator';
import { getActivityProgress } from '../utils/scoring';

function toPoint(index, total, score, radius, center) {
  const angle = ((index / total) * Math.PI * 2) - Math.PI / 2;
  const distance = (score / 100) * radius;
  return [center + Math.cos(angle) * distance, center + Math.sin(angle) * distance];
}

function toPolygon(values, radius, center) {
  return values
    .map((value, index) => {
      const [x, y] = toPoint(index, values.length, value, radius, center);
      return `${x},${y}`;
    })
    .join(' ');
}

function buildAxisScores(state) {
  return AXES.map((axis) => {
    let weightedScore = 0;
    let maxScore = 0;

    ACTIVITIES.forEach((activity) => {
      const weight = activity.axis[axis.key] ?? 0;
      if (!weight) {
        return;
      }

      maxScore += weight;
      weightedScore += weight * getActivityProgress(activity.id, state.activityData[activity.id]);
    });

    return {
      ...axis,
      score: Math.round(maxScore === 0 ? 0 : (weightedScore / maxScore) * 100),
    };
  });
}

export default function ResultReport({ state, levelInfo }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const axisScores = useMemo(() => buildAxisScores(state), [state]);
  const promptPack = useMemo(() => buildPromptPack(state.activityData, state.profile), [state.activityData, state.profile]);
  const topInsights = useMemo(() => buildTopInsights(state.activityData), [state.activityData]);
  const seciMap = useMemo(() => buildSeciMap(state.activityData), [state.activityData]);

  const polygon = toPolygon(axisScores.map((axis) => axis.score), 92, 120);
  const profileName = state.profile.name?.trim() || '익명 원장';
  const career = state.profile.career?.trim() || '경력 미입력';
  const academy = state.profile.academy?.trim() || '우리 학원';

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1400);
    } catch {
      setCopiedIndex(index);
    }
  };

  return (
    <section className="report-shell">
      <div className="section-heading report-heading">
        <div>
          <p className="eyebrow">FINAL REPORT</p>
          <h2>암묵지 프로필 리포트</h2>
        </div>
        <strong>{state.xp} XP</strong>
      </div>

      <div className="report-grid">
        <article className="glass-panel report-card">
          <div className="profile-card-header">
            <div>
              <p className="eyebrow">PROFILE CARD</p>
              <h3>{profileName}</h3>
              <p>{career} · {academy}</p>
            </div>
            <div className="profile-level-pill">
              <span>{levelInfo.icon}</span>
              <strong>{levelInfo.title}</strong>
            </div>
          </div>
          <div className="profile-metrics">
            <div>
              <strong>{state.completed.length}</strong>
              <span>완료 활동</span>
            </div>
            <div>
              <strong>{state.badges.length}</strong>
              <span>획득 뱃지</span>
            </div>
            <div>
              <strong>{state.maxCombo}</strong>
              <span>최대 콤보</span>
            </div>
          </div>
          <div className="profile-insights">
            <h4>핵심 암묵지 Top 3</h4>
            <ul>
              {topInsights.length === 0 ? <li>활동 답변이 쌓이면 여기에 당신만의 핵심 통찰이 요약됩니다.</li> : null}
              {topInsights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="glass-panel radar-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RADAR MAP</p>
              <h3>발견된 암묵지 영역</h3>
            </div>
          </div>
          <svg viewBox="0 0 240 240" className="radar-svg" aria-label="암묵지 영역 레이더 차트">
            {[25, 50, 75, 100].map((value) => (
              <polygon
                key={value}
                className="radar-grid"
                points={toPolygon(axisScores.map(() => value), 92, 120)}
              />
            ))}
            {axisScores.map((axis, index) => {
              const [x, y] = toPoint(index, axisScores.length, 100, 92, 120);
              return (
                <g key={axis.key}>
                  <line className="radar-axis" x1="120" y1="120" x2={x} y2={y} />
                  <text className="radar-label" x={x} y={y}>
                    {axis.label}
                  </text>
                </g>
              );
            })}
            <polygon className="radar-area" points={polygon} />
          </svg>
          <div className="radar-legend">
            {axisScores.map((axis) => (
              <div key={axis.key}>
                <span>{axis.label}</span>
                <strong>{axis.score}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="report-grid">
        <article className="glass-panel report-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PROMPT PACK</p>
              <h3>AI 프롬프트 팩</h3>
            </div>
          </div>
          <div className="prompt-list">
            {promptPack.map((prompt, index) => (
              <article key={prompt} className="prompt-card">
                <p>{prompt}</p>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => handleCopy(prompt, index)}
                  aria-label={`프롬프트 ${index + 1} 복사`}
                >
                  {copiedIndex === index ? '복사됨' : '복사'}
                </button>
              </article>
            ))}
          </div>
        </article>

        <article className="glass-panel report-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SECI MAP</p>
              <h3>지식 전환 흐름</h3>
            </div>
          </div>
          <div className="seci-grid">
            <div>
              <h4>S · 공유화</h4>
              <ul>{seciMap.socialization.length ? seciMap.socialization.map((item) => <li key={item}>{item}</li>) : <li>갤러리 공유가 여기에 모입니다.</li>}</ul>
            </div>
            <div>
              <h4>E · 표출화</h4>
              <ul>{seciMap.externalization.length ? seciMap.externalization.map((item) => <li key={item}>{item}</li>) : <li>위기/전수 답변이 여기에 모입니다.</li>}</ul>
            </div>
            <div>
              <h4>C · 연결화</h4>
              <ul>{seciMap.combination.length ? seciMap.combination.map((item) => <li key={item}>{item}</li>) : <li>SECI 활동의 프롬프트가 여기에 표시됩니다.</li>}</ul>
            </div>
            <div>
              <h4>I · 내면화</h4>
              <ul>{seciMap.internalization.length ? seciMap.internalization.map((item) => <li key={item}>{item}</li>) : <li>퀴즈와 역할극 인사이트가 여기에 축적됩니다.</li>}</ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
