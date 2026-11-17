import { expect, test } from '@playwright/test';
import { expectRing, openGallery, ring, selectGalleryLook, smallTargets, tokenColor } from './gallery-helpers.js';

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} toolbar aligns controls to the bottom edge and wraps on narrow screens`, async ({ page }, testInfo) => {
        const failures = [];
        page.on('requestfailed', request => failures.push(request.url()));
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        const section = page.locator('#toolbar');
        await expect(section).toBeVisible({ timeout: 1000 });
        await expect(section.locator('.toolbar[hidden]')).toBeHidden();

        const bar = section.getByRole('search', { name: 'Filter sample records' });
        await expect(bar).toBeVisible();
        const search = bar.getByRole('searchbox', { name: 'Filter this page' });
        const category = bar.getByRole('combobox', { name: 'Category' });
        const pageSize = bar.getByRole('combobox', { name: 'Page size' });
        const clear = bar.getByRole('button', { name: 'Clear filters' });

        const boxes = await Promise.all([search, category, pageSize, clear].map(control => control.boundingBox()));
        if (page.viewportSize().width === 1440) {
            for (const box of boxes.slice(1)) {
                expect(Math.abs((box.y + box.height) - (boxes[0].y + boxes[0].height))).toBeLessThanOrEqual(1);
            }
            expect(boxes[1].x).toBeGreaterThan(boxes[0].x);
            expect(boxes[2].x).toBeGreaterThan(boxes[1].x);
        }
        else {
            const tops = boxes.map(box => Math.round(box.y));
            expect(Math.max(...tops)).toBeGreaterThan(Math.min(...tops));
        }

        const targets = await smallTargets(page, '#toolbar input, #toolbar select, #toolbar button');
        expect(targets.count).toBe(4);
        expect(targets.small).toEqual([]);
        expectRing(await ring(clear), await tokenColor(page, '--color-focus'), 'toolbar button');

        await search.fill('alex');
        await search.press('ArrowLeft');
        await expect(search).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(category).toBeFocused();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

        if (process.env.LIST_TABLE_PROOF) {
            await section.screenshot({ path: `${process.env.LIST_TABLE_PROOF}/after-toolbar-${look}-${testInfo.project.name}.png` });
        }
        expect([...problems, ...failures]).toEqual([]);
    });
}
