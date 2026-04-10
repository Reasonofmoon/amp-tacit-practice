import React, { Suspense, lazy, useRef, useState } from 'react';
import './index.css';
import confetti from 'canvas-confetti';
import { useGameState } from './hooks/useGameState';
import { ACTIVITIES } from './data/activities';
import { DEV_ACTIVITIES } from './data/developerActivities';
import { AUTOMATION_ACTIVITIES } from './data/automationActivities';
import { SHOWCASE_ACTIVITIES, SHOWCASE_LEVELS } from './data/showcaseActivities';
import { getActivityProgress } from './utils/scoring';
import { playSuccessSound, playFanfareSound } from './utils/sound';
import Layout from './components/Layout';
import ActivityCard from './components/ActivityCard';
import OnboardingOverlay from './components/OnboardingOverlay';
import ModalOverlay from './components/ModalOverlay';
import ErrorBoundary from './components/ErrorBoundary';
const PromoGallery = lazy(() => import('./components/PromoGallery'));
const ResultReport = lazy(() => import('./components/ResultReport'));
const ReportAIWorkbench = lazy(() => import('./components/ReportAIWorkbench'));
const TimelineActivity = lazy(() => import('./activities/TimelineActivity'));
const AutopilotActivity = lazy(() => import('./activities/AutopilotActivity'));
const CrisisActivity = lazy(() => import('./activities/CrisisActivity'));
const TransferActivity = lazy(() => import('./activities/TransferActivity'));
const SeciActivity = lazy(() => import('./activities/SeciActivity'));
const GalleryActivity = lazy(() => import('./activities/GalleryActivity'));
const QuickQuizActivity = lazy(() => import('./activities/QuickQuizActivity'));
const RolePlayActivity = lazy(() => import('./activities/RolePlayActivity'));
const PatternMatchActivity = lazy(() => import('./activities/PatternMatchActivity'));
const NoticingDrillActivity = lazy(() => import('./activities/NoticingDrillActivity'));
const CdmSimulatorActivity = lazy(() => import('./activities/CdmSimulatorActivity'));
const AutoSetupActivity = lazy(() => import('./activities/AutoSetupActivity'));
const AutoScriptActivity = lazy(() => import('./activities/AutoScriptActivity'));
const AutoPropertyActivity = lazy(() => import('./activities/AutoPropertyActivity'));
const AutoCodeActivity = lazy(() => import('./activities/AutoCodeActivity'));
const AutoTriggerActivity = lazy(() => import('./activities/AutoTriggerActivity'));
const DemoLiveAppTemplate = lazy(() => import('./activities/DemoLiveAppTemplate'));

const ACTIVITY_COMPONENTS = {
  // Director Journey
  timeline: TimelineActivity,
  autopilot: AutopilotActivity,
  crisis: CrisisActivity,
  transfer: TransferActivity,
  seci: SeciActivity,
  gallery: GalleryActivity,
  quiz: QuickQuizActivity,
  roleplay: RolePlayActivity,
  pattern: PatternMatchActivity,
  noticing: NoticingDrillActivity,
  cdm: CdmSimulatorActivity,
  // Developer Journey
  dev_timeline: TimelineActivity,
  dev_autopilot: AutopilotActivity,
  dev_crisis: CrisisActivity,
  dev_transfer: TransferActivity,
  dev_seci: SeciActivity,
  dev_gallery: GalleryActivity,
  dev_quiz: QuickQuizActivity,
  dev_roleplay: RolePlayActivity,
  dev_pattern: PatternMatchActivity,
  dev_noticing: NoticingDrillActivity,
  dev_cdm: CdmSimulatorActivity,
  // Automation Journey
  auto_setup: AutoSetupActivity,
  auto_script: AutoScriptActivity,
  auto_property: AutoPropertyActivity,
  auto_code: AutoCodeActivity,
  auto_trigger: AutoTriggerActivity,

  // Showcase Journey (Live URLs)
  demo_readmaster: DemoLiveAppTemplate,
  demo_pettrip: DemoLiveAppTemplate,
  demo_smartstart: DemoLiveAppTemplate,
  demo_ontology: DemoLiveAppTemplate,
  demo_knot: DemoLiveAppTemplate,
  demo_bluel: DemoLiveAppTemplate,
  demo_librainy: DemoLiveAppTemplate,
  demo_moonlang: DemoLiveAppTemplate,
  demo_gidoboard: DemoLiveAppTemplate,
};

