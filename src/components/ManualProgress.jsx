import { motion } from 'framer-motion';
import { LEVELS } from '../utils/scoring';
import { buildChapterProgress, getTotalManualPages } from '../utils/chapterProgress';

// "내가 만들고 있는 학원 운영 매뉴얼" 8 챕터 시각화.
// XPBar(점수 막대)를 대체. 점수가 아니라 자산이 쌓이고 있다는 감각.
export default function ManualProgress({ state, levelInfo, nextLevel, xpGain, onPrintChapter }) {
  const chapters = buildChapterProgress(state);
  const totalManualPages = getTotalManualPages();
  const completedChapters = chapters.filter((chapter) => chapter.isComplete).length;
  const remaining = Math.max(nextLevel.minXP - state.xp, 0);
  const isLastTier = nextLevel.minXP === levelInfo.minXP || levelInfo.level === LEVELS.length;

  return (
    <div className="manual-progress">
      <header className="manual-progress-header">
        <div className="manual-progress-headings">
          <p className="eyebrow">학원 운영 매뉴얼</p>
          <h3 className="manual-progress-title">
            <span aria-hidden="true">{levelInfo.icon}</span>
            {levelInfo.title}
          </h3>
          <p className="manual-progress-subtitle">
            {completedChapters > 0
              ? `${completedChapters} / ${chapters.length} 챕터 발급 가능 상태`
              : '아직 발급 가능한 챕터는 없습니다 — 첫 챕터를 채워보세요.'}
          </p>
        </div>
        <div className="manual-progress-count" aria-live="polite">
          <span className="manual-progress-count-num">{state.xp}</span>
          <span className="manual-progress-count-of">/ {totalManualPages}</span>
          <span className="manual-progress-count-label">페이지</span>
          {xpGain && (
            <motion.span
              key={xpGain.at}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: -32 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="manual-progress-gain"
              aria-hidden="true"
            >
              +{xpGain.amount}
            </motion.span>
          )}
        </div>
      </header>

      <ol className="manual-chapters" aria-label="매뉴얼 챕터 진행도">
        {chapters.map((chapter) => {
          const ratioPercent = Math.round(chapter.ratio * 100);
          return (
            <li
              key={chapter.id}
              className={`manual-chapter ${chapter.isComplete ? 'complete' : chapter.completedCount > 0 ? 'in-progress' : 'empty'}`}
            >
              <span className="manual-chapter-num" aria-hidden="true">{chapter.n}</span>
              <span className="manual-chapter-icon" aria-hidden="true">{chapter.icon}</span>
              <div className="manual-chapter-main">
                <strong className="manual-chapter-title">{chapter.title}</strong>
                <span className="manual-chapter-summary">{chapter.summary}</span>
                <div
                  className="manual-chapter-bar"
                  role="progressbar"
                  aria-valuenow={ratioPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${chapter.title} 진행률 ${ratioPercent}%`}
                >
                  <motion.div
                    className="manual-chapter-fill"
                    initial={false}
                    animate={{ width: `${ratioPercent}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
              <span className="manual-chapter-meta">
                {chapter.isComplete ? (
                  onPrintChapter ? (
                    <button
                      type="button"
                      className="manual-chapter-badge complete is-button print-hide"
                      onClick={() => onPrintChapter(chapter.id)}
                      aria-label={`${chapter.title} 챕터 PDF 발급`}
                    >
                      📄 PDF 받기 →
                    </button>
                  ) : (
                    <span className="manual-chapter-badge complete">📄 발급 가능</span>
                  )
                ) : (
                  <span className="manual-chapter-counter">
                    <strong>{chapter.completedCount}</strong>
                    <span> / {chapter.totalCount}</span>
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>

      <footer className="manual-progress-footer">
        <span aria-hidden="true">📓</span>
        {isLastTier && state.xp >= nextLevel.minXP
          ? <span><strong>마지막 단계</strong> — 운영 백서를 쓰는 단계입니다. 챕터를 하나씩 강사들과 나눌 차례입니다.</span>
          : <span>다음 직책 카드까지 <strong>{remaining} 페이지</strong> · {levelInfo.level} / {LEVELS.length} 단계</span>}
      </footer>
    </div>
  );
}
