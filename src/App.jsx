import { useState } from 'react';
import './index.css';
import { useGameState } from './hooks/useGameState';
import { ACTIVITIES } from './data/activities';
import { getActivityProgress } from './utils/scoring';
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

const ACTIVITY_COMPONENTS = {
  timeline: TimelineActivity,
  autopilot: AutopilotActivity,
  crisis: CrisisActivity,
  transfer: TransferActivity,
  seci: SeciActivity,
  gallery: GalleryActivity,
  quiz: QuickQuizActivity,
  roleplay: RolePlayActivity,
  pattern: PatternMatchActivity,
};

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const game = useGameState();

  const goHome = () => setCurrentView('home');
  const goReport = () => setCurrentView('report');

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
        showReportButton={game.state.completed.length >= 3}
      >
        {currentView === 'home' && (
          <div className="dashboard-layers">
            <div className="layer-section">
              <div className="layer-header">
                <div className="layer-indicator layer-a">A</div>
                <h3>기초 진단 (Foundation)</h3>
              </div>
              <div className="grid-3">
                {ACTIVITIES.slice(0, 3).map((activity, index) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    index={index}
                    completed={game.state.completed.includes(activity.id)}
                    progress={getActivityProgress(activity.id, game.state.activityData[activity.id])}
                    onClick={() => setCurrentView(activity.id)}
                  />
                ))}
              </div>
            </div>

            <div className="layer-section">
              <div className="layer-header">
                <div className="layer-indicator layer-b">B</div>
                <h3>심화 발굴 (Deepening)</h3>
              </div>
              <div className="grid-3">
                {ACTIVITIES.slice(3, 6).map((activity, index) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    index={index}
                    completed={game.state.completed.includes(activity.id)}
                    progress={getActivityProgress(activity.id, game.state.activityData[activity.id])}
                    onClick={() => setCurrentView(activity.id)}
                  />
                ))}
              </div>
            </div>

            <div className="layer-section">
              <div className="layer-header">
                <div className="layer-indicator layer-c">C</div>
                <h3>패턴 응용 (Application)</h3>
              </div>
              <div className="grid-3">
                {ACTIVITIES.slice(6, 9).map((activity, index) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    index={index}
                    completed={game.state.completed.includes(activity.id)}
                    progress={getActivityProgress(activity.id, game.state.activityData[activity.id])}
                    onClick={() => setCurrentView(activity.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'report' && (
          <ResultReport state={game.state} levelInfo={game.levelInfo} unlockedBadges={game.unlockedBadges} />
        )}

        {ActivityComponent && (
          <ActivityComponent
            state={game.state}
            data={game.state.activityData[currentView]}
            saveData={(next) => game.saveActivityData(currentView, next)}
            complete={(options) => {
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