function LoadingPanel() {
  return (
    <div className="card" style={{ minHeight: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '999px', border: '3px solid rgba(99, 102, 241, 0.15)', borderTopColor: 'var(--primary)', animation: 'spin 0.9s linear infinite' }} />
      <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>화면을 불러오는 중입니다</strong>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>필요한 활동 청크만 동적으로 로드합니다.</p>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeJourney, setActiveJourney] = useState('director'); // 'director' | 'developer'
  const [aiWorkbenchOpen, setAIWorkbenchOpen] = useState(false);
  const [qrInterstitialOpen, setQrInterstitialOpen] = useState(false);
  const appContentRef = useRef(null);
  const game = useGameState();

  const goHome = () => setCurrentView('home');
  const goReport = () => {
    playFanfareSound();
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setCurrentView('report');
  };

  const ActivityComponent = ACTIVITY_COMPONENTS[currentView] ?? null;

  return (
    <ErrorBoundary>
      <OnboardingOverlay
        open={!game.state.onboardingSeen}
        profile={game.state.profile}
        onChangeProfile={game.updateProfile}
        onClose={game.setOnboardingSeen}
        appRootRef={appContentRef}
      />

      <div ref={appContentRef}>
      <Layout
        currentView={currentView}
        state={game.state}
        levelInfo={game.levelInfo}
        nextLevel={game.nextLevel}
        celebration={game.celebration}
        onGoHome={goHome}
        onGoReport={goReport}
        showReportButton={true}
        activeJourney={activeJourney}
        onToggleJourney={setActiveJourney}
      >
        {currentView === 'home' && activeJourney === 'promo' && (
          <Suspense fallback={<LoadingPanel />}>
            <PromoGallery />
          </Suspense>
        )}

        {currentView === 'home' && activeJourney !== 'promo' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: 'var(--space-md)', fontSize: '2rem' }}>탁월함의 발자취 (Monopoly Path)</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
              각 노드를 클릭해 암묵지 발굴 여정을 진행하세요.
            </p>

            {/* Showcase Progress Bar */}
            {activeJourney === 'showcase' && (() => {
              const total = SHOWCASE_ACTIVITIES.length;
              const done = SHOWCASE_ACTIVITIES.filter(a => game.state.completed.includes(a.id)).length;
              return (
                <div style={{ maxWidth: '600px', margin: '0 auto var(--space-lg)', padding: '16px 24px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>🎯 시연 진행률</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{done} / {total} 완료</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(done / total) * 100}%`, borderRadius: '4px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })()}
            
            <div className="monopoly-board">
              {(activeJourney === 'director' ? ACTIVITIES : 
                activeJourney === 'developer' ? DEV_ACTIVITIES : 
                activeJourney === 'automation' ? AUTOMATION_ACTIVITIES : 
                SHOWCASE_ACTIVITIES).map((activity, index) => {
                const isCompleted = game.state.completed.includes(activity.id);

                // Bridge slide logic for showcase journey
                let bridgeSlide = null;
                if (activeJourney === 'showcase') {
                  const level = SHOWCASE_LEVELS.find(l => l.ids[0] === activity.id);
                  if (level) {
                    bridgeSlide = (
                      <div key={`bridge-${level.level}`} style={{
                        width: '100%', flexBasis: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '12px', padding: '12px 24px', margin: '8px 0',
                        borderRadius: '12px', background: `${level.color}10`, border: `1px dashed ${level.color}40`,
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>{level.icon}</span>
                        <div style={{ textAlign: 'left' }}>
                          <strong style={{ fontSize: '0.85rem', color: level.color, letterSpacing: '1px' }}>{level.label}</strong>
                          <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{level.title}</p>
                        </div>
                      </div>
                    );
                  }
                }

                return (
                  <React.Fragment key={activity.id}>
                    {bridgeSlide}
                    <div className="monopoly-node">
                      <ActivityCard
                        activity={activity}
                        index={index}
                        completed={isCompleted}
                        progress={getActivityProgress(activity.id, game.state.activityData[activity.id])}
                        onClick={() => setCurrentView(activity.id)}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* QR Code Interstitial + Report Button */}
            <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              {activeJourney === 'showcase' && (
                <button
                  className="btn btn-ghost"
                  onClick={() => setQrInterstitialOpen(true)}
                  style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  📱 청중 참여 QR코드 보기
                </button>
              )}
              <button 
                className="btn btn-primary neon-btn" 
                onClick={goReport} 
                disabled={game.state.completed.length === 0}
                style={{ padding: '16px 32px', fontSize: '1.25rem', opacity: game.state.completed.length === 0 ? 0.5 : 1 }}
              >
                {game.state.completed.length > 0 ? "최종 진단 리포트 & 프롬프트 발급받기 →" : "활동을 1개 이상 완료해야 리포트를 볼 수 있습니다"}
              </button>
            </div>
          </div>
        )}

        {currentView === 'report' && (
          <Suspense fallback={<LoadingPanel />}>
            <ResultReport
              state={game.state}
              levelInfo={game.levelInfo}
              unlockedBadges={game.unlockedBadges}
              activeJourney={activeJourney}
              onOpenAIWorkbench={() => setAIWorkbenchOpen(true)}
            />
          </Suspense>
        )}

        {ActivityComponent && (
          <Suspense fallback={<LoadingPanel />}>
            <ActivityComponent
              id={currentView}
              state={game.state}
              data={game.state.activityData[currentView]}
              saveData={(next) => game.saveActivityData(currentView, next)}
              complete={(options) => {
                playSuccessSound();
                confetti({ particleCount: 50, spread: 60 });
                game.completeActivity(currentView, options);
                goHome();
              }}
              onBack={goHome}
            />
          </Suspense>
        )}

      </Layout>
      </div>

      <ModalOverlay
        open={qrInterstitialOpen}
        onClose={() => setQrInterstitialOpen(false)}
        appRootRef={appContentRef}
        ariaLabel="청중 참여 QR 코드"
        panelClassName="modal-panel-dark"
        panelStyle={{ maxWidth: '960px', textAlign: 'center', color: 'white', gap: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px' }}>📱 지금 바로 체험해보세요!</h2>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '500px', textAlign: 'center' }}>아래 URL을 핸드폰 브라우저에 입력하시면 방금 보신 앱들을 직접 체험하실 수 있습니다.</p>
        <div style={{ padding: '32px 48px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(99, 102, 241, 0.3)', textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7', fontFamily: 'monospace', letterSpacing: '2px', margin: 0 }}>amp-tacit-practice.vercel.app</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', maxWidth: '600px' }}>
          {SHOWCASE_ACTIVITIES.map(a => (
            <a key={a.id} href={a.url} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: '8px', background: `${a.color}15`, border: `1px solid ${a.color}40`, color: a.color, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              {a.icon} {a.title.split('. ')[1]}
            </a>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={() => setQrInterstitialOpen(false)} style={{ marginTop: '16px', color: '#94a3b8', fontSize: '1rem' }}>← 닫기</button>
      </ModalOverlay>

      <ModalOverlay
        open={aiWorkbenchOpen}
        onClose={() => setAIWorkbenchOpen(false)}
        appRootRef={appContentRef}
        ariaLabel="AI 실행 워크벤치"
      >
        <Suspense fallback={<LoadingPanel />}>
          <ReportAIWorkbench
            state={game.state}
            activeJourney={activeJourney}
            onClose={() => setAIWorkbenchOpen(false)}
          />
        </Suspense>
      </ModalOverlay>
    </ErrorBoundary>
  );
}
