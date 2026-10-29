import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('workshop opens real labs and keeps links explicit', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('실제로 만들어');
  await expect(page.getByRole('link', { name: /Pomelli 열기/ })).toHaveAttribute('href', 'https://labs.google.com/u/0/pomelli/campaigns');
  await page.getByLabel('공개 브랜드 또는 가상 브랜드', { exact: true }).fill('가상 독서모임');
  await expect(page.getByLabel('Pomelli에 붙여 넣을 프롬프트', { exact: true })).toHaveValue(/가상 독서모임/);
  await page.getByLabel('실제 결과 링크 (선택)', { exact: true }).fill('javascript:alert(1)');
  await expect(page.getByRole('link', { name: /기록한 결과 열기/ })).toHaveCount(0);
});
test('keyboard tabs, persistence, and harness JSON download', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: /브랜드를 장면으로/ }).press('End');
  await expect(page.getByRole('tab', { name: /반복을 구조로/ })).toHaveAttribute('aria-selected', 'true');
  await page.getByLabel('반복할 작업', { exact: true }).fill('매주 공개 자료 정리');
  await page.reload();
  await expect(page.getByLabel('반복할 작업', { exact: true })).toHaveValue('매주 공개 자료 정리');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '설계 JSON 저장', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('amp26-harness.json');
  const stream = await download.createReadStream();
  let text = '';
  for await (const chunk of stream) text += chunk.toString();
  expect(JSON.parse(text)).toMatchObject({task:'매주 공개 자료 정리',kind:'harness-design-only',autonomousExecution:false});
});
test('legacy return link restores the workshop anchor', async ({ page }) => {
  await page.goto('/#legacy');
  await page.getByRole('link', { name: 'AMP 26 새 워크숍으로 돌아가기', exact: true }).click();
  await expect(page.locator('#workshop')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('실제로 만들어');
});
test('mobile layout, reduced motion, and accessibility', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/');
  await page.getByRole('tab', { name: /자료를 생각으로/ }).click();
  await expect(page.getByLabel('가상 실습 자료', { exact:true })).toHaveValue(/가상 실습 자료/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(v => v.impact === 'critical')).toEqual([]);
});
