// Browser integration checks for admin-changelog.js in the admin console shell demo:
// two pages of releases from a fake adapter, status chips, area groups, empty/error/401 states,
// Overview version link navigation, and cross-look layout and target checks.
import { expect, test } from '@playwright/test';
import { selectGalleryLook, settleGalleryStyles, smallTargets } from './gallery-helpers.js';

/**
 * Open the admin console demo at the requested hash and collect console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page Playwright page
 * @param {string} [hash] route hash, `'#/changelog'` by default
 * @returns {Promise<string[]>} live list of errors
 */
async function openChangelog(page, hash = '#/changelog') {
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

test('admin console demo shows two pages of releases from a fake adapter and handles empty and failure states', async ({ page }, testInfo) => {
    if (process.env.T0302_BASELINE === '1' && process.env.T0302_CAPTURE_DIR) {
        const problems = await openChangelog(page, '#/overview');
        await page.screenshot({
            path: `${process.env.T0302_CAPTURE_DIR}/before-admin-changelog-neutral-${testInfo.project.name}.png`,
            animations: 'disabled'
        });
        expect(problems).toEqual([]);
        return;
    }

    const problems = await openChangelog(page);

    const screen = page.locator('[data-admin-changelog]');
    await expect(screen).toBeVisible();
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Changelog');
    await expect(page.locator('[data-admin-console-nav="changelog"]')).toHaveAttribute('aria-current', 'page');

    // Page 1 shows 10 releases with status chips, area headings, inline code, and a Show older button.
    const releases = screen.locator('[data-release-notes-release]');
    await expect(releases).toHaveCount(10);
    await expect(screen.locator('[data-release-notes-status="in-development"]')).toHaveCount(1);
    await expect(screen.locator('[data-release-notes-status="released"]').first()).toBeVisible();
    await expect(screen.locator('[data-release-notes-status="frozen"]').first()).toBeVisible();
    await expect(screen.locator('[data-release-notes-status="broken"]')).toHaveCount(1);
    await expect(screen.locator('[data-release-notes-breaking]').first()).toBeVisible();
    await expect(screen.locator('[data-release-notes-area]').first()).toBeVisible();

    const more = screen.locator('[data-release-notes-more]');
    await expect(more).toBeVisible();
    await expect(more).toHaveText('Show 4 older releases');
    await more.click();

    // Page 2 reveals the remaining 4 releases (14 total) and removes the button.
    await expect(releases).toHaveCount(14);
    await expect(more).toHaveCount(0);

    // Demo state previews: empty changelog, fetch failure with Retry, and 401 Sign in.
    await page.locator('[data-demo-changelog="empty"]').click();
    await expect(screen.locator('[data-admin-changelog-empty]')).toBeVisible();
    await expect(releases).toHaveCount(0);

    await page.locator('[data-demo-changelog="fail-once"]').click();
    const errorBanner = screen.locator('[data-data-loader-error="failed"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveAttribute('role', 'alert');
    await errorBanner.locator('[data-data-loader-action="retry"]').click();
    await expect(errorBanner).toHaveCount(0);
    await expect(releases).toHaveCount(10);
    await expect(more).toBeVisible();

    await page.locator('[data-demo-changelog="unauthorized"]').click();
    const authBanner = screen.locator('[data-data-loader-error="unauthorized"]');
    await expect(authBanner).toBeVisible();
    await authBanner.locator('[data-data-loader-action="sign-in"]').click();
    await expect(page.locator('.toast-region .toast')).toContainText('Signed in');

    // Overview's Version link navigates directly to the shared Changelog screen.
    await page.evaluate(() => {
        location.hash = '#/overview';
    });
    await expect(page.locator('[data-fact="version"] a')).toBeVisible();
    await page.locator('[data-fact="version"] a').click();
    await expect(page).toHaveURL(/#\/changelog$/);
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Changelog');
    await expect(screen.locator('[data-release-notes-release]')).toHaveCount(10);

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);
    expect(problems).toEqual([]);
});

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} admin changelog screen renders without overflow or small targets`, async ({ page }, testInfo) => {
        if (process.env.T0302_BASELINE === '1') {
            return;
        }
        const problems = await openChangelog(page);
        await selectGalleryLook(page, look);
        await settleGalleryStyles(page);

        const screen = page.locator('[data-admin-changelog]');
        await expect(screen).toBeVisible();
        await expect(screen.locator('[data-release-notes-release]')).toHaveCount(10);
        await expect(screen.locator('[data-release-notes-more]')).toBeVisible();

        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);

        if (process.env.T0302_CAPTURE_DIR) {
            await page.screenshot({
                path: `${process.env.T0302_CAPTURE_DIR}/after-admin-changelog-${look}-${testInfo.project.name}.png`,
                animations: 'disabled'
            });
        }

        expect(problems).toEqual([]);
    });
}
