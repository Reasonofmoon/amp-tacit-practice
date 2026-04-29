import { ACTIVITIES } from '../data/activities';
import { AUTOMATION_ACTIVITIES } from '../data/automationActivities';
import { DEV_ACTIVITIES } from '../data/developerActivities';
import { SHOWCASE_ACTIVITIES } from '../data/showcaseActivities';

// Single source of truth for activityId → human title.
// Used by ResultReport, App.jsx (gift modal), ChapterPrintLayout.
export const ACTIVITY_TITLES = (() => {
  const lookup = {};
  [...ACTIVITIES, ...DEV_ACTIVITIES, ...AUTOMATION_ACTIVITIES, ...SHOWCASE_ACTIVITIES].forEach((entry) => {
    if (entry?.id) lookup[entry.id] = entry.title;
  });
  return lookup;
})();

export function titleOf(activityId) {
  return ACTIVITY_TITLES[activityId] ?? activityId;
}
