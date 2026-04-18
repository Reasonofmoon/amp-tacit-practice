import { useMemo, useState } from 'react';
import { ACTIVITIES, AXES } from '../data/activities';
import { DEV_ACTIVITIES, DEV_AXES } from '../data/developerActivities';
import { buildPromptPack, buildVibeCodingPrompts } from '../utils/promptGenerator';
import { getActivityProgress } from '../utils/scoring';
import { PROVIDERS, getStoredApiKey } from '../utils/llmClient';
import GlobalAIToolbar from './GlobalAIToolbar';
import AITaskRunner from './AITaskRunner';

const PROVIDER_ORDER = ['gemini', 'openai', 'claude'];

function buildAxisScores(state, isDev = false) {
  const targetAxes = isDev ? DEV_AXES : AXES;
  const targetActivities = isDev ? DEV_ACTIVITIES : ACTIVITIES;

  return targetAxes.map((axis) => {
    let weightedScore = 0;
    let maxScore = 0;

    targetActivities.forEach((activity) => {
      const weight = activity.axis[axis.key] ?? 0;
      if (!weight) {
        return;
      }

      maxScore += weight;
      weightedScore += weight * getActivityProgress(activity.id, state.activityData[activity.id]);
    });

    return {
      ...axis,
      score: Math.round(maxScore === 0 ? 0 : (weightedScore / maxScore) * 100),
    };
  });
}

export default function ReportAIWorkbench({ state, activeJourney = 'director', onClose }) {
  const isDev = activeJourney === 'developer';
  const axisScores = useMemo(() => buildAxisScores(state, isDev), [state, isDev]);
  const promptPack = useMemo(() => buildPromptPack(state.activityData, state.profile, isDev), [state.activityData, state.profile, isDev]);
  const vibeCodingPrompts = useMemo(() => buildVibeCodingPrompts(state.activityData, state.profile, isDev, axisScores), [state.activityData, state.profile, isDev, axisScores]);

  const [copiedIndex, setCopiedIndex] = useState(null);
  const [vibeCopied, setVibeCopied] = useState(null);
  const [activeProvider, setActiveProvider] = useState('gemini');
  const [apiKeys, setApiKeys] = useState(() => {
    const keys = {};
    PROVIDER_ORDER.forEach((id) => { keys[id] = getStoredApiKey(id); });
    return keys;
  });
  const [selectedModels, setSelectedModels] = useState(() => {
    const models = {};
    PROVIDER_ORDER.forEach((id) => { models[id] = PROVIDERS[id].defaultModel; });
    return models;
  });

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1400);
    } catch {
      setCopiedIndex(index);
    }
  };

  const handleVibeCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setVibeCopied(index);
      window.setTimeout(() => setVibeCopied(null), 1400);
    } catch {
      setVibeCopied(index);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <span className="flow-eyebrow-tag" style={{ background: 'var(--blue-wash)', borderColor: 'var(--ink-blue)', color: 'var(--ink-blue-deep)' }}>
            AI WORKBENCH
          </span>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', color: 'var(--ink-900)', marginTop: '12px' }}>
            AI 실행 워크벤치
          </h2>
          <p style={{ color: 'var(--ink-700)', marginTop: '6px', maxWidth: '540px' }}>
            리포트 본문과 분리된 전용 실행 공간입니다. 프롬프트 복사, 모델 선택, 즉시 실행을 여기서 처리합니다.
          </p>
        </div>
        <button type="button" className="btn-paper-outline" onClick={onClose}>
          닫기
        </button>
      </div>

      <GlobalAIToolbar
        activeProvider={activeProvider}
        setActiveProvider={setActiveProvider}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        selectedModels={selectedModels}
        setSelectedModels={setSelectedModels}
      />

      <div className="report-grid">
        <article className="report-paper-card">
          <div className="section-heading" style={{ marginBottom: '18px' }}>
            <div>
              <p className="eyebrow">PROMPT PACK</p>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--ink-900)', marginTop: '4px' }}>
                AI 프롬프트 팩
              </h3>
            </div>
          </div>
          <div className="prompt-list" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {promptPack.map((prompt, index) => (
              <article key={index} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="prompt-paper">
                  {prompt}
                </div>
                <button
                  type="button"
                  className="btn-paper-primary"
                  style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => handleCopy(prompt, index)}
                  aria-label="프롬프트 템플릿 복사"
                >
                  {copiedIndex === index ? '✅ 클립보드에 복사됨' : '📋 전체 프롬프트 복사하기'}
                </button>
                <AITaskRunner
                  prompt={prompt}
                  activeProvider={activeProvider}
                  currentKey={apiKeys[activeProvider]}
                  currentModel={selectedModels[activeProvider]}
                />
              </article>
            ))}
          </div>
        </article>

        <article className="report-paper-card vibe-coding-section">
          <div className="section-heading" style={{ marginBottom: '18px' }}>
            <div>
              <p className="eyebrow">VIBE CODING</p>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', color: 'var(--ink-900)', marginTop: '4px' }}>
                🎯 맞춤형 바이브코딩 프롬프트
              </h3>
              <p style={{ color: 'var(--ink-500)', fontSize: '0.85rem', marginTop: '4px' }}>
                레이더맵 분석 결과 기반으로 약한 영역을 보완하는 앱/솔루션을 바로 생성할 수 있습니다.
              </p>
            </div>
          </div>
          <div className="vibe-prompt-grid">
            {vibeCodingPrompts.map((vp, index) => (
              <article key={index} className="vibe-prompt-paper-card">
                <div className="vibe-prompt-header">
                  <span className="vibe-prompt-icon">{vp.icon}</span>
                  <div>
                    <strong className="vibe-prompt-label">{vp.label}</strong>
                    <p className="vibe-prompt-desc">{vp.desc}</p>
                  </div>
                </div>
                <div className="prompt-paper" style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {vp.prompt}
                </div>
                <button
                  type="button"
                  className="btn-paper-primary"
                  style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
                  onClick={() => handleVibeCopy(vp.prompt, index)}
                  aria-label="바이브코딩 프롬프트 복사"
                >
                  {vibeCopied === index ? '✅ 복사됨!' : `📋 ${vp.icon} 프롬프트 복사`}
                </button>
                <AITaskRunner
                  prompt={vp.prompt}
                  activeProvider={activeProvider}
                  currentKey={apiKeys[activeProvider]}
                  currentModel={selectedModels[activeProvider]}
                />
              </article>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
