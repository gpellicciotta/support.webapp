// Browser integration checks for data-loader.js in the admin console shell demo.
import { expect, test } from '@playwright/test';
import { settleGalleryStyles, smallTargets } from './gallery-helpers.js';

test('admin console demo screen fails once and recovers through Retry, handles 401 Sign in, and supports quiet refresh', async ({ page }) => {
    test.skip(page.viewportSize().width < 1024, 'admin console demo targets desktop widths');
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));

    const response = await page.goto('/demo/shell-admin-console.html', { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await settleGalleryStyles(page);

    const section = page.locator('[data-admin-loader-demo]');
    const host = section.locator('[data-admin-status-host]');
    await expect(section).toBeVisible();
    await expect(host.locator('.list--facts')).toBeVisible();

    // Fail once, show the danger error banner with Retry, and recover on Retry click.
    await section.locator('[data-admin-load="fail-once"]').click();
    const errorBanner = host.locator('[data-data-loader-error="failed"]');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveAttribute('role', 'alert');
    await expect(errorBanner.locator('.banner__text')).toContainText('Server status could not be loaded:');
    const retryBtn = errorBanner.locator('[data-data-loader-action="retry"]');
    await expect(retryBtn).toHaveAccessibleName('Retry');
    await expect(retryBtn.locator('use')).toHaveAttribute('href', /#icon-refresh$/);

    await retryBtn.click();
    await expect(host.locator('.list--facts')).toBeVisible();
    await expect(host.locator('[data-fact="server-status"] .chip--status')).toHaveText('Healthy');
    await expect(host.locator('[data-fact="checks"]')).toHaveText('2');
    await expect(host.locator('[data-data-loader-error]')).toHaveCount(0);

    // Quiet refresh keeps the shown facts visible and updates them cleanly.
    await section.locator('[data-admin-load="quiet"]').click();
    await expect(host.locator('[data-fact="checks"]')).toHaveText('3');

    // 401 offers Sign in through the app callback.
    await section.locator('[data-admin-load="unauthorized"]').click();
    const authBanner = host.locator('[data-data-loader-error="unauthorized"]');
    await expect(authBanner).toBeVisible();
    await expect(authBanner.locator('.banner__text')).toContainText('Sign in again.');
    const signInBtn = authBanner.locator('[data-data-loader-action="sign-in"]');
    await expect(signInBtn).toHaveAccessibleName('Sign in');
    await signInBtn.click();
    await expect(page.locator('.toast-region .toast')).toContainText('Sign-in');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);
    expect(problems).toEqual([]);
});
