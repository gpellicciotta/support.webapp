// Browser integration checks for admin-logs.js in the admin console shell demo:
// filtered and paged entry cards, URL hash persistence across reload, empty/error/401 states, and cross-look layout checks.
import { expect, test } from '@playwright/test';
import { selectGalleryLook, settleGalleryStyles, smallTargets } from './gallery-helpers.js';

/**
 * Open the admin console demo at `#/logs` (with optional hash query) and collect console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page Playwright page
 * @param {string} [hash] route hash, `'#/logs'` by default
 * @returns {Promise<string[]>} live list of errors
 */
async function openLogs(page, hash = '#/logs') {
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
    const response = await page.goto(`/demo/shell-admin-console.html${hash}`, { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await settleGalleryStyles(page);
    return problems;
}

test('admin console demo filters log entry cards by level, survives reload, pages cards, and handles empty and failure states', async ({ page }) => {
    const problems = await openLogs(page);
    const historyBefore = await page.evaluate(() => history.length);

    const logs = page.locator('[data-admin-logs]');
    await expect(logs).toBeVisible();
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Logs');
    await expect(page.locator('[data-admin-console-nav="logs"]')).toHaveAttribute('aria-current', 'page');

    const items = logs.locator('[data-admin-logs-item]');
    const levelSelect = logs.locator('[data-admin-logs-filter="level"]');
    const filterInput = logs.locator('[data-admin-logs-filter="q"]');
    const pager = logs.locator('[data-table-state-pager]');
    const pagerText = pager.locator('[data-table-state-text]');

    // Initial load shows first page of entry cards with stripped multiline message and chips.
    const initialCount = await items.count();
    expect(initialCount).toBeGreaterThan(0);
    await expect(pager).toBeVisible();
    await expect(pagerText).toContainText('Page 1 of 2');
    await expect(items.first().locator('[data-admin-logs-message]')).toContainText('\n    at ');

    // Advancing to page 2 updates cards and hash without adding a history entry.
    await pager.locator('[data-table-state-action="next"]').click();
    await expect(pagerText).toContainText('Page 2 of 2');
    expect(await page.evaluate(() => location.hash)).toBe('#/logs?page=2');
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);

    // Selecting the Error level filter narrows the cards, resets to page 1, and updates the URL hash.
    await levelSelect.selectOption('error');
    const errorCount = await items.count();
    expect(errorCount).toBeGreaterThan(0);
    expect(errorCount).toBeLessThan(initialCount);
    await expect(logs.locator('[data-admin-logs-item] [data-severity="error"]')).toHaveCount(errorCount);
    expect(await page.evaluate(() => location.hash)).toBe('#/logs?level=error');
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);

    // Reloading the page keeps the Error level filter and the narrowed cards.
    await page.reload({ waitUntil: 'networkidle' });
    await settleGalleryStyles(page);
    await expect(levelSelect).toHaveValue('error');
    await expect(items).toHaveCount(errorCount);
    await expect(logs.locator('[data-admin-logs-item] [data-severity="error"]')).toHaveCount(errorCount);

    // Unmatched text filter shows filtered empty state; Clear filters restores cards and clears hash.
    await filterInput.fill('no-matching-log-entry-xyz');
    const filteredEmpty = logs.locator('[data-admin-logs-empty="filtered"]');
    await expect(filteredEmpty).toBeVisible();
    await expect(pager).toBeHidden();
    await filteredEmpty.locator('[data-admin-logs-action="clear"]').click();
    await expect(items).toHaveCount(initialCount);
    expect(await page.evaluate(() => location.hash)).toBe('#/logs');

    // Demo state previews: empty buffer, fetch failure with Retry recovery, and 401 Sign in.
    await page.locator('[data-demo-logs="empty"]').click();
    await expect(logs.locator('[data-admin-logs-empty="buffer"]')).toBeVisible();
    await expect(pager).toBeHidden();

    await page.locator('[data-demo-logs="fail-once"]').click();
    const errorBanner = logs.locator('[data-data-loader-error="failed"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveAttribute('role', 'alert');
    await errorBanner.locator('[data-data-loader-action="retry"]').click();
    await expect(errorBanner).toHaveCount(0);
    await expect(items).toHaveCount(initialCount);

    await page.locator('[data-demo-logs="unauthorized"]').click();
    const authBanner = logs.locator('[data-data-loader-error="unauthorized"]');
    await expect(authBanner).toBeVisible();
    await authBanner.locator('[data-data-loader-action="sign-in"]').click();
    await expect(page.locator('.toast-region .toast')).toContainText('Signed in');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);
    expect(problems).toEqual([]);
});

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} admin logs screen passes layout and target checks`, async ({ page }, testInfo) => {
        const problems = await openLogs(page);
        await selectGalleryLook(page, look);
        await settleGalleryStyles(page);

        const logs = page.locator('[data-admin-logs]');
        await expect(logs.locator('[data-admin-logs-list]')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);

        if (process.env.T0297_CAPTURE_DIR) {
            if (page.viewportSize().width < 1024) {
                await logs.scrollIntoViewIfNeeded();
            }
            await page.screenshot({
                path: `${process.env.T0297_CAPTURE_DIR}/after-admin-logs-${look}-${testInfo.project.name}.png`
            });
        }

        expect(problems).toEqual([]);
    });
}
