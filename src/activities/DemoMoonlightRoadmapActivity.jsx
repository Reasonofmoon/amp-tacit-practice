import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PresentationShell from '../components/PresentationShell';
import { Github, Play, ExternalLink, CheckCircle } from 'lucide-react';

export default function DemoMoonlightRoadmapActivity(props) {
  const [deployState, setDeployState] = useState('idle'); // idle -> building -> deployed
  
  const handleDeploy = () => {
    setDeployState('building');
    setTimeout(() => {
      setDeployState('deployed');
    }, 3000);
  };

  return (
    <PresentationShell 
      step="1" 
      title="1. 홈페이지 첫 배포 (Moonlight Roadmap)"
      subtitle="가장 쉬운 Vercel 클릭 배포"
      storyText="우리 학원만의 훌륭한 로드맵 커리큘럼을 학부모에게 세련되게 보여주고 싶은 마음"
      actionText="Vercel 배포 스크립트 실행"
      actionColor="#22D3EE"
      {...props}
    >
      <div className="flex bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 w-full max-w-4xl" style={{ height: '450px' }}>
        
        {/* Sidebar */}
        <div className="w-64 bg-slate-950 p-6 flex flex-col gap-6 border-r border-slate-800">
          <div className="flex items-center gap-3 text-cyan-400 font-bold text-xl">
            <span className="text-2xl">▲</span> Vercel Mock
          </div>
          <div className="space-y-4 text-slate-400 text-sm">
            <div className="font-semibold text-slate-300">New Project</div>
            <div className="flex items-center gap-2 text-cyan-400"><Github size={16} /> Import Git Repository</div>
            <div className="flex items-center gap-2"><Play size={16} /> Deployments</div>
            <div className="flex items-center gap-2"><ExternalLink size={16} /> Domains</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
          
          <AnimatePresence mode="wait">
            {deployState === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md bg-slate-800/80 backdrop-blur-md p-6 rounded-xl border border-slate-700 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Github className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">moonlight-roadmap</h3>
                    <p className="text-slate-400 text-sm">Reasonofmoon / moonlight-roadmap-master</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Project Name</label>
                    <input type="text" value="moonlight-academy-roadmap" disabled className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-300" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase font-semibold">Framework Preset</label>
                    <input type="text" value="Next.js" disabled className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-slate-300" />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeploy}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-md transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                >
                  Deploy
                </motion.button>
              </motion.div>
            )}

            {deployState === 'building' && (
              <motion.div 
                key="building"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-6"
              >
                <div className="w-20 h-20 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Building...</h3>
                  <p className="text-cyan-400 font-mono text-sm">Running build command 'npm run build'</p>
                </div>
                <div className="w-80 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  />
                </div>
              </motion.div>
            )}

            {deployState === 'deployed' && (
              <motion.div 
                key="deployed"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center max-w-lg"
              >
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle size={40} />
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4">Congratulations!</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  원장님의 학원 로드맵 홈페이지가 성공적으로 전 세계에 배포되었습니다. 이제 학부모님들께 공유해보세요!
                </p>
                
                <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-lg flex items-center gap-4 w-full justify-between">
                  <div className="text-left">
                    <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Domain</div>
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
                      moonlight-academy-roadmap.vercel.app <ExternalLink size={14} />
                    </a>
                  </div>
                  <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-white text-sm font-medium transition-colors">
                    Visit Site
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </PresentationShell>
  );
}
