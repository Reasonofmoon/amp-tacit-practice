import { useState } from 'react';
import { motion } from 'framer-motion';
import ActivityFooter from '../components/ActivityFooter';
import ConceptModeBanner from '../components/ConceptModeBanner';

const SCRIPT_CODE = `const MY_EMAIL = "당신의이메일@gmail.com";

function sendMorningLetter() {
  // 스크립트 속성(비밀 금고)에서 API 키를 안전하게 불러옵니다.
  const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  
  if (!GEMINI_API_KEY) {
    console.error("API 키를 찾을 수 없습니다. 3단계를 다시 확인해주세요!");
    return;
  }

  const prompt = "오늘 하루를 힘차게 시작할 수 있는 짧은 동기부여 명언 1개와 해석을 알려줘.";
  const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${GEMINI_API_KEY}\`;
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  };
  
  // AI에게 물어보고 답변 받기
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  const quote = data.candidates[0].content.parts[0].text;
  
  // 오늘의 날짜
  const today = new Date();
  const dateString = \`\${today.getFullYear()}년 \${today.getMonth()+1}월 \${today.getDate()}일\`;
  
  // 나에게 이메일 보내기
  GmailApp.sendEmail(
    MY_EMAIL, 
    \`[AI 비서] \${dateString} 아침 명언 알림\`, 
    quote
  );
}`;

export default function AutoCodeActivity({ data, saveData, complete, onBack }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isChecked, setIsChecked] = useState(data?.isChecked ?? false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SCRIPT_CODE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCheck = () => {
    setIsChecked(!isChecked);
    saveData({ isChecked: !isChecked });
  };

  return (
    <div className="activity-workspace">
      <header className="workspace-header">
        <div>
          <span className="tag" style={{ marginBottom: '8px', background: '#3B82F6' }}>Tutorial Step 4</span>
          <h2 className="question-title" style={{ marginBottom: 0 }}>
            4단계: 영혼(코드) 불어넣기 및 권한 승인
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            복사+붙여넣기로 앱을 완성하고, 내 구글 계정에서 메일을 보낼 수 있도록 허락(권한 승인)해줍니다.
          </p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={onBack}>돌아가기</button>
      </header>

      <div className="workspace-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <ConceptModeBanner
          onConceptComplete={() => complete({ activityData: { isChecked: true, mode: 'concept' }, bonusXp: 5 })}
        />
        <div className="card" style={{ padding: '24px', background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#3B82F6', margin: 0 }}>🎯 미션: 복사 & 붙여넣고 실행하기</h3>
            <button 
              onClick={handleCopy}
              className="btn btn-primary"
              style={{ background: isCopied ? '#10B981' : '#3B82F6', color: 'white', padding: '8px 16px', display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              <span>{isCopied ? '✓ 복사됨!' : '📋 전체 코드 복사하기'}</span>
            </button>
          </div>
          
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155', overflowX: 'auto' }}>
            <pre style={{ margin: 0, color: '#f8fafc', fontSize: '0.9rem', lineHeight: '1.5', fontFamily: 'monospace' }}>
              {SCRIPT_CODE}
            </pre>
          </div>

          <ol style={{ lineHeight: '1.8', color: 'var(--text-main)', paddingLeft: '20px', marginTop: '16px' }}>
            <li>위 <strong>전체 코드 복사하기</strong> 버튼을 누릅니다.</li>
            <li>왼쪽 <code>&lt; &gt; 편집기(Editor)</code> 메뉴로 돌아와 창에 붙여넣습니다.</li>
            <li>코드 첫째 줄에 있는 <strong>내 이메일 주소</strong>를 올바르게 수정하세요.</li>
            <li>상단의 💾 <strong>저장(Save)</strong>을 누르고, ▷ <strong>실행(Run)</strong>을 테스트해 봅니다.</li>
            <li><strong style={{ color: '#FCD34D' }}>⚠️ [권한 필요]</strong> 팝업이 뜨면:<br/>
                <code>[권한 검토] → 내 구글 계정 선택 → 고급(Advanced) → 'AI 아침 편지 봇(으)로 이동(안전하지 않음)' → [허용]</code> 순으로 뚫고 들어갑니다.<br/>(내가 짠 코드이므로 걱정하지 마세요!)
            </li>
          </ol>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ padding: '24px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', textAlign: 'center' }}
        >
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={isChecked} onChange={handleCheck} style={{ width: '20px', height: '20px', accentColor: '#3B82F6' }} />
            <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>네, 권한을 승인했고 메일함에 테스트 알림이 도착했습니다!</span>
          </label>
        </motion.div>

        <div style={{ marginTop: 'auto' }}>
          <ActivityFooter 
            onComplete={(insight) => complete({ activityData: { isChecked, insight }, bonusXp: 30 })}
            onSkip={() => complete({ activityData: { isChecked, insight: 'Skipped' }, bonusXp: 0 })}
            onAutoFill={() => setIsChecked(true)}
            disableComplete={!isChecked}
          />
        </div>
      </div>
    </div>
  );
}
