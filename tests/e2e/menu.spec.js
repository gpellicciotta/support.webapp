import { expect, test } from '@playwright/test';
import { GALLERY, expectAboveStickyBar, expectAnchored, expectOnTop, expectRing, forcedRing, openGallery, selectGalleryLook, tokenColor, tokenLength } from './gallery-helpers.js';
import { resolve } from 'node:path';

const evidence = process.env.MENU_EVIDENCE;

test('menu keyboard and anchoring', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    const trigger = page.locator('#menu-demo-trigger');
    const menu = page.locator('#menu-demo');
    const result = page.locator('#menu-demo-result');
    for (const look of ['neutral', 'warm', 'bright']) {
        await page.locator('#look-select').selectOption(look);
        await page.waitForFunction(name => [...document.styleSheets].some(sheet => sheet.href?.includes(`/looks/${name}/index.css`)), look);
        await page.locator('#menu').scrollIntoViewIfNeeded();
        await trigger.focus();
        await page.keyboard.press('Enter');
        await expect(menu).toBeVisible();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await expect(menu.getByRole('menuitem', { name: 'Add to list' })).toBeFocused();
        expect(await menu.evaluate((element) => element.matches(':popover-open'))).toBe(true);
        await expectAnchored(page, trigger, menu);
        await expectOnTop(menu.getByRole('menuitem', { name: 'Delete' }));
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await expect(menu.getByRole('menuitem', { name: 'Move up' })).toBeFocused();
        await page.keyboard.press('ArrowDown');
        await expect(menu.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
        await page.keyboard.press('r');
        await expect(menu.getByRole('menuitem', { name: 'Remove from this list' })).toBeFocused();
        if (evidence) {
            await page.screenshot({ path: resolve(evidence, `after-menu-${look}-${testInfo.project.name}.png`) });
        }
        await page.keyboard.press('Enter');
        await expect(menu).toBeHidden();
        await expect(result).toHaveText('Last action: Remove from this list');
        await expect(trigger).toBeFocused();
        await page.keyboard.press('ArrowUp');
        await expect(menu.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(menu).toBeHidden();
        await expect(trigger).toBeFocused();
    }
    await trigger.click();
    await expect(menu).toBeVisible();
    await page.locator('#menu-title').click();
    await expect(menu).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});

/**
 * Measure how far each visible item of a menu sits from the menu's inner side edges.
 * @param {import('@playwright/test').Locator} menu menu panel
 * @returns {Promise<{start: number, end: number}[]>} the inline gaps of every item
 */
function sideRoom(menu) {
    return menu.evaluate((panel) => {
        const box = panel.getBoundingClientRect();
        const style = getComputedStyle(panel);
        const inner = { left: box.left + parseFloat(style.borderLeftWidth), right: box.right - parseFloat(style.borderRightWidth) };
        return [...panel.querySelectorAll('.menu__item')].map((item) => {
            const rect = item.getBoundingClientRect();
            return { start: rect.left - inner.left, end: inner.right - rect.right };
        });
    });
}

test('menu focus glows inside each item, clear of neighbors and side borders', async ({ page }) => {
    const problems = await openGallery(page);
    const trigger = page.locator('#menu-demo-trigger');
    const menu = page.locator('#menu-demo');
    for (const look of ['neutral', 'warm', 'bright']) {
        await selectGalleryLook(page, look);
        const [focus, danger, room] = await Promise.all([tokenColor(page, '--color-focus'), tokenColor(page, '--color-danger'), tokenLength(page, '--space-2')]);
        const specimens = page.locator('#menu .menu:not(#menu-demo)');
        expectRing(await forcedRing(specimens.locator('.menu__item.is-focus:not(.menu__item--danger)')), focus, `${look} item specimen`, { inset: true });
        expectRing(await forcedRing(specimens.locator('.menu__item--danger.is-focus')), danger, `${look} danger specimen`, { inset: true });
        for (const gap of (await sideRoom(specimens.first())).concat(await sideRoom(specimens.last()))) {
            expect(gap.start, `${look} start room`).toBeGreaterThanOrEqual(parseFloat(room) - 0.5);
            expect(gap.end, `${look} end room`).toBeGreaterThanOrEqual(parseFloat(room) - 0.5);
        }
        await page.locator('#menu').scrollIntoViewIfNeeded();
        await trigger.focus();
        await page.keyboard.press('Enter');
        const live = menu.getByRole('menuitem', { name: 'Add to list' });
        await expect(live).toBeFocused();
        const focusVisible = await live.evaluate((item) => item.matches(':focus-visible'));
        expectRing({ focusVisible, ...await forcedRing(live) }, focus, `${look} live item`, { inset: true });
        await page.keyboard.press('Escape');
        await expect(menu).toBeHidden();
    }
    expect(problems).toEqual([]);
});

test('menu light dismiss and top layer', async ({ page }) => {
    const problems = await openGallery(page);
    const trigger = page.locator('#menu-demo-trigger');
    const menu = page.locator('#menu-demo');
    await expect(menu).toHaveJSProperty('popover', 'auto');
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await trigger.click();
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Add to list' })).toBeFocused();
    await expectAboveStickyBar(trigger, menu.getByRole('menuitem', { name: 'Delete' }));
    await trigger.click();
    await expect(menu).toBeHidden();
    await trigger.click();
    await expect(menu).toBeVisible();
    await page.locator('#menu-demo-result').click();
    await expect(menu).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
    await expect(page.locator('#menu-demo-result')).toHaveText('Last action: none');
    expect(problems).toEqual([]);
});

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('menu opens through popovertarget', async ({ page }) => {
        await page.goto(GALLERY, { waitUntil: 'networkidle' });
        const trigger = page.locator('#menu-demo-trigger');
        const menu = page.locator('#menu-demo');
        await expect(menu).toBeHidden();
        await trigger.click();
        await expect(menu).toBeVisible();
        expect(await menu.evaluate((element) => element.matches(':popover-open'))).toBe(true);
        await expectOnTop(menu.getByText('Add to list'));
        await page.locator('#menu-demo-title').click();
        await expect(menu).toBeHidden();
    });
});
