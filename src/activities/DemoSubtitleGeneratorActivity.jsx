import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PresentationShell from '../components/PresentationShell';
import { PlaySquare, Download, Terminal, Video } from 'lucide-react';

export default function DemoSubtitleGeneratorActivity(props) {
  const [genState, setGenState] = useState('idle'); // idle -> downloading -> transcribing -> done
  const [logs, setLogs] = useState([]);

  const addLog = (msg, delay) => {
    setTimeout(() => {
      setLogs(prev => [...prev, msg]);
    }, delay);
  };

  const handleGenerate = () => {
    setGenState('downloading');
    setLogs(['[SYSTEM] Initializing Python backend...']);
    
    addLog('[INFO] Loading model: faster-whisper (large-v3)', 800);
    addLog('[INFO] Downloading YouTube audio streams...', 1500);
    
    setTimeout(() => setGenState('transcribing'), 2500);

    addLog('[PROCESSING] Starting VAD (Voice Activity Detection)', 3000);
    addLog('[TRANSCRIPTION] 00:00:01 - "Hello everyone..."', 4000);
    addLog('[TRANSCRIPTION] 00:00:04 - "Today we are going to learn..."', 5000);
    
    setTimeout(() => {
      addLog('[SUCCESS] subtitles.srt generated successfully.', 6000);
      setGenState('done');
    }, 6500);
  };

  return (
    <PresentationShell 
      step="6" 
      title="6. 자막 생성 컨트롤 타워"
      subtitle="Python 및 Hugging Face 연동"
      storyText="학생들이 듣고 따라하기 편하도록 영상의 자막 타이밍을 완벽하게 끊어주는 호흡의 감각"
      actionText="로컬 Python AI 모델 가동"
      actionColor="#EF4444"
      {...props}
    >
      <div className="flex flex-col bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-red-900/50 w-full max-w-4xl" style={{ height: '500px' }}>
        
        {/* Top: Gradio style UI */}
        <div className="bg-slate-800 p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
              <Video className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Dark Moon Subtitler</h3>
              <p className="text-slate-400 text-xs text-mono">Powered by faster-whisper & Gradio</p>
            </div>
          </div>

          <div className="flex gap-4">
            <input 
              type="text" 
              value="https://youtube.com/watch?v=english_lesson"
              disabled 
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 rounded px-4 py-3 opacity-70"
            />
            <button 
              onClick={handleGenerate}
              disabled={genState !== 'idle'}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              <PlaySquare size={18} /> Generate Subtitles
            </button>
          </div>
        </div>

        {/* Bottom: Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Output Video Area */}
          <div className="w-1/2 p-6 flex flex-col items-center justify-center border-r border-slate-700 relative bg-black">
            <AnimatePresence>
              {genState === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-slate-600 flex flex-col items-center">
                   <Video size={48} className="mb-4 opacity-50" />
                   <p>영상 URL을 입력하고 생성을 누르세요</p>
                </motion.div>
              )}

              {(genState === 'downloading' || genState === 'transcribing') && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative w-full aspect-video border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-slate-700 border-t-red-500 rounded-full animate-spin"></div>
                   </div>
                </motion.div>
              )}

              {genState === 'done' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center">
                   <div className="w-full aspect-video bg-slate-800 rounded-lg relative overflow-hidden group">
                      {/* Fake video thumbnail */}
                      <div className="absolute inset-0 bg-slate-800 opacity-50"></div>
                      
                      {/* Fake Subtitle */}
                      <div className="absolute bottom-6 inset-x-0 text-center">
                        <span className="bg-black/80 text-white px-3 py-1 font-bold rounded text-lg border border-red-500/30">
                          Hello everyone! Welcome to...
                        </span>
                      </div>
                   </div>
                   <button className="mt-6 w-full py-3 bg-red-900/40 hover:bg-red-900/60 border border-red-500/50 text-red-200 font-bold rounded flex items-center justify-center gap-2 transition-colors">
                     <Download size={18} /> Download SRT file
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Terminal / Logs Area */}
          <div className="w-1/2 bg-[#0B0B0B] p-4 font-mono text-xs overflow-y-auto flex flex-col">
            <div className="flex items-center gap-2 text-slate-500 mb-4 border-b border-slate-800 pb-2">
              <Terminal size={14} /> <span>Backend Console</span>
            </div>
            <div className="space-y-2">
              {logs.map((log, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${log.includes('INFO') ? 'text-blue-400' : log.includes('PROCESSING') ? 'text-orange-400' : log.includes('SUCCESS') ? 'text-green-400' : 'text-slate-300'}`}
                >
                  {log}
                </motion.div>
              ))}
              {genState !== 'idle' && genState !== 'done' && (
                <div className="flex items-center gap-1 mt-2 text-slate-600">
                  <div className="w-1 h-3 bg-red-500 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PresentationShell>
  );
}
