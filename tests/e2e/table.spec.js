import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, ring, expectRing, tokenColor } from './gallery-helpers.js';

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} tables preserve headers and captions with keyboard scroll containment`, async ({ page }, testInfo) => {
        const failures = [];
        page.on('requestfailed', request => failures.push(request.url()));
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        const section = page.locator('#table');
        await expect(section).toBeVisible({ timeout: 1000 });
        const table = section.getByRole('table', { name: 'Readings this week' });
        await expect(table.locator('caption')).toHaveText('Readings this week');
        await expect(table.getByRole('columnheader')).toHaveCount(4);
        await expect(table.locator('thead th[scope="col"]')).toHaveCount(4);
        await expect(table.getByRole('rowheader')).toHaveCount(3);
        await expect(table.locator('tbody th[scope="row"]')).toHaveCount(3);
        await expect(table).toHaveCSS('display', 'table');
        await expect(table.locator('tbody tr').first()).toHaveCSS('display', 'table-row');
        await expect(table.locator('td.table__numeric').first()).toHaveCSS('text-align', 'end');
        await expect(table.locator('td.table__numeric').first()).toHaveCSS('font-variant-numeric', 'tabular-nums');
        const scroll = section.getByRole('region', { name: 'Readings this week' });
        expectRing(await ring(scroll), await tokenColor(page, '--color-focus'), 'table scroll region');
        if (page.viewportSize().width === 390) {
            expect(await scroll.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
            await page.keyboard.press('ArrowRight');
            await expect.poll(() => scroll.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
        }
        await page.keyboard.press('Tab');
        await expect(table.getByRole('button', { name: 'View Monday' })).toBeFocused();
        expect(await table.locator('th, td').evaluateAll(cells => cells.every(cell => cell.tabIndex === -1))).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await scroll.evaluate(element => {
            element.scrollLeft = 0;
        });
        if (process.env.LIST_TABLE_PROOF) {
            await section.screenshot({ path: `${process.env.LIST_TABLE_PROOF}/after-table-${look}-${testInfo.project.name}.png` });
        }
        expect([...problems, ...failures]).toEqual([]);
    });
}

test('dense tables reduce cell padding while preserving native headers', async ({ page }) => {
    const problems = await openGallery(page);
    const dense = page.locator('#table').getByRole('table', { name: 'Summary totals' });
    await expect(dense).toBeVisible({ timeout: 1000 });
    await expect(dense.getByRole('columnheader')).toHaveCount(2);
    await expect(dense.getByRole('rowheader')).toHaveCount(2);
    const padding = await dense.locator('td').first().evaluate(element => parseFloat(getComputedStyle(element).paddingTop));
    const normal = await page.locator('#table .table:not(.table--dense) td').first().evaluate(element => parseFloat(getComputedStyle(element).paddingTop));
    expect(padding).toBeLessThan(normal);
    expect(problems).toEqual([]);
});
