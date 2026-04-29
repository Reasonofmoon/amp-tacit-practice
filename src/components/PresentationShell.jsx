import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Eye, EyeOff } from 'lucide-react';

const springTransition = { type: 'spring', mass: 0.5, damping: 12, stiffness: 100 };

const SECI_STEPS = [
  { icon: '🧠', label: '암묵지 (Tacit Knowledge)', sub: '경험으로 체화된 직관…' },
  { icon: '💬', label: '프롬프트 (Prompt)', sub: 'AI가 이해하는 언어로 번역…' },
  { icon: '⚙️', label: '코드 (Code)', sub: '로직으로 구조화…' },
  { icon: '🚀', label: '앱 (Application)', sub: '누구나 사용할 수 있는 도구!' },
];

export default function PresentationShell({ 
  step, 
  title, 
  subtitle, 
  storyText,
  speakerNotes,
  actionText = "형식지 변환 엔진 가동", 
  actionColor = "#3B82F6",
  children,
  onBack,
  complete,
  xpReward = 50
}) {
  const [phase, setPhase] = useState('story'); 
  const [showNotes, setShowNotes] = useState(false);
  const [seciStep, setSeciStep] = useState(0);

  // P key toggle for presenter notes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        setShowNotes(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startTransition = () => {
    setPhase('transition');
    setSeciStep(0);
    // Animate through SECI steps
    const timer1 = setTimeout(() => setSeciStep(1), 800);
    const timer2 = setTimeout(() => setSeciStep(2), 1600);
    const timer3 = setTimeout(() => setSeciStep(3), 2400);
    const timer4 = setTimeout(() => setPhase('demo'), 3400);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); };
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, 
      backgroundColor: '#050a1a', color: '#ffffff', display: 'flex', flexDirection: 'column', 
      overflow: 'hidden', fontFamily: 'var(--font-sans, sans-serif)', 
      backgroundImage: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)' 
    }}>
      
      {/* Top Header */}
      <header style={{ 
        height: '64px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.1)', 
        backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 30 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ 
            padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', 
            letterSpacing: '1px', borderRadius: '9999px', backgroundColor: actionColor, color: 'white', 
            border: '1px solid rgba(255,255,255,0.2)' 
          }}>
            Lv.{step} APP
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            {title}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes(prev => !prev)}
            title="발표자 노트 (P키)"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px',
              backgroundColor: showNotes ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: showNotes ? '#60a5fa' : '#94a3b8', border: '1px solid transparent', cursor: 'pointer',
              transition: 'all 0.2s', fontSize: '0.8rem', fontWeight: 500
            }}
          >
            {showNotes ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>노트</span>
          </button>
          <button 
            onClick={onBack} 
            style={{ 
               display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', 
               backgroundColor: 'transparent', color: '#94a3b8', border: '1px solid transparent', cursor: 'pointer', 
               transition: 'all 0.2s', fontSize: '0.875rem', fontWeight: 500 
            }} 
            onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; }} 
            onMouseOut={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <X size={18} />
            <span>쇼케이스 종료</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          
          {/* Phase 1: Cinematic Typemotion */}
          {phase === 'story' && (
            <motion.div 
              key="story"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}
              transition={springTransition}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}
            >
              <div style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '48px' }}>
                <motion.p 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springTransition, delay: 0.2 }}
                  style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: actionColor, margin: 0 }}
                >
                  {subtitle}
                </motion.p>
                <motion.h3 
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springTransition, delay: 0.4 }}
                  style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.3, color: '#f8fafc', margin: 0, textShadow: '0 10px 30px rgba(0,0,0,0.5)', letterSpacing: '-1px' }}
                >
                  &ldquo;{storyText}&rdquo;
                </motion.h3>
                
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...springTransition, delay: 0.8 }}
                  whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${actionColor}80` }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startTransition}
                  style={{ 
                    marginTop: '24px', padding: '16px 40px', borderRadius: '9999px', color: 'white', fontSize: '1.25rem', 
                    fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '12px', 
                    background: `linear-gradient(135deg, ${actionColor}, #020617)`, cursor: 'pointer', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  <span>✨</span> {actionText}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Phase 2: SECI Transition — 4-Step Animation */}
          {phase === 'transition' && (
            <motion.div 
              key="transition"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', zIndex: 20, gap: '48px' }}
            >
              {/* SECI Step Indicators */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                {SECI_STEPS.map((s, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                      opacity: i <= seciStep ? 1 : 0.2, 
                      scale: i <= seciStep ? 1 : 0.8,
                      y: i === seciStep ? -8 : 0
                    }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    style={{ 
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                      padding: '24px', borderRadius: '16px', minWidth: '140px',
                      background: i === seciStep ? `${actionColor}20` : 'transparent',
                      border: i === seciStep ? `2px solid ${actionColor}` : '2px solid transparent',
                      transition: 'background 0.3s, border 0.3s'
                    }}
                  >
                    <span style={{ fontSize: '2.5rem' }}>{s.icon}</span>
                    <strong style={{ fontSize: '0.95rem', color: i <= seciStep ? '#f8fafc' : '#475569' }}>{s.label}</strong>
                    <span style={{ fontSize: '0.75rem', color: i <= seciStep ? '#94a3b8' : '#334155' }}>{s.sub}</span>
                  </motion.div>
                ))}
              </div>

              {/* Connection arrows */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {[0,1,2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ opacity: i < seciStep ? 1 : 0.2, color: i < seciStep ? actionColor : '#334155' }}
                    style={{ fontSize: '1.5rem', fontWeight: 700 }}
                  >
                    →
                  </motion.span>
                ))}
              </div>

              {/* Bottom label */}
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ color: '#94a3b8', fontFamily: 'var(--font-mono, monospace)', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase' }}
              >
                Deploying Knowledge Asset...
              </motion.div>
            </motion.div>
          )}

          {/* Phase 3: Demo Output */}
          {phase === 'demo' && (
            <motion.div 
              key="demo"
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={springTransition}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#000', zIndex: 10 }}
            >
              {children}

              {/* Float Complete Button */}
              <div style={{ position: 'absolute', bottom: '24px', right: '24px', zIndex: 50 }}>
                 <motion.button 
                   whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                   onClick={() => complete({ activityData: { isChecked: true }, bonusXp: xpReward })}
                   style={{ 
                     display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#10b981', 
                     color: 'white', fontWeight: 700, borderRadius: '9999px', border: '1px solid rgba(16,185,129,0.5)', 
                     cursor: 'pointer', boxShadow: '0 0 20px rgba(16,185,129,0.4)', fontSize: '1rem' 
                   }}
                 >
                   <CheckCircle size={20} /> 체험 완료 (+{xpReward} 페이지)
                 </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Speaker Notes Panel (toggleable with P key) */}
      <AnimatePresence>
        {showNotes && speakerNotes && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
              background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)',
              borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 32px',
              maxHeight: '25vh', overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>🎤</span>
              <div>
                <p style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', fontWeight: 700 }}>
                  발표자 노트 (청중에게는 보이지 않습니다)
                </p>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#e2e8f0', margin: 0 }}>
                  {speakerNotes}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
