import { useState } from 'react';
import { motion } from 'framer-motion';
import ActivityFooter from '../components/ActivityFooter';

export default function AutoPropertyActivity({ id, data, saveData, complete, onBack }) {
  const [isChecked, setIsChecked] = useState(data?.isChecked ?? false);

  const handleCheck = () => {
    setIsChecked(!isChecked);
    saveData({ isChecked: !isChecked });
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: '#EC4899' }}>Tutorial Step 3</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>
            3단계: 비밀 금고 설정 (보안)
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            중요한 API 키를 코드에 직접 쓰면 남들이 볼 수 있습니다. 앱스스크립트의 안전한 환경 변수에 숨겨봅시다.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ padding: '24px', background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '16px', color: '#EC4899' }}>🎯 미션: 스크립트 속성(Properties) 추가</h3>
          <ol style={{ lineHeight: '1.8', color: 'var(--text-main)', paddingLeft: '20px' }}>
            <li>Apps Script 화면 <strong>왼쪽 메뉴바</strong> 하단의 ⚙️ <strong>프로젝트 설정(Project Settings)</strong>을 클릭합니다.</li>
            <li>맨 아래로 스크롤하여 <strong>스크립트 속성(Script Properties)</strong> 섹션을 찾습니다.</li>
            <li><strong>스크립트 속성 추가</strong> 버튼을 누릅니다.</li>
            <li>속성(Property) 칸에는 <code style={{ color: '#F472B6' }}>GEMINI_API_KEY</code> 라고 씁니다. (대문자, 띄어쓰기 대신 언더바)</li>
            <li>값(Value) 칸에는 아까 1단계에서 복사한 <code>AIzaSy...</code> 키를 붙여넣습니다.</li>
            <li>저장(Save)을 누릅니다. 이제 이 프로젝트는 이 암호를 기억합니다!</li>
          </ol>
        </div>

        {/* UI Animation Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
          <motion.div 
            animate={{ scale: [1, 1.02, 1] }} 
            transition={{ repeat: Infinity, duration: 2.5 }}
            style={{ padding: '16px 24px', background: '#334155', borderRadius: '8px', border: '1px solid #475569', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94A3B8', width: '80px' }}>Property</span>
                <span style={{ background: '#1e293b', padding: '4px 12px', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace', color: '#F472B6' }}>GEMINI_API_KEY</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#94A3B8', width: '80px' }}>Value</span>
                <span style={{ background: '#1e293b', padding: '4px 12px', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace', color: '#e2e8f0' }}>AIzaSy... (내 복사된 키)</span>
              </div>
            </div>
            <div style={{ background: '#2563EB', padding: '8px 16px', borderRadius: '4px', color: 'white', fontSize: '13px', fontWeight: 'bold' }}>Save</div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ padding: '24px', background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.2)', textAlign: 'center' }}
        >
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isChecked} onChange={handleCheck} style={{ width: '20px', height: '20px', accentColor: '#EC4899' }} />
            <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>네, 스크립트 속성에 API 키를 안전하게 저장했습니다.</span>
          </label>
        </motion.div>

        <div style={{ marginTop: 'auto' }}>
          <ActivityFooter 
            onComplete={(insight) => complete({ activityData: { isChecked, insight }, bonusXp: 15 })}
            onSkip={() => complete({ activityData: { isChecked, insight: 'Skipped' }, bonusXp: 0 })}
            onAutoFill={() => setIsChecked(true)}
            disableComplete={!isChecked}
          />
        </div>
      </div>
    </div>
  );
}
