import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PresentationShell from '../components/PresentationShell';
import { Upload, ScanLine, FileJson, Database } from 'lucide-react';

export default function DemoKbobOcrActivity(props) {
  const [scanState, setScanState] = useState('idle');

  const handleUpload = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('done');
    }, 4000); // 4 seconds of scanning
  };

  return (
    <PresentationShell 
      step="5" 
      title="5. 시험지 OCR 시스템"
      subtitle="백엔드 이미지 파이프라인"
      storyText="산더미 같은 종이 시험지와 교재를 일일이 타이핑하지 않고 문항만 쏙쏙 뽑아내는 데이터화 안목"
      actionText="Vision 백엔드 엔진 스캐닝"
      actionColor="#F59E0B"
      {...props}
    >
      <div className="flex bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-orange-900/50 w-full max-w-4xl" style={{ height: '480px' }}>
        
        {/* Left: Upload Area */}
        <div className="w-1/2 p-8 flex flex-col justify-center items-center border-r border-slate-800 bg-slate-950 relative overflow-hidden">
          {scanState === 'scanning' && (
            <motion.div 
              initial={{ top: '-10%' }} animate={{ top: '110%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute w-full h-8 bg-gradient-to-b from-transparent via-orange-500/50 to-orange-500/10 shadow-[0_5px_20px_rgba(245,158,11,0.5)] z-10 blur-sm pointer-events-none"
            />
          )}

          <div className={`w-full max-w-xs aspect-[3/4] bg-white rounded shadow-lg relative p-4 pointer-events-none ${scanState === 'scanning' ? 'opacity-80' : ''}`}>
             <div className="w-1/2 h-2 bg-slate-300 rounded mb-4"></div>
             <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
             <div className="w-5/6 h-2 bg-slate-200 rounded mb-6"></div>
             <div className="w-1/3 h-10 border border-slate-300 rounded mb-6 flex items-center justify-center text-slate-400 font-serif">A</div>
             <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
             <div className="w-4/5 h-2 bg-slate-200 rounded mb-2"></div>
             <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
          </div>

          <AnimatePresence>
            {scanState === 'idle' && (
              <motion.button 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleUpload}
                className="absolute inset-x-8 bottom-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 transition-transform"
              >
                <Upload size={18} /> 시험지 사진 업로드
              </motion.button>
            )}
            
            {scanState === 'scanning' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-x-8 bottom-8 p-4 bg-slate-800 border border-orange-500/50 rounded-lg flex items-center gap-3 backdrop-blur-md"
              >
                <ScanLine className="text-orange-500 animate-pulse" />
                <div className="flex-1">
                  <div className="text-xs text-orange-400 font-bold mb-1">OCR Processing...</div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-orange-500" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 4 }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Data Output */}
        <div className="w-1/2 bg-[#1e1e1e] flex flex-col relative">
          <header className="bg-slate-800 p-3 border-b border-slate-700 flex items-center gap-2">
            <Database size={16} className="text-orange-400" />
            <span className="text-slate-300 font-mono text-sm">Extracted JSON Data</span>
          </header>
          
          <div className="flex-1 p-6 overflow-y-auto font-mono text-xs text-slate-300">
            {scanState === 'idle' && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <FileJson size={48} className="mb-4 opacity-50" />
                <p>문서가 업로드되면 추출된 데이터 구조가 여기에 표시됩니다.</p>
              </div>
            )}
            
            {scanState === 'scanning' && (
              <div className="h-full flex items-center justify-center text-orange-500/50">
                <span className="animate-pulse">Parsing syntax tree...</span>
              </div>
            )}

            {scanState === 'done' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
<pre className="whitespace-pre-wrap leading-relaxed text-[#d4d4d4]">
<span className="text-[#569cd6]">{"{"}</span>
  <span className="text-[#9cdcfe]">"documentId"</span>: <span className="text-[#ce9178]">"EXAM_2026_03_A"</span>,
  <span className="text-[#9cdcfe]">"status"</span>: <span className="text-[#ce9178]">"SUCCESS"</span>,
  <span className="text-[#9cdcfe]">"questions"</span>: <span className="text-[#569cd6]">{"["}</span>
    <span className="text-[#569cd6]">{"{"}</span>
      <span className="text-[#9cdcfe]">"number"</span>: <span className="text-[#b5cea8]">1</span>,
      <span className="text-[#9cdcfe]">"type"</span>: <span className="text-[#ce9178]">"Multiple_Choice"</span>,
      <span className="text-[#9cdcfe]">"passage"</span>: <span className="text-[#ce9178]">"In the modern era..."</span>,
      <span className="text-[#9cdcfe]">"options"</span>: <span className="text-[#569cd6]">{"["}</span>
        <span className="text-[#ce9178]">"(A) Technology is..."</span>,
        <span className="text-[#ce9178]">"(B) Climate change..."</span>
      <span className="text-[#569cd6]">{"]"}</span>
    <span className="text-[#569cd6]">{"}"}</span>
  <span className="text-[#569cd6]">{"]"}</span>
<span className="text-[#569cd6]">{"}"}</span>
</pre>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </PresentationShell>
  );
}
