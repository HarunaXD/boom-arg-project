import { expect, test } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4177/';

async function resetGame(page: import('@playwright/test').Page) {
  await page.goto(baseURL);
  await page.evaluate(() => window.localStorage.clear());
  await page.goto(`${baseURL}?testMode=1`);
  await expect(page.getByRole('heading', { name: /凝视直到图片开始回看你/ })).toBeVisible();
}

async function terminal(page: import('@playwright/test').Page, command: string) {
  await page.getByLabel('终端查询').fill(command);
  await page.getByLabel('终端查询').press('Enter');
}

async function openNav(page: import('@playwright/test').Page, code: string, view: string) {
  await page.getByRole('button', { name: new RegExp(code) }).click();
  await expect(page.locator(`[data-view="${view}"]`)).toBeVisible();
}

test.use({
  acceptDownloads: true,
  channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome',
});

test('玩家能走通主线、关键支线和结局', async ({ page }) => {
  test.setTimeout(60000);
  await resetGame(page);

  await page.getByLabel('left iris archive').hover();
  await expect(page.locator('.pixel-drop')).toContainText('094', { timeout: 5000 });

  await page.locator('[data-photo-id="photo-2"]').click({ button: 'right' });
  await page.getByRole('button', { name: '镜像翻转' }).click();
  await page.getByLabel('reverse lip print').hover();
  await expect(page.locator('.pixel-drop')).toContainText('DONOR-PREP-ROOM-03', { timeout: 5000 });

  await openNav(page, 'BOUT', 'boutique');
  await expect(page.getByRole('heading', { name: /所有商品都有防伪码/ })).toBeVisible();
  await page.locator('.product-card').filter({ hasText: '限量版血滴项链' }).getByRole('button', { name: '放大检查' }).click();
  await expect(page.locator('.product-card').filter({ hasText: '限量版血滴项链' })).toContainText('BLD-O-NEG-0412');

  await terminal(page, 'QUERY:VERIFY');
  await expect(page.locator('.terminal-log')).toContainText('无效查询');
  await terminal(page, 'BLD-O-NEG-0412');
  await expect(page.locator('.terminal-log')).toContainText('DATABASE BREACH');
  await terminal(page, 'QUERY:VERIFY');
  await expect(page.locator('.terminal-log')).toContainText('VERIFY TABLE');
  await terminal(page, 'DONOR-PREP-ROOM-03');
  await expect(page.locator('.terminal-log')).toContainText('准备室编号缺少楼层');
  await terminal(page, 'H-042');
  await expect(page.locator('.terminal-log')).toContainText('定制手模购买者备注');
  await terminal(page, 'EYE-094');
  await expect(page.locator('.terminal-log')).toContainText('请先在 Devotees 确认');

  await openNav(page, 'DEVO', 'devotees');
  await expect(page.locator('.devotee-table')).toContainText('094号信徒');
  await expect(page.locator('.devotee-table')).toContainText('[已收割]');
  await page.getByRole('button', { name: '[已收割]' }).click();
  await terminal(page, 'EYE-094');
  await expect(page.locator('.terminal-log')).toContainText('EYE FILE #094');

  await openNav(page, 'GALL', 'gallery');
  await page.getByLabel('bracelet charm').hover();
  await expect(page.locator('.pixel-drop')).toContainText('H-042', { timeout: 5000 });
  await openNav(page, 'BOUT', 'boutique');
  await page.locator('.product-card').filter({ hasText: '定制手模' }).getByRole('button', { name: '放大检查' }).click();
  await expect(page.locator('.product-card').filter({ hasText: '定制手模' })).toContainText('购买者备注：#094');
  await terminal(page, 'H-042');
  await expect(page.locator('.terminal-log')).toContainText('HAND FILE H-042');

  await page.locator('.product-card').filter({ hasText: 'VIP见面会邀请函' }).getByRole('button', { name: '放大检查' }).click();
  await expect(page.locator('.product-card').filter({ hasText: 'VIP见面会邀请函' })).toContainText('B2 / DONOR WING');
  await terminal(page, 'DONOR-PREP-ROOM-03');
  await expect(page.locator('.terminal-log')).toContainText('ROOM-03 LIVE');

  await openNav(page, 'GALL', 'gallery');
  await page.getByLabel('cheek noise').hover();
  await expect(page.locator('.pixel-drop')).toContainText('/v1', { timeout: 3000 });
  await openNav(page, 'V1.0', 'v1');
  await expect(page.getByRole('heading', { name: /Project-Æ V1.0/ })).toBeVisible();

  await page.getByRole('button', { name: 'finish sampling' }).click();
  await expect(page.locator('.ending-view')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('.ending-view')).toContainText('[End of Connection]');
});

test('进度会保存到 localStorage', async ({ page }) => {
  await resetGame(page);
  await terminal(page, 'BLD-O-NEG-0412');
  await expect(page.locator('.terminal-log')).toContainText('DATABASE BREACH');
  await page.reload();
  await expect(page.locator('.terminal-log')).toContainText('DATABASE BREACH');
});
