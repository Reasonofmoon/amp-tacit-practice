import { useState } from 'react';
import { motion } from 'framer-motion';
import ActivityFooter from '../components/ActivityFooter';
import ConceptModeBanner from '../components/ConceptModeBanner';

export default function AutoScriptActivity({ data, saveData, complete, onBack }) {
  const [isChecked, setIsChecked] = useState(data?.isChecked ?? false);

  const handleCheck = () => {
    setIsChecked(!isChecked);
    saveData({ isChecked: !isChecked });
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: '#10B981' }}>Tutorial Step 2</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>
            2단계: 몸통(서버) 만들기
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            코드가 24시간 내내 무료로 실행될 수 있는 "Google Apps Script" 환경을 생성합니다.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <ConceptModeBanner
          onConceptComplete={() => complete({ activityData: { isChecked: true, mode: 'concept' }, bonusXp: 5 })}
        />
        <div className="card" style={{ padding: '24px', background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '16px', color: '#10B981' }}>🎯 미션: 스크립트 에디터 열기</h3>
          <ol style={{ lineHeight: '1.8', color: 'var(--text-main)', paddingLeft: '20px' }}>
            <li>
              구글 드라이브나 브라우저 주소창에 <br/>
              <code style={{ background: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#38bdf8' }}>script.new</code> 를 입력하고 엔터를 칩니다.
            </li>
            <li>새로운 <strong>Apps Script 프로젝트</strong> 창이 뜹니다.</li>
            <li>상단의 '제목 없는 프로젝트'를 클릭하여 <strong>"AI 아침 편지 봇"</strong>으로 이름을 바꿉니다.</li>
            <li>화면 중앙의 <code>function myFunction() &#123; &#125;</code> 코드를 모두 지워 빈 화면으로 만듭니다.</li>
          </ol>
        </div>

        {/* CSS Animation indicating script.new */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ padding: '16px 32px', background: '#1e293b', borderRadius: '8px', border: '2px solid #10B981', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <span style={{ fontSize: '1.5rem' }}>🌐</span>
            <span style={{ fontSize: '1.25rem', fontFamily: 'monospace', color: '#f8fafc' }}>
              https://<strong style={{ color: '#34d399' }}>script.new</strong>
            </span>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ padding: '24px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}
        >
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isChecked} onChange={handleCheck} style={{ width: '20px', height: '20px', accentColor: '#10B981' }} />
            <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>네, 빈 프로젝트 화면을 띄웠습니다.</span>
          </label>
        </motion.div>

        <div style={{ marginTop: 'auto' }}>
          <ActivityFooter 
            onComplete={(insight) => complete({ activityData: { isChecked, insight }, bonusXp: 10 })}
            onSkip={() => complete({ activityData: { isChecked, insight: 'Skipped' }, bonusXp: 0 })}
            onAutoFill={() => setIsChecked(true)}
            disableComplete={!isChecked}
          />
        </div>
      </div>
    </div>
  );
}
