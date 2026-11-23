// Browser checks of the notifications inbox pattern and top-bar unread count button on the portal shell demo.
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

test.describe('notifications inbox and unread button', () => {
    test('selecting two rows and choosing Mark Read updates the inbox summary and top-bar unread count', async ({ page }) => {
        const problems = await openPortal(page);
        const button = page.locator('[data-inbox-button]');
        const badge = button.locator('[data-inbox-count]');
        const inbox = page.locator('[data-inbox]');
        const summary = inbox.locator('[data-inbox-summary]');
        const rows = inbox.locator('[data-inbox-item]');

        await expect(button).toBeVisible();
        await expect(badge).toHaveText('3');
        await expect(button).toHaveAttribute('aria-label', 'Notifications, 3 unread notifications');
        await expect(summary).toHaveText('3 unread · 4 total');
        await expect(rows).toHaveCount(4);

        // Select two unread rows and click bulk Mark Read.
        const checkboxes = inbox.locator('[data-selection-item]');
        await checkboxes.nth(0).check();
        await checkboxes.nth(1).check();
        await expect(inbox.locator('[data-selection-count]')).toHaveText('2 selected');

        const bulkBar = inbox.locator('[data-selection-bar]');
        await expect(bulkBar).toBeVisible();
        await bulkBar.locator('[data-selection-action="mark-read"]').click();

        await expect(badge).toHaveText('1');
        await expect(button).toHaveAttribute('aria-label', 'Notifications, 1 unread notification');
        await expect(summary).toHaveText('1 unread · 4 total');
        await expect(rows.nth(0)).not.toHaveAttribute('data-inbox-unread', 'true');
        await expect(rows.nth(1)).not.toHaveAttribute('data-inbox-unread', 'true');
        await expect(rows.nth(2)).toHaveAttribute('data-inbox-unread', 'true');
        await expect(bulkBar).toBeHidden();

        // No horizontal overflow after updates.
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow).toBeLessThanOrEqual(0);
        expect(problems).toEqual([]);
    });

    test('row Discard and Discard All empty the inbox and hide the unread count badge', async ({ page }) => {
        const problems = await openPortal(page);
        const button = page.locator('[data-inbox-button]');
        const badge = button.locator('[data-inbox-count]');
        const inbox = page.locator('[data-inbox]');
        const rows = inbox.locator('[data-inbox-item]');

        // Discard one unread row via its row Discard button.
        await expect(rows).toHaveCount(4);
        await rows.nth(2).locator('[data-inbox-action="discard"]').click();
        await expect(rows).toHaveCount(3);
        await expect(badge).toHaveText('2');
        await expect(button).toHaveAttribute('aria-label', 'Notifications, 2 unread notifications');

        // Discard All empties the inbox, shows empty state, disables Discard All, and hides the badge.
        const discardAll = inbox.locator('[data-inbox-discard-all]');
        await discardAll.click();
        await expect(rows).toHaveCount(0);
        await expect(inbox.locator('[data-inbox-empty]')).toBeVisible();
        await expect(inbox.locator('[data-inbox-selection]')).toBeHidden();
        await expect(discardAll).toBeDisabled();
        await expect(badge).toBeHidden();
        await expect(button).toHaveAttribute('aria-label', 'Notifications');

        expect(problems).toEqual([]);
    });
});
