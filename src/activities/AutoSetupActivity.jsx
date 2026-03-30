import { useState } from 'react';
import { motion } from 'framer-motion';
import ActivityFooter from '../components/ActivityFooter';

export default function AutoSetupActivity({ data, saveData, complete, onBack }) {
  const [isChecked, setIsChecked] = useState(data?.isChecked ?? false);

  const handleCheck = () => {
    setIsChecked(!isChecked);
    saveData({ isChecked: !isChecked });
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: '#8B5CF6' }}>Tutorial Step 1</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>
            1단계: 뇌(AI) 준비하기
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            나만의 아침 편지 봇을 위한 AI 두뇌(Gemini API 키)를 발급받아 환경을 세팅합니다.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ padding: '24px', background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
          <h3 style={{ marginBottom: '16px', color: '#A78BFA' }}>🎯 미션: Gemini API 키 발급</h3>
          <ol style={{ lineHeight: '1.8', color: 'var(--text-main)', paddingLeft: '20px' }}>
            <li>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#8B5CF6', textDecoration: 'underline' }}>
                Google AI Studio
              </a>에 접속하여 Google 계정으로 로그인합니다.
            </li>
            <li>왼쪽 메뉴에서 <strong>Get API key</strong> 버튼을 클릭합니다.</li>
            <li><strong>Create API key</strong>를 누르고 새 프로젝트에서 키를 생성합니다.</li>
            <li>
              생성된 키 <code>AIzaSy...</code> 형태의 문자열을 <strong>복사(Copy)</strong>해둡니다. (절대 외부에 유출하지 마세요!)
            </li>
          </ol>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ padding: '24px', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔑</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>API 키를 안전하게 복사하셨나요?</p>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isChecked} onChange={handleCheck} style={{ width: '20px', height: '20px', accentColor: '#8B5CF6' }} />
            <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>네, 복사 완료했습니다.</span>
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
