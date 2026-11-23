import { expect, test } from '@playwright/test';
import { GALLERY, openGallery } from './gallery-helpers.js';

test('boot script applies a stored dark theme before any ES module runs', async ({ page }) => {
    await page.goto(GALLERY, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
        localStorage.setItem('support-webapp-gallery.theme', 'dark');
    });
    // Abort the gallery module so only the classic head boot script can set data-theme.
    await page.route('**/demo/gallery.js', (route) => route.abort());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark');

    await page.evaluate(() => {
        localStorage.setItem('support-webapp-gallery.theme', 'system');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).not.toHaveAttribute('data-theme');
    await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'light dark');
});

test('boot script migrates a legacy key once before any module runs', async ({ page }) => {
    await page.route('**/demo/theme-boot-probe.html', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'text/html; charset=utf-8',
            body: `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="color-scheme" content="light dark">
    <script src="../js/theme-boot.js" data-theme-switch-app="probe" data-theme-switch-legacy-key="probe_theme"></script>
</head>
<body><p>Probe</p></body>
</html>`
        });
    });
    await page.goto('/demo/theme-boot-probe.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
        localStorage.removeItem('probe.theme');
        localStorage.setItem('probe_theme', 'dark');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => ({
        current: localStorage.getItem('probe.theme'),
        legacy: localStorage.getItem('probe_theme')
    }))).toEqual({ current: 'dark', legacy: null });

    await page.evaluate(() => {
        localStorage.setItem('probe_theme', 'light');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => ({
        current: localStorage.getItem('probe.theme'),
        legacy: localStorage.getItem('probe_theme')
    }))).toEqual({ current: 'dark', legacy: null });
});

test('gallery demonstrates account theme sync at sign-in and saves manual changes', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    const section = page.locator('#theme-switch');
    await expect(section).toBeVisible();
    await section.scrollIntoViewIfNeeded();
    if (process.env.THEME_PROOF_DIR) {
        await section.screenshot({ path: `${process.env.THEME_PROOF_DIR}/section-${testInfo.project.name}.png` });
    }
    const root = page.locator('html');
    const status = section.locator('[data-theme-sync-status]');

    await section.locator('[data-theme-sync-demo="dark"]').click();
    await expect(root).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('input[name="theme"][value="dark"]')).toBeChecked();
    await expect(status).toContainText('dark');

    await page.locator('input[name="theme"][value="light"]').check();
    await expect(root).toHaveAttribute('data-theme', 'light');
    await expect(status).toContainText('Saved');
    await expect(status).toContainText('light');

    await section.locator('[data-theme-sync-demo="default"]').click();
    await expect(root).not.toHaveAttribute('data-theme');
    await expect(page.locator('input[name="theme"][value="system"]')).toBeChecked();
    await expect(status).toContainText('system');

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});
