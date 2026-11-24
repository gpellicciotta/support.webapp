// Browser integration checks for admin-overview.js in the admin console shell demo:
// server facts from fake adapter, failure/disconnected recovery, 401 Sign in, and cross-look layout checks.
import { expect, test } from '@playwright/test';
import { selectGalleryLook, settleGalleryStyles, smallTargets } from './gallery-helpers.js';

/**
 * Open the admin console demo at `#/overview` and collect console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page Playwright page
 * @returns {Promise<string[]>} live list of errors
 */
async function openOverview(page) {
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
    const response = await page.goto('/demo/shell-admin-console.html#/overview', { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await settleGalleryStyles(page);
    return problems;
}

test('admin console demo renders Overview server facts from a fake adapter and handles failure and repository states', async ({ page }) => {
    const problems = await openOverview(page);

    const overview = page.locator('[data-admin-overview]');
    await expect(overview).toBeVisible();
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Overview');
    await expect(overview.locator('[data-admin-overview-section="server"]')).toBeVisible();
    await expect(overview.locator('[data-fact="status"] .chip--status')).toHaveText('Running');
    await expect(overview.locator('[data-fact="uptime"]')).not.toBeEmpty();
    await expect(overview.locator('[data-fact="version"] a')).toHaveAttribute('href', '#/changelog');
    await expect(overview.locator('[data-fact="repository"] .chip--status')).toHaveText('Connected');
    await expect(overview.locator('[data-fact="api-url"] code')).toBeVisible();
    await expect(overview.locator('[data-admin-overview-status]')).toContainText('Refreshes every 30 seconds while the tab is visible.');

    // Simulate disconnected repository state and recover via Retry.
    await page.locator('[data-demo-overview="disconnected"]').click();
    const repoBanner = overview.locator('[data-admin-overview-banner="repository"]');
    await expect(repoBanner).toBeVisible();
    await expect(repoBanner).toHaveAttribute('role', 'alert');
    await expect(overview.locator('[data-fact="repository"] .chip--status')).toHaveText('Not connected');
    await repoBanner.locator('[data-admin-overview-action="retry"]').click();
    await expect(repoBanner).toHaveCount(0);
    await expect(overview.locator('[data-fact="repository"] .chip--status')).toHaveText('Connected');

    // Simulate a server fetch failure and recover via Retry.
    await page.locator('[data-demo-overview="fail-once"]').click();
    const errorBanner = overview.locator('[data-data-loader-error="failed"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveAttribute('role', 'alert');
    await errorBanner.locator('[data-data-loader-action="retry"]').click();
    await expect(errorBanner).toHaveCount(0);
    await expect(overview.locator('[data-fact="status"] .chip--status')).toHaveText('Running');

    // Simulate a 401 unauthorized response and trigger Sign in.
    await page.locator('[data-demo-overview="unauthorized"]').click();
    const authBanner = overview.locator('[data-data-loader-error="unauthorized"]');
    await expect(authBanner).toBeVisible();
    await authBanner.locator('[data-data-loader-action="sign-in"]').click();
    await expect(page.locator('.toast-region .toast')).toContainText('Signed in');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);
    expect(problems).toEqual([]);
});

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} admin overview screen passes layout and target checks`, async ({ page }, testInfo) => {
        const problems = await openOverview(page);
        await selectGalleryLook(page, look);
        await settleGalleryStyles(page);

        const overview = page.locator('[data-admin-overview]');
        await expect(overview.locator('[data-admin-overview-section="server"]')).toBeVisible();
        await expect(overview.locator('[data-fact="status"] .chip--status')).toHaveText('Running');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);

        if (process.env.T0296_CAPTURE_DIR) {
            await page.screenshot({
                path: `${process.env.T0296_CAPTURE_DIR}/after-admin-overview-${look}-${testInfo.project.name}.png`
            });
        }

        expect(problems).toEqual([]);
    });
}
