import { expect, test } from '@playwright/test';
import { join } from 'node:path';
import { openGallery, selectGalleryLook, tokenColor } from './gallery-helpers.js';

test('badges show labeled tones without adding keyboard stops', async ({ page }, testInfo) => {
    const failed = [];
    page.on('requestfailed', request => failed.push(request.url()));
    const problems = await openGallery(page);
    const section = page.locator('#badge');
    if (process.env.BADGE_EVIDENCE_DIR) {
        const exists = await section.count();
        await (exists ? section : page.locator('#chip')).screenshot({
            path: join(process.env.BADGE_EVIDENCE_DIR, `${exists ? 'after' : 'before'}-${testInfo.project.name}.png`)
        });
    }
    await expect(section).toHaveCount(1);
    for (const look of ['neutral', 'warm', 'bright']) {
        await selectGalleryLook(page, look);
        for (const [variant, role] of [['', 'text'], ['--count', 'text'], ['--success', 'on-success'], ['--warning', 'on-warning'], ['--danger', 'on-danger']]) {
            const badge = section.locator(variant ? `.badge${variant}` : '.badge:not([class*="badge--"], [hidden])');
            await expect(badge).toHaveCount(1);
            await expect(badge).toHaveText(/\S/);
            expect(await badge.evaluate(element => ({ tag: element.tagName, tab: element.tabIndex }))).toEqual({ tag: 'SPAN', tab: -1 });
            expect(await badge.evaluate(element => getComputedStyle(element).color)).toBe(await tokenColor(page, `--color-${role}`));
            const contrast = await badge.evaluate(element => {
                const style = getComputedStyle(element);
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const luminance = color => {
                    context.fillStyle = color;
                    context.fillRect(0, 0, 1, 1);
                    const channels = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3).map(value => {
                        const channel = value / 255;
                        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
                    });
                    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
                };
                const values = [luminance(style.color), luminance(style.backgroundColor)].sort((a, b) => b - a);
                return (values[0] + 0.05) / (values[1] + 0.05);
            });
            expect(contrast, `${look} ${variant}`).toBeGreaterThanOrEqual(4.5);
            await badge.evaluate(element => element.focus());
            expect(await badge.evaluate(element => element === document.activeElement)).toBe(false);
        }
        await expect(section.locator('.badge--count')).toHaveText('3 unread');
        await expect(section.locator('.badge[hidden]')).toBeHidden();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    await page.emulateMedia({ forcedColors: 'active' });
    for (const badge of await section.locator('.badge:not([hidden])').all()) {
        await expect(badge).toBeVisible();
        await expect(badge).toHaveText(/\S/);
        expect(await badge.evaluate(element => getComputedStyle(element).borderTopStyle)).toBe('solid');
    }
    expect(failed).toEqual([]);
    expect(problems).toEqual([]);
});
