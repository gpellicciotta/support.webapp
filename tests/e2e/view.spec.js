// Browser checks of the view lifecycle base (ADR-0004), on the sample view of the portal shell demo.
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

test.describe('sample view', () => {
    test('shows the error page after a failed load, and Try again loads the data', async ({ page }) => {
        const problems = await openPortal(page);
        const view = page.locator('#sample-view');
        const error = view.locator('[data-view-error]');
        await expect(view).toHaveAttribute('data-view-state', 'error');
        await expect(error).toBeVisible();
        await expect(error.locator('.empty-state__title')).toHaveText('Refresh Sample View');
        await expect(error.locator('.empty-state__text')).toHaveText('The sample server is not answering');
        await expect(view.locator('[data-view-main]')).toBeHidden();
        await error.getByRole('button', { name: 'Try again' }).click();
        await expect(view).toHaveAttribute('data-view-state', 'ready');
        await expect(error).toBeHidden();
        await expect(view.locator('[data-sample-view-text]')).toHaveText('Sample data loaded on attempt 2.');
        expect(problems).toEqual([]);
    });

    test('draws the error page with the look icon and no wait status for a fast load', async ({ page }) => {
        await openPortal(page);
        const view = page.locator('#sample-view');
        await expect(view).toHaveAttribute('data-view-state', 'error');
        await expect(view.locator('[data-view-error] svg use')).toHaveAttribute('href', /icons\.svg#icon-alert$/);
        await expect(view.locator('[data-view-wait]')).toBeHidden();
        // The button class sets a display of its own, which must not defeat `hidden` on the unused way back.
        await expect(view.locator('[data-view-back]')).toBeHidden();
    });
});
