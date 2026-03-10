import { useMemo, useState } from 'react';
import ActivityShell from '../components/ActivityShell';
import { MONTHS, YEAR_EVENTS } from '../data/yearEvents';

export default function TimelineActivity({ data, onSave, onComplete, onBack }) {
  const [entries, setEntries] = useState(data?.entries ?? {});
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [draft, setDraft] = useState('');

  const filledCount = useMemo(
    () => Object.values(entries).filter((value) => typeof value === 'string' && value.trim()).length,
    [entries],
  );

  const handleSelectMonth = (index) => {
    setSelectedMonth(index);
    setDraft(entries[index] ?? '');
  };

  const handleSaveMonth = () => {
    if (selectedMonth === null || !draft.trim()) {
      return;
    }

    const nextEntries = {
      ...entries,
      [selectedMonth]: draft.trim(),
    };

    setEntries(nextEntries);
    onSave({ entries: nextEntries });
    setSelectedMonth(null);
    setDraft('');
  };

  return (
    <ActivityShell
      title="나의 1년 타임라인"
      desc="각 월을 눌러 그 시기에 반복적으로 하는 운영 습관을 적어보세요. 3개월 이상 기록하면 활동을 완료할 수 있습니다."
      icon="🗓️"
      color="#10B981"
      time="5분"
      onBack={onBack}
      actions={
        <button
          type="button"
          className="primary-button"
          disabled={filledCount < 3}
          onClick={() => onComplete({ activityData: { entries }, bonusXp: filledCount >= 6 ? 12 : 0 })}
          aria-label="타임라인 활동 완료"
        >
          타임라인 완료하고 XP 받기
        </button>
      }
    >
      <div className="month-grid">
        {YEAR_EVENTS.map((event, index) => {
          const saved = Boolean(entries[index]?.trim());
          const active = selectedMonth === index;

          return (
            <button
              key={event.label}
              type="button"
              className={`month-card ${active ? 'is-active' : ''} ${saved ? 'is-filled' : ''}`}
              onClick={() => handleSelectMonth(index)}
              aria-label={`${MONTHS[index]} 기록 열기`}
            >
              <span className="month-icon" aria-hidden="true">
                {event.icon}
              </span>
              <strong>{MONTHS[index]}</strong>
              <span>{event.label}</span>
              {saved ? <em>기록됨</em> : null}
            </button>
          );
        })}
      </div>

      {selectedMonth !== null ? (
        <div className="glass-panel inner-panel">
          <p className="eyebrow">{MONTHS[selectedMonth]} · {YEAR_EVENTS[selectedMonth].label}</p>
          <h3>{YEAR_EVENTS[selectedMonth].desc}</h3>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="예: 3월이면 항상 조용한 아이를 먼저 파악해 짝을 붙여줍니다."
            aria-label="타임라인 기록 입력"
          />
          <button type="button" className="primary-button" onClick={handleSaveMonth} aria-label="이번 달 기록 저장">
            저장
          </button>
        </div>
      ) : null}

      <div className="insight-banner">
        <strong>{filledCount}개월 기록됨</strong>
        <p>매뉴얼에 없지만 해마다 반복되는 행동은 이미 당신의 운영 알고리즘입니다.</p>
      </div>
    </ActivityShell>
  );
}
