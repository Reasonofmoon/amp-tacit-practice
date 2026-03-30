import { useState } from 'react';
import { motion } from 'framer-motion';
import ActivityFooter from '../components/ActivityFooter';

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const EVENTS = [
  { id: 'ev1', text: '신규생 집중 상담 주간', char: '👩‍🏫' },
  { id: 'ev2', text: '학부모 간담회 (상반기)', char: '🧑‍🤝‍🧑' },
  { id: 'ev3', text: '1학기 중간고사 리포트 발송', char: '📝' },
  { id: 'ev4', text: '여름방학 특강 기획', char: '🏖️' },
  { id: 'ev5', text: '강사 워크샵 및 재교육', char: '🧑‍🏫' },
  { id: 'ev6', text: '2학기 기말고사 대비반 편성', char: '🎯' },
  { id: 'ev7', text: '학부모 간담회 (하반기)', char: '🤝' },
  { id: 'ev8', text: '겨울방학 특강 설명회', char: '⛄' },
  { id: 'ev9', text: '졸업생 환송 및 성취도 평가', char: '🎓' },
];

const DEV_EVENTS = [
  { id: 'ev1', text: '프로젝트 스캐폴딩 및 초기 세팅', char: '🏗️' },
  { id: 'ev2', text: '아키텍처 설계/Tech Stack', char: '🧠' },
  { id: 'ev3', text: '코어 비즈니스 로직 MVP 빌드', char: '⚙️' },
  { id: 'ev4', text: '컴포넌트 단위 테스트 및 디버깅', char: '🐛' },
  { id: 'ev5', text: 'CI/CD 자동 배포 인프라', char: '🚀' },
  { id: 'ev6', text: '프롬프트 컴파일 연동', char: '🔗' },
  { id: 'ev7', text: '기술 부채(Linter, 최적화)', char: '🧹' },
  { id: 'ev8', text: 'Vercel 프로덕션 런칭', char: '🌐' },
  { id: 'ev9', text: '사용자 피드백 기반 리팩토링', char: '🔄' },
];

export default function TimelineActivity({ id, data, saveData, complete, onBack }) {
  const isDev = id?.startsWith('dev_');
  const targetEvents = isDev ? DEV_EVENTS : EVENTS;
  
  const [placedEvents, setPlacedEvents] = useState(data?.placedEvents ?? {});
  const [draggedId, setDraggedId] = useState(null);

  const availableEvents = targetEvents.filter(ev => !Object.values(placedEvents).some(placed => placed.id === ev.id));
  const filledCount = Object.keys(placedEvents).length;

  const handleDragStart = (e, eventItem) => {
    setDraggedId(eventItem.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', eventItem.id);
  };

  const handleDrop = (e, monthIndex) => {
    e.preventDefault();
    if (!draggedId) return;

    const eventToDrop = targetEvents.find(ev => ev.id === draggedId);
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
          <h2 className="question-title" style={{ marginBottom: 0 }}>
            {isDev ? '나의 개발 파이프라인 타임라인' : '나의 1년 타임라인'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            오른쪽의 주요 사건을 해당하는 월(Month) 슬롯으로 <strong>드래그 앤 드랍</strong> 해보세요. 
            {isDev ? '개발의 전체 리듬이 시각화됩니다.' : '학원의 운영 리듬이 시각화됩니다.'}
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content split-view">
        <div className="split-left">
          <h3 style={{ marginBottom: '16px' }}>배치 대기 이벤트</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableEvents.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--success)', background: 'var(--primary-light)', borderRadius: '12px', fontWeight: 600 }}>
                모든 이벤트를 배치했습니다! 🎉
              </div>
            )}
            {availableEvents.length > 0 && (
              <motion.div 
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                style={{ background: 'var(--primary)', color: 'white', padding: '8px 16px', borderRadius: '20px', display: 'inline-block', alignSelf: 'center', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}
              >
                👇 아이콘을 달에 드래그!
              </motion.div>
            )}
            <div className="drag-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {availableEvents.map(ev => (
                <motion.div
                  key={ev.id}
                  draggable
                  layout
                  onDragStart={(e) => handleDragStart(e, ev)}
                  className="drag-item gamified-node"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', borderRadius: '16px', background: 'var(--bg-app)', border: '2px solid var(--border)', cursor: 'grab', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}
                  whileHover={{ scale: 1.05, borderColor: 'var(--primary)', y: -4, boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)' }}
                  whileTap={{ scale: 0.95, cursor: 'grabbing' }}
                >
                  <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.1))' }}>{ev.char}</span>
                  <strong style={{ fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.3, wordBreak: 'keep-all' }}>{ev.text}</strong>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '12px', textAlign: 'center' }}>
              기본 사이클이 파악되었습니다. {filledCount}개 배치 완료.
            </p>
            <ActivityFooter 
              onComplete={(insight) => complete({ activityData: { placedEvents, insight }, bonusXp: filledCount >= 6 ? 15 : 0 })}
              onSkip={() => complete({ activityData: { placedEvents: {}, insight: 'Skipped' }, bonusXp: 0 })}
              onAutoFill={() => {
                const autoFill = { 0: targetEvents[0], 2: targetEvents[2], 5: targetEvents[5] };
                setPlacedEvents(autoFill);
                saveData({ placedEvents: autoFill });
              }}
              disableComplete={filledCount < 3}
            />
          </div>
        </div>

        <div className="split-right" style={{ paddingLeft: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>연간 일정 슬롯</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', overflowY: 'auto', paddingRight: '8px' }}>
            {MONTHS.map((month, idx) => (
              <div 
                key={month} 
                className={`drop-zone ${placedEvents[idx] ? 'filled' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
              >
                {placedEvents[idx] ? (
                  <motion.div 
                    layoutId={placedEvents[idx].id}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="gamified-placed-node"
                    style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'white', borderRadius: '12px', border: '2px solid var(--primary)', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.15)' }}
                  >
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', position: 'absolute', top: '8px', left: '12px', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '12px' }}>{month}</span>
                    <span style={{ fontSize: '2rem', marginTop: '16px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{placedEvents[idx].char}</span>
                    <strong style={{ fontSize: '0.8rem', textAlign: 'center', padding: '8px', wordBreak: 'keep-all', lineHeight: 1.2 }}>{placedEvents[idx].text}</strong>
                    <button 
                      onClick={() => handleRemove(idx)}
                      style={{ position: 'absolute', top: '-8px', right: '-8px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--danger)', color: 'white', border: '2px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                    >✕</button>
                  </motion.div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.4 }}>
                    <span style={{ fontSize: '1.5rem' }}>🎯</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-light)' }}>{month} 에 드랍</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
