import { expect, test } from '@playwright/test';
import { openGallery } from './gallery-helpers.js';
import { looks } from '../../src/demo/gallery.js';

test('loading status and slow-list placeholders render across looks and motion preferences', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(request.url()));
    const section = page.locator('#loading');
    await expect(section).toBeVisible();
    for (const look of looks) {
        await page.locator('#look-select').selectOption(look);
        await page.waitForFunction((selectedLook) => {
            const sheet = document.getElementById('look-stylesheet').sheet;
            return sheet?.href.endsWith(`/looks/${selectedLook}/index.css`) && sheet.cssRules.length > 0;
        }, look);
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => document.fonts.ready.then(() => true));
        for (const reducedMotion of ['no-preference', 'reduce']) {
            await page.emulateMedia({ reducedMotion });
            const skeleton = section.locator('.loading__skeleton');
            await expect(skeleton).toBeVisible();
            await expect(skeleton).toHaveCSS('animation-name', 'none');
            await expect(skeleton.locator('.loading__placeholder').first()).toHaveCSS('animation-name', 'none');
            await expect(section.locator('[role="status"]').first()).toContainText('Loading');
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        }
        if (process.env.LOADING_PROOF) {
            await section.screenshot({ path: `${process.env.LOADING_PROOF}/after-${look}-${testInfo.project.name}.png` });
        }
    }
    expect(problems).toEqual([]);
});
