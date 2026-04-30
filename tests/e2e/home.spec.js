import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  // Skip onboarding modal so each test starts on the home view directly.
  await page.addInitScript(() => {
    window.localStorage.setItem('tacit-game-state', JSON.stringify({ onboardingSeen: true }));
  });
});

test('home loads and exposes primary journeys', async ({ page }) => {
  await page.goto('/');

  // W7 변경 후 본문은 "현장 노하우". 옛 표현도 함께 허용 — 회귀 보호.
  await expect(
    page.getByRole('heading', { name: /학원 원장의 1년|현장 노하우가 앱으로 변하는|암묵지가 앱으로 변하는/ })
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /원장 데모 시작|추천 시연 시작/ }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /천천히 둘러보기/ })).toBeVisible();
});

test('home has no critical accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((violation) => violation.impact === 'critical');

  expect(critical).toEqual([]);
});

test('NextStepBeacon advances the user from cold start', async ({ page }) => {
  await page.goto('/');

  // 0개 완료 상태에서 beacon 은 ReadMaster 데모로 안내.
  const beacon = page.getByRole('button', { name: /1분 데모|ReadMaster부터 시작/ });
  await expect(beacon).toBeVisible();
});

test('clicking a director activity card opens the activity workspace', async ({ page }) => {
  // 기본 진입은 showcase 여정. director 여정으로 토글한 뒤 활동 그리드의 첫 카드를 클릭.
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'tacit-game-state',
      JSON.stringify({ onboardingSeen: true })
    );
  });
  await page.goto('/');

  // mode-selector 의 "진단 시작" 카드 클릭 → director 여정 활성화.
  await page.getByRole('button', { name: /진단 시작/ }).click();

  // 활동 그리드의 카드들 중 quiz 또는 timeline 활동을 찾아 클릭.
  const quizCard = page.getByRole('button', { name: /스피드 퀴즈|30초 안에/ }).first();
  await expect(quizCard).toBeVisible();
  await quizCard.click();

  // workspace-header 의 활동 제목이 보이면 진입 성공.
  await expect(page.getByRole('heading', { name: /스피드 퀴즈|판단 퀴즈/ }).first()).toBeVisible({ timeout: 10000 });

  // 자동저장 pill 은 활동 화면에서 노출 (저장 발생 전엔 idle 상태).
  await expect(page.locator('.autosave-pill')).toBeVisible();
});
