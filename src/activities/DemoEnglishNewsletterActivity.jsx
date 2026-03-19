import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PresentationShell from '../components/PresentationShell';
import { Code, Clock, Mail, Send, CheckCircle2 } from 'lucide-react';

export default function DemoEnglishNewsletterActivity(props) {
  const [triggerState, setTriggerState] = useState('idle'); // idle -> running -> done

  const handleRunTrigger = () => {
    setTriggerState('running');
    setTimeout(() => {
      setTriggerState('done');
    }, 3000);
  };

  return (
    <PresentationShell 
      step="4" 
      title="4. 아침 편지 자동화"
      subtitle="JavaScript/GAS 백그라운드 구동"
      storyText="매일 아침 유익한 영어 기사를 학부모와 학생에게 잊지 않고 보내주는 정성"
      actionText="Apps Script 시간 트리거 연동"
      actionColor="#10B981"
      {...props}
    >
      <div className="flex w-full max-w-4xl bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-emerald-900/50" style={{ height: '480px' }}>
        
        {/* Left: VS Code / Apps Script Editor style */}
        <div className="w-1/2 flex flex-col border-r border-[#333]">
          <header className="bg-[#2d2d2d] py-2 px-4 flex items-center justify-between border-b border-[#111]">
            <div className="flex flex-col">
              <span className="text-gray-300 text-sm font-medium">📜 Code.gs</span>
              <span className="text-gray-500 text-[10px]">appsscript.json</span>
            </div>
            <button 
              onClick={handleRunTrigger}
              disabled={triggerState !== 'idle'}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors"
            >
              <Clock size={14} /> Set Daily Trigger
            </button>
          </header>
          <div className="flex-1 p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs overflow-hidden">
<pre className="leading-relaxed">
<span className="text-[#569cd6]">function</span> <span className="text-[#dcdcaa]">sendDailyNewsletter</span>() {'{'}
  <span className="text-[#6a9955]">// 1. Fetch latest English articles</span>
  <span className="text-[#569cd6]">const</span> articles = <span className="text-[#dcdcaa]">fetchArticlesFromRSS</span>();
  
  <span className="text-[#6a9955]">// 2. Translate with AI</span>
  <span className="text-[#569cd6]">const</span> translated = <span className="text-[#dcdcaa]">translateWithAI</span>(articles);
  
  <span className="text-[#6a9955]">// 3. Get student mailing list</span>
  <span className="text-[#569cd6]">const</span> emails = <span className="text-[#dcdcaa]">getEmailsFromSheet</span>();
  
  <span className="text-[#6a9955]">// 4. Send Broadcast</span>
  <span className="text-[#4ec9b0]">MailApp</span>.<span className="text-[#dcdcaa]">sendEmail</span>({'{'}
    to: emails.<span className="text-[#dcdcaa]">join</span>(<span className="text-[#ce9178]">','</span>),
    subject: <span className="text-[#ce9178]">'[단비학원] 오늘의 영어 기사 ☀️'</span>,
    htmlBody: translated
  {'}'});
{'}'}
</pre>
            <div className="mt-8 border-t border-[#333] pt-4">
              <div className="text-gray-500 mb-2">Triggers Configuration:</div>
              <div className="bg-[#2d2d2d] p-3 rounded flex items-center justify-between border border-[#444]">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-emerald-500" />
                  <span className="text-sm">Time-driven</span>
                </div>
                <span className="text-emerald-400 text-xs font-bold bg-emerald-900/30 px-2 py-1 rounded">Every morning 07:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Phone Mockup / Email View */}
        <div className="w-1/2 bg-[#0d1117] flex items-center justify-center p-6 relative">
          
          <AnimatePresence mode="wait">
            {triggerState === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="text-center text-gray-400"
              >
                <Mail size={48} className="mx-auto mb-4 opacity-30" />
                <p>좌측에서 트리거를 가동하여<br/>자동 발송 시뮬레이션을 시작하세요.</p>
              </motion.div>
            )}

            {triggerState === 'running' && (
              <motion.div 
                key="running"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative">
                  <Clock size={48} className="text-emerald-500 animate-spin" style={{ animationDuration: '3s' }} />
                  <Send size={20} className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-emerald-400 font-mono text-sm">Executing trigger...</div>
                <div className="w-48 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <motion.div className="bg-emerald-500 h-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3 }} />
                </div>
              </motion.div>
            )}

            {triggerState === 'done' && (
              <motion.div 
                key="done"
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full"
              >
                <div className="bg-emerald-600 text-white p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs opacity-80">Today 07:00 AM</div>
                    <div className="font-bold text-sm truncate">[단비학원] 오늘의 영어 기사 ☀️</div>
                  </div>
                  <CheckCircle2 size={20} className="text-emerald-200" />
                </div>
                <div className="p-5 overflow-y-auto flex-1 bg-slate-50">
                  <div className="text-slate-800 text-sm leading-relaxed space-y-4">
                    <p>안녕하세요 지민 학생! 오늘 아침 배달된 신선한 영어 기사입니다.</p>
                    <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-1">SpaceX Launches New Rocket</h4>
                      <p className="text-slate-600 text-xs italic mb-2">스페이스X가 새로운 로켓을 발사했습니다.</p>
                      <p className="text-slate-700">SpaceX successfully launched its newest rocket into orbit this morning...</p>
                    </div>
                    <p className="text-emerald-600 font-bold text-xs mt-4">오늘도 활기찬 하루 보내세요!</p>
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
