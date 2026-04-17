import React, { useState, useRef } from 'react';
import { Play, Pause, Maximize2, Download, Film, Clock, Layers } from 'lucide-react';

/**
 * PromoGallery — Showcases all Remotion-rendered AMP keynote motion graphics.
 * Videos are served from /videos/ folder (rendered MP4s from remo-motion-graphic).
 */

const VIDEO_SETS = [
  {
    id: 'opener',
    title: '키노트 오프닝',
    subtitle: 'Keynote Opener',
    description: '"여러분은 무엇을 알고 있습니까?"로 시작하여 암묵지의 정의와 80~90% 통계까지. 발표 시작 직전에 사용하세요.',
    duration: '~28초',
    slideCount: 15,
    src: '/videos/amp-opener.mp4',
    color: '#6366F1',
    icon: '🎬',
    tags: ['Opening', 'Hook', 'Tacit Knowledge'],
  },
  {
    id: 'seci',
    title: 'SECI 모델',
    subtitle: 'Knowledge Creation Theory',
    description: '노나카 이쿠지로의 SECI 4단계 모델을 한 영상으로. Socialization → Externalization → Combination → Internalization.',
    duration: '~25초',
    slideCount: 15,
    src: '/videos/amp-seci.mp4',
    color: '#10B981',
    icon: '🔄',
    tags: ['Theory', 'SECI', 'Framework'],
  },
  {
    id: 'pipeline',
    title: '암묵지 → 앱 파이프라인',
    subtitle: '5-Stage Framework',
    description: '경험 회상 → 패턴 인식 → 구조화 → AI 결합 → 앱 구현. 80% 통계 카운터부터 SECI 플로우까지.',
    duration: '~21초',
    slideCount: 11,
    src: '/videos/amp-pipeline.mp4',
    color: '#8B5CF6',
    icon: '⚡',
    tags: ['Pipeline', 'Framework'],
  },
  {
    id: 'episodes',
    title: '8대 앱 에피소드',
    subtitle: '8 App Stories',
    description: 'ReadMaster부터 MoonLang까지, 8개 앱의 핵심 메시지를 키네틱 타이포그래피로. 발표 중간 브리지로 활용.',
    duration: '~52초',
    slideCount: 31,
    src: '/videos/amp-episodes.mp4',
    color: '#EC4899',
    icon: '🎯',
    tags: ['Episodes', '8 Apps', 'Stories'],
  },
  {
    id: 'workshop',
    title: '워크샵 안내',
    subtitle: 'Workshop Intro',
    description: '"이제 여러분의 암묵지를 꺼내 볼 시간"으로 시작. 3대 질문 + 3단계 STEP. 청중 참여 직전에 사용.',
    duration: '~17초',
    slideCount: 11,
    src: '/videos/amp-workshop.mp4',
    color: '#F59E0B',
    icon: '✍️',
    tags: ['Workshop', 'Action'],
  },
  {
    id: 'closer',
    title: '키노트 클로징',
    subtitle: 'Keynote Closer',
    description: '"AI는 당신을 대체하지 않습니다. 증폭합니다." 강력한 마무리 메시지와 감사 인사.',
    duration: '~18초',
    slideCount: 9,
    src: '/videos/amp-closer.mp4',
    color: '#EF4444',
    icon: '🏁',
    tags: ['Closing', 'Thank You'],
  },
  {
    id: 'tutorial-readmaster',
    title: 'ReadMaster 튜토리얼',
    subtitle: 'How to Build · Step by Step',
    description: 'Level 1 ReadMaster 진단 앱을 처음부터 만드는 MECE 가이드. WHY → WHAT → PREPARE → BUILD(4단계) → RESULT → NEXT.',
    duration: '~2분 30초',
    slideCount: 65,
    src: '/videos/amp-tutorial-readmaster.mp4',
    color: '#06B6D4',
    icon: '🎓',
    tags: ['Tutorial', 'MECE', 'ReadMaster', 'Level 1'],
    featured: true,
  },
  {
    id: 'lv1',
    title: 'Level 1 전환',
    subtitle: 'ReadMaster + Pet Trip',
    description: '"클릭 한 번으로 나만의 홈페이지" — 코드를 몰라도 가능한 2가지 앱.',
    duration: '~3초',
    slideCount: 2,
    src: '/videos/amp-lv1.mp4',
    color: '#22C55E',
    icon: '🟢',
    tags: ['Level Card'],
  },
  {
    id: 'lv2',
    title: 'Level 2 전환',
    subtitle: 'SmartStart + Edu Ontology',
    description: '"AI API를 내 앱에 연결하기" — 나만의 기준을 AI에 심는 단계.',
    duration: '~5초',
    slideCount: 3,
    src: '/videos/amp-lv2.mp4',
    color: '#3B82F6',
    icon: '🔵',
    tags: ['Level Card'],
  },
  {
    id: 'lv3',
    title: 'Level 3 전환',
    subtitle: 'Knot + BlueL',
    description: '"나만의 지식 도구 만들기" — 사용자가 직접 만들고 관리하는 앱.',
    duration: '~4초',
    slideCount: 3,
    src: '/videos/amp-lv3.mp4',
    color: '#A855F7',
    icon: '🟣',
    tags: ['Level Card'],
  },
  {
    id: 'lv4',
    title: 'Level 4 전환',
    subtitle: 'Librainy + MoonLang',
    description: '"교육 생태계를 통째로 만들기" — 비즈니스 모델까지 포함하는 종합 시스템.',
    duration: '~5초',
    slideCount: 3,
    src: '/videos/amp-lv4.mp4',
    color: '#EF4444',
    icon: '🔴',
    tags: ['Level Card'],
  },
  {
    id: 'lv5',
    title: 'Level 5 전환',
    subtitle: '碁Vibe',
    description: '"바둑 수순으로 개발을 설계하기" — 마스터 레벨, 전략으로 코딩하다.',
    duration: '~4초',
    slideCount: 2,
    src: '/videos/amp-lv5.mp4',
    color: '#06B6D4',
    icon: '⚫',
    tags: ['Level Card'],
  },
];

