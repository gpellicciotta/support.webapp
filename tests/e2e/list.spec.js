import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, ring, expectRing, tokenColor, smallTargets } from './gallery-helpers.js';

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} lists retain semantics, wrap content, and preserve action focus`, async ({ page }, testInfo) => {
        const failures = [];
        page.on('requestfailed', request => failures.push(request.url()));
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        if (process.env.LIST_TABLE_BEFORE) {
            await page.locator('#row').screenshot({ path: `${process.env.LIST_TABLE_BEFORE}/before-${look}-${testInfo.project.name}.png` });
        }
        const section = page.locator('#list');
        await expect(section).toBeVisible({ timeout: 1000 });
        const list = section.getByRole('list', { name: 'Shared collections' });
        await expect(list.getByRole('listitem')).toHaveCount(3);
        expect(await list.ariaSnapshot()).toContain('listitem');
        await expect(section.getByRole('list', { name: 'Supplies' }).getByRole('listitem')).toHaveCount(2);
        await expect(section.getByRole('term')).toHaveCount(2);
        await expect(section.getByRole('definition')).toHaveCount(2);
        const term = await section.locator('.list__term').first().boundingBox();
        const value = await section.locator('.list__value').first().boundingBox();
        if (page.viewportSize().width === 390) {
            expect(value.y).toBeGreaterThanOrEqual(term.y + term.height);
        }
        else {
            expect(value.x).toBeGreaterThan(term.x);
            expect(value.y).toBeCloseTo(term.y, 0);
        }
        const edit = list.getByRole('button', { name: 'Edit Groceries' });
        expectRing(await ring(edit), await tokenColor(page, '--color-focus'), 'list action');
        await page.keyboard.press('Tab');
        await expect(list.getByRole('button', { name: 'Open collection' })).toBeFocused();
        await expect(list.getByRole('button', { name: 'Edit archived collection' })).toBeDisabled();
        expect((await smallTargets(page, '#list button')).small).toEqual([]);
        expect(await section.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (process.env.LIST_TABLE_PROOF) {
            await section.screenshot({ path: `${process.env.LIST_TABLE_PROOF}/after-list-${look}-${testInfo.project.name}.png` });
        }
        expect([...problems, ...failures]).toEqual([]);
    });
}

test('ordered lists preserve visible sequence markers', async ({ page }) => {
    const problems = await openGallery(page);
    const ordered = page.locator('#list').getByRole('list', { name: 'Preparation steps' });
    await expect(ordered).toBeVisible({ timeout: 1000 });
    await expect(ordered).toHaveCSS('list-style-type', 'decimal');
    await expect(ordered.getByRole('listitem')).toHaveCount(2);
    expect(await ordered.evaluate(element => element.tagName)).toBe('OL');
    expect(problems).toEqual([]);
});
