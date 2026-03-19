import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PresentationShell from '../components/PresentationShell';
import { Send, Map, Sparkles, BrainCircuit } from 'lucide-react';

export default function DemoSaboPhilosophyActivity(props) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '반갑습니다. 384 의식 매트릭스가 준비되었습니다. 어떤 고민을 나누고 싶으신가요?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeNode, setActiveNode] = useState(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: inputText }]);
    setInputText('');
    setIsTyping(true);
    
    // Animate matrix node
    setActiveNode(Math.floor(Math.random() * 8));

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '그 아이의 행동 이면에는 "존재의 인정"을 갈구하는 마음이 숨어있습니다. 표면적인 꾸짖음 대신, 지금 그 자리에 있다는 사실 자체를 인정해 주는 것에서부터 대화를 시작해 보세요. (매트릭스 좌표: C-4 통찰)' 
      }]);
      setIsTyping(false);
    }, 2500);
  };

  return (
    <PresentationShell 
      step="3" 
      title="3. 사보 철학 AI 챗봇"
      subtitle="온톨로지와 시스템 프롬프트의 결합"
      storyText="수십 년간 쌓아온 동양 철학적 직관과 심리 치유의 방법론을 384개의 경우의 수로 구조화한 통찰"
      actionText="384 매트릭스 시스템 프롬프트 활성화"
      actionColor="#8B5CF6"
      {...props}
    >
      <div className="flex bg-[#030712] rounded-xl overflow-hidden shadow-2xl border border-purple-900/50 w-full max-w-5xl" style={{ height: '550px' }}>
        
        {/* Left: 384 Matrix Visualization */}
        <div className="w-1/2 relative flex items-center justify-center border-r border-purple-900/30 overflow-hidden">
          {/* Starry background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#030712] to-[#030712]"></div>
          
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Core */}
            <motion.div 
              animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-40 h-40 border-2 border-purple-500/30 rounded-full flex items-center justify-center"
            >
              <div className="w-20 h-20 bg-purple-600/20 blur-md rounded-full absolute"></div>
              <BrainCircuit className="text-purple-400 relative z-10" size={32} />
            </motion.div>

            {/* Orbit rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div 
                key={`ring-${ring}`}
                animate={{ rotate: ring % 2 === 0 ? -360 : 360 }} 
                transition={{ duration: 40 + ring * 10, repeat: Infinity, ease: "linear" }}
                className="absolute rounded-full border border-purple-500/10"
                style={{ width: `${ring * 80 + 100}px`, height: `${ring * 80 + 100}px` }}
              >
                {/* Nodes on rings */}
                {[...Array(ring * 4)].map((_, i) => (
                  <motion.div 
                    key={`node-${ring}-${i}`}
                    animate={activeNode !== null ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 2, repeat: activeNode !== null ? Infinity : 0 }}
                    className={`absolute w-3 h-3 rounded-full ${activeNode !== null && i % 3 === 0 ? 'bg-fuchsia-400 shadow-[0_0_10px_#e879f9]' : 'bg-purple-800/50'}`}
                    style={{ 
                      top: '50%', left: '50%', 
                      transform: `translate(-50%, -50%) rotate(${(360 / (ring * 4)) * i}deg) translateX(${(ring * 80 + 100) / 2}px)` 
                    }}
                  />
                ))}
              </motion.div>
            ))}
          </div>
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/40 border border-purple-500/30 rounded-full backdrop-blur-sm">
              <Map size={16} className="text-purple-400" />
              <span className="text-purple-200 text-sm font-medium tracking-wide">384 Consciousness Matrix Active</span>
            </div>
          </div>
        </div>

        {/* Right: Chat Interface */}
        <div className="w-1/2 flex flex-col bg-[#0B1120] relative">
          <header className="p-4 border-b border-purple-900/30 flex items-center gap-3 bg-[#0f172a]/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.4)]">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-purple-50 font-bold">사보 통찰 AI</h3>
              <p className="text-purple-400/70 text-xs">Based on Gemini 2.5 Pro</p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-sm' 
                      : 'bg-[#1e293b] text-slate-200 border border-purple-900/50 rounded-tl-sm shadow-lg'
                  }`}>
                    <p className="leading-relaxed text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#1e293b] border border-purple-900/50 p-4 rounded-2xl rounded-tl-sm flex gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-[#0f172a]/80 border-t border-purple-900/30">
            <div className="relative">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="상담할 내용을 입력하세요..."
                className="w-full bg-[#1e293b] border border-purple-900/50 rounded-full py-4 pl-6 pr-14 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-500 disabled:opacity-50 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </PresentationShell>
  );
}
