// Browser integration checks for admin-console.js in the admin console shell demo:
// hash routing, browser back button, route marks, screen titles, skip link, forbidden gate, and signed-out shell.
import { expect, test } from '@playwright/test';
import { selectGalleryLook, settleGalleryStyles, smallTargets } from './gallery-helpers.js';

const BREAKPOINT = 1024;

/**
 * Open the admin console demo and watch for console, page, and network errors.
 * @param {import('@playwright/test').Page} page Playwright page
 * @param {string} [hash] optional hash route
 * @returns {Promise<string[]>} live list of errors
 */
async function openConsole(page, hash = '') {
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

/**
 * Click a sidebar navigation link, opening the drawer first on mobile viewports.
 * @param {import('@playwright/test').Page} page Playwright page
 * @param {string} screen screen key
 */
async function clickNav(page, screen) {
    const { width } = page.viewportSize();
    if (width < BREAKPOINT) {
        const panelClose = page.locator('[data-demo-panel-close]');
        if (await panelClose.isVisible()) {
            await panelClose.click();
        }
        const sidebar = page.locator('[data-admin-console-sidebar]');
        if (!(await sidebar.isVisible())) {
            await page.locator('[data-app-nav-toggle]').click();
            await expect(sidebar).toBeVisible();
        }
    }
    await page.locator(`[data-admin-console-nav="${screen}"]`).click();
}

test('admin console demo moves between screens by hash and back button, updates marks and titles, and preserves route on skip link', async ({ page }) => {
    const problems = await openConsole(page);
    const { width } = page.viewportSize();

    // Initial screen is Accounts with its route mark active.
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Accounts');
    await expect(page.locator('[data-admin-console-view]')).toHaveAttribute('data-admin-console-screen', 'accounts');
    await expect(page.locator('[data-admin-console-nav="accounts"]')).toHaveAttribute('aria-current', 'page');

    // Navigate to Overview by sidebar link.
    await clickNav(page, 'overview');
    await expect(page).toHaveURL(/#\/overview$/);
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Overview');
    await expect(page).toHaveTitle('Overview · Admin Console');
    await expect(page.locator('[data-admin-console-view]')).toHaveAttribute('data-admin-console-screen', 'overview');
    await expect(page.locator('[data-admin-console-nav="overview"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('[data-admin-console-nav="accounts"]')).not.toHaveAttribute('aria-current', 'page');
    await expect(page.locator('[data-admin-console-panel]')).toBeHidden();

    // Skip link focuses #main without changing the #/overview route.
    await page.locator('[data-admin-console-skip]').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
    await expect(page).toHaveURL(/#\/overview$/);

    // Navigate to Sessions and System events, then use browser Back button.
    await clickNav(page, 'sessions');
    await expect(page).toHaveURL(/#\/sessions$/);
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Sessions');
    await expect(page).toHaveTitle('Sessions · Admin Console');
    await expect(page.locator('[data-admin-console-nav="sessions"]')).toHaveAttribute('aria-current', 'page');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await page.goBack();
    await expect(page).toHaveURL(/#\/overview$/);
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Overview');
    await expect(page.locator('[data-admin-console-nav="overview"]')).toHaveAttribute('aria-current', 'page');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await page.goBack();
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Accounts');
    await expect(page.locator('[data-admin-console-nav="accounts"]')).toHaveAttribute('aria-current', 'page');

    // Same-screen detail route updates without remounting the Accounts screen.
    if (width >= BREAKPOINT) {
        await page.evaluate(() => {
            location.hash = '#/accounts';
        });
        const mountCountBefore = await page.locator('[data-admin-console-view]').getAttribute('data-demo-accounts-mounts');
        await page.evaluate(() => {
            location.hash = '#/accounts/1';
        });
        await expect(page.locator('[data-admin-console-panel]')).toBeVisible();
        await expect(page.locator('#detail-panel-demo-title')).toHaveText('Alex North');
        expect(await page.locator('[data-admin-console-view]').getAttribute('data-demo-accounts-mounts')).toBe(mountCountBefore);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }

    expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);
    expect(problems).toEqual([]);
});

test('admin console demo shows the forbidden gate, transitions to signed-out shell, and returns cleanly', async ({ page }) => {
    const problems = await openConsole(page, '#/overview');

    // Trigger the forbidden gate from the Overview screen.
    const forbiddenBtn = page.locator('[data-demo-gate="forbidden"]');
    await expect(forbiddenBtn).toBeVisible();
    await forbiddenBtn.click();
    const gate = page.locator('[data-admin-console-gate="forbidden"]');
    await expect(gate).toBeVisible();
    await expect(page.locator('main')).toHaveCount(1);
    await expect(gate).toHaveAttribute('aria-label', 'Administrator access required');
    await expect(gate.locator('h1')).toHaveText('Admin Console');
    await expect(gate.locator('[role="status"]')).toContainText('Administrator access is required');
    await expect(gate.locator('[data-admin-console-gate-actions]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'a[href], button:not(:disabled)')).small).toEqual([]);

    // Sign out from the forbidden gate into the signed-out shell.
    await gate.locator('[data-admin-console-action="sign-out"]').click();
    await expect(page.locator('[data-admin-console-gate]')).toHaveCount(0);
    const signInBtn = page.locator('[data-admin-console-action="sign-in"]');
    await expect(signInBtn).toBeVisible();
    await expect(page.locator('[data-admin-console-view] [role="status"]')).toContainText('signed out');

    // Signed-out shell updates route marks without mounting protected screens.
    await clickNav(page, 'sessions');
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Sessions');
    await expect(page.locator('[data-admin-console-nav="sessions"]')).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('[data-admin-console-view] [role="status"]')).toContainText('signed out');

    // Clicking Sign In restores the signed-in shell on the current route.
    await signInBtn.click();
    await expect(page.locator('[data-admin-console-title]')).toHaveText('Sessions');
    await expect(page.locator('[data-admin-console-view]')).toHaveAttribute('data-admin-console-screen', 'sessions');
    await expect(page.locator('[data-admin-console-action="sign-in"]')).toHaveCount(0);

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} admin console frame and forbidden gate pass layout and target checks`, async ({ page }, testInfo) => {
        const problems = await openConsole(page, '#/overview');
        await selectGalleryLook(page, look);
        await settleGalleryStyles(page);

        await expect(page.locator('[data-admin-console-title]')).toHaveText('Overview');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);

        if (process.env.T0293_CAPTURE_DIR) {
            await page.screenshot({
                path: `${process.env.T0293_CAPTURE_DIR}/after-admin-console-overview-${look}-${testInfo.project.name}.png`
            });
        }

        await page.locator('[data-demo-gate="forbidden"]').click();
        await expect(page.locator('[data-admin-console-gate="forbidden"]')).toBeVisible();
        await settleGalleryStyles(page);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'a[href], button:not(:disabled)')).small).toEqual([]);

        if (process.env.T0293_CAPTURE_DIR) {
            await page.screenshot({
                path: `${process.env.T0293_CAPTURE_DIR}/after-admin-console-gate-${look}-${testInfo.project.name}.png`
            });
        }

        expect(problems).toEqual([]);
    });
}
