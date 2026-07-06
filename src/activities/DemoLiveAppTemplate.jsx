import { useEffect, useRef, useState } from 'react';
import PresentationShell from '../components/PresentationShell';
import { ExternalLink, Github, Lock } from 'lucide-react';
import { SHOWCASE_ACTIVITIES } from '../data/showcaseActivities';

export default function DemoLiveAppTemplate(props) {
  const activity = SHOWCASE_ACTIVITIES.find(a => a.id === props.id);
  const frameLoadedRef = useRef(false);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);
  const [showFrameFallback, setShowFrameFallback] = useState(false);

  useEffect(() => {
    frameLoadedRef.current = false;

    const fallbackTimer = window.setTimeout(() => {
      if (!frameLoadedRef.current) {
        setShowFrameFallback(true);
      }
    }, 7000);

    return () => window.clearTimeout(fallbackTimer);
  }, [activity?.url]);

  if (!activity) return null;

  const stepNumber = activity.title.split('.')[0];

  return (
    <PresentationShell
      step={stepNumber} 
      title={activity.title} 
      subtitle={activity.subtitle} 
      storyText={activity.storyText} 
      speakerNotes={activity.speakerNotes}
      actionText="라이브 웹앱 접속하기" 
      actionColor={activity.color} 
      {...props}
    >
      <div style={{ flex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1e293b' }}>
        
        {/* Safari/Mac-like Top Navigation Bar */}
        <div style={{ 
          height: '48px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '0 16px', backgroundImage: 'linear-gradient(to bottom, #2a364a, #1e293b)', 
          borderBottom: '1px solid rgba(0,0,0,0.8)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 20 
        }}>
          
          {/* Mac window controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, width: '120px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ff5f56', border: '1px solid rgba(0,0,0,0.2)' }}></div>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#ffbd2e', border: '1px solid rgba(0,0,0,0.2)' }}></div>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#27c93f', border: '1px solid rgba(0,0,0,0.2)' }}></div>
          </div>
          
          {/* URL Bar */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: '600px', padding: '0 16px' }}>
             <div style={{ 
               width: '100%', backgroundColor: '#0f172a', color: '#cbd5e1', fontSize: '13px', 
               fontFamily: 'var(--font-mono, monospace)', padding: '6px 16px', borderRadius: '8px', 
               border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)', 
               display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '8px', 
               overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' 
             }}>
                <Lock size={12} style={{ color: '#10b981', opacity: 0.8 }} /> 
                {activity.url}
             </div>
          </div>

          {/* External Link */}
          <div style={{ flexShrink: 0, minWidth: '220px', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
            {activity.repoUrl && (
              <a
                href={activity.repoUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px',
                  backgroundColor: 'rgba(15,23,42,0.55)', color: '#cbd5e1', fontSize: '12px',
                  fontWeight: 700, borderRadius: '6px', textDecoration: 'none', border: '1px solid rgba(148,163,184,0.24)',
                  transition: 'background 0.2s'
                }}
              >
                <Github size={14} /> <span style={{ display: 'inline-block' }}>Repo</span>
              </a>
            )}
            <a 
              href={activity.url} target="_blank" rel="noopener noreferrer"
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', 
                backgroundColor: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontSize: '12px', 
                fontWeight: 700, borderRadius: '6px', textDecoration: 'none', border: '1px solid rgba(59,130,246,0.2)', 
                transition: 'background 0.2s' 
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.2)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.1)'}
            >
              <ExternalLink size={14} /> <span style={{ display: 'inline-block' }}>새 창 열기</span>
            </a>
            {activity.extraLinks?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.password ? `${link.label} 비밀번호: ${link.password}` : link.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px',
                  backgroundColor: `${activity.color}22`, color: '#e0f2fe', fontSize: '12px',
                  fontWeight: 800, borderRadius: '6px', textDecoration: 'none', border: `1px solid ${activity.color}66`,
                  transition: 'background 0.2s'
                }}
              >
                <ExternalLink size={14} /> <span style={{ display: 'inline-block' }}>{link.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Live Iframe View */}
        <div style={{ flex: 1, position: 'relative', backgroundColor: '#ffffff' }}>
          {activity.embedDisabled ? (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              background: 'linear-gradient(135deg, #0f172a, #111827)',
              color: '#e5e7eb',
              textAlign: 'center',
            }}>
              <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                <span style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: `${activity.color}22`,
                  border: `1px solid ${activity.color}66`,
                  fontSize: '28px',
                }}>
                  {activity.icon}
                </span>
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.5rem', color: '#ffffff' }}>
                    별도 탭에서 확인하세요
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', lineHeight: 1.7 }}>
                    이 데모는 Vercel 보안 정책 때문에 쇼케이스 안쪽 미리보기 대신 새 창에서 여는 방식으로 보여줍니다.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a
                    href={activity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      backgroundColor: activity.color,
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    <ExternalLink size={16} /> 새 창 열기
                  </a>
                  {activity.repoUrl && (
                    <a
                      href={activity.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(15,23,42,0.92)',
                        border: '1px solid rgba(148,163,184,0.32)',
                        color: '#e5e7eb',
                        fontSize: '14px',
                        fontWeight: 800,
                        textDecoration: 'none',
                      }}
                    >
                      <Github size={16} /> Repo
                    </a>
                  )}
                  {activity.extraLinks?.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        backgroundColor: `${activity.color}22`,
                        border: `1px solid ${activity.color}66`,
                        color: '#e0f2fe',
                        fontSize: '14px',
                        fontWeight: 800,
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={16} /> {link.label}
                    </a>
                  ))}
                </div>
                {activity.extraLinks?.some((link) => link.password) && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(15,23,42,0.74)',
                    border: '1px solid rgba(148,163,184,0.24)',
                    color: '#cbd5e1',
                    fontSize: '13px',
                    lineHeight: 1.55,
                  }}>
                    {activity.extraLinks
                      .filter((link) => link.password)
                      .map((link) => (
                        <span key={`${link.url}-password`}>
                          <strong style={{ color: '#ffffff' }}>{link.label}</strong> 화면 비번: <code style={{ color: '#67e8f9', fontWeight: 800 }}>{link.password}</code>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {!isFrameLoaded && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 5, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '14px', background: '#f8fafc',
                  color: '#0f172a', textAlign: 'center', padding: '24px'
                }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '999px', border: `3px solid ${activity.color}30`, borderTopColor: activity.color, animation: 'spin 0.9s linear infinite' }} />
                  <strong style={{ fontSize: '1rem' }}>{activity.title} 로딩 중</strong>
                  {showFrameFallback && (
                    <a
                      href={activity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
                        borderRadius: '8px', color: '#fff', background: activity.color, fontWeight: 700,
                        textDecoration: 'none', boxShadow: `0 10px 24px ${activity.color}40`
                      }}
                    >
                      새 창에서 열기 <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              )}
              <iframe
                src={activity.url}
                title={activity.title}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent' }}
                allow="fullscreen; clipboard-read; clipboard-write"
                sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                loading="lazy"
                onLoad={() => {
                  frameLoadedRef.current = true;
                  setIsFrameLoaded(true);
                  setShowFrameFallback(false);
                }}
                onError={() => setShowFrameFallback(true)}
              />
            </>
          )}
        </div>
      </div>
    </PresentationShell>
  );
}
