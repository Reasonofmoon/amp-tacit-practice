import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ACTIVITY_MODELS } from '../data/activities';

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const EVENTS = [
  { id: 'ev1', text: '신규생 집중 상담 주간' },
  { id: 'ev2', text: '학부모 간담회 (상반기)' },
  { id: 'ev3', text: '1학기 중간고사 리포트 발송' },
  { id: 'ev4', text: '여름방학 특강 기획' },
  { id: 'ev5', text: '강사 워크샵 및 재교육' },
  { id: 'ev6', text: '2학기 기말고사 대비반 편성' },
  { id: 'ev7', text: '학부모 간담회 (하반기)' },
  { id: 'ev8', text: '겨울방학 특강 설명회' },
  { id: 'ev9', text: '졸업생 환송 및 성취도 평가' },
];

export default function TimelineActivity({ data, saveData, complete, onBack }) {
  const [placedEvents, setPlacedEvents] = useState(data?.placedEvents ?? {});
  const [draggedId, setDraggedId] = useState(null);

  const availableEvents = EVENTS.filter(ev => !Object.values(placedEvents).some(placed => placed.id === ev.id));
  const filledCount = Object.keys(placedEvents).length;

  const handleDragStart = (e, eventItem) => {
    setDraggedId(eventItem.id);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires dataTransfer data
    e.dataTransfer.setData('text/plain', eventItem.id);
  };

  const handleDrop = (e, monthIndex) => {
    e.preventDefault();
    if (!draggedId) return;

    const eventToDrop = EVENTS.find(ev => ev.id === draggedId);
    if (eventToDrop) {
      const nextPlaced = { ...placedEvents, [monthIndex]: eventToDrop };
      setPlacedEvents(nextPlaced);
      saveData({ placedEvents: nextPlaced });
    }
    setDraggedId(null);
  };

  const handleRemove = (monthIndex) => {
    const nextPlaced = { ...placedEvents };
    delete nextPlaced[monthIndex];
    setPlacedEvents(nextPlaced);
    saveData({ placedEvents: nextPlaced });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px' }}>Layer A: Foundation</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>나의 1년 타임라인</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>오른쪽의 주요 사건을 해당하는 월(Month) 슬롯으로 <strong>드래그 앤 드랍</strong> 해보세요. 학원의 운영 리듬이 시각화됩니다.</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        <div className="split-left">
          <h3 style={{ marginBottom: '16px' }}>연간 일정 슬롯</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', overflowY: 'auto' }}>
            {MONTHS.map((month, idx) => (
              <div 
                key={month} 
                className={`drop-zone ${placedEvents[idx] ? 'filled' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
              >
                {placedEvents[idx] ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', position: 'absolute', top: '8px', left: '12px' }}>{month}</span>
                    <strong style={{ fontSize: '0.875rem', textAlign: 'center', padding: '0 12px' }}>{placedEvents[idx].text}</strong>
                    <button 
                      onClick={() => handleRemove(idx)}
                      style={{ position: 'absolute', top: '4px', right: '4px', color: 'var(--text-light)', border: 'none', background: 'none', cursor: 'pointer', padding: '4px' }}
                    >✕</button>
                  </div>
                ) : (
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-light)' }}>{month} Drop</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="split-right" style={{ paddingLeft: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>배치 대기 이벤트</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableEvents.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--success)', background: 'var(--primary-light)', borderRadius: '12px', fontWeight: 600 }}>
                모든 이벤트를 배치했습니다! 🎉
              </div>
            )}
            {availableEvents.map(ev => (
              <motion.div
                key={ev.id}
                draggable
                onDragStart={(e) => handleDragStart(e, ev)}
                className="drag-item"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />
                {ev.text}
              </motion.div>
            ))}
          </div>

          <div className="confidence-module" style={{ marginTop: 'auto' }}>
            <p>기본 사이클이 파악되었습니다. {filledCount}개 배치 완료.</p>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={filledCount < 3}
              onClick={() => complete({ activityData: { placedEvents }, bonusXp: filledCount >= 6 ? 15 : 0 })}
            >
              타임라인 완료 및 저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
