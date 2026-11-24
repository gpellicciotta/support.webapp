// Browser integration checks for admin-system-events.js in the admin console shell demo:
// event details expand/collapse with ARIA state, server filters and offset paging, client search,
// URL hash persistence, empty/error/401 states, and cross-look layout checks.
import { expect, test } from '@playwright/test';
import { selectGalleryLook, settleGalleryStyles, smallTargets } from './gallery-helpers.js';

/**
 * Open the admin console demo at `#/system-events` and collect console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page Playwright page
 * @param {string} [hash] route hash, `'#/system-events'` by default
 * @returns {Promise<string[]>} live list of errors
 */
async function openSystemEvents(page, hash = '#/system-events') {
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

test('admin console demo expands and collapses event JSON details, filters, pages, and handles empty and failure states', async ({ page }) => {
    const problems = await openSystemEvents(page);
    const historyBefore = await page.evaluate(() => history.length);

    const screen = page.locator('[data-admin-system-events]');
    await expect(screen).toBeVisible();
    await expect(page.locator('[data-admin-console-title]')).toHaveText('System events');
    await expect(page.locator('[data-admin-console-nav="system-events"]')).toHaveAttribute('aria-current', 'page');

    const items = screen.locator('[data-admin-system-events-item]');
    const searchInput = screen.locator('[data-admin-system-events-filter="q"]');
    const typeSelect = screen.locator('[data-admin-system-events-filter="event-type"]');
    const severitySelect = screen.locator('[data-admin-system-events-filter="severity"]');
    const pager = screen.locator('[data-table-state-pager]');
    const pagerText = pager.locator('[data-table-state-text]');

    // Initial load shows first page of audit event cards.
    const initialCount = await items.count();
    expect(initialCount).toBeGreaterThan(0);
    await expect(pager).toBeVisible();
    await expect(pagerText).toContainText('Rows 1–');

    // Expand and collapse an event's JSON details via its toggle button and verify ARIA state.
    const firstItem = items.first();
    const firstToggle = firstItem.locator('[data-admin-system-events-toggle]');
    const firstDetails = firstItem.locator('[data-admin-system-events-details]');
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(firstDetails).toHaveCount(0);

    await firstToggle.click();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(firstDetails).toBeVisible();
    const detailsId = await firstDetails.getAttribute('id');
    expect(detailsId).toBeTruthy();
    await expect(firstToggle).toHaveAttribute('aria-controls', detailsId);
    await expect(firstDetails).toContainText('{');

    await firstToggle.click();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(firstDetails).toHaveCount(0);
    expect(await firstToggle.getAttribute('aria-controls')).toBeNull();

    // Advance to page 2 with server offset paging and return to page 1.
    await pager.locator('[data-table-state-action="next"]').click();
    await expect(pagerText).toContainText(`Rows ${initialCount + 1}–`);
    await pager.locator('[data-table-state-action="prev"]').click();
    await expect(pagerText).toContainText('Rows 1–');

    // Select a severity filter, verify URL hash persistence without history growth, and survive reload.
    await severitySelect.selectOption('error');
    const errorCount = await items.count();
    expect(errorCount).toBeGreaterThan(0);
    expect(errorCount).toBeLessThan(initialCount);
    await expect(screen.locator('[data-admin-system-events-item][data-severity="error"]')).toHaveCount(errorCount);
    expect(await page.evaluate(() => location.hash)).toBe('#/system-events?severity=error');
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);

    await page.reload({ waitUntil: 'networkidle' });
    await settleGalleryStyles(page);
    await expect(severitySelect).toHaveValue('error');
    await expect(items).toHaveCount(errorCount);

    // Filter by event type as well, then search with an unmatched query and recover via Clear filters.
    await typeSelect.selectOption('user-locked');
    await expect(items).toHaveCount(1);
    await searchInput.fill('no-matching-audit-event-xyz');
    await searchInput.press('Enter');
    const filteredEmpty = screen.locator('[data-admin-system-events-empty="filtered"]');
    await expect(filteredEmpty).toBeVisible();
    await expect(pager).toBeHidden();

    await filteredEmpty.locator('[data-admin-system-events-action="clear"]').click();
    await expect(items).toHaveCount(initialCount);
    expect(await page.evaluate(() => location.hash)).toBe('#/system-events');

    // Demo state previews: empty audit log, fetch failure with Retry recovery, and 401 Sign in.
    await page.locator('[data-demo-events="empty"]').click();
    await expect(screen.locator('[data-admin-system-events-empty="none"]')).toBeVisible();
    await expect(pager).toBeHidden();

    await page.locator('[data-demo-events="fail-once"]').click();
    const errorBanner = screen.locator('[data-data-loader-error="failed"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveAttribute('role', 'alert');
    await errorBanner.locator('[data-data-loader-action="retry"]').click();
    await expect(errorBanner).toHaveCount(0);
    await expect(items).toHaveCount(initialCount);

    await page.locator('[data-demo-events="unauthorized"]').click();
    const authBanner = screen.locator('[data-data-loader-error="unauthorized"]');
    await expect(authBanner).toBeVisible();
    await authBanner.locator('[data-data-loader-action="sign-in"]').click();
    await expect(page.locator('.toast-region .toast')).toContainText('Signed in');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);
    expect(problems).toEqual([]);
});

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} admin system events screen passes layout and target checks`, async ({ page }, testInfo) => {
        const problems = await openSystemEvents(page);
        await selectGalleryLook(page, look);
        await settleGalleryStyles(page);

        const screen = page.locator('[data-admin-system-events]');
        await expect(screen.locator('[data-admin-system-events-list]')).toBeVisible();

        // Expand the first event's JSON details so expanded cards are checked across looks and widths.
        const firstToggle = screen.locator('[data-admin-system-events-item]').first().locator('[data-admin-system-events-toggle]');
        await firstToggle.click();
        await expect(screen.locator('[data-admin-system-events-details]').first()).toBeVisible();

        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);

        if (process.env.T0298_CAPTURE_DIR) {
            if (page.viewportSize().width < 1024) {
                await screen.scrollIntoViewIfNeeded();
            }
            await page.screenshot({
                path: `${process.env.T0298_CAPTURE_DIR}/after-admin-system-events-${look}-${testInfo.project.name}.png`,
                animations: 'disabled'
            });
        }

        expect(problems).toEqual([]);
    });
}
