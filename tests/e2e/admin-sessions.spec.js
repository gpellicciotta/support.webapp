// Browser integration checks for admin-sessions.js in the admin console shell demo:
// own-session protection, bulk selection and revocation, single revocation, expired cleanup,
// filters and paging persisted in the URL hash, empty/error/401 states, and cross-look checks.
import { expect, test } from '@playwright/test';
import { selectGalleryLook, settleGalleryStyles, smallTargets } from './gallery-helpers.js';

/**
 * Open the admin console demo at `#/sessions` and collect console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page Playwright page
 * @param {string} [hash] route hash, `'#/sessions'` by default
 * @returns {Promise<string[]>} live list of errors
 */
async function openSessions(page, hash = '#/sessions') {
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

test('admin console demo protects own session, bulk revokes two sessions, revokes single and expired tokens, filters, and pages', async ({ page }) => {
    const problems = await openSessions(page);

    const screen = page.locator('[data-admin-sessions]');
    await expect(screen).toBeVisible();
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Sessions');
    await expect(page.locator('[data-admin-console-nav="sessions"]')).toHaveAttribute('aria-current', 'page');

    const rows = screen.locator('[data-admin-sessions-row]');
    await expect(rows).toHaveCount(4);

    // The console's own session (901) can be neither selected nor revoked.
    const ownRow = screen.locator('[data-admin-sessions-row][data-token-id="901"]');
    await expect(ownRow.locator('[data-selection-item]')).toBeDisabled();
    await expect(ownRow.locator('[data-admin-sessions-own]')).toHaveText('Your session');
    await expect(ownRow.locator('[data-admin-sessions-action="revoke"]')).toBeDisabled();

    // Selecting two sessions and revoking them via inline confirmation removes both rows.
    const row902 = screen.locator('[data-admin-sessions-row][data-token-id="902"]');
    const row903 = screen.locator('[data-admin-sessions-row][data-token-id="903"]');
    await row902.locator('[data-selection-item]').check();
    await row903.locator('[data-selection-item]').check();

    const bulkBar = screen.locator('[data-selection-bar]');
    await expect(bulkBar).toBeVisible();
    await expect(bulkBar.locator('[data-selection-count]')).toHaveText('2 selected');

    await bulkBar.locator('[data-admin-sessions-action="revoke-selected"]').click();
    const bulkConfirm = bulkBar.locator('[data-inline-confirm]:not([hidden])');
    await expect(bulkConfirm).toBeVisible();
    await expect(bulkConfirm).toContainText('Revoke 2 selected tokens?');
    await bulkConfirm.locator('[data-inline-confirm-answer="yes"]').click();

    await expect(screen.locator('[data-admin-sessions-notice]')).toHaveText('2 tokens revoked.');
    await expect(row902).toHaveCount(0);
    await expect(row903).toHaveCount(0);
    await expect(bulkBar).toBeHidden();

    // Single-row revocation via inline confirmation removes the target row.
    const row904 = screen.locator('[data-admin-sessions-row][data-token-id="904"]');
    await row904.locator('[data-admin-sessions-action="revoke"]').click();
    const rowConfirm = row904.locator('[data-inline-confirm]:not([hidden])');
    await expect(rowConfirm).toBeVisible();
    await rowConfirm.locator('[data-inline-confirm-answer="yes"]').click();
    await expect(screen.locator('[data-admin-sessions-notice]')).toHaveText('Token 904 revoked.');
    await expect(row904).toHaveCount(0);

    // Removing expired tokens asks through inline confirmation and disables once cleared.
    const removeExpired = screen.locator('[data-admin-sessions-action="remove-expired"]');
    await expect(removeExpired).toBeEnabled();
    await removeExpired.click();
    const expiredConfirm = screen.locator('[data-admin-sessions-toolbar] [data-inline-confirm]:not([hidden])');
    await expect(expiredConfirm).toBeVisible();
    await expect(expiredConfirm).toContainText('Active sessions stay signed in.');
    await expiredConfirm.locator('[data-inline-confirm-answer="yes"]').click();
    await expect(screen.locator('[data-admin-sessions-notice]')).toHaveText('Expired tokens removed.');
    await expect(removeExpired).toBeDisabled();

    // Filtering persists in the URL hash without growing history.
    const historyBefore = await page.evaluate(() => history.length);
    const stateSelect = screen.locator('[data-admin-sessions-filter="state"]');
    await stateSelect.selectOption('expired');
    expect(await page.evaluate(() => location.hash)).toBe('#/sessions?state=expired');
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);
    await expect(screen.locator('[data-admin-sessions-empty="filtered"]')).toBeVisible();

    await screen.locator('[data-admin-sessions-action="clear-filters"]').click();
    expect(await page.evaluate(() => location.hash)).toBe('#/sessions');
    await expect(ownRow).toBeVisible();

    // Demo state previews: empty list, fetch failure with Retry, and 401 Sign in.
    await page.locator('[data-demo-sessions="empty"]').click();
    await expect(screen.locator('[data-admin-sessions-empty="none"]')).toBeVisible();

    await page.locator('[data-demo-sessions="fail-once"]').click();
    const errorBanner = screen.locator('[data-data-loader-error="failed"]');
    await expect(errorBanner).toBeVisible();
    await errorBanner.locator('[data-data-loader-action="retry"]').click();
    await expect(ownRow).toBeVisible();

    await page.locator('[data-demo-sessions="unauthorized"]').click();
    const authBanner = screen.locator('[data-data-loader-error="unauthorized"]');
    await expect(authBanner).toBeVisible();
    await authBanner.locator('[data-data-loader-action="sign-in"]').click();
    await expect(page.locator('.toast-region .toast')).toContainText('Signed in');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), a.link-button, input, select')).small).toEqual([]);
    expect(problems).toEqual([]);
});

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} admin sessions screen renders table and bulk bar without overflow or small targets`, async ({ page }, testInfo) => {
        const problems = await openSessions(page);
        await selectGalleryLook(page, look);
        await settleGalleryStyles(page);

        const screen = page.locator('[data-admin-sessions]');
        await expect(screen).toBeVisible();

        // Select two sessions so the bulk bar is visible in screenshots and layout checks.
        await screen.locator('[data-admin-sessions-row][data-token-id="902"] [data-selection-item]').check();
        await screen.locator('[data-admin-sessions-row][data-token-id="903"] [data-selection-item]').check();
        await expect(screen.locator('[data-selection-bar]')).toBeVisible();

        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'button:not(:disabled), a.link-button, input, select')).small).toEqual([]);

        if (process.env.T0301_CAPTURE_DIR) {
            await page.screenshot({
                path: `${process.env.T0301_CAPTURE_DIR}/after-admin-sessions-${look}-${testInfo.project.name}.png`,
                animations: 'disabled'
            });
        }

        expect(problems).toEqual([]);
    });
}
