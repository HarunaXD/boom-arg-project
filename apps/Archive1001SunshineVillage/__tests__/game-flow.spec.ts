import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import {
  finishGame,
  openBoard,
  openMainThread,
  openPageNumber,
  openThreadFromBoard,
  resetGame,
  unlockSpace,
  unlockVent,
  unlockZhao,
  visitAwakeEndingBranches,
} from './game-helpers';

test.use({
  acceptDownloads: true,
  channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome',
});

test('玩家能走通主线、支线和清醒结局', async ({ page }) => {
  test.setTimeout(60000);
  await resetGame(page);
  await expect(page.locator('.board-row')).toHaveCount(4);
  await expect(page.locator('.recent-records')).toContainText('#009 / 处理记录');
  await page.locator('.search-box input').fill('墙');
  await expect(page.locator('.search-suggestions')).toContainText('你为什么还在查');

  await openMainThread(page);
  await expect(page.locator('.pagination').first().getByRole('button', { name: '16', exact: true })).toHaveAttribute('title', '处理记录 009 缺失');
  await expect(page.locator('.post-row')).toHaveCount(1);
  await expect(page.locator('.floor-reply')).toHaveCount(1);
  await page.locator('.profile-name').first().click();
  await expect(page.locator('.panel-title span')).toHaveText(/UID 031 - 李大妈/);
  await expect(page.locator('.history-entry')).not.toHaveCount(0);
  await expect(page.locator('.user-activity')).toContainText('大家今天吃了吗？');

  await unlockZhao(page);
  await unlockSpace(page);
  await unlockVent(page);
  await page.locator('.logo').click();
  await openBoard(page, '闲聊茶馆');
  await expect(page.locator('.thread-table')).toContainText('2003-08-14 03:02');
  await openThreadFromBoard(page, /大家今天吃了吗？/);
  await openPageNumber(page, 46);
  await expect(page.locator('.db-row').first()).toContainText('archive_id=1001');
  await visitAwakeEndingBranches(page);
  await finishGame(page);

  await expect(page.locator('.xp-body')).toContainText('awake_user residue detected');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '确认' }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  const content = await readFile(path!, 'utf8');
  expect(content).toContain('AWAKE_USER_RESIDUE=334');
  await expect(page.locator('.not-found')).toHaveText('404 Not Found');
});
