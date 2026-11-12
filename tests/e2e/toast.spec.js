import { expect, test } from '@playwright/test';
import { openGallery } from './gallery-helpers.js';
import { resolve } from 'node:path';

const evidence = process.env.TOAST_EVIDENCE;

/**
 * Check that a toast sits inside the demo frame and the viewport.
 * @param {import('@playwright/test').Page} page page to probe
 * @param {import('@playwright/test').Locator} toast shown toast
 */
async function expectFramed(page, toast) {
    const box = await toast.boundingBox();
    const frame = await page.locator('.toast-frame').boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(Math.max(0, frame.x));
    expect(box.x + box.width).toBeLessThanOrEqual(Math.min(page.viewportSize().width, frame.x + frame.width));
    expect(box.y).toBeGreaterThanOrEqual(frame.y);
    expect(box.y + box.height).toBeLessThanOrEqual(frame.y + frame.height);
}

test('toast Undo, Ctrl+Z, expiry, and modal holding', async ({ page }, testInfo) => {
    await page.clock.install();
    const problems = await openGallery(page);
    const region = page.locator('#toast-demo-region');
    const toasts = region.locator('.toast');
    const result = page.locator('#toast-demo-result');
    const remove = page.locator('#toast-demo-delete');
    const update = page.locator('#toast-demo-update');
    const polite = page.locator('[data-live-region="polite"]');
    await expect(region).toHaveAttribute('role', 'region');
    await expect(region).toHaveAttribute('aria-label', 'Notifications');
    await page.locator('#toast').scrollIntoViewIfNeeded();

    // Undo by pointer returns focus to the control that raised the toast.
    await remove.click();
    await expect(toasts).toHaveCount(1);
    await expect(toasts).toContainText('Sample task moved to the recycle bin.');
    await expect(result).toHaveText('Sample task deleted.');
    await expectFramed(page, toasts);
    await page.clock.runFor(200);
    await expect(polite).toHaveText('Sample task moved to the recycle bin.');
    await toasts.getByRole('button', { name: 'Undo' }).click();
    await expect(toasts).toHaveCount(0);
    await expect(result).toHaveText('Sample task restored.');
    await expect(remove).toBeFocused();

    // Undo by keyboard: Enter on the focused button, then Ctrl+Z outside text fields.
    await page.keyboard.press('Enter');
    await expect(toasts).toHaveCount(1);
    await toasts.getByRole('button', { name: 'Undo' }).press('Enter');
    await expect(toasts).toHaveCount(0);
    await expect(result).toHaveText('Sample task restored.');
    await expect(remove).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(result).toHaveText('Sample task deleted.');
    await page.keyboard.press('Control+z');
    await expect(toasts).toHaveCount(0);
    await expect(result).toHaveText('Sample task restored.');

    // Escape dismisses without Undo; a plain toast expires after 8 seconds, a persistent one stays.
    await remove.click();
    await toasts.getByRole('button', { name: 'Undo' }).focus();
    await page.keyboard.press('Escape');
    await expect(toasts).toHaveCount(0);
    await expect(result).toHaveText('Sample task deleted.');
    await expect(remove).toBeFocused();
    await remove.click();
    await update.click();
    await expect(toasts).toHaveCount(2);
    await page.mouse.move(0, 0);
    await page.clock.runFor(8_000);
    await expect(toasts).toHaveCount(1);
    await expect(toasts).toContainText('A new version is ready.');
    await page.clock.runFor(60_000);
    await expect(toasts).toHaveCount(1);
    await page.keyboard.press('Control+z');
    await expect(toasts).toHaveCount(1);
    await toasts.getByRole('button', { name: 'Reload' }).click();
    await expect(toasts).toHaveCount(0);
    await expect(result).toHaveText('Reload chosen.');

    // A toast raised while a modal is open waits until the modal closes.
    await page.locator('#toast-demo-modal').click();
    const modal = page.locator('#toast-modal');
    await expect(modal).toBeVisible();
    await modal.getByRole('button', { name: 'Delete sample task' }).click();
    await page.clock.runFor(10_000);
    await expect(toasts).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
    await expect(toasts).toHaveCount(1);
    await expectFramed(page, toasts);
    await toasts.getByRole('button', { name: 'Undo' }).click();
    await expect(result).toHaveText('Sample task restored.');

    if (evidence) {
        for (const look of ['neutral', 'warm', 'bright']) {
            await page.locator('#look-select').selectOption(look);
            await page.waitForFunction(name => [...document.styleSheets].some(sheet => sheet.href?.includes(`/looks/${name}/index.css`)), look);
            await remove.click();
            await update.click();
            await page.mouse.move(0, 0);
            await page.locator('#toast').screenshot({ path: resolve(evidence, `after-toast-${look}-${testInfo.project.name}.png`) });
            await toasts.getByRole('button', { name: 'Undo' }).click();
            await toasts.getByRole('button', { name: 'Reload' }).click();
        }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});
