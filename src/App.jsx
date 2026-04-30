import React, { Suspense, useRef, useState } from 'react';
import './index.css';
import { useGameState } from './hooks/useGameState';
import { SHOWCASE_ACTIVITIES } from './data/showcaseActivities';
import { getJourneyGuide } from './data/journeyGuides';
import { buildHomeViewModel } from './utils/homeFlow';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { playSuccessSound, playFanfareSound } from './utils/sound';
import { triggerInkBurst } from './utils/inkBurst';
import HomeJourneyView from './components/HomeJourneyView';
import Layout from './components/Layout';
import OnboardingOverlay from './components/OnboardingOverlay';
import ModalOverlay from './components/ModalOverlay';
import ErrorBoundary from './components/ErrorBoundary';
import PromptGiftModal from './components/PromptGiftModal';
import NextStepBeacon from './components/NextStepBeacon';
import ChapterPrintLayout from './components/ChapterPrintLayout';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import { getActivityPromptGift } from './data/activityPrompts';
import { ACTIVITY_TITLES } from './utils/activityTitles';
import { buildMicroInsight } from './utils/microInsight';
import { findClosestChapter, findNextActivityForChapter } from './utils/chapterProgress';
const PromoGallery = lazyWithRetry(() => import('./components/PromoGallery'), 'PromoGallery');
const ResultReport = lazyWithRetry(() => import('./components/ResultReport'), 'ResultReport');
const ReportAIWorkbench = lazyWithRetry(() => import('./components/ReportAIWorkbench'), 'ReportAIWorkbench');
const TimelineActivity = lazyWithRetry(() => import('./activities/TimelineActivity'), 'TimelineActivity');
const AutopilotActivity = lazyWithRetry(() => import('./activities/AutopilotActivity'), 'AutopilotActivity');
const CrisisActivity = lazyWithRetry(() => import('./activities/CrisisActivity'), 'CrisisActivity');
const TransferActivity = lazyWithRetry(() => import('./activities/TransferActivity'), 'TransferActivity');
const SeciActivity = lazyWithRetry(() => import('./activities/SeciActivity'), 'SeciActivity');
const GalleryActivity = lazyWithRetry(() => import('./activities/GalleryActivity'), 'GalleryActivity');
const QuickQuizActivity = lazyWithRetry(() => import('./activities/QuickQuizActivity'), 'QuickQuizActivity');
const RolePlayActivity = lazyWithRetry(() => import('./activities/RolePlayActivity'), 'RolePlayActivity');
const PatternMatchActivity = lazyWithRetry(() => import('./activities/PatternMatchActivity'), 'PatternMatchActivity');
const NoticingDrillActivity = lazyWithRetry(() => import('./activities/NoticingDrillActivity'), 'NoticingDrillActivity');
const CdmSimulatorActivity = lazyWithRetry(() => import('./activities/CdmSimulatorActivity'), 'CdmSimulatorActivity');
const AutoSetupActivity = lazyWithRetry(() => import('./activities/AutoSetupActivity'), 'AutoSetupActivity');
const AutoScriptActivity = lazyWithRetry(() => import('./activities/AutoScriptActivity'), 'AutoScriptActivity');
const AutoPropertyActivity = lazyWithRetry(() => import('./activities/AutoPropertyActivity'), 'AutoPropertyActivity');
const AutoCodeActivity = lazyWithRetry(() => import('./activities/AutoCodeActivity'), 'AutoCodeActivity');
const AutoTriggerActivity = lazyWithRetry(() => import('./activities/AutoTriggerActivity'), 'AutoTriggerActivity');
const DemoLiveAppTemplate = lazyWithRetry(() => import('./activities/DemoLiveAppTemplate'), 'DemoLiveAppTemplate');
const DemoAcademyOsActivity = lazyWithRetry(() => import('./activities/DemoAcademyOsActivity'), 'DemoAcademyOsActivity');
const DemoSaboPhilosophyActivity = lazyWithRetry(() => import('./activities/DemoSaboPhilosophyActivity'), 'DemoSaboPhilosophyActivity');
const DemoShowcaseIntroActivity = lazyWithRetry(() => import('./activities/DemoShowcaseIntroActivity'), 'DemoShowcaseIntroActivity');

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
  demo_showcase_intro: DemoShowcaseIntroActivity,
  demo_sign_design: DemoLiveAppTemplate,
  demo_readmaster: DemoLiveAppTemplate,
  demo_writing_correction: DemoLiveAppTemplate,
  demo_level_test_proto: DemoLiveAppTemplate,
  demo_academy_os: DemoAcademyOsActivity,
  demo_ontology: DemoLiveAppTemplate,
  demo_storyboard_gen: DemoLiveAppTemplate,
  demo_knot: DemoLiveAppTemplate,
  demo_bluel: DemoLiveAppTemplate,
  demo_librainy: DemoLiveAppTemplate,
  demo_moonlang: DemoLiveAppTemplate,
  demo_gidoboard: DemoLiveAppTemplate,
  demo_sabo_philosophy: DemoSaboPhilosophyActivity,
  demo_app_factory: DemoLiveAppTemplate,
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
  const [activeJourney, setActiveJourney] = useState('director');
  const [showJourneyPicker, setShowJourneyPicker] = useState(false);
  const [aiWorkbenchOpen, setAIWorkbenchOpen] = useState(false);
  const [qrInterstitialOpen, setQrInterstitialOpen] = useState(false);
  const [pendingGift, setPendingGift] = useState(null);
  const [printingChapter, setPrintingChapter] = useState(null);
  const appContentRef = useRef(null);
  const game = useGameState();

  const handlePrintChapter = (chapterId) => {
    setPrintingChapter(chapterId);
    document.body.classList.add('print-mode-chapter');
    window.requestAnimationFrame(() => {
      window.print();
      window.setTimeout(() => {
        document.body.classList.remove('print-mode-chapter');
        setPrintingChapter(null);
      }, 200);
    });
  };

  const goHome = () => setCurrentView('home');
  const goReport = () => {
    playFanfareSound();
    triggerInkBurst({ origin: { x: 0.5, y: 0.55 }, size: 'lg' });
    setCurrentView('report');
  };

  const ActivityComponent = ACTIVITY_COMPONENTS[currentView] ?? null;
  const homeView = buildHomeViewModel(activeJourney, game.state);
  const recommendedJourney = homeView.journeyGuide;

  const handleToggleJourney = (journey) => {
    setActiveJourney(journey);
  };

  const handleStartRecommendedDemo = (journey = activeJourney) => {
    const recommendedId = getJourneyGuide(journey).recommendedActivityId;
    if (!recommendedId) {
      setCurrentView('home');
      return;
    }
    setActiveJourney(journey);
    setCurrentView(recommendedId);
  };

  const handleQuickStart = (journey) => {
    game.setOnboardingSeen();
    setShowJourneyPicker(false);
    handleStartRecommendedDemo(journey);
  };

  return (
    <ErrorBoundary>
      <OnboardingOverlay
        open={!game.state.onboardingSeen}
        profile={game.state.profile}
        onChangeProfile={game.updateProfile}
        onClose={game.setOnboardingSeen}
        onQuickStart={handleQuickStart}
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
        onToggleJourney={handleToggleJourney}
        onStartRecommendedDemo={() => handleStartRecommendedDemo(activeJourney)}
        onToggleJourneyPicker={() => setShowJourneyPicker((previous) => !previous)}
        showJourneyPicker={showJourneyPicker}
        recommendedJourney={recommendedJourney}
        onPrintChapter={handlePrintChapter}
        onResumeActivity={(id) => { if (id) setCurrentView(id); }}
      >
        {currentView === 'home' && activeJourney === 'promo' && (
          <Suspense fallback={<LoadingPanel />}>
            <PromoGallery />
          </Suspense>
        )}

        {currentView === 'home' && activeJourney !== 'promo' && (
          <HomeJourneyView
            activeJourney={activeJourney}
            state={game.state}
            homeView={homeView}
            onStartRecommendedDemo={() => handleStartRecommendedDemo(activeJourney)}
            onGoReport={goReport}
            onOpenQr={() => setQrInterstitialOpen(true)}
            onSelectActivity={setCurrentView}
            onChooseJourney={handleToggleJourney}
          />
        )}

        {currentView === 'report' && (
          <Suspense fallback={<LoadingPanel />}>
            <ResultReport
              state={game.state}
              levelInfo={game.levelInfo}
              unlockedBadges={game.unlockedBadges}
              activeJourney={activeJourney}
              onOpenAIWorkbench={() => setAIWorkbenchOpen(true)}
              onUpdateConsent={game.updateConsent}
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
                triggerInkBurst({ origin: { x: 0.5, y: 0.5 }, size: 'md' });
                const completedId = currentView;
                game.completeActivity(completedId, options);
                const mergedData = {
                  ...(game.state.activityData[completedId] ?? {}),
                  ...(options?.activityData ?? {}),
                };
                const gift = getActivityPromptGift(completedId, mergedData, game.state.profile);
                const microInsight = buildMicroInsight(completedId, mergedData, game.state.profile);

                // 다음 마일스톤 — 가장 가까운 챕터 PDF.
                // useGameState setState가 비동기라 낙관적 사본으로 계산.
                const optimisticState = {
                  ...game.state,
                  completed: game.state.completed.includes(completedId)
                    ? game.state.completed
                    : [...game.state.completed, completedId],
                  activityData: {
                    ...game.state.activityData,
                    [completedId]: mergedData,
                  },
                  metrics: { ...(game.state.metrics ?? {}), lastCompletedId: completedId },
                };
                const closestChapter = findClosestChapter(optimisticState);
                let nextStep = null;
                if (closestChapter) {
                  if (closestChapter.kind === 'just-completed') {
                    nextStep = {
                      line: `🎉 ${closestChapter.title} 챕터가 완성되었습니다. 강사 회의용 PDF를 바로 발급할 수 있어요.`,
                      cta: '챕터 PDF 받기',
                      onClick: () => {
                        setPendingGift(null);
                        handlePrintChapter(closestChapter.id);
                      },
                    };
                  } else if (closestChapter.kind === 'one-away') {
                    const nextId = findNextActivityForChapter(closestChapter, optimisticState);
                    const nextTitle = ACTIVITY_TITLES[nextId] ?? '';
                    nextStep = nextId ? {
                      line: `${nextTitle} 1개만 더 풀면 ${closestChapter.title} 챕터 PDF가 발급됩니다.`,
                      cta: `${nextTitle} 시작`,
                      onClick: () => {
                        setPendingGift(null);
                        setCurrentView(nextId);
                      },
                    } : null;
                  } else if (closestChapter.kind === 'in-progress') {
                    const nextId = findNextActivityForChapter(closestChapter, optimisticState);
                    const nextTitle = ACTIVITY_TITLES[nextId] ?? '';
                    nextStep = nextId ? {
                      line: `${closestChapter.title} 챕터까지 ${closestChapter.remaining}개 활동 남음 — 다음은 ${nextTitle}.`,
                      cta: `${nextTitle} 시작`,
                      onClick: () => {
                        setPendingGift(null);
                        setCurrentView(nextId);
                      },
                    } : null;
                  } else if (closestChapter.kind === 'empty') {
                    const nextId = findNextActivityForChapter(closestChapter, optimisticState);
                    const nextTitle = ACTIVITY_TITLES[nextId] ?? '';
                    nextStep = nextId ? {
                      line: `${closestChapter.title}는 단 ${closestChapter.totalCount}개 활동으로 닫히는 가장 가까운 챕터입니다.`,
                      cta: `${nextTitle} 시작`,
                      onClick: () => {
                        setPendingGift(null);
                        setCurrentView(nextId);
                      },
                    } : null;
                  }
                }

                setPendingGift({
                  id: completedId,
                  title: ACTIVITY_TITLES[completedId] ?? '',
                  gift,
                  microInsight,
                  nextStep,
                });
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
            a.url ? (
            <a key={a.id} href={a.url} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: '8px', background: `${a.color}15`, border: `1px solid ${a.color}40`, color: a.color, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              {a.icon} {a.title.split('. ')[1]}
            </a>
            ) : (
            <span key={a.id} style={{ padding: '8px 16px', borderRadius: '8px', background: `${a.color}15`, border: `1px solid ${a.color}40`, color: a.color, fontSize: '0.85rem', fontWeight: 600 }}>
              {a.icon} {a.title.split('. ')[1]}
            </span>
            )
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

      <PromptGiftModal
        open={!!pendingGift}
        gift={pendingGift?.gift ?? null}
        activityTitle={pendingGift?.title ?? ''}
        microInsight={pendingGift?.microInsight ?? null}
        nextStep={pendingGift?.nextStep ?? null}
        appRootRef={appContentRef}
        onClose={() => {
          setPendingGift(null);
          goHome();
        }}
      />

      {ActivityComponent && (
        <AutoSaveIndicator lastSaveAt={game.state.metrics?.lastSaveAt} />
      )}

      <ChapterPrintLayout
        chapterId={printingChapter}
        state={game.state}
        levelInfo={game.levelInfo}
      />

      <NextStepBeacon
        state={game.state}
        currentView={currentView}
        hasGiftOpen={!!pendingGift}
        hasModalOpen={qrInterstitialOpen || aiWorkbenchOpen}
        onStartTour={() => {
          setActiveJourney('showcase');
          setCurrentView('demo_readmaster');
        }}
        onGoReport={goReport}
        onSelectActivity={(id) => {
          if (id) setCurrentView(id);
        }}
        onPrintChapter={handlePrintChapter}
      />
    </ErrorBoundary>
  );
}
