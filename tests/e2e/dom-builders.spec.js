// Browser integration checks for dom-builders.js driving the admin console shell demo.
import { expect, test } from '@playwright/test';
import { selectGalleryLook, settleGalleryStyles, smallTargets } from './gallery-helpers.js';

test('admin console demo filters rows and renders builder empty state, facts, and inline confirm without errors', async ({ page }) => {
    test.skip(page.viewportSize().width < 1024, 'admin console demo targets desktop widths');
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));

    const response = await page.goto('/demo/shell-admin-console.html', { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await settleGalleryStyles(page);

    // Table, status chips, facts list, and inline confirm slot are rendered by dom-builders.
    const tableRegion = page.locator('.table__frame[role="region"]');
    await expect(tableRegion).toBeVisible();
    await expect(tableRegion.locator('tbody tr')).toHaveCount(4);
    await expect(tableRegion.locator('.chip--status[data-severity="ok"]')).toHaveCount(2);
    await expect(tableRegion.locator('.chip--status.chip--warning[data-severity="warning"]')).toHaveCount(1);
    await expect(tableRegion.locator('.chip--status.chip--danger[data-severity="error"]')).toHaveCount(1);
    await expect(page.locator('[data-inline-confirm-slot]')).toHaveCount(1);

    // Filtering by status narrows the table and updates the pager summary.
    await page.locator('#admin-status').selectOption('warning');
    await expect(tableRegion.locator('tbody tr')).toHaveCount(1);
    await expect(tableRegion.locator('tbody th[scope="row"]')).toHaveText('Jordan Kim');

    // A non-matching query renders an empty state with a Clear filter button that restores all rows.
    await page.locator('#admin-filter').fill('no-such-person');
    const empty = page.locator('.empty-state');
    await expect(empty).toBeVisible();
    await expect(empty.locator('.empty-state__text')).toContainText('no-such-person');
    await empty.getByRole('button', { name: 'Clear filter' }).click();
    await expect(tableRegion.locator('tbody tr')).toHaveCount(4);
    await expect(page.locator('#admin-status')).toHaveValue('');
    await expect(page.locator('#admin-filter')).toHaveValue('');

    // Switching looks keeps dynamically built facts and chips valid.
    await selectGalleryLook(page, 'warm');
    await settleGalleryStyles(page);
    await page.getByRole('button', { name: 'Inspect Morgan Lee' }).click();
    await expect(page.locator('.list--facts [data-fact="status"] .chip--danger')).toHaveText('Locked');
    await expect(page.locator('.list--facts [data-fact="status"] use')).toHaveAttribute('href', '../looks/warm/icons.svg#icon-alert');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);
    expect(problems).toEqual([]);
});
