import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PresentationShell from '../components/PresentationShell';
import { Users, LayoutDashboard, Calendar, DollarSign, Target, UserCheck } from 'lucide-react';
import { SHOWCASE_ACTIVITIES } from '../data/showcaseActivities';

export default function DemoAcademyOsActivity(props) {
  const activity = SHOWCASE_ACTIVITIES.find((item) => item.id === props.id);
  const stepNumber = activity?.title?.split('.')[0] ?? '8';
  const [role, setRole] = useState('director'); // director, teacher, student

  const layoutVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(5px)' },
    visible: { 
      opacity: 1, scale: 1, filter: 'blur(0px)',
      transition: { duration: 0.3, staggerChildren: 0.1 } 
    },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(5px)', transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PresentationShell 
      step={stepNumber}
      title={activity?.title ?? "8. Academy OS"}
      subtitle={activity?.subtitle ?? "운영 대시보드"}
      storyText={activity?.storyText ?? "출결, 수납, 진도, 과제를 한 번에 꿰뚫어 보며 학원 운영의 누수를 막는 원장의 뇌내 멀티태스킹"}
      speakerNotes={activity?.speakerNotes}
      actionText="Academy OS 백엔드 대시보드 마이그레이션"
      actionColor={activity?.color ?? "#EC4899"}
      {...props}
    >
      <div className="flex flex-col bg-[#0F172A] rounded-xl overflow-hidden shadow-2xl border border-pink-900/40 w-full max-w-5xl" style={{ height: '550px' }}>
        
        {/* Top Navbar */}
        <header className="bg-[#1E293B] border-b border-pink-900/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-[0_0_10px_rgba(236,72,153,0.5)]">
               <LayoutDashboard size={18} className="text-white" />
            </div>
            <h2 className="text-white font-bold text-xl tracking-wide">Academy OS</h2>
          </div>

          {/* Role Switcher */}
          <div className="flex p-1 bg-[#0F172A] rounded-lg border border-[#334155]">
            {[
              { id: 'director', label: '원장 (Director)' },
              { id: 'teacher', label: '강사 (Teacher)' },
              { id: 'student', label: '학생 (Student)' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                  role === r.id 
                    ? 'bg-pink-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#020617]">
          <AnimatePresence mode="wait">
            
            {/* DIRECTOR VIEW */}
            {role === 'director' && (
              <motion.div key="director" variants={layoutVariants} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-3 gap-6 h-full">
                <motion.div variants={itemVariants} className="col-span-2 bg-[#1E293B]/80 border border-slate-700/50 rounded-xl p-5 flex flex-col">
                  <h3 className="text-slate-300 font-bold mb-4 flex items-center gap-2"><DollarSign size={18} className="text-pink-500"/>이번 달 통합 매출</h3>
                  <div className="flex-1 flex items-end justify-between gap-2 px-4 pb-2">
                    {/* Fake bar chart */}
                    {[40, 60, 45, 80, 50, 90, 100].map((h, i) => (
                       <div key={i} className="w-full bg-pink-500/20 rounded-t-sm" style={{ height: `${h}%` }}>
                          <div className="w-full bg-pink-500 rounded-t-sm" style={{ height: '4px' }} />
                       </div>
                    ))}
                  </div>
                </motion.div>
                <div className="flex flex-col gap-6">
                  <motion.div variants={itemVariants} className="flex-1 bg-[#1E293B]/80 border border-slate-700/50 rounded-xl p-5">
                    <h3 className="text-slate-300 font-bold mb-2 flex items-center gap-2"><UserCheck size={18} className="text-emerald-500"/>오늘 결석률</h3>
                    <div className="text-4xl font-bold text-white mt-4">2.4%</div>
                    <div className="text-xs text-emerald-400 mt-2">▼ 어제 대비 1.1% 감소</div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="flex-1 bg-gradient-to-br from-pink-900/50 to-rose-900/30 border border-pink-500/30 rounded-xl p-5">
                    <h3 className="text-pink-200 font-bold mb-2 flex items-center gap-2"><Target size={18} />미납자 알림</h3>
                    <button className="w-full mt-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded font-bold text-sm shadow-lg transition-colors">전체 문자 전송 (12명)</button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* TEACHER VIEW */}
            {role === 'teacher' && (
              <motion.div key="teacher" variants={layoutVariants} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-2 gap-6 h-full">
                <motion.div variants={itemVariants} className="bg-[#1E293B]/80 border border-slate-700/50 rounded-xl p-5 overflow-hidden flex flex-col">
                  <h3 className="text-slate-300 font-bold mb-4 flex items-center gap-2"><Calendar size={18} className="text-cyan-500"/>오늘의 시간표</h3>
                  <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {['14:00 - 중1 내신대비반 (A강의실)', '16:00 - 초6 영문법 (B강의실)', '18:00 - 고1 수능기초 (A강의실)', '20:00 - 고2 심화 (원장실)'].map((cls, i) => (
                      <div key={i} className="bg-slate-800/80 p-3 rounded border border-slate-700 text-sm text-slate-300 flex justify-between items-center">
                        <span>{cls}</span>
                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-[#1E293B]/80 border border-slate-700/50 rounded-xl p-5 flex flex-col">
                  <h3 className="text-slate-300 font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-orange-500"/>과제 제출 현황</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#334155" strokeWidth="15" />
                        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="15" strokeDasharray="251" strokeDashoffset="50" strokeLinecap="round" className="transform -rotate-90 origin-center" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold">
                        <span className="text-3xl">80%</span>
                        <span className="text-xs text-slate-400">제출률</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* STUDENT VIEW */}
            {role === 'student' && (
              <motion.div key="student" variants={layoutVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full">
                <motion.div variants={itemVariants} className="w-full max-w-md bg-gradient-to-b from-blue-900/40 to-[#1E293B] border border-blue-500/30 rounded-2xl p-8 text-center shadow-2xl">
                  <div className="w-24 h-24 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-20 h-20" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">김지민 학생, 환영해요!</h2>
                  <p className="text-blue-300 mb-8">오늘 완료해야 할 과제가 2개 있습니다.</p>
                  
                  <div className="space-y-4">
                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      <Target size={18} /> 오늘 과제 하러가기
                    </button>
                    <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                      <LayoutDashboard size={18} /> 내 학습 리포트 보기
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
      `}</style>
    </PresentationShell>
  );
}
