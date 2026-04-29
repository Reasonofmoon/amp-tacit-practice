import {
  ANSWER_LENGTH_BENCHMARK,
  CRISIS_BENCHMARK,
  KEYWORD_BENCHMARK,
  QUIZ_BENCHMARK,
  ROLEPLAY_STYLE_BENCHMARK,
} from '../data/benchmarks';

// p10 / p50(=mean으로 근사) / p90 세 점만 알 때 사용자 위치를 단순 보간으로 추정.
// "더 큰 게 좋은 지표(longer answer / accuracy)" 일 때.
function percentileForBigger(value, dist) {
  const { mean, p10, p90 } = dist;
  if (value <= p10) return Math.max(1, Math.round((value / p10) * 10));
  if (value <= mean) {
    const ratio = (value - p10) / (mean - p10);
    return Math.round(10 + ratio * 40);
  }
  if (value <= p90) {
    const ratio = (value - mean) / (p90 - mean);
    return Math.round(50 + ratio * 40);
  }
  return Math.min(99, Math.round(90 + ((value - p90) / p90) * 9));
}

// "작은 게 좋은 지표 (시간 짧을수록 좋음)" 변종.
function percentileForSmaller(value, dist) {
  const { mean, p10, p90 } = dist;
  if (value <= p10) return Math.min(99, Math.round(95));
  if (value <= mean) {
    const ratio = (value - p10) / (mean - p10);
    return Math.round(95 - ratio * 45);
  }
  if (value <= p90) {
    const ratio = (value - mean) / (p90 - mean);
    return Math.round(50 - ratio * 40);
  }
  return Math.max(1, Math.round(10 - ((value - p90) / p90) * 9));
}

function tierLabel(percentile) {
  if (percentile >= 90) return '상위 10%';
  if (percentile >= 75) return '상위 25%';
  if (percentile >= 50) return '상위 50%';
  if (percentile >= 25) return '평균 근처';
  return '도입 단계';
}

export function compareAnswerLength(userMeanLength, tier = 'mid') {
  const benchmark = ANSWER_LENGTH_BENCHMARK[tier] ?? ANSWER_LENGTH_BENCHMARK.mid;
  const dist = { mean: benchmark.mean, p10: benchmark.p50 / 2, p90: benchmark.p90 };
  const percentile = percentileForBigger(userMeanLength, dist);
  return {
    percentile,
    label: tierLabel(percentile),
    cohortMean: benchmark.mean,
    cohortLabel: benchmark.tier,
  };
}

export function compareQuizTime(userSeconds) {
  if (typeof userSeconds !== 'number' || userSeconds <= 0) return null;
  const percentile = percentileForSmaller(userSeconds, QUIZ_BENCHMARK.timeSeconds);
  return {
    percentile,
    label: tierLabel(percentile),
    cohortMean: QUIZ_BENCHMARK.timeSeconds.mean,
  };
}

export function compareQuizAccuracy(userRatio) {
  if (typeof userRatio !== 'number') return null;
  const percentile = percentileForBigger(userRatio, QUIZ_BENCHMARK.accuracy);
  return {
    percentile,
    label: tierLabel(percentile),
    cohortMean: QUIZ_BENCHMARK.accuracy.mean,
  };
}

export function compareCrisisCompletion(userCompletedAll) {
  return {
    rare: userCompletedAll === true,
    cohortRate: CRISIS_BENCHMARK.completionRate,
    cohortRatePercent: Math.round(CRISIS_BENCHMARK.completionRate * 100),
  };
}

export function compareRoleplayStyle(styleTitle) {
  const pct = ROLEPLAY_STYLE_BENCHMARK[styleTitle];
  if (typeof pct !== 'number') return null;
  return { matchPercent: pct, cohortLabel: '12년차 원장' };
}

export function compareKeywordDensity(userTextChars, userKeywordCount, key) {
  const benchmark = KEYWORD_BENCHMARK[key];
  if (!benchmark || userTextChars === 0) return null;
  const userPer1k = (userKeywordCount / userTextChars) * 1000;
  const ratioVsMean = userPer1k / benchmark.mean;
  return {
    userPer1k: Number(userPer1k.toFixed(1)),
    cohortMean: benchmark.mean,
    cohortP90: benchmark.p90,
    ratioVsMean: Number(ratioVsMean.toFixed(1)),
    aboveAverage: userPer1k > benchmark.mean,
    aboveTopDecile: userPer1k > benchmark.p90,
  };
}
