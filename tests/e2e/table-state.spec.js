// Browser integration checks for table-state.js in the admin console shell demo.
import { expect, test } from '@playwright/test';
import { settleGalleryStyles, smallTargets } from './gallery-helpers.js';

test('admin console demo persists filters and page in the hash without history entries and survives reload', async ({ page }) => {
    test.skip(page.viewportSize().width < 1024, 'admin console demo targets desktop widths');
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));

    const response = await page.goto('/demo/shell-admin-console.html', { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await settleGalleryStyles(page);

    const historyBefore = await page.evaluate(() => history.length);
    const pager = page.locator('[data-table-state-pager]');
    const pagerText = pager.locator('[data-table-state-text]');
    const firstBtn = pager.locator('[data-table-state-action="first"]');
    const prevBtn = pager.locator('[data-table-state-action="prev"]');
    const nextBtn = pager.locator('[data-table-state-action="next"]');
    const lastBtn = pager.locator('[data-table-state-action="last"]');
    const rows = page.locator('.table__frame tbody tr');

    // Initial state: page 1 of 2 with boundary buttons disabled/enabled appropriately.
    await expect(rows).toHaveCount(4);
    await expect(pagerText).toContainText('Page 1 of 2');
    await expect(firstBtn).toBeDisabled();
    await expect(prevBtn).toBeDisabled();
    await expect(nextBtn).toBeEnabled();
    await expect(lastBtn).toBeEnabled();

    // Moving to page 2 updates the table and hash without adding a history entry.
    await nextBtn.click();
    await expect(rows).toHaveCount(2);
    await expect(pagerText).toContainText('Page 2 of 2');
    await expect(firstBtn).toBeEnabled();
    await expect(prevBtn).toBeEnabled();
    await expect(nextBtn).toBeDisabled();
    await expect(lastBtn).toBeDisabled();
    expect(await page.evaluate(() => location.hash)).toBe('#?page=2');
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);

    // Filter by active status, change page size to 2, and advance to page 2.
    await page.locator('#admin-status').selectOption('active');
    await expect(pagerText).toContainText('Page 1 of 1');
    await page.locator('#admin-size').selectOption('2');
    await expect(rows).toHaveCount(2);
    await expect(pagerText).toContainText('Page 1 of 2');
    await nextBtn.click();
    await expect(pagerText).toContainText('Page 2 of 2');
    await expect(page.locator('.table__frame tbody th[scope="row"]').first()).toHaveText('Taylor Brooks');
    expect(await page.evaluate(() => location.hash)).toBe('#?status=active&size=2&page=2');
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);

    // Reloading the page restores the filter, page size, and page 2 rows from the hash query.
    await page.reload({ waitUntil: 'networkidle' });
    await settleGalleryStyles(page);
    await expect(page.locator('#admin-status')).toHaveValue('active');
    await expect(page.locator('#admin-size')).toHaveValue('2');
    await expect(pagerText).toContainText('Page 2 of 2');
    await expect(rows).toHaveCount(2);
    await expect(page.locator('.table__frame tbody th[scope="row"]').first()).toHaveText('Taylor Brooks');

    // A shared link with an out-of-range page clamps to available pages and drops page=1 from the hash.
    await page.goto('/demo/shell-admin-console.html#?q=alex&page=99', { waitUntil: 'networkidle' });
    await settleGalleryStyles(page);
    await expect(page.locator('#admin-filter')).toHaveValue('alex');
    await expect(rows).toHaveCount(1);
    await expect(page.locator('.table__frame tbody th[scope="row"]')).toHaveText('Alex North');
    await expect(pagerText).toContainText('Page 1 of 1');
    expect(await page.evaluate(() => location.hash)).toBe('#?q=alex');

    // Clearing the filter drops empty values from the hash.
    await page.locator('#admin-filter').fill('');
    await expect(rows).toHaveCount(4);
    expect(await page.evaluate(() => location.hash)).toBe('');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);
    expect(problems).toEqual([]);
});
