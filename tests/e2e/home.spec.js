import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('tacit-game-state', JSON.stringify({ onboardingSeen: true }));
  });
});

test('home loads and exposes primary journeys', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /학원 원장의 1년|암묵지가 앱으로 변하는/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /원장 데모 시작|추천 시연 시작/ }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /천천히 둘러보기/ })).toBeVisible();
});

test('home has no critical accessibility violations', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter((violation) => violation.impact === 'critical');

  expect(critical).toEqual([]);
});
