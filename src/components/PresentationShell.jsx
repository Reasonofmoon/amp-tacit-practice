import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

const springTransition = { type: 'spring', mass: 0.5, damping: 12, stiffness: 100 };

export default function PresentationShell({ 
  step, 
  title, 
  subtitle, 
  storyText, 
  actionText = "형식지 변환 엔진 가동", 
  actionColor = "#3B82F6",
  children,
  onBack,
  complete,
  xpReward = 50
}) {
  const [phase, setPhase] = useState('story'); 

  const startTransition = () => {
    setPhase('transition');
    setTimeout(() => {
      setPhase('demo');
    }, 2500);
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
                  "{storyText}"
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

          {/* Phase 2: Transition / Loader */}
          {phase === 'transition' && (
            <motion.div 
              key="transition"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', zIndex: 20 }}
            >
              <motion.div 
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid ' + actionColor, borderTopColor: 'transparent', marginBottom: '32px' }} 
              />
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ color: '#94a3b8', fontFamily: 'var(--font-mono, monospace)', fontSize: '1.25rem', letterSpacing: '2px', textTransform: 'uppercase' }}
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
                   <CheckCircle size={20} /> 체험 완료 (+{xpReward} XP)
                 </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
