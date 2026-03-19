import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PresentationShell from '../components/PresentationShell';
import { KeyRound, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function DemoWritingCorrectionActivity(props) {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [result, setResult] = useState(null);

  const handleSaveKey = () => {
    if (apiKey.length > 10) setHasKey(true);
  };

  const handleCorrection = () => {
    if (!inputText) return;
    setIsCorrecting(true);
    setTimeout(() => {
      setIsCorrecting(false);
      setResult({
        original: inputText,
        corrected: "Yesterday, I went to the park. It was very fun and I played with my friends.",
        feedback: "과거 시제(went, played)를 아주 잘 사용했어요! 문장의 연결이 자연스러워졌습니다. 아주 훌륭해요! 👍"
      });
    }, 2000);
  };

  return (
    <PresentationShell 
      step="2" 
      title="2. 영어 작문 첨삭 앱"
      subtitle="API 지능 연동"
      storyText="학생들의 영작을 나만의 깐깐한 기준과 따뜻한 톤앤매너로 꼼꼼하게 첨삭해주는 노하우"
      actionText="프롬프트 구조화 및 API 연동"
      actionColor="#3B82F6"
      {...props}
    >
      <div className="flex flex-col bg-slate-50 w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-slate-200" style={{ height: '500px' }}>
        
        {/* App Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">단비 원장님의 따뜻한 첨삭봇</h1>
          </div>
          
          {/* API Key Status */}
          <div className="flex items-center gap-2">
            {hasKey ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full flex items-center gap-1">
                <CheckCircle size={14} /> API Key Active
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold uppercase rounded-full flex items-center gap-1">
                <AlertCircle size={14} /> Needs API Key
              </span>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto relative">
          <AnimatePresence mode="popLayout">
            {!hasKey ? (
              <motion.div 
                key="api-setup"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-slate-100 text-center"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <KeyRound size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">프롬프트 엔진 활성화</h2>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                  원장님의 첨삭 노하우가 담긴 프롬프트를 작동시키려면 OpenAI/Gemini API 키가 필요합니다.
                </p>
                <div className="flex flex-col gap-3">
                  <input 
                    type="password" 
                    placeholder="sk-..." 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleSaveKey}
                    disabled={apiKey.length < 5}
                    className="px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    API Key 연동 및 활성화
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="editor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-6 h-full"
              >
                {/* Left: Input */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">📝 학생 영작 입력</h3>
                  </div>
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="여기에 학생이 쓴 영어 문장을 입력하세요... (예: Yesterday i go to park. it is very fun and i play with friend.)"
                    className="flex-1 resize-none p-4 rounded-xl border border-slate-200 shadow-inner bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleCorrection}
                    disabled={!inputText || isCorrecting}
                    className="py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCorrecting ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> 지능적 교정 중...</>
                    ) : (
                      <>✨ 원장님 톤앤매너로 첨삭하기</>
                    )}
                  </button>
                </div>

                {/* Right: Output */}
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowRight className="text-slate-400" />
                    <h3 className="font-bold text-blue-700">AI 첨삭 결과</h3>
                  </div>
                  
                  <div className="flex-1 bg-white border border-blue-100 rounded-xl p-5 shadow-sm overflow-y-auto">
                    {isCorrecting ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                        <div className="h-24 bg-blue-50 rounded mt-6"></div>
                      </div>
                    ) : result ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase mb-1">교정된 문장</div>
                          <div className="text-lg text-slate-800 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
                            {result.corrected}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-400 uppercase mb-1">단비 원장님의 코멘트</div>
                          <div className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 border-l-4 border-l-orange-400 italic">
                            "{result.feedback}"
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-center px-8">
                        좌측에 학생의 글을 입력하고 첨삭 버튼을 누르면, 시스템 프롬프트에 저장된 원장님의 노하우가 발동합니다.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PresentationShell>
  );
}

// Ensure CheckCircle is available
const CheckCircle = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
