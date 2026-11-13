import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, tokenColor } from './gallery-helpers.js';

test('decorative spinner sizes accompany status and stop under reduced motion', async ({ page }, testInfo) => {
    const failed = [];
    page.on('requestfailed', request => failed.push(request.url()));
    const problems = await openGallery(page);
    const section = page.locator('#spinner');
    await expect(section).toHaveCount(1);
    for (const look of ['neutral', 'warm', 'bright']) {
        await selectGalleryLook(page, look);
        const spinners = section.locator('.spinner');
        await expect(spinners).toHaveCount(2);
        await expect(section.getByRole('status')).toHaveText(['Syncing...', 'Loading details...']);
        const sizes = [];
        for (const spinner of await spinners.all()) {
            await expect(spinner).toHaveAttribute('aria-hidden', 'true');
            await expect(spinner).toHaveCSS('border-top-color', await tokenColor(page, '--color-primary'));
            sizes.push(await spinner.evaluate(element => parseFloat(getComputedStyle(element).width)));
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await expect(spinner).toHaveCSS('animation-name', 'spinner-turn');
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await expect(spinner).toHaveCSS('animation-name', 'none');
        }
        expect(sizes[0]).toBeLessThan(sizes[1]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (process.env.PROGRESS_PROOF) {
            await section.screenshot({ path: `${process.env.PROGRESS_PROOF}/after-spinner-${look}-${testInfo.project.name}.png` });
        }
    }
    await page.emulateMedia({ forcedColors: 'active' });
    for (const spinner of await section.locator('.spinner').all()) {
        await expect(spinner).toHaveCSS('border-top-style', 'solid');
        const colors = await spinner.evaluate(element => {
            const style = getComputedStyle(element);
            return [style.borderTopColor, style.borderRightColor];
        });
        expect(colors[0]).not.toBe(colors[1]);
    }
    expect(failed).toEqual([]);
    expect(problems).toEqual([]);
});
