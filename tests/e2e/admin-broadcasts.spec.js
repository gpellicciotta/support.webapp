// Browser integration checks for admin-broadcasts.js in the admin console shell demo:
// compose form with live inbox/banner preview, recipient selection, publish, history filtering,
// inline-confirm retraction removing the history row, responsive split stacking, and cross-look checks.
import { expect, test } from '@playwright/test';
import { selectGalleryLook, settleGalleryStyles, smallTargets } from './gallery-helpers.js';

/**
 * Open the admin console demo at `#/broadcasts` and collect console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page Playwright page
 * @param {string} [hash] route hash, `'#/broadcasts'` by default
 * @returns {Promise<string[]>} live list of errors
 */
async function openBroadcasts(page, hash = '#/broadcasts') {
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

test('admin console demo composes with live preview, selects recipients, publishes, filters, and retracts history rows', async ({ page }) => {
    const problems = await openBroadcasts(page);
    const historyBefore = await page.evaluate(() => history.length);

    const screen = page.locator('[data-admin-broadcasts]');
    await expect(screen).toBeVisible();
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Broadcasts');
    await expect(page.locator('[data-admin-console-nav="broadcasts"]')).toHaveAttribute('aria-current', 'page');

    const titleInput = screen.locator('[data-admin-broadcasts-input="title"]');
    const messageInput = screen.locator('[data-admin-broadcasts-input="message"]');
    const bannerInput = screen.locator('[data-admin-broadcasts-input="banner"]');
    const actionInput = screen.locator('[data-admin-broadcasts-input="action-url"]');
    const audienceSelect = screen.locator('[data-admin-broadcasts-input="audience"]');
    const publishBtn = screen.locator('[data-admin-broadcasts-action="publish"]');

    const inboxPreview = screen.locator('[data-admin-broadcasts-preview-inbox]');
    const bannerPreview = screen.locator('[data-admin-broadcasts-preview-banner]');
    const bannerBox = screen.locator('[data-admin-broadcasts-preview-banner-box]');

    // Non-banner compose previews as an inbox row; banner preview stays hidden.
    await expect(inboxPreview).toBeVisible();
    await expect(bannerPreview).toBeHidden();
    await titleInput.fill('Planned upgrade');
    await messageInput.fill('Background jobs pause for ten minutes at 03:00 UTC.');
    await actionInput.fill('/help');
    await expect(inboxPreview).toContainText('Planned upgrade');
    await expect(inboxPreview).toContainText('Background jobs pause for ten minutes at 03:00 UTC.');
    await expect(inboxPreview.locator('a')).toHaveAttribute('href', '/help');

    // Toggling banner previews as a banner with the selected type variant.
    await screen.locator('[data-admin-broadcasts-input="type"][value="warning"]').check();
    await bannerInput.check();
    await expect(bannerPreview).toBeVisible();
    await expect(bannerBox).toHaveClass(/banner--warning/);
    await expect(bannerBox).toContainText('Planned upgrade:');
    await expect(bannerBox).toContainText('Background jobs pause for ten minutes at 03:00 UTC.');

    // Selecting "Selected accounts" loads the searchable recipient checklist.
    const rows = screen.locator('[data-admin-broadcasts-row]');
    const initialRowCount = await rows.count();
    expect(initialRowCount).toBeGreaterThan(1);

    await audienceSelect.selectOption('specific-users');
    const recipients = screen.locator('[data-admin-broadcasts-recipients]');
    await expect(recipients).toBeVisible();
    const recipientFilter = recipients.locator('[data-admin-broadcasts-recipient-filter]');
    await recipientFilter.fill('Samira');
    const firstRecipient = recipients.locator('[data-admin-broadcasts-recipient-list] > li:not([hidden]) [data-selection-item]').first();
    await firstRecipient.check();

    // Publishing adds the new broadcast to history and clears the form.
    await publishBtn.click();
    await expect(screen.locator('[data-admin-broadcasts-compose-status]')).toContainText('published');
    await expect(titleInput).toHaveValue('');
    await expect(messageInput).toHaveValue('');
    await expect(rows).toHaveCount(initialRowCount + 1);
    await expect(rows.first()).toContainText('Planned upgrade');

    // Retracting asks through inline confirmation and removes the history row on confirm.
    const targetRow = rows.first();
    const targetId = await targetRow.getAttribute('data-broadcast-id');
    expect(targetId).toBeTruthy();
    await targetRow.locator('[data-inline-confirm-trigger]').click();
    const confirmBox = targetRow.locator('[data-inline-confirm]');
    await expect(confirmBox).toBeVisible();
    await confirmBox.locator('[data-inline-confirm-answer="yes"]').click();

    await expect(screen.locator(`[data-admin-broadcasts-row][data-broadcast-id="${targetId}"]`)).toHaveCount(0);
    await expect(rows).toHaveCount(initialRowCount);

    // Filter history via status select and verify URL hash persistence without growing history.
    const statusSelect = screen.locator('[data-admin-broadcasts-filter="status"]');
    await statusSelect.selectOption('retracted');
    expect(await page.evaluate(() => location.hash)).toBe('#/broadcasts?status=retracted');
    expect(await page.evaluate(() => history.length)).toBe(historyBefore);
    const retractedCount = await rows.count();
    expect(retractedCount).toBeGreaterThan(0);

    await statusSelect.selectOption('');
    await expect(rows).toHaveCount(initialRowCount);

    // Demo state previews: empty history, fetch failure with Retry, and 401 Sign in.
    await page.locator('[data-demo-broadcasts="empty"]').click();
    await expect(screen.locator('[data-admin-broadcasts-empty="none"]')).toBeVisible();

    await page.locator('[data-demo-broadcasts="fail-once"]').click();
    const errorBanner = screen.locator('[data-data-loader-error="failed"]');
    await expect(errorBanner).toBeVisible();
    await errorBanner.locator('[data-data-loader-action="retry"]').click();
    await expect(rows).toHaveCount(initialRowCount);

    await page.locator('[data-demo-broadcasts="unauthorized"]').click();
    const authBanner = screen.locator('[data-data-loader-error="unauthorized"]');
    await expect(authBanner).toBeVisible();
    await authBanner.locator('[data-data-loader-action="sign-in"]').click();
    await expect(page.locator('.toast-region .toast')).toContainText('Signed in');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), input:not([type="checkbox"]):not([type="radio"]), select')).small).toEqual([]);
    expect(problems).toEqual([]);
});

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} admin broadcasts screen stacks compose and preview below 64rem and splits on desktop`, async ({ page }, testInfo) => {
        const problems = await openBroadcasts(page);
        await selectGalleryLook(page, look);
        await settleGalleryStyles(page);

        const screen = page.locator('[data-admin-broadcasts]');
        const compose = screen.locator('[data-admin-broadcasts-compose]');
        const preview = screen.locator('[data-admin-broadcasts-preview]');
        await expect(compose).toBeVisible();
        await expect(preview).toBeVisible();

        // Populate preview with a banner too so screenshots and layout checks show both preview cards.
        await screen.locator('[data-admin-broadcasts-input="title"]').fill('Scheduled maintenance');
        await screen.locator('[data-admin-broadcasts-input="message"]').fill('Sign-in restarts at 22:00 UTC for five minutes.');
        await screen.locator('[data-admin-broadcasts-input="type"][value="warning"]').check();
        await screen.locator('[data-admin-broadcasts-input="banner"]').check();
        await expect(screen.locator('[data-admin-broadcasts-preview-banner]')).toBeVisible();

        const composeBox = await compose.boundingBox();
        const previewBox = await preview.boundingBox();
        if (page.viewportSize().width < 1024) {
            expect(previewBox.y).toBeGreaterThanOrEqual(composeBox.y + composeBox.height - 2);
        }
        else {
            expect(previewBox.x).toBeGreaterThan(composeBox.x + composeBox.width / 2);
            expect(Math.abs(previewBox.y - composeBox.y)).toBeLessThan(8);
        }

        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'button:not(:disabled), input:not([type="checkbox"]):not([type="radio"]), select')).small).toEqual([]);

        if (process.env.T0299_CAPTURE_DIR) {
            if (page.viewportSize().width < 1024) {
                await screen.scrollIntoViewIfNeeded();
            }
            await page.screenshot({
                path: `${process.env.T0299_CAPTURE_DIR}/after-admin-broadcasts-${look}-${testInfo.project.name}.png`,
                animations: 'disabled'
            });
        }

        expect(problems).toEqual([]);
    });
}
