// Browser checks of the action registry on the portal shell demo.
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

test.describe('action registry', () => {
    test('registers routed view actions, blocks disabled actions with reasons, and delegates data-action clicks', async ({ page }) => {
        const problems = await openPortal(page);
        const bar = page.locator('body > .app__action-bar[data-screen-action-bar]');
        await expect(bar).toHaveCount(1);

        const exportButton = bar.locator('button[data-action="sample-view.export"]');
        const publishButton = bar.locator('button[data-action="sample-view.publish"]');
        const calendarLink = bar.locator('a[data-action="sample-view.calendar"]');

        // Disabled actions expose their disabled reasons and do nothing when clicked.
        await expect(exportButton).toBeEnabled();
        await expect(publishButton).toBeDisabled();
        await expect(publishButton).toHaveAttribute('title', 'Load sample data before publishing');
        await expect(publishButton).toHaveAttribute('aria-description', 'Load sample data before publishing');
        await expect(calendarLink).toHaveAttribute('aria-disabled', 'true');
        await expect(calendarLink).toHaveAttribute('title', 'Load sample data to open calendar');

        await calendarLink.click({ force: true });
        expect(new URL(page.url()).hash).toBe('');
        await expect(page.locator('.toast-region .toast__text')).toHaveCount(0);

        // Enabled handler action runs through delegated data-action clicks, including outside the action bar.
        await page.evaluate(() => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = 'Inline export';
            btn.setAttribute('data-action', 'sample-view.export');
            document.querySelector('#sample-view').append(btn);
        });
        await page.locator('#sample-view button[data-action="sample-view.export"]').click();
        await expect(page.locator('.toast-region .toast__text')).toContainText(['Sample summary exported.']);

        // Loading sample data enables the gated actions through the registry.
        await page.locator('#sample-view [data-view-retry]').click();
        await expect(page.locator('#sample-view')).toHaveAttribute('data-view-state', 'ready');
        await expect(publishButton).toBeEnabled();
        await expect(publishButton).toHaveAttribute('title', 'Publish the loaded sample data');

        await publishButton.click();
        await expect(page.locator('.toast-region .toast__text')).toContainText(['Sample data published.']);

        // Enabled href action navigates through the registry's onNavigate callback.
        await calendarLink.click();
        expect(new URL(page.url()).hash).toBe('#sample-calendar-title');

        // Detaching the routed view unregisters its actions; re-attaching registers them cleanly again.
        const toggle = page.locator('[data-demo-view-toggle]');
        await toggle.click();
        await expect(bar).toHaveCount(0);
        await toggle.click();
        await expect(bar).toHaveCount(1);

        expect(problems).toEqual([]);
    });
});
