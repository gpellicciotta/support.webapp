import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, tokenColor } from './gallery-helpers.js';

test('native progress exposes labeled values and static indeterminate feedback', async ({ page }, testInfo) => {
    const failed = [];
    page.on('requestfailed', request => failed.push(request.url()));
    const problems = await openGallery(page);
    const section = page.locator('#progress');
    if (process.env.PROGRESS_PROOF && !await section.count()) {
        await page.locator('#loading').screenshot({ path: `${process.env.PROGRESS_PROOF}/before-${testInfo.project.name}.png` });
    }
    await expect(section).toHaveCount(1);
    for (const look of ['neutral', 'warm', 'bright']) {
        await selectGalleryLook(page, look);
        await expect(section.locator('.progress__bar').first()).toHaveCSS('color', await tokenColor(page, '--color-text'));
        for (const [name, value] of [['Uploading: 40%', 40], ['Queued: 0%', 0], ['Complete: 100%', 100]]) {
            const bar = section.getByRole('progressbar', { name, exact: true });
            await expect(bar).toBeVisible();
            expect(await bar.evaluate(element => [element.tagName, element.value, element.max, element.position])).toEqual(['PROGRESS', value, 100, value / 100]);
        }
        const unknown = section.getByRole('progressbar', { name: 'Preparing upload' });
        expect(await unknown.evaluate(element => element.position)).toBe(-1);
        for (const reducedMotion of ['no-preference', 'reduce']) {
            await page.emulateMedia({ reducedMotion });
            await expect(unknown).toHaveCSS('appearance', 'none');
            await expect(unknown).toHaveCSS('animation-name', 'none');
            expect(await section.evaluate(element => element.getAnimations({ subtree: true }).length)).toBe(0);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (process.env.PROGRESS_PROOF) {
            await section.screenshot({ path: `${process.env.PROGRESS_PROOF}/after-progress-${look}-${testInfo.project.name}.png` });
        }
    }
    await page.emulateMedia({ forcedColors: 'active' });
    const bar = section.getByRole('progressbar', { name: 'Uploading: 40%', exact: true });
    await expect(bar).toBeVisible();
    await expect(bar).toHaveCSS('border-top-style', 'solid');
    expect(await bar.evaluate(element => {
        element.max = 200;
        element.value = 75;
        return [element.position, element.tabIndex];
    })).toEqual([0.375, -1]);
    expect(failed).toEqual([]);
    expect(problems).toEqual([]);
});