const SECTIONS = [
  {
    id: 'main',
    title: '발표 핵심 영상',
    description: '키노트 시작/중간/끝에 배치할 메인 모션 그래픽',
    filter: (v) => ['opener', 'seci', 'pipeline', 'episodes', 'workshop', 'closer'].includes(v.id),
  },
  {
    id: 'tutorial',
    title: '튜토리얼',
    description: '실습용 단계별 가이드 영상',
    filter: (v) => v.id.startsWith('tutorial-'),
  },
  {
    id: 'levels',
    title: '레벨 전환 카드',
    description: '난이도별 섹션 구분용 짧은 브리지 영상',
    filter: (v) => v.id.startsWith('lv'),
  },
];

const VIDEO_STATS = {
  totalVideos: VIDEO_SETS.length,
  totalSlides: VIDEO_SETS.reduce((sum, video) => sum + video.slideCount, 0),
};

function VideoCard({ video, expanded, onToggle }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const togglePlay = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const handleFullscreen = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (v?.requestFullscreen) v.requestFullscreen();
  };

  return (
    <div
      className="card promo-card"
      onClick={onToggle}
      style={{
        cursor: 'pointer',
        borderColor: expanded ? video.color : 'var(--border)',
        borderWidth: expanded ? '2px' : '1px',
        transition: 'all 0.2s',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {video.featured && (
        <span
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: video.color,
            color: 'white',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            zIndex: 2,
          }}
        >
          FEATURED
        </span>
      )}

      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: `linear-gradient(135deg, ${video.color}20, ${video.color}05)`,
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {hasError ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
            <Film size={32} style={{ marginBottom: '8px', opacity: 0.4 }} />
            <p style={{ fontSize: '12px', margin: 0 }}>
              영상 렌더링 대기중
              <br />
              <code style={{ fontSize: '10px' }}>{video.src}</code>
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={video.src}
            preload="metadata"
            playsInline
            muted
            loop
            onError={() => setHasError(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        )}

        {!hasError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: isPlaying ? 'transparent' : 'rgba(0,0,0,0.3)',
              opacity: isPlaying ? 0 : 1,
              transition: 'opacity 0.2s',
              pointerEvents: 'none',
            }}
          >
            <button
              onClick={togglePlay}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: video.color,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                pointerEvents: 'auto',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
              aria-label="Play video"
            >
              <Play size={24} fill="white" color="white" style={{ marginLeft: '4px' }} />
            </button>
          </div>
        )}

        {!hasError && isPlaying && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              display: 'flex',
              gap: '6px',
            }}
          >
            <button
              onClick={togglePlay}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
              }}
              aria-label="Pause"
            >
              <Pause size={16} />
            </button>
            <button
              onClick={handleFullscreen}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.6)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
              }}
              aria-label="Fullscreen"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
        <span style={{ fontSize: '28px' }}>{video.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: video.color }}>{video.title}</h3>
          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {video.subtitle}
          </p>
        </div>
      </div>

      <p
        style={{
          fontSize: '0.85rem',
          lineHeight: 1.5,
          color: 'var(--text)',
          marginBottom: '12px',
          opacity: 0.85,
        }}
      >
        {video.description}
      </p>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginBottom: '10px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} /> {video.duration}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layers size={12} /> {video.slideCount}개 슬라이드
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {video.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '10px',
              background: `${video.color}15`,
              color: video.color,
              border: `1px solid ${video.color}30`,
              fontWeight: 600,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {!hasError && (
        <a
          href={video.src}
          download
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '12px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: '12px',
            textDecoration: 'none',
          }}
        >
          <Download size={12} /> MP4 다운로드
        </a>
      )}
    </div>
  );
}

