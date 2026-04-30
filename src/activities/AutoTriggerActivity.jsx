import { useState } from 'react';
import { motion } from 'framer-motion';
import ActivityFooter from '../components/ActivityFooter';
import ConceptModeBanner from '../components/ConceptModeBanner';

export default function AutoTriggerActivity({ data, saveData, complete, onBack }) {
  const [isChecked, setIsChecked] = useState(data?.isChecked ?? false);

  const handleCheck = () => {
    setIsChecked(!isChecked);
    saveData({ isChecked: !isChecked });
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: '#F59E0B' }}>Tutorial Step 5</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>
            5단계: 알람 맞추기 & 자동 배포
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            수동으로 ▷실행 버튼을 누르는 대신, 시간이나 외부 이벤트에 따라 코드가 작동하는 트리거(Trigger)를 활성화하면 배포가 완료됩니다.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <ConceptModeBanner
          onConceptComplete={() => complete({ activityData: { isChecked: true, mode: 'concept' }, bonusXp: 5 })}
        />
        <div className="card" style={{ padding: '24px', background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '16px', color: '#F59E0B' }}>🎯 미션: 스케줄 시계 설정하기</h3>
          <ol style={{ lineHeight: '1.8', color: 'var(--text-main)', paddingLeft: '20px' }}>
            <li>Apps Script 화면 <strong>왼쪽 메뉴</strong>에서 시계 모양(⏰ <strong>트리거</strong>) 아이콘을 클릭합니다.</li>
            <li>우측 하단의 파란 버튼 <strong>[+ 트리거 추가]</strong>를 누릅니다.</li>
            <li>(중요) 어떤 함수를 실행할지: <code>sendMorningLetter</code>로 설정되어 있는지 확인합니다.</li>
            <li><strong>이벤트 소스 선택</strong>을 <code>[시간 기반]</code>으로 변경합니다.</li>
            <li><strong>트리거 기반 시간 유형</strong>을 <code>[일일 타이머]</code>로 변경합니다.</li>
            <li><strong>시간대</strong>를 <code>[오전 7시 ~ 오전 8시]</code>로 맞추고 <strong>[저장]</strong>을 누릅니다.</li>
          </ol>
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#60A5FA', fontSize: '0.9rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <strong>💡 배포 완료!</strong> 트리거가 등록된 순간 이 프로그램은 더 이상 여러분의 PC 자원을 쓰지 않는 독립적인 클라우드 앱이 되었습니다!
          </div>
        </div>

        {/* CSS Animation indicating clock UI */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))' }}
          >
            ⏰
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ padding: '24px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', textAlign: 'center' }}
        >
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isChecked} onChange={handleCheck} style={{ width: '20px', height: '20px', accentColor: '#F59E0B' }} />
            <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>네, 매일 아침 자동으로 백그라운드에서 실행되도록 배포 완료했습니다! 🎉</span>
          </label>
        </motion.div>

        <div style={{ marginTop: 'auto' }}>
          <ActivityFooter 
            onComplete={(insight) => complete({ activityData: { isChecked, insight }, bonusXp: 20 })}
            onSkip={() => complete({ activityData: { isChecked, insight: 'Skipped' }, bonusXp: 0 })}
            onAutoFill={() => setIsChecked(true)}
            disableComplete={!isChecked}
          />
        </div>
      </div>
    </div>
  );
}
