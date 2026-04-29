import { useMemo } from 'react';
import { BENCHMARK_SAMPLE, COMPLETION_BENCHMARK, KEYWORD_BENCHMARK } from '../data/benchmarks';
import {
  compareAnswerLength,
  compareCrisisCompletion,
  compareKeywordDensity,
  compareQuizAccuracy,
  compareQuizTime,
} from '../utils/benchmark';
import { QUIZZES } from '../data/quizzes';

function collectStrings(value, bucket) {
  if (!value) return;
  if (typeof value === 'string') {
    const t = value.trim();
    if (t) bucket.push(t);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v) => collectStrings(v, bucket));
    return;
  }
  if (typeof value === 'object') {
    Object.values(value).forEach((v) => collectStrings(v, bucket));
  }
}

function buildComparisons(state) {
  const allStrings = [];
  collectStrings(state.activityData ?? {}, allStrings);
  const totalChars = allStrings.reduce((sum, s) => sum + s.length, 0);
  const avgLength = allStrings.length > 0 ? Math.round(totalChars / allStrings.length) : 0;

  const lengthCmp = avgLength > 0 ? compareAnswerLength(avgLength, 'mid') : null;

  const quizTimeSec = state.metrics?.quizTime ?? null;
  const quizTimeCmp = compareQuizTime(quizTimeSec);

  const correctCount = state.activityData?.quiz?.correctCount ?? 0;
  const quizFinished = state.activityData?.quiz?.finished;
  const accuracy = quizFinished && QUIZZES.length > 0 ? correctCount / QUIZZES.length : null;
  const accuracyCmp = accuracy !== null ? compareQuizAccuracy(accuracy) : null;

  const crisisCmp = compareCrisisCompletion(state.metrics?.crisisAll);

  const completedCount = state.completed?.length ?? 0;

  const fullText = allStrings.join(' ');
  const relCount = countMatches(fullText, KEYWORD_BENCHMARK.relationship.words);
  const dataCount = countMatches(fullText, KEYWORD_BENCHMARK.data.words);
  const relCmp = compareKeywordDensity(totalChars, relCount, 'relationship');
  const dataCmp = compareKeywordDensity(totalChars, dataCount, 'data');

  return {
    avgLength,
    lengthCmp,
    quizTimeSec,
    quizTimeCmp,
    accuracy,
    accuracyCmp,
    crisisCmp,
    completedCount,
    relCount,
    relCmp,
    dataCount,
    dataCmp,
  };
}

function countMatches(text, words) {
  if (!text) return 0;
  const lower = text.toLowerCase();
  return words.reduce((sum, word) => {
    const re = new RegExp(word.toLowerCase(), 'g');
    return sum + (lower.match(re)?.length ?? 0);
  }, 0);
}

