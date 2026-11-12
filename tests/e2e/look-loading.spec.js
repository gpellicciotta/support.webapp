import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, tokenColor } from './gallery-helpers.js';

for (const look of ['warm', 'bright']) {
    test(`${look} look switch waits for the stylesheet load event`, async ({ page }) => {
        const problems = await openGallery(page);
        let release;
        let requested;
        const held = new Promise(resolve => {
            release = resolve;
        });
        const started = new Promise(resolve => {
            requested = resolve;
        });
        await page.route(`**/looks/${look}/look.css`, async route => {
            requested();
            await held;
            await route.continue();
        });
        let completed = false;
        const switched = selectGalleryLook(page, look).then(() => {
            completed = true;
        });
        try {
            await started;
            expect(completed).toBe(false);
        }
        finally {
            release();
        }
        await switched;
        if (look === 'warm') {
            const box = await page.locator('#icon-tile .icon-tile--sm').first().boundingBox();
            expect(box.height).toBe(box.width);
        }
        else {
            await page.locator('#accent-select').selectOption('blue');
            const color = await tokenColor(page, '--color-primary');
            expect(color).not.toBe('rgb(0, 0, 0)');
            await expect(page.locator('#accents [data-accent="blue"] .button').first()).toHaveCSS('background-color', color);
        }
        await selectGalleryLook(page, look);
        expect(problems).toEqual([]);
    });
}
