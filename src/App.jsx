import { useState } from 'react';
import './index.css';
import confetti from 'canvas-confetti';
import { useGameState } from './hooks/useGameState';
import { ACTIVITIES } from './data/activities';
import { DEV_ACTIVITIES } from './data/developerActivities';
import { AUTOMATION_ACTIVITIES } from './data/automationActivities';
import { SHOWCASE_ACTIVITIES } from './data/showcaseActivities';
import { getActivityProgress } from './utils/scoring';
import { playSuccessSound, playFanfareSound } from './utils/sound';
import Layout from './components/Layout';
import ActivityCard from './components/ActivityCard';
import OnboardingOverlay from './components/OnboardingOverlay';
import ResultReport from './components/ResultReport';
import TimelineActivity from './activities/TimelineActivity';
import AutopilotActivity from './activities/AutopilotActivity';
import CrisisActivity from './activities/CrisisActivity';
import TransferActivity from './activities/TransferActivity';
import SeciActivity from './activities/SeciActivity';
import GalleryActivity from './activities/GalleryActivity';
import QuickQuizActivity from './activities/QuickQuizActivity';
import RolePlayActivity from './activities/RolePlayActivity';
import PatternMatchActivity from './activities/PatternMatchActivity';
import NoticingDrillActivity from './activities/NoticingDrillActivity';
import CdmSimulatorActivity from './activities/CdmSimulatorActivity';
import AutoSetupActivity from './activities/AutoSetupActivity';
import AutoScriptActivity from './activities/AutoScriptActivity';
import AutoPropertyActivity from './activities/AutoPropertyActivity';
import AutoCodeActivity from './activities/AutoCodeActivity';
import AutoTriggerActivity from './activities/AutoTriggerActivity';

// Showcase Journey (Live URLs)
import DemoLiveAppTemplate from './activities/DemoLiveAppTemplate';

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
};

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeJourney, setActiveJourney] = useState('director'); // 'director' | 'developer'
  const game = useGameState();

  const goHome = () => setCurrentView('home');
  const goReport = () => {
    playFanfareSound();
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setCurrentView('report');
  };

  const ActivityComponent = ACTIVITY_COMPONENTS[currentView] ?? null;

  return (
    <>
      <OnboardingOverlay
        open={!game.state.onboardingSeen}
        profile={game.state.profile}
        onChangeProfile={game.updateProfile}
        onClose={game.setOnboardingSeen}
      />

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
        {currentView === 'home' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: 'var(--space-md)', fontSize: '2rem' }}>탁월함의 발자취 (Monopoly Path)</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
              각 노드를 클릭해 암묵지 발굴 여정을 진행하세요.
            </p>
            
            <div className="monopoly-board">
              {(activeJourney === 'director' ? ACTIVITIES : 
                activeJourney === 'developer' ? DEV_ACTIVITIES : 
                activeJourney === 'automation' ? AUTOMATION_ACTIVITIES : 
                SHOWCASE_ACTIVITIES).map((activity, index) => {
                const isCompleted = game.state.completed.includes(activity.id);
                return (
                  <div key={activity.id} className="monopoly-node">
                    <ActivityCard
                      activity={activity}
                      index={index}
                      completed={isCompleted}
                      progress={getActivityProgress(activity.id, game.state.activityData[activity.id])}
                      onClick={() => setCurrentView(activity.id)}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Render the report button always, but visually disabled if length === 0 */}
            <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
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
          <ResultReport state={game.state} levelInfo={game.levelInfo} unlockedBadges={game.unlockedBadges} activeJourney={activeJourney} />
        )}

        {ActivityComponent && (
          <ActivityComponent
            id={currentView} // pass active view to the component explicitly for data conditional checks
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
        )}
      </Layout>
    </>
  );
}
