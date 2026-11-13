import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { openGallery, selectGalleryLook, smallTargets } from './gallery-helpers.js';

test('selection supports pointer ranges, keyboard, bulk bin action and Undo', async ({ page }, testInfo) => {
    const problems = [];
    page.on('requestfailed', request => problems.push(`request: ${request.url()}`));
    const galleryProblems = await openGallery(page);
    const section = page.locator('#selection');
    if (process.env.SELECTION_BEFORE) {
        await page.locator('#list').screenshot({ path: resolve(process.env.SELECTION_BEFORE, `before-${testInfo.project.name}.png`) });
    }
    await expect(section).toBeVisible();
    const items = section.locator('[data-selection-item]');
    await items.nth(0).check();
    await expect(section.locator('[data-selection-all]')).toHaveJSProperty('indeterminate', true);
    await expect(items.nth(3)).toBeDisabled();
    await items.nth(2).click({ modifiers: ['Shift'] });
    await expect(section.locator('[data-selection-count]')).toHaveText('3 selected');
    await expect(section.locator('[data-selection-all]')).toBeChecked();
    await items.nth(0).focus();
    await page.keyboard.press('Space');
    await expect(items.nth(0)).not.toBeChecked();
    await items.nth(2).focus();
    await page.keyboard.press('Shift+Space');
    await expect(section.locator('[data-selection-count]')).toHaveText('0 selected');
    await section.locator('[data-selection-all]').check();
    for (const look of ['neutral', 'warm', 'bright']) {
        await selectGalleryLook(page, look);
        expect((await smallTargets(page, '#selection input, #selection button')).small).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (process.env.SELECTION_EVIDENCE) {
            await section.screenshot({ path: resolve(process.env.SELECTION_EVIDENCE, `after-${look}-${testInfo.project.name}.png`) });
        }
    }
    await section.getByRole('button', { name: 'Move to bin' }).click();
    await expect(items.nth(0)).toBeHidden();
    await page.getByRole('region', { name: 'Notifications' }).getByRole('button', { name: 'Undo', exact: true }).click();
    await expect(items.nth(0)).toBeVisible();
    await expect(section.locator('[data-selection-count]')).toHaveText('0 selected');
    expect([...problems, ...galleryProblems]).toEqual([]);
});

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });
    test('native labeled rows remain selectable', async ({ page }) => {
        await page.goto('/demo/visual-style-gallery.html');
        const first = page.locator('#selection [data-selection-item]').first();
        await first.check();
        await expect(first).toBeChecked();
    });
});
