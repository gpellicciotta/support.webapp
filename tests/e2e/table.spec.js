import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, ring, expectRing, tokenColor, tokenLength } from './gallery-helpers.js';

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

    test(`${look} framed table shows hover feedback and a selected row edge and ground`, async ({ page }) => {
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        const section = page.locator('#table');
        const frame = section.getByRole('region', { name: 'Sample accounts' });
        await expect(frame).toBeVisible({ timeout: 1000 });
        await expect(frame).toHaveCSS('border-top-color', await tokenColor(page, '--color-border'));
        await expect(frame).toHaveCSS('border-top-left-radius', await tokenLength(page, '--radius-card'));

        const table = frame.getByRole('table', { name: 'Sample accounts' });
        const rows = table.locator('tbody tr');
        await expect(rows).toHaveCount(4);
        await expect(rows.last().locator('td').first()).toHaveCSS('border-bottom-width', '0px');

        const hoverColor = await tokenColor(page, '--color-surface-hover');
        await expect(rows.nth(1)).toHaveCSS('background-color', hoverColor);
        await rows.first().hover();
        await expect(rows.first()).toHaveCSS('background-color', hoverColor);

        const selected = table.locator('tbody tr[aria-selected="true"]');
        await expect(selected).toHaveCount(1);
        await expect(selected).toHaveCSS('background-color', await tokenColor(page, '--color-surface-selected'));
        const primary = await tokenColor(page, '--color-primary');
        const strong = await tokenLength(page, '--border-width-strong');
        const ringWidth = await tokenLength(page, '--focus-ring-width');
        expect(await selected.evaluate(row => getComputedStyle(row).boxShadow)).toBe(`${primary} ${strong} 0px 0px 0px inset`);

        await frame.evaluate(el => el.setAttribute('dir', 'rtl'));
        expect(await selected.evaluate(row => getComputedStyle(row).boxShadow)).toBe(`${primary} -${strong} 0px 0px 0px inset`);
        await frame.evaluate(el => el.removeAttribute('dir'));

        await page.emulateMedia({ forcedColors: 'active' });
        const expectedForcedWidth = `${Math.max(parseFloat(strong), parseFloat(ringWidth))}px`;
        await expect(selected.locator(':scope > :first-child')).toHaveCSS('border-inline-start-width', expectedForcedWidth);
        await page.emulateMedia({ forcedColors: 'none' });

        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(problems).toEqual([]);
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
