import { expect, test } from '@playwright/test';

test('shows every app icon rendition without broken images or browser errors', async ({ page }, testInfo) => {
    const errors = [];
    page.on('console', message => {
        if (message.type() === 'error') {
            errors.push(message.text());
        }
    });
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(request.url()));
    page.on('response', response => {
        if (response.status() >= 400) {
            errors.push(`${response.status()} ${response.url()}`);
        }
    });
    const response = await page.goto('/demo/app-icon-gallery.html');
    expect(response.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'App icon gallery' })).toBeVisible();
    // Four styles of twelve apps, each with a touch and a maskable install icon preview.
    await expect(page.locator('img.touch')).toHaveCount(48);
    await expect(page.locator('img.maskable')).toHaveCount(48);
    await page.waitForLoadState('networkidle');
    const broken = await page.locator('img').evaluateAll(images => images
        .filter(image => !image.complete || image.naturalWidth === 0)
        .map(image => image.getAttribute('src')));
    expect(broken).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('app-icon-gallery.png'), fullPage: true });
    expect(errors).toEqual([]);
});
