// Browser checks of the screen action bar renderer on the portal shell demo.
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

test.describe('screen action bar', () => {
    test('shows the routed view screen actions, updates them on state change, and removes the bar on detach', async ({ page }) => {
        const problems = await openPortal(page);
        const bar = page.locator('body > .app__action-bar[data-screen-action-bar]');
        await expect(bar).toHaveCount(1);

        const exportButton = bar.locator('button[data-action="sample-view.export"]');
        const publishButton = bar.locator('button[data-action="sample-view.publish"]');
        const calendarLink = bar.locator('a[data-action="sample-view.calendar"]');

        await expect(exportButton).toHaveText('Export');
        await expect(exportButton).toBeEnabled();
        await expect(publishButton).toHaveText('Publish');
        await expect(publishButton).toBeDisabled();
        await expect(publishButton).toHaveAttribute('title', 'Load sample data before publishing');
        await expect(publishButton).toHaveAttribute('aria-description', 'Load sample data before publishing');
        await expect(calendarLink).toHaveText('Calendar');
        await expect(calendarLink).toHaveAttribute('aria-disabled', 'true');
        await expect(calendarLink).toHaveAttribute('title', 'Load sample data to open calendar');

        // Disabled link clicks do not navigate.
        await calendarLink.click({ force: true });
        expect(new URL(page.url()).hash).toBe('');

        // Enabled button action runs through the bar.
        await exportButton.click();
        await expect(page.locator('.toast-region .toast__text')).toContainText(['Sample summary exported.']);

        // Loading the view succeeds on Try again and enables the gated screen actions via action-state-changed.
        await page.locator('#sample-view [data-view-retry]').click();
        await expect(page.locator('#sample-view')).toHaveAttribute('data-view-state', 'ready');
        await expect(publishButton).toBeEnabled();
        await expect(publishButton).toHaveAttribute('title', 'Publish the loaded sample data');
        await expect(calendarLink).not.toHaveAttribute('aria-disabled', 'true');
        await expect(calendarLink).toHaveAttribute('title', 'Jump to the sample calendar');

        // Detaching the routed view removes the empty action bar; re-attaching brings it back.
        const toggle = page.locator('[data-demo-view-toggle]');
        await toggle.click();
        await expect(bar).toHaveCount(0);
        await expect(toggle).toHaveText('Attach sample view');

        await toggle.click();
        await expect(bar).toHaveCount(1);
        await expect(toggle).toHaveText('Detach sample view');
        expect(problems).toEqual([]);
    });
});
