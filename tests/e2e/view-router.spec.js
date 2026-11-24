// Browser checks of the view router on the portal shell demo.
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

test.describe('view router', () => {
    test('moves between two routed views with links and the browser back and forward buttons', async ({ page }) => {
        const problems = await openPortal(page);
        const nav = page.locator('nav[data-view-router-nav]');
        const sampleLink = nav.locator('a[href="/demo/shell-portal.html"]');
        const notesLink = nav.locator('a[href="/demo/shell-portal.html?view=notes"]');
        const title = page.locator('[data-view-router-title]');
        const bar = page.locator('body > .app__action-bar[data-screen-action-bar]');

        // Initial load activates the default routed view and marks its link current.
        await expect(page.locator('#sample-view')).toBeVisible();
        await expect(page.locator('#sample-notes-view')).toHaveCount(0);
        await expect(title).toHaveText('Sample');
        await expect(sampleLink).toHaveAttribute('aria-current', 'page');
        await expect(notesLink).not.toHaveAttribute('aria-current', 'page');
        await expect(bar.locator('button[data-action="sample-view.export"]')).toHaveCount(1);

        // Clicking the Notes link pushes history, switches routed views, updates route marks, and swaps screen actions.
        await notesLink.click();
        expect(new URL(page.url()).search).toBe('?view=notes');
        await expect(page.locator('#sample-notes-view')).toBeVisible();
        await expect(page.locator('#sample-view')).toHaveCount(0);
        await expect(title).toHaveText('Notes');
        await expect(notesLink).toHaveAttribute('aria-current', 'page');
        await expect(sampleLink).not.toHaveAttribute('aria-current', 'page');
        await expect(bar.locator('button[data-action="sample-notes-view.archive"]')).toHaveCount(1);
        await expect(bar.locator('button[data-action="sample-view.export"]')).toHaveCount(0);

        await bar.locator('button[data-action="sample-notes-view.archive"]').click();
        await expect(page.locator('.toast-region .toast__text')).toContainText(['Sample notes archived.']);

        // Browser Back restores the first routed view without breaking Forward.
        await page.goBack();
        expect(new URL(page.url()).search).toBe('');
        await expect(page.locator('#sample-view')).toBeVisible();
        await expect(page.locator('#sample-notes-view')).toHaveCount(0);
        await expect(title).toHaveText('Sample');
        await expect(sampleLink).toHaveAttribute('aria-current', 'page');
        await expect(notesLink).not.toHaveAttribute('aria-current', 'page');
        await expect(bar.locator('button[data-action="sample-view.export"]')).toHaveCount(1);

        // Browser Forward returns to the second routed view cleanly.
        await page.goForward();
        expect(new URL(page.url()).search).toBe('?view=notes');
        await expect(page.locator('#sample-notes-view')).toBeVisible();
        await expect(page.locator('#sample-view')).toHaveCount(0);
        await expect(title).toHaveText('Notes');
        await expect(notesLink).toHaveAttribute('aria-current', 'page');
        await expect(sampleLink).not.toHaveAttribute('aria-current', 'page');

        // Clicking the Sample link returns to the first routed view via the action registry.
        await sampleLink.click();
        expect(new URL(page.url()).search).toBe('');
        await expect(page.locator('#sample-view')).toBeVisible();
        await expect(title).toHaveText('Sample');
        await expect(sampleLink).toHaveAttribute('aria-current', 'page');

        expect(problems).toEqual([]);
    });
});
