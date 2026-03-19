import React from 'react';
import PresentationShell from '../components/PresentationShell';
import { ExternalLink, Lock } from 'lucide-react';
import { SHOWCASE_ACTIVITIES } from '../data/showcaseActivities';

export default function DemoLiveAppTemplate(props) {
  const activity = SHOWCASE_ACTIVITIES.find(a => a.id === props.id);
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
          <div style={{ flexShrink: 0, width: '120px', display: 'flex', justifyContent: 'flex-end' }}>
            <a 
              href={activity.url} target="_blank" rel="noreferrer"
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
          </div>
        </div>

        {/* Live Iframe View */}
        <div style={{ flex: 1, position: 'relative', backgroundColor: '#ffffff' }}>
          <iframe 
            src={activity.url} 
            title={activity.title}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent' }}
            allow="camera; microphone; fullscreen; clipboard-read; clipboard-write; display-capture"
            loading="lazy"
          />
        </div>
      </div>
    </PresentationShell>
  );
}
