import { ACTIVITIES } from '../data/activities';
import { AUTOMATION_ACTIVITIES } from '../data/automationActivities';
import { DEV_ACTIVITIES } from '../data/developerActivities';
import { getJourneyGuide } from '../data/journeyGuides';
import { SHOWCASE_ACTIVITIES } from '../data/showcaseActivities';

const ALL_ACTIVITIES = [
  ...ACTIVITIES,
  ...DEV_ACTIVITIES,
  ...AUTOMATION_ACTIVITIES,
  ...SHOWCASE_ACTIVITIES,
];

function collectStrings(value, bucket) {
  if (!value) {
    return;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length >= 8) {
      bucket.push(trimmed);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectStrings(entry, bucket));
    return;
  }

  if (typeof value === 'object') {
    Object.values(value).forEach((entry) => collectStrings(entry, bucket));
  }
}

function firstSentence(text) {
  const sentence = text.split(/[.!?]|다\./)[0]?.trim() ?? '';
  return sentence.length > 0 ? sentence : text.trim();
}

export function getJourneyActivities(journey) {
  if (journey === 'developer') return DEV_ACTIVITIES;
  if (journey === 'automation') return AUTOMATION_ACTIVITIES;
  if (journey === 'showcase') return SHOWCASE_ACTIVITIES;
  if (journey === 'promo') return [];
  return ACTIVITIES;
}

export function findActivityMeta(activityId) {
  return ALL_ACTIVITIES.find((activity) => activity.id === activityId) ?? null;
}

export function extractActivityPreviewSentence(activityId, activityData, activityMeta, journeyGuide) {
  const candidates = [];

  if (activityData?.insight && activityData.insight !== 'Skipped') {
    candidates.push(activityData.insight);
  }

  if (activityData?.prompt) {
    candidates.push(activityData.prompt);
  }

  collectStrings(activityData, candidates);

  if (activityMeta?.storyText) {
    candidates.push(activityMeta.storyText);
  }

  if (activityMeta?.speakerNotes) {
    candidates.push(activityMeta.speakerNotes);
  }

  const guideStep = journeyGuide.demoOrder.find((step) => step.activityId === activityId);
  if (guideStep?.presenterLine) {
    candidates.push(guideStep.presenterLine);
  }

  if (activityMeta?.subtitle) {
    candidates.push(activityMeta.subtitle);
  }

  const uniqueCandidates = [...new Set(candidates.map(firstSentence).filter((sentence) => sentence.length >= 8))];
  return uniqueCandidates[0] ?? journeyGuide.previewFallback;
}

export function buildHomeViewModel(activeJourney, state) {
  const journeyGuide = getJourneyGuide(activeJourney);
  const journeyActivities = getJourneyActivities(activeJourney);
  const completedJourneyCount = journeyActivities.filter((activity) => state.completed.includes(activity.id)).length;
  const recommendedActivity = journeyGuide.recommendedActivityId
    ? findActivityMeta(journeyGuide.recommendedActivityId)
    : null;
  const lastCompletedActivity = findActivityMeta(state.metrics.lastCompletedId);
  const isLastCompletedInJourney = lastCompletedActivity
    ? journeyActivities.some((activity) => activity.id === lastCompletedActivity.id)
    : false;

  const lastCompletedPreview = isLastCompletedInJourney
    ? extractActivityPreviewSentence(
        lastCompletedActivity.id,
        state.activityData[lastCompletedActivity.id],
        lastCompletedActivity,
        journeyGuide,
      )
    : null;

  return {
    journeyGuide,
    journeyActivities,
    completedJourneyCount,
    recommendedActivity,
    lastCompletedActivity: isLastCompletedInJourney ? lastCompletedActivity : null,
    lastCompletedPreview,
  };
}
