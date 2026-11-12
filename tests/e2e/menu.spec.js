import { expect, test } from '@playwright/test';
import { expectAnchored, expectOnTop, openGallery } from './gallery-helpers.js';
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
