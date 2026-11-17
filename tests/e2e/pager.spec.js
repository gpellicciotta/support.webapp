import { expect, test } from '@playwright/test';
import { expectRing, openGallery, ring, selectGalleryLook, smallTargets, styles, tokenColor } from './gallery-helpers.js';

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} pager exposes boundary button states and wraps without overflow`, async ({ page }, testInfo) => {
        const failures = [];
        page.on('requestfailed', request => failures.push(request.url()));
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        const section = page.locator('#pager');
        await expect(section).toBeVisible({ timeout: 1000 });
        await expect(section.locator('.pager[hidden]')).toBeHidden();

        const firstNav = section.getByRole('navigation', { name: 'First page example' });
        await expect(firstNav).toBeVisible();
        const status = firstNav.locator('.pager__text');
        await expect(status).toHaveText('Page 1 · 20 records shown');
        expect(await styles(status, ['color', 'font-variant-numeric'])).toEqual({
            color: await tokenColor(page, '--color-text-muted'),
            'font-variant-numeric': 'tabular-nums'
        });

        await expect(firstNav.getByRole('button', { name: 'First' })).toBeDisabled();
        await expect(firstNav.getByRole('button', { name: 'Previous' })).toBeDisabled();
        const next = firstNav.getByRole('button', { name: 'Next' });
        const last = firstNav.getByRole('button', { name: 'Last' });
        await expect(next).toBeEnabled();
        await expect(last).toBeEnabled();

        const lastNav = section.getByRole('navigation', { name: 'Last page example' });
        await expect(lastNav.getByRole('button', { name: 'First' })).toBeEnabled();
        await expect(lastNav.getByRole('button', { name: 'Previous' })).toBeEnabled();
        await expect(lastNav.getByRole('button', { name: 'Next' })).toBeDisabled();
        await expect(lastNav.getByRole('button', { name: 'Last' })).toBeDisabled();

        if (page.viewportSize().width === 1440) {
            const textBox = await status.boundingBox();
            const buttonsBox = await firstNav.locator('.pager__buttons').boundingBox();
            expect(buttonsBox.x).toBeGreaterThan(textBox.x + textBox.width);
        }

        const targets = await smallTargets(page, '#pager button:not(:disabled)');
        expect(targets.count).toBe(4);
        expect(targets.small).toEqual([]);
        expectRing(await ring(next), await tokenColor(page, '--color-focus'), 'pager Next button');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

        if (process.env.LIST_TABLE_PROOF) {
            await section.screenshot({ path: `${process.env.LIST_TABLE_PROOF}/after-pager-${look}-${testInfo.project.name}.png` });
        }
        expect([...problems, ...failures]).toEqual([]);
    });
}
