// Browser integration checks for admin-users.js in the admin console shell demo:
// account table with filters and paging, selecting a user to open the detail panel,
// extension columns/sections, editing, New user creation adding a row, inline-confirmed
// mark for deletion, restore, and permanent deletion, plus cross-look checks.
import { expect, test } from '@playwright/test';
import { selectGalleryLook, settleGalleryStyles, smallTargets } from './gallery-helpers.js';

/**
 * Open the admin console demo at `#/users` and collect console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page Playwright page
 * @param {string} [hash] route hash, `'#/users'` by default
 * @returns {Promise<string[]>} live list of errors
 */
async function openUsers(page, hash = '#/users') {
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

test('admin console demo filters, pages, opens user detail panel, creates a user, and deletes with inline confirmations', async ({ page }) => {
    const problems = await openUsers(page);

    const screen = page.locator('[data-admin-users]');
    await expect(screen).toBeVisible();
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Users');
    await expect(page.locator('[data-admin-console-nav="users"]')).toHaveAttribute('aria-current', 'page');

    const rows = screen.locator('[data-admin-users-row]');
    await expect(rows).toHaveCount(4);

    // Selecting a user opens the detail panel, marks the row selected, and focuses the title.
    const samiraLink = screen.locator('[data-admin-users-link="34"]');
    await samiraLink.click();
    const sidePanel = page.locator('[data-admin-console-panel]');
    await expect(sidePanel).toBeVisible();
    const panelTitle = sidePanel.locator('[data-admin-users-panel-title]');
    await expect(panelTitle).toHaveText('Samira Patel');
    await expect(panelTitle).toBeFocused();
    await expect(screen.locator('[data-admin-users-row][data-user-id="34"]')).toHaveAttribute('aria-selected', 'true');
    await expect(sidePanel.locator('[data-fact="id"]')).toHaveText('34');

    // Mark for deletion and restore both ask through inline confirmations in the danger zone.
    const markTrigger = sidePanel.locator('[data-admin-users-action="mark-delete"]');
    await markTrigger.click();
    const markConfirm = sidePanel.locator('[data-admin-users-section="danger"] [data-inline-confirm]:not([hidden])');
    await expect(markConfirm).toBeVisible();
    await markConfirm.locator('[data-inline-confirm-answer="yes"]').click();
    await expect(sidePanel.locator('[data-admin-users-status="danger"]')).toHaveText('Account marked for deletion.');
    await expect(sidePanel.locator('[data-admin-users-action="restore"]')).toBeVisible();

    await sidePanel.locator('[data-admin-users-action="restore"]').click();
    const restoreConfirm = sidePanel.locator('[data-admin-users-section="danger"] [data-inline-confirm]:not([hidden])');
    await expect(restoreConfirm).toBeVisible();
    await restoreConfirm.locator('[data-inline-confirm-answer="yes"]').click();
    await expect(sidePanel.locator('[data-admin-users-status="danger"]')).toHaveText('Account restored.');
    await expect(sidePanel.locator('[data-admin-users-action="mark-delete"]')).toBeVisible();

    // Closing the detail panel hides it and returns focus to the triggering link.
    await sidePanel.locator('[data-admin-users-action="close"]').click();
    await expect(sidePanel).toBeHidden();
    await expect(samiraLink).toBeFocused();

    // Clicking New user opens the creation panel and adds a row to the table.
    const pagerText = screen.locator('[data-table-state-text]');
    await expect(pagerText).toContainText('6 users');
    await screen.locator('[data-admin-users-action="new"]').click();
    await expect(sidePanel).toBeVisible();
    await expect(panelTitle).toHaveText('New user');

    await sidePanel.locator('[data-admin-users-input="email"]').fill('dana.cho@example.test');
    await sidePanel.locator('[data-admin-users-input="name"]').fill('Dana Cho');
    await sidePanel.locator('[data-admin-users-action="create"]').click();

    await expect(panelTitle).toHaveText('Dana Cho');
    await expect(pagerText).toContainText('7 users');

    // Permanently deleting the created user via inline confirmation removes the row and closes the panel.
    await sidePanel.locator('[data-admin-users-action="delete"]').click();
    const deleteConfirm = sidePanel.locator('[data-admin-users-section="danger"] [data-inline-confirm]:not([hidden])');
    await expect(deleteConfirm).toBeVisible();
    await deleteConfirm.locator('[data-inline-confirm-answer="yes"]').click();
    await expect(sidePanel).toBeHidden();
    await expect(pagerText).toContainText('6 users');

    // Filtering persists in the hash without growing history.
    const historyBefore = await page.evaluate(() => history.length);
    const statusSelect = screen.locator('[data-admin-users-filter="status"]');
    await statusSelect.selectOption('marked');
    expect(await page.evaluate(() => location.hash)).toBe('#/users?status=marked');
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);
    await expect(rows).toHaveCount(1);

    await statusSelect.selectOption('');
    await expect(rows).toHaveCount(4);

    // Demo state previews: empty list, fetch failure with Retry, and 401 Sign in.
    await page.locator('[data-demo-users="empty"]').click();
    await expect(screen.locator('[data-admin-users-empty="none"]')).toBeVisible();

    await page.locator('[data-demo-users="fail-once"]').click();
    const errorBanner = screen.locator('[data-data-loader-error="failed"]');
    await expect(errorBanner).toBeVisible();
    await errorBanner.locator('[data-data-loader-action="retry"]').click();
    await expect(rows).toHaveCount(4);

    await page.locator('[data-demo-users="unauthorized"]').click();
    const authBanner = screen.locator('[data-data-loader-error="unauthorized"]');
    await expect(authBanner).toBeVisible();
    await authBanner.locator('[data-data-loader-action="sign-in"]').click();
    await expect(page.locator('.toast-region .toast')).toContainText('Signed in');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), a.link-button, input:not([type="checkbox"]):not([type="radio"]), select')).small).toEqual([]);
    expect(problems).toEqual([]);
});

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} admin users screen renders table and detail panel without overflow or small targets`, async ({ page }, testInfo) => {
        const problems = await openUsers(page, '#/users/34');
        await selectGalleryLook(page, look);
        await settleGalleryStyles(page);

        const screen = page.locator('[data-admin-users]');
        const sidePanel = page.locator('[data-admin-console-panel]');
        await expect(screen).toBeVisible();
        await expect(sidePanel).toBeVisible();
        await expect(sidePanel.locator('[data-admin-users-panel-title]')).toHaveText('Samira Patel');

        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'button:not(:disabled), a.link-button, input:not([type="checkbox"]):not([type="radio"]), select')).small).toEqual([]);

        if (process.env.T0300_CAPTURE_DIR) {
            await page.screenshot({
                path: `${process.env.T0300_CAPTURE_DIR}/after-admin-users-${look}-${testInfo.project.name}.png`,
                animations: 'disabled'
            });
        }

        expect(problems).toEqual([]);
    });
}
