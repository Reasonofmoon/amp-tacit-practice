import { CHAPTERS } from '../data/chapters';
import { getActivityPromptGift } from '../data/activityPrompts';
import { buildDiscoveryView } from '../data/discoveryCards';
import { ACTIVITY_TITLES } from './activityTitles';

// 어떤 발견 카드가 어떤 챕터의 핵심을 비추는지 매핑.
// (한 카드가 여러 챕터에 등장할 수 있다 — 가벼운 중복은 의도)
const CHAPTER_DISCOVERY_MAP = {
  ch1: ['speedster'],
  ch2: ['empath'],
  ch3: ['observer'],
  ch4: ['crisis_manager', 'pattern_finder'],
  ch5: ['mentor'],
  ch6: ['transformer'],
  ch7: ['speedster', 'pattern_finder'],
  ch8: ['master'],
};

function collectStrings(value, bucket) {
  if (!value) return;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed) bucket.push(trimmed);
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

function getActivityVariants(canonicalId, completed) {
  const out = [];
  if (completed.includes(canonicalId)) out.push(canonicalId);
  if (
    !canonicalId.startsWith('auto_') &&
    !canonicalId.startsWith('demo_') &&
    completed.includes(`dev_${canonicalId}`)
  ) {
    out.push(`dev_${canonicalId}`);
  }
  return out;
}

function formatActivityContent(data) {
  if (!data) return [];
  // Showcase activities only mark { isChecked: true } — surface that explicitly.
  if (data.isChecked && Object.keys(data).length === 1) {
    return ['(라이브 앱 체험 완료 — 실제 답변은 외부 앱에서 작성됨)'];
  }
  const strings = [];
  collectStrings(data, strings);
  return strings;
}

export function buildChapterPrintData(state, chapterId) {
  const chapter = CHAPTERS.find((entry) => entry.id === chapterId);
  if (!chapter) return null;

  const completed = state.completed ?? [];

  const activities = [];
  for (const canonicalId of chapter.activities) {
    const variants = getActivityVariants(canonicalId, completed);
    for (const variantId of variants) {
      const data = state.activityData?.[variantId];
      const content = formatActivityContent(data);
      if (content.length > 0) {
        activities.push({
          id: variantId,
          title: ACTIVITY_TITLES[variantId] ?? variantId,
          content,
        });
      }
    }
  }

  const giftSeen = new Set();
  const gifts = [];
  for (const canonicalId of chapter.activities) {
    const variants = getActivityVariants(canonicalId, completed);
    for (const variantId of variants) {
      if (giftSeen.has(canonicalId)) continue; // mirror 두 번 발급 방지
      giftSeen.add(canonicalId);
      const gift = getActivityPromptGift(
        variantId,
        state.activityData?.[variantId] ?? {},
        state.profile ?? {},
      );
      gifts.push({
        id: variantId,
        title: ACTIVITY_TITLES[variantId] ?? variantId,
        gift,
      });
    }
  }

  const discoveryIds = CHAPTER_DISCOVERY_MAP[chapterId] ?? [];
  const allDiscoveries = buildDiscoveryView(state, state.badges ?? []);
  const discoveries = allDiscoveries.filter(
    (card) => discoveryIds.includes(card.id) && card.unlocked,
  );

  return {
    chapter,
    activities,
    gifts,
    discoveries,
    profile: state.profile ?? {},
    issuedAt: new Date().toISOString().slice(0, 10),
  };
}
