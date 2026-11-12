import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, ring, expectRing, tokenColor } from './gallery-helpers.js';

for (const look of ['neutral', 'warm']) {
    test(`${look} cards, tiles, and avatars`, async ({ page }, testInfo) => {
        const problems = await openGallery(page);
        page.on('requestfailed', request => problems.push(request.url()));
        await selectGalleryLook(page, look);
        const tileWidths = [];
        for (const size of ['sm', 'md', 'lg']) {
            const box = await page.locator(`#icon-tile .icon-tile--${size}`).first().boundingBox();
            expect(box.height).toBe(box.width);
            tileWidths.push(box.width);
        }
        expect(tileWidths[0]).toBeLessThan(tileWidths[1]);
        expect(tileWidths[1]).toBeLessThan(tileWidths[2]);
        const card = page.locator('#card a.card').first();
        await expect(card).toBeVisible();
        expect(await card.locator('button, input, a').count()).toBe(0);
        expectRing(await ring(card), await tokenColor(page, '--color-focus'), 'card');
        await card.hover();
        await expect(card).not.toHaveCSS('transform', 'none');
        await page.mouse.down();
        await expect(card).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 1)');
        await page.mouse.up();
        for (const key of ['card', 'icon-tile', 'avatar']) {
            await page.locator(`#${key}`).screenshot({ path: testInfo.outputPath(`${look}-${key}.png`) });
        }
        for (const [size, pixels] of [['sm', 48], ['md', 72], ['lg', 104]]) {
            await expect(page.locator(`#avatar > .specimens > .avatar--${size}`).first()).toHaveCSS('width', `${pixels}px`);
        }
        expect(await page.locator('#avatar img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
        const stack = page.locator('.avatar-stack .avatar');
        const first = await stack.nth(0).boundingBox();
        const second = await stack.nth(1).boundingBox();
        expect(second.x).toBeLessThan(first.x + first.width);
        for (const [size, pixels] of [['sm', 48], ['md', 72], ['lg', 104]]) {
            await stack.nth(0).evaluate((element, modifier) => {
                element.className = `avatar avatar--${modifier}`;
            }, size);
            await expect(stack.nth(0)).toHaveCSS('width', `${pixels}px`);
            await expect(stack.nth(0)).toHaveCSS('height', `${pixels}px`);
        }
        await page.locator('style').last().evaluate(element => element.remove());
        await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
        await expect(card).toHaveCSS('transition-duration', '0s, 0s');
        expect((await ring(card)).style).toBe('solid');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(problems).toEqual([]);
    });
}