export default function PromoGallery() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="promo-gallery">
      {/* Stats Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(99,102,241,0.05))',
          borderColor: '#F59E0B40',
          marginBottom: 'var(--space-xl)',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          <Stat label="제작된 영상" value={VIDEO_STATS.totalVideos} unit="개" color="#F59E0B" />
          <Stat label="총 슬라이드" value={VIDEO_STATS.totalSlides} unit="장" color="#6366F1" />
          <Stat label="해상도" value="1920×1080" unit="" color="#10B981" />
          <Stat label="프레임레이트" value="30" unit="fps" color="#EC4899" />
        </div>
        <p style={{ marginTop: '20px', marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          모든 영상은 <strong>Remotion + React</strong>로 제작되었으며, 발표용 MP4 또는 임베드용 컴포넌트로 활용 가능합니다.
        </p>
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => {
        const videos = VIDEO_SETS.filter(section.filter);
        if (videos.length === 0) return null;
        return (
          <section key={section.id} style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h2 style={{ margin: '0 0 6px', fontSize: '1.4rem' }}>{section.title}</h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {section.description}
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: section.id === 'tutorial'
                  ? 'minmax(0, 1fr)'
                  : 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '20px',
              }}
            >
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  expanded={expandedId === video.id}
                  onToggle={() => setExpandedId(expandedId === video.id ? null : video.id)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Footer note */}
      <div
        className="card"
        style={{
          marginTop: 'var(--space-xl)',
          textAlign: 'center',
          background: 'rgba(99,102,241,0.05)',
          borderColor: 'rgba(99,102,241,0.2)',
        }}
      >
        <h3 style={{ margin: '0 0 8px' }}>🛠️ 직접 수정하고 싶다면?</h3>
        <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          모든 영상의 텍스트, 색상, 타이밍은{' '}
          <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
            remo-motion-graphic/remotion/AMPTypoComposition.tsx
          </code>
          {' '}에서 수정할 수 있습니다.
        </p>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
            npm run studio
          </code>
          {' '}로 Remotion Studio를 열어 바로 프리뷰 + 렌더 가능
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, unit, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>
        {value}
        <span style={{ fontSize: '1rem', marginLeft: '4px', opacity: 0.7 }}>{unit}</span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}
