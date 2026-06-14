import { expect, type Page } from '@playwright/test';

export const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4177/';

export async function resetGame(page: Page) {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto(baseURL);
  await expect(page.locator('.logo')).toHaveText('阳光新村BBS');
}

export async function openMainThread(page: Page) {
  await page.getByRole('button', { name: '进入置顶热帖' }).click();
  await expect(page.locator('.panel-title span')).toContainText('大家今天吃了吗？');
}

export async function openPageNumber(page: Page, pageNumber: number) {
  await page.locator('.pagination').first().getByRole('button', { name: String(pageNumber), exact: true }).click();
  await expect(page.locator('.pagination').first().getByRole('button', { name: String(pageNumber), exact: true })).toHaveClass(/active/);
}

export async function searchAndOpenThread(page: Page, keyword: string, title: string | RegExp) {
  await page.locator('.search-box input').fill(keyword);
  await page.getByRole('button', { name: '搜索' }).click();
  await page.getByRole('button', { name: title }).click();
  await expect(page.locator('.panel-title span')).toHaveText(title);
}

export async function openBoard(page: Page, boardName: string) {
  await page.locator('.logo').click();
  await page.getByRole('button', { name: boardName }).click();
  await expect(page.locator('.panel-title span')).toHaveText(boardName);
}

export async function openThreadFromBoard(page: Page, threadTitle: string | RegExp) {
  await page.getByRole('button', { name: threadTitle }).click();
  await expect(page.locator('.panel-title span')).toHaveText(threadTitle);
}

export async function inspectFirstAuthorOnCurrentPage(page: Page, uidPattern: RegExp) {
  await page.locator('.post-row .avatar-button').first().click();
  await expect(page.locator('.panel-title span')).toHaveText(uidPattern);
  await page.getByRole('button', { name: '返回' }).click();
  await expect(page.locator('.thread-panel')).toBeVisible();
}

export async function unlockZhao(page: Page) {
  await page.locator('.logo').click();
  await openMainThread(page);
  await openPageNumber(page, 8);
  await page.getByRole('button', { name: /引用自 #009/ }).click();
  await expect(page.locator('.thread-panel')).toContainText('墙还会自己往回缩');
}

export async function unlockSpace(page: Page) {
  await page.locator('.logo').click();
  await openMainThread(page);
  await openPageNumber(page, 16);
  await page.getByRole('button', { name: /缓存字段：302/ }).click();
  await openPageNumber(page, 17);
  await page.getByRole('button', { name: /缓存字段：402/ }).click();
  await page.locator('.logo').click();
  await page.getByRole('button', { name: '查看户型图' }).click();
  await expect(page.locator('.floorplan')).toBeVisible();
  await expect(page.locator('.plan-note')).toContainText('比对记录：2 处尺寸不一致');
  await expect(page.locator('.shaft')).toContainText('胃井');
}

export async function unlockVent(page: Page) {
  await page.getByRole('button', { name: '返回' }).click();
  await openThreadFromBoard(page, /大家今天吃了吗？/);
  await openPageNumber(page, 38);
  await page.locator('.post-row .profile-name').first().click();
  await expect(page.locator('.panel-title span')).toHaveText(/UID 334 - 失眠的猫/);
  await expect(page.locator('.diary').first()).toContainText('通风口尺寸有点奇怪');
  await expect(page.locator('.history-residue')).toContainText('封风口');
  await page.getByRole('button', { name: /vent_334.tmp/ }).click();
  await expect(page.locator('.attachment-list')).toContainText('404 Not Found');
  await expect(page.locator('.attachment-list')).toContainText(/visitor_\d{4}-\d{2}-\d{2}\.tmp/);
  await page.getByRole('button', { name: '返回' }).click();
  await openPageNumber(page, 38);
  await page.locator('.post-row .profile-name').first().hover();
  await expect(page.locator('.profile-card').first()).toContainText('查看者房号');
}

export async function visitAwakeEndingBranches(page: Page) {
  await openBoard(page, '闲聊茶馆');
  await openThreadFromBoard(page, /猫一直盯着通风口/);
  await expect(page.locator('.thread-panel')).toContainText('先别吸气');

  await searchAndOpenThread(page, '密码', /密码没改过/);
  await page.getByRole('button', { name: /缓存字段：密码所有者互换/ }).click();
  await expect(page.locator('.thread-panel')).toContainText('用我的密码登他的号');

  await searchAndOpenThread(page, '修订', /入住须知修订记录/);
  await page.getByRole('button', { name: /查看 修订前版本/ }).click();
  await expect(page.locator('.thread-panel')).toContainText('墙体回缩');
}

export async function finishGame(page: Page) {
  await page.locator('.logo').click();
  await openMainThread(page);
  await openPageNumber(page, 50);
  await page.locator('#archive-code').fill('302');
  await page.getByRole('button', { name: '确认' }).click();
  await expect(page.locator('.archive-echo')).toContainText('302');
  await page.locator('#archive-code').fill('1001');
  await page.getByRole('button', { name: '确认' }).click();
  await expect(page.locator('.xp-body')).toBeVisible({ timeout: 6000 });
}
