// Browser checks of the notices module on the portal shell demo.
import { expect, test } from '@playwright/test';

/**
 * Open the portal demo, failing on console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page page to drive
 * @returns {Promise<string[]>} live problem list
 */
async function openPortal(page) {
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && !message.text().includes('Failed to load resource') && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
    const response = await page.goto('/demo/shell-portal.html', { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    return problems;
}

test.describe('notices', () => {
    test('routes an error notice to a banner and an info notice to a toast, and dismissal removes both', async ({ page }) => {
        const problems = await openPortal(page);
        const banners = page.locator('body > .app__banners');
        const toastRegion = page.locator('body > .app__overlays > .toast-region');

        // Initial sticky inbox banner shows with a link to all alerts and a dismiss control.
        const inboxBanner = banners.locator('[data-notices-banner][data-notices-source="inbox"]');
        await expect(inboxBanner).toHaveCount(1);
        await expect(inboxBanner.locator('[data-notices-all]')).toHaveText(/View all 2 alerts/);

        // Raise an error notice: renders a danger alert banner in .app__banners, not a toast.
        await page.locator('[data-demo-notice-error]').click();
        const errorBanner = banners.locator('[data-notices-banner][data-notices-source="app"].banner--danger');
        await expect(errorBanner).toHaveCount(1);
        await expect(errorBanner).toHaveAttribute('role', 'alert');
        await expect(toastRegion.locator('.toast')).toHaveCount(0);

        // Raise an info notice: renders a toast in .toast-region, not a banner.
        await page.locator('[data-demo-notice-info]').click();
        const toast = toastRegion.locator('.toast').first();
        await expect(toast).toBeVisible();
        await expect(errorBanner).toHaveCount(1);

        // Dismiss the error banner via its dismiss button.
        await errorBanner.locator('[data-notices-dismiss]').click();
        await expect(errorBanner).toHaveCount(0);

        // Dismiss the info toast via Escape while focused inside it.
        await page.locator('[data-demo-notice-action]').click();
        const actionToast = toastRegion.locator('.toast').last();
        const actionButton = actionToast.locator('[data-toast-action]');
        await actionButton.focus();
        await page.keyboard.press('Escape');
        await expect(actionButton).toHaveCount(0);

        // Dismiss the sticky inbox banner via its dismiss button.
        await inboxBanner.locator('[data-notices-dismiss]').click();
        await expect(inboxBanner).toHaveCount(1);
        await expect(inboxBanner.locator('[data-notices-all]')).toHaveCount(0);
        await inboxBanner.locator('[data-notices-dismiss]').click();
        await expect(inboxBanner).toHaveCount(0);

        expect(problems).toEqual([]);
    });

    test('caps visible app banners at three and reveals waiting banners on dismissal', async ({ page }) => {
        const problems = await openPortal(page);
        const appBanners = page.locator('body > .app__banners [data-notices-banner][data-notices-source="app"]');
        const errorButton = page.locator('[data-demo-notice-error]');
        const warningButton = page.locator('[data-demo-notice-warning]');

        await errorButton.click();
        await warningButton.click();
        await errorButton.click();
        await warningButton.click();

        await expect(appBanners).toHaveCount(3);
        await appBanners.first().locator('[data-notices-dismiss]').click();
        await expect(appBanners).toHaveCount(3);
        await appBanners.first().locator('[data-notices-dismiss]').click();
        await expect(appBanners).toHaveCount(2);

        expect(problems).toEqual([]);
    });
});
