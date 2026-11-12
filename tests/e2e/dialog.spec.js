import { expect, test } from '@playwright/test';
import { openGallery } from './gallery-helpers.js';
import { resolve } from 'node:path';

const evidence = process.env.DIALOG_EVIDENCE;

test('dialog confirmation tiers', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(request.url()));
    await page.locator('#dialog').scrollIntoViewIfNeeded();
    for (const look of ['neutral', 'warm', 'bright']) {
        await page.locator('#look-select').selectOption(look);
        await page.waitForFunction(name => [...document.styleSheets].some(sheet => sheet.href?.includes(`/looks/${name}/index.css`)), look);
        const opener = page.locator('[data-dialog-open="confirm-list"]');
        await opener.click();
        const dialog = page.locator('#confirm-list');
        await expect(dialog).toBeVisible();
        const keep = dialog.getByRole('button', { name: 'Keep' });
        const remove = dialog.getByRole('button', { name: 'Delete list' });
        await remove.focus();
        await page.keyboard.press('Tab');
        await expect(keep).toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await expect(remove).toBeFocused();
        const box = await dialog.boundingBox();
        if (page.viewportSize().width < 1024) {
            expect(box.width).toBe(page.viewportSize().width);
            expect(box.height).toBe(page.viewportSize().height);
        }
        else {
            expect(box.width).toBeLessThan(page.viewportSize().width);
        }
        if (evidence) {
            await page.screenshot({ path: resolve(evidence, `after-${look}-${testInfo.project.name}.png`) });
        }
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
        await expect(opener).toBeFocused();
    }
    await page.locator('[data-dialog-open="confirm-data"]').click();
    const typed = page.locator('#confirm-data');
    const erase = typed.getByRole('button', { name: 'Erase data' });
    await expect(erase).toBeDisabled();
    await typed.getByLabel('Type DELETE to continue').fill('delete');
    await expect(erase).toBeDisabled();
    await typed.getByLabel('Type DELETE to continue').fill('DELETE');
    await expect(erase).toBeEnabled();
    if (evidence) {
        await page.screenshot({ path: resolve(evidence, `typed-${testInfo.project.name}.png`) });
    }
    await erase.click();
    await expect(typed).not.toBeVisible();
    await page.locator('[data-dialog-open="confirm-data"]').click();
    await expect(erase).toBeDisabled();
    await page.keyboard.press('Escape');
    const trigger = page.locator('[data-inline-confirm-trigger]');
    await trigger.click();
    await expect(page.locator('[data-inline-confirm]')).toBeFocused();
    if (evidence) {
        await page.locator('#inline-confirm').screenshot({ path: resolve(evidence, `inline-${testInfo.project.name}.png`) });
    }
    await page.getByRole('button', { name: 'Keep note' }).click();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});
