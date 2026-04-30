import { useEffect, useMemo, useState } from 'react';
import { BENCHMARK_SAMPLE, COMPLETION_BENCHMARK, KEYWORD_BENCHMARK } from '../data/benchmarks';
import {
  compareAnswerLength,
  compareCrisisCompletion,
  compareKeywordDensity,
  compareQuizAccuracy,
  compareQuizTime,
} from '../utils/benchmark';
import { QUIZZES } from '../data/quizzes';
import { fetchLiveBenchmark, isBenchmarkServerEnabled } from '../utils/benchmarkClient';

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

function buildComparisons(state, live) {
  const allStrings = [];
  collectStrings(state.activityData ?? {}, allStrings);
  const totalChars = allStrings.reduce((sum, s) => sum + s.length, 0);
  const avgLength = allStrings.length > 0 ? Math.round(totalChars / allStrings.length) : 0;

  // 실측이 있으면 평균값을 live로 swap.
  // (아직 단순 1차 적용 — percentile/tier 계산은 정적 헬퍼 그대로 사용)
  const liveLengthMean = live?.metrics?.answerLength?.mean ?? null;
  const liveQuizTimeMean = live?.metrics?.quizTime?.mean ?? null;
  const liveQuizAccMean = live?.metrics?.quizAccuracy?.mean ?? null;

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
    liveLengthMean,
    quizTimeSec,
    quizTimeCmp,
    liveQuizTimeMean,
    accuracy,
    accuracyCmp,
    liveQuizAccMean,
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

export default function BenchmarkSection({ state, consent, onUpdateConsent }) {
  const [live, setLive] = useState(null);
  const [pending, setPending] = useState(null); // { totalSubmissions } 일 때 transition viz
  const benchmarkServerOn = isBenchmarkServerEnabled();
  const optedIn = !!consent?.benchmarkOptIn;

  // 처음 렌더 시 + opt-in 변경 시 실측 fetch 시도. 24h 캐시 적용.
  useEffect(() => {
    if (!benchmarkServerOn) return;
    let cancelled = false;
    fetch(import.meta.env.VITE_BENCHMARK_ENDPOINT || '/api/benchmark', { method: 'GET' })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (cancelled || !data) return;
        if (data.ready) {
          setLive(data);
          setPending(null);
        } else {
          setLive(null);
          setPending({ totalSubmissions: data.totalSubmissions ?? 0 });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [benchmarkServerOn, optedIn]);

  const cmp = useMemo(() => buildComparisons(state, live), [state, live]);

  const cohortLabel = live?.ready
    ? `실측 코호트 N=${live.totalSubmissions}`
    : `${BENCHMARK_SAMPLE.cohortLabel} N=${BENCHMARK_SAMPLE.totalRespondents}`;
  const cohortBadge = live?.ready ? '🟢 LIVE BENCHMARK' : '📊 ANONYMOUS BENCHMARK';
  const cohortNote = live?.ready
    ? '실측 익명 응답이 누적되면 자동으로 갱신됩니다 (24시간 캐시).'
    : `표본은 ${BENCHMARK_SAMPLE.collectedAt} 가상 코호트. 옵트인 사용자 5명 이상 누적되면 실측으로 자동 전환됩니다.`;

  return (
    <article className="report-paper-card benchmark-section">
      <div className="section-heading">
        <div>
          <span className="flow-eyebrow-tag" style={{ background: 'var(--green-wash)', borderColor: 'var(--sage)', color: '#3F6620' }}>
            {cohortBadge}
          </span>
          <h3 style={{ fontSize: '1.3rem', marginTop: '8px', fontFamily: 'var(--font-display)', color: 'var(--ink-900)' }}>
            익명 비교 — {cohortLabel}
          </h3>
          <p style={{ color: 'var(--ink-500)', fontSize: '0.86rem', marginTop: '4px' }}>
            남과 비교하라는 게 아니라, 당신이 어디에 서 있는지를 익명 표본으로 보여줍니다. {cohortNote}
          </p>
        </div>
      </div>

      <div className="benchmark-grid">
        <BenchmarkTile
          label="답변 평균 길이"
          userValue={cmp.avgLength > 0 ? `${cmp.avgLength} 자` : '—'}
          cohortValue={cmp.lengthCmp ? `${cmp.liveLengthMean ?? cmp.lengthCmp.cohortMean} 자${cmp.liveLengthMean != null ? ' (실측)' : ''}` : '— 자'}
          tier={cmp.lengthCmp?.label}
          delta={cmp.lengthCmp ? cmp.avgLength - (cmp.liveLengthMean ?? cmp.lengthCmp.cohortMean) : null}
          unit="자"
        />

        <BenchmarkTile
          label="퀴즈 풀이 시간"
          userValue={fmtMinSec(cmp.quizTimeSec)}
          cohortValue={cmp.quizTimeCmp ? `${fmtMinSec(cmp.liveQuizTimeMean ?? cmp.quizTimeCmp.cohortMean)}${cmp.liveQuizTimeMean != null ? ' (실측)' : ''}` : '—'}
          tier={cmp.quizTimeCmp?.label}
          tone={cmp.quizTimeCmp && cmp.quizTimeCmp.percentile >= 50 ? 'positive' : 'neutral'}
          smaller
        />

        <BenchmarkTile
          label="퀴즈 정답률"
          userValue={cmp.accuracy !== null ? `${Math.round(cmp.accuracy * 100)}%` : '—'}
          cohortValue={cmp.accuracyCmp ? `${Math.round((cmp.liveQuizAccMean ?? cmp.accuracyCmp.cohortMean) * 100)}%${cmp.liveQuizAccMean != null ? ' (실측)' : ''}` : '— %'}
          tier={cmp.accuracyCmp?.label}
          delta={
            cmp.accuracyCmp
              ? Math.round((cmp.accuracy - (cmp.liveQuizAccMean ?? cmp.accuracyCmp.cohortMean)) * 100)
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

      {/* 실측 전환 프로그레스 (N<5 일 때만, 사용자가 켜져 있으면 본인 1명을 마중하기 위해 노출) */}
      {benchmarkServerOn && pending && pending.totalSubmissions < 5 && (
        <div className="benchmark-transition" role="status" aria-live="polite">
          <div className="benchmark-transition-text">
            <strong>가상 → 실측 전환까지 {Math.max(0, 5 - pending.totalSubmissions)}명 남음</strong>
            <p>옵트인 사용자 5명 이상 누적되면 위 카드들이 자동으로 실측 평균으로 전환됩니다.</p>
          </div>
          <div className="benchmark-transition-bar" aria-hidden="true">
            <div
              className="benchmark-transition-fill"
              style={{ width: `${Math.min(100, (pending.totalSubmissions / 5) * 100)}%` }}
            />
            <span className="benchmark-transition-marker" style={{ left: '0%' }}>
              <span>가상 N=84</span>
            </span>
            <span className="benchmark-transition-marker right" style={{ left: '100%' }}>
              <span>실측 N=5+</span>
            </span>
          </div>
          <div className="benchmark-transition-counter">
            현재 누적 <strong>{pending.totalSubmissions}</strong>명
          </div>
        </div>
      )}

      {/* 옵트인 토글 — 실측 데이터에 익명 기여 */}
      {benchmarkServerOn && onUpdateConsent && (
        <div className="benchmark-consent" role="region" aria-label="익명 통계 기여 동의">
          <div className="benchmark-consent-text">
            <strong>익명 통계에 기여하기</strong>
            <p>
              켜면 활동 완료 시 <strong>이름·답변 원문 없이</strong> 답변 길이, 퀴즈 정확도/시간, 역할극 스타일 라벨만 익명으로 누적됩니다.
              실측 N이 5명 이상 누적되면 위 카드들이 자동으로 실측 평균으로 갱신됩니다. 언제든 끌 수 있습니다.
            </p>
          </div>
          <label className="benchmark-consent-toggle">
            <input
              type="checkbox"
              checked={optedIn}
              onChange={(e) => onUpdateConsent({ benchmarkOptIn: e.target.checked })}
            />
            <span className="benchmark-consent-toggle-track" aria-hidden="true">
              <span className="benchmark-consent-toggle-thumb" />
            </span>
            <span className="benchmark-consent-toggle-label">{optedIn ? '기여 중' : '기여 안 함'}</span>
          </label>
        </div>
      )}

      <p className="benchmark-footer">
        ※ 개인 식별 정보(이름·학원명·답변 원문)는 절대 비교/송신되지 않습니다. 본인 데이터는 항상 브라우저 안에만 저장됩니다.
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
