import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, ring, expectRing, styles, tokenColor, tokenLength, smallTargets } from './gallery-helpers.js';

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} lists retain semantics, wrap content, and preserve action focus`, async ({ page }, testInfo) => {
        const failures = [];
        page.on('requestfailed', request => failures.push(request.url()));
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        if (process.env.T0048_BEFORE && look === 'neutral') {
            await page.locator('#list').screenshot({ path: `${process.env.T0048_BEFORE}/before-list-${testInfo.project.name}.png` });
        }
        if (process.env.LIST_TABLE_BEFORE) {
            await page.locator('#row').screenshot({ path: `${process.env.LIST_TABLE_BEFORE}/before-${look}-${testInfo.project.name}.png` });
        }
        const section = page.locator('#list');
        await expect(section).toBeVisible({ timeout: 1000 });
        const list = section.getByRole('list', { name: 'Shared collections' });
        await expect(list.getByRole('listitem')).toHaveCount(3);
        expect(await list.ariaSnapshot()).toContain('listitem');
        await expect(section.getByRole('list', { name: 'Supplies' }).getByRole('listitem')).toHaveCount(2);
        const definitions = section.locator('.list--definitions');
        await expect(definitions.getByRole('term')).toHaveCount(2);
        await expect(definitions.getByRole('definition')).toHaveCount(2);
        const term = await definitions.locator('.list__term').first().boundingBox();
        const value = await definitions.locator('.list__value').first().boundingBox();
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

    test(`${look} facts lists render bordered term and value rows with a narrower compact column`, async ({ page }, testInfo) => {
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        const section = page.locator('#list');
        const facts = section.locator('dl.list.list--facts:not(.list--compact)');
        const compact = section.locator('dl.list.list--facts.list--compact');
        await expect(facts).toHaveCount(1);
        await expect(compact).toHaveCount(1);

        expect(await styles(facts, ['background-color', 'border-top-left-radius'])).toEqual({
            'background-color': await tokenColor(page, '--color-surface'),
            'border-top-left-radius': await tokenLength(page, '--radius-card')
        });
        const muted = await tokenColor(page, '--color-text-muted');
        const firstTerm = facts.locator('.list__term').first();
        const firstValue = facts.locator('.list__value').first();
        expect((await styles(firstTerm, ['color'])).color).toBe(muted);
        expect(parseFloat((await styles(firstTerm, ['border-bottom-width']))['border-bottom-width'])).toBeGreaterThan(0);
        expect(parseFloat((await styles(facts.locator('.list__term').last(), ['border-bottom-width']))['border-bottom-width'])).toBe(0);
        expect(parseFloat((await styles(facts.locator('.list__value').last(), ['border-bottom-width']))['border-bottom-width'])).toBe(0);

        const termBox = await firstTerm.boundingBox();
        const valueBox = await firstValue.boundingBox();
        const compactBox = await compact.locator('.list__term').first().boundingBox();
        expect(valueBox.x).toBeGreaterThanOrEqual(termBox.x + termBox.width - 0.5);
        expect(valueBox.y).toBeCloseTo(termBox.y, 0);
        expect(compactBox.width).toBeLessThan(termBox.width);
        expect(await section.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        if (process.env.T0048_AFTER) {
            await section.screenshot({ path: `${process.env.T0048_AFTER}/after-list-${look}-${testInfo.project.name}.png` });
        }
        expect(problems).toEqual([]);
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