function fmtMinSec(seconds) {
  if (typeof seconds !== 'number' || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}분 ${s}초`;
}

export default function BenchmarkSection({ state }) {
  const cmp = useMemo(() => buildComparisons(state), [state]);

  return (
    <article className="report-paper-card benchmark-section">
      <div className="section-heading">
        <div>
          <span className="flow-eyebrow-tag" style={{ background: 'var(--green-wash)', borderColor: 'var(--sage)', color: '#3F6620' }}>
            📊 ANONYMOUS BENCHMARK
          </span>
          <h3 style={{ fontSize: '1.3rem', marginTop: '8px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>
            익명 비교 — {BENCHMARK_SAMPLE.cohortLabel} N={BENCHMARK_SAMPLE.totalRespondents}
          </h3>
          <p style={{ color: 'var(--ink-500)', fontSize: '0.86rem', marginTop: '4px' }}>
            남과 비교하라는 게 아니라, 당신이 어디에 서 있는지를 익명 표본으로 보여줍니다. 표본은 {BENCHMARK_SAMPLE.collectedAt} 가상 코호트.
          </p>
        </div>
      </div>

      <div className="benchmark-grid">
        <BenchmarkTile
          label="답변 평균 길이"
          userValue={cmp.avgLength > 0 ? `${cmp.avgLength} 자` : '—'}
          cohortValue={cmp.lengthCmp ? `${cmp.lengthCmp.cohortMean} 자` : '— 자'}
          tier={cmp.lengthCmp?.label}
          delta={cmp.lengthCmp ? cmp.avgLength - cmp.lengthCmp.cohortMean : null}
          unit="자"
        />

        <BenchmarkTile
          label="퀴즈 풀이 시간"
          userValue={fmtMinSec(cmp.quizTimeSec)}
          cohortValue={cmp.quizTimeCmp ? fmtMinSec(cmp.quizTimeCmp.cohortMean) : '—'}
          tier={cmp.quizTimeCmp?.label}
          tone={cmp.quizTimeCmp && cmp.quizTimeCmp.percentile >= 50 ? 'positive' : 'neutral'}
          smaller
        />

        <BenchmarkTile
          label="퀴즈 정답률"
          userValue={cmp.accuracy !== null ? `${Math.round(cmp.accuracy * 100)}%` : '—'}
          cohortValue={cmp.accuracyCmp ? `${Math.round(cmp.accuracyCmp.cohortMean * 100)}%` : '— %'}
          tier={cmp.accuracyCmp?.label}
          delta={
            cmp.accuracyCmp
              ? Math.round((cmp.accuracy - cmp.accuracyCmp.cohortMean) * 100)
              : null
          }
          unit="%p"
        />

        <BenchmarkTile
          label="채운 챕터/활동 수"
          userValue={`${cmp.completedCount}개`}
          cohortValue={`${COMPLETION_BENCHMARK.median}개 (중앙값)`}
          tier={cmp.completedCount >= COMPLETION_BENCHMARK.p75 ? '상위 25%' : cmp.completedCount >= COMPLETION_BENCHMARK.median ? '중앙값 이상' : '도입 단계'}
          delta={cmp.completedCount - COMPLETION_BENCHMARK.median}
          unit="개"
        />

        <BenchmarkTile
          label="위기 시나리오 모두 작성"
          userValue={cmp.crisisCmp.rare ? '예' : '아직'}
          cohortValue={`베테랑 ${cmp.crisisCmp.cohortRatePercent}%만`}
          tier={cmp.crisisCmp.rare ? '드문 패턴' : null}
          tone={cmp.crisisCmp.rare ? 'positive' : 'neutral'}
        />

        <BenchmarkTile
          label="키워드 사용 — 관계 vs 데이터"
          userValue={`${cmp.relCount} : ${cmp.dataCount}`}
          cohortValue={`평균 ${KEYWORD_BENCHMARK.relationship.mean} : ${KEYWORD_BENCHMARK.data.mean}`}
          tier={
            cmp.relCmp && cmp.relCmp.aboveAverage ? '관계 우선' : cmp.dataCmp && cmp.dataCmp.aboveAverage ? '데이터 우선' : '균형'
          }
          tone="neutral"
        />
      </div>

      <p className="benchmark-footer">
        ※ 익명·평균 비교 채널입니다. 개인 식별 정보를 비교하지 않습니다. 표본은 익명 응답으로 구성된 가상 코호트로, 실측 데이터가 누적되면 자동 갱신됩니다.
      </p>
    </article>
  );
}

function BenchmarkTile({ label, userValue, cohortValue, tier, delta, unit, tone, smaller }) {
  let toneClass = tone ?? 'neutral';
  if (tone === undefined && typeof delta === 'number') {
    const meaningful = delta > 0;
    toneClass = smaller
      ? delta < 0
        ? 'positive'
        : 'neutral'
      : meaningful
      ? 'positive'
      : delta < 0
      ? 'caution'
      : 'neutral';
  }

  return (
    <div className={`benchmark-tile tone-${toneClass}`}>
      <p className="benchmark-tile-label">{label}</p>
      <div className="benchmark-tile-values">
        <strong className="benchmark-tile-user">{userValue}</strong>
        <span className="benchmark-tile-cohort">vs {cohortValue}</span>
      </div>
      {tier && <span className="benchmark-tile-tier">{tier}</span>}
      {typeof delta === 'number' && delta !== 0 && (
        <span className="benchmark-tile-delta">
          {delta > 0 ? `+${delta}` : delta}{unit ? ` ${unit}` : ''} vs 평균
        </span>
      )}
    </div>
  );
}
