import { buildChapterPrintData } from '../utils/chapterContent';

// 인쇄 전용 챕터 레이아웃. 평소엔 display:none, body.print-mode-chapter 일 때만 표시.
// PDF 한 부의 구조: 표지 → 발견 카드 → 활동 답변 → 프롬프트 선물 → 푸터
export default function ChapterPrintLayout({ chapterId, state, levelInfo }) {
  if (!chapterId) return null;
  const data = buildChapterPrintData(state, chapterId);
  if (!data) return null;

  const profileName = data.profile.name?.trim() || '익명 원장';
  const academy = data.profile.academy?.trim() || '우리 학원';
  const career = data.profile.career?.trim();

  return (
    <div className="chapter-print" aria-hidden="true">
      <header className="chapter-print-cover">
        <p className="chapter-print-eyebrow">학원 운영 매뉴얼 · 챕터 {data.chapter.n}</p>
        <h1 className="chapter-print-title">
          <span aria-hidden="true">{data.chapter.icon}</span> {data.chapter.title}
        </h1>
        <p className="chapter-print-summary">{data.chapter.summary}</p>
        <dl className="chapter-print-meta">
          <div><dt>발행</dt><dd>{profileName} · {academy}{career ? ` · ${career}` : ''}</dd></div>
          {levelInfo && (
            <div><dt>현재 직책</dt><dd>{levelInfo.icon} {levelInfo.title}</dd></div>
          )}
          <div><dt>발행일</dt><dd>{data.issuedAt}</dd></div>
        </dl>
      </header>

      {data.discoveries.length > 0 && (
        <section className="chapter-print-section chapter-print-discoveries">
          <h2>🪞 이 챕터에서 잠금 해제된 발견 카드</h2>
          {data.discoveries.map((card) => (
            <article key={card.id} className="chapter-print-discovery">
              <h3>{card.icon} {card.name}</h3>
              <p>{card.desc}</p>
              {card.evidenceText && (
                <p className="chapter-print-discovery-evidence">{card.evidenceText}</p>
              )}
              {card.benchmark && (
                <p className="chapter-print-discovery-benchmark">{card.benchmark}</p>
              )}
            </article>
          ))}
        </section>
      )}

      {data.activities.length > 0 && (
        <section className="chapter-print-section chapter-print-activities">
          <h2>📝 활동 답변 ({data.activities.length}개)</h2>
          {data.activities.map((activity) => (
            <article key={activity.id} className="chapter-print-activity">
              <h3>{activity.title}</h3>
              <ul>
                {activity.content.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )}

      {data.gifts.length > 0 && (
        <section className="chapter-print-section chapter-print-gifts">
          <h2>🎁 이 챕터에서 받은 프롬프트 ({data.gifts.length}개)</h2>
          {data.gifts.map(({ id, title, gift }, idx) => (
            <article key={id} className="chapter-print-gift">
              <p className="chapter-print-gift-num">#{idx + 1} · {title}</p>
              <h3>{gift.emoji} {gift.title}</h3>
              {gift.payoff && <p className="chapter-print-gift-payoff">"{gift.payoff}"</p>}
              <p className="chapter-print-gift-usecase">
                <strong>📍 어디서 쓰나요</strong> {gift.useCase}
              </p>
              <pre>{gift.prompt}</pre>
            </article>
          ))}
        </section>
      )}

      <footer className="chapter-print-footer">
        <p>이 매뉴얼 챕터는 {profileName}님의 학원 운영 백서의 일부입니다.</p>
        <p>Tacit KnowledgeLab · 챕터 {data.chapter.n} · {data.issuedAt}</p>
      </footer>
    </div>
  );
}
