import { expect, test } from '@playwright/test';
import { GALLERY, MIN_TARGET, expectAboveStickyBar, expectAnchored, expectOnTop, openGallery } from './gallery-helpers.js';
import { resolve } from 'node:path';

const evidence = process.env.ACCOUNT_MENU_EVIDENCE;

test('account menu opens by pointer at the end of the top bar and marks the current route', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    const section = page.locator('#account-menu');
    const button = page.locator('#account-menu-demo-button');
    const menu = page.locator('#account-menu-demo');
    await section.scrollIntoViewIfNeeded();
    await expect(button).toHaveAccessibleName('Alex North');
    await expect(button.locator('.avatar--initials')).toHaveText('AN');
    const target = await button.boundingBox();
    expect(Math.min(target.width, target.height)).toBeGreaterThanOrEqual(MIN_TARGET);
    if (evidence) {
        await section.screenshot({ path: resolve(evidence, `section-account-menu-${testInfo.project.name}.png`) });
    }

    await button.click();
    await expect(menu).toBeVisible();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toHaveAccessibleName('Alex North');
    expect(await menu.evaluate((element) => element.matches(':popover-open'))).toBe(true);
    await expectAnchored(page, button, menu);
    const panel = await menu.boundingBox();
    expect(Math.abs(panel.x + panel.width - (target.x + target.width))).toBeLessThan(1);
    const current = menu.getByRole('menuitem', { name: 'Recycle bin' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(menu.locator('[aria-current]')).toHaveCount(1);
    await expectOnTop(menu.getByRole('menuitem', { name: 'Sign out' }));
    await expectAboveStickyBar(button, menu.getByRole('menuitem', { name: 'Sign out' }));
    const marked = await current.evaluate((element) => getComputedStyle(element).backgroundColor);
    const plain = await menu.getByRole('menuitem', { name: 'Help' }).evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(marked).not.toBe(plain);
    if (evidence) {
        await page.screenshot({ path: resolve(evidence, `open-account-menu-${testInfo.project.name}.png`) });
    }

    await menu.getByRole('menuitem', { name: 'Settings' }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator('#account-menu-demo-result')).toHaveText('Route: #/settings');
    await expect(page).toHaveURL(new RegExp(`${GALLERY.replaceAll('.', '\\.')}$`));
    await button.click();
    await expect(menu.getByRole('menuitem', { name: 'Settings' })).toHaveAttribute('aria-current', 'page');
    await page.locator('#account-menu-title').click();
    await expect(menu).toBeHidden();
    await expect(button).toHaveAttribute('aria-expanded', 'false');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});

test('account menu works by keyboard and signs out to the person icon', async ({ page }) => {
    const problems = await openGallery(page);
    const button = page.locator('#account-menu-demo-button');
    const menu = page.locator('#account-menu-demo');
    await page.locator('#account-menu').scrollIntoViewIfNeeded();
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Recycle bin' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem', { name: 'Settings' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
    await expect(page.locator('#account-menu-demo-result')).toHaveText('Route: #/settings');

    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem', { name: 'Recycle bin' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();

    await page.keyboard.press('ArrowUp');
    await expect(menu.getByRole('menuitem', { name: 'Sign out' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toBeHidden();
    await expect(button).toHaveAccessibleName('Not signed in');
    await expect(button.locator('.avatar use')).toHaveAttribute('href', /#icon-user$/);
    await page.keyboard.press('Space');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAccessibleName('Not signed in');
    await expect(menu.getByRole('menuitem', { name: 'Sign in' })).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(menu).toBeHidden();
    expect(problems).toEqual([]);
});

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('account menu opens through popovertarget', async ({ page }) => {
        await page.goto(GALLERY, { waitUntil: 'networkidle' });
        await page.locator('#account-menu-demo-button').click();
        await expect(page.locator('#account-menu-demo')).toBeVisible();
    });
});
