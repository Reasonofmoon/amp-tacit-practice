import { useMemo, useState } from 'react';
import ActivityShell from '../components/ActivityShell';
import { PATTERN_CARDS } from '../data/patternCards';
import { calculatePatternBonus } from '../utils/scoring';

const CARD_SET = PATTERN_CARDS[0];

function buildMatchKey(situationId, responseId) {
  return `${situationId}:${responseId}`;
}

export default function PatternMatchActivity({ data, onSave, onComplete, onBack }) {
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [matches, setMatches] = useState(data?.matches ?? {});
  const [reflections, setReflections] = useState(data?.reflections ?? {});
  const [modalPair, setModalPair] = useState(null);
  const [draftReason, setDraftReason] = useState('');

  const matchedResponses = useMemo(() => new Set(Object.values(matches)), [matches]);
  const completedCount = useMemo(
    () =>
      Object.entries(matches).filter(([situationId, responseId]) => reflections[buildMatchKey(situationId, responseId)]?.trim()).length,
    [matches, reflections],
  );

  const persist = (nextMatches, nextReflections) => {
    onSave({
      matches: nextMatches,
      reflections: nextReflections,
    });
  };

  const openReasonModal = (situationId, responseId) => {
    setModalPair({ situationId, responseId });
    setDraftReason(reflections[buildMatchKey(situationId, responseId)] ?? '');
  };

  const saveReason = () => {
    if (!modalPair || !draftReason.trim()) {
      return;
    }

    const previousResponseId = matches[modalPair.situationId];
    const nextMatches = {
      ...matches,
      [modalPair.situationId]: modalPair.responseId,
    };
    const nextReflections = {
      ...reflections,
      [buildMatchKey(modalPair.situationId, modalPair.responseId)]: draftReason.trim(),
    };

    if (previousResponseId && previousResponseId !== modalPair.responseId) {
      delete nextReflections[buildMatchKey(modalPair.situationId, previousResponseId)];
    }

    setMatches(nextMatches);
    setReflections(nextReflections);
    persist(nextMatches, nextReflections);
    setModalPair(null);
    setSelectedSituation(null);
    setDraftReason('');
  };

  return (
    <ActivityShell
      title="패턴 매칭 게임"
      desc="상황과 대응을 클릭으로 연결하고, 왜 그 조합이 맞는지 서술해보세요. 정답은 없고 당신의 판단 프레임만 남습니다."
      icon="🧩"
      color="#06B6D4"
      time="5분"
      onBack={onBack}
      actions={
        <button
          type="button"
          className="primary-button"
          disabled={completedCount < CARD_SET.situations.length}
          onClick={() =>
            onComplete({
              activityData: {
                matches,
                reflections,
              },
              bonusXp: calculatePatternBonus(completedCount),
              metrics: {
                patternCount: completedCount,
              },
            })
          }
          aria-label="패턴 매칭 활동 완료"
        >
          패턴 매칭 완료
        </button>
      }
    >
      <div className="pattern-shell">
        <div className="glass-panel inner-panel">
          <p className="eyebrow">STEP 1</p>
          <h3>상황 카드를 고르세요</h3>
          <div className="match-card-list">
            {CARD_SET.situations.map((situation) => (
              <button
                key={situation.id}
                type="button"
                className={`match-card ${selectedSituation === situation.id ? 'is-active' : ''} ${matches[situation.id] ? 'is-filled' : ''}`}
                onClick={() => setSelectedSituation(situation.id)}
                aria-label={`${situation.text} 선택`}
              >
                <span>{situation.icon}</span>
                <p>{situation.text}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="pattern-connections">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CONNECT</p>
              <h3>연결된 판단 프레임</h3>
            </div>
            <strong>{completedCount}/6</strong>
          </div>
          <div className="connection-list">
            {Object.entries(matches).length === 0 ? <p className="muted-copy empty-state">매칭된 조합이 아직 없습니다.</p> : null}
            {Object.entries(matches).map(([situationId, responseId]) => {
              const situation = CARD_SET.situations.find((item) => item.id === situationId);
              const response = CARD_SET.responses.find((item) => item.id === responseId);
              const reflection = reflections[buildMatchKey(situationId, responseId)];

              return (
                <button
                  key={buildMatchKey(situationId, responseId)}
                  type="button"
                  className="connection-card"
                  onClick={() => openReasonModal(situationId, responseId)}
                  aria-label={`${situation?.text}와 ${response?.text} 연결 이유 수정`}
                >
                  <span>{situation?.icon} {situation?.text}</span>
                  <strong>⟶</strong>
                  <span>{response?.icon} {response?.text}</span>
                  <p>{reflection ? reflection : '이유를 적어 연결을 완성하세요.'}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel inner-panel">
          <p className="eyebrow">STEP 2</p>
          <h3>대응 카드를 연결하세요</h3>
          <div className="match-card-list">
            {CARD_SET.responses.map((response) => {
              const alreadyUsed = matchedResponses.has(response.id);
              const currentResponseForSelected = selectedSituation ? matches[selectedSituation] === response.id : false;

              return (
                <button
                  key={response.id}
                  type="button"
                  className={`match-card ${currentResponseForSelected ? 'is-active' : ''} ${alreadyUsed ? 'is-filled' : ''}`}
                  disabled={!selectedSituation || (alreadyUsed && !currentResponseForSelected)}
                  onClick={() => openReasonModal(selectedSituation, response.id)}
                  aria-label={`${response.text} 대응 선택`}
                >
                  <span>{response.icon}</span>
                  <p>{response.text}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {modalPair ? (
        <div className="inline-modal" role="dialog" aria-modal="true" aria-label="연결 이유 입력">
          <div className="glass-panel modal-card">
            <h3>왜 이 조합인가요?</h3>
            <p>정답은 없습니다. 당신의 판단 기준을 1~2문장으로 적어주세요.</p>
            <textarea
              value={draftReason}
              onChange={(event) => setDraftReason(event.target.value)}
              placeholder="예: 신규 등록 급감은 관계 자산을 먼저 점검해야 하므로 1:1 전화가 맞습니다."
              aria-label="연결 이유 입력"
            />
            <div className="button-row">
              <button type="button" className="ghost-button" onClick={() => setModalPair(null)} aria-label="모달 닫기">
                취소
              </button>
              <button type="button" className="primary-button" onClick={saveReason} aria-label="연결 이유 저장">
                저장
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ActivityShell>
  );
}
