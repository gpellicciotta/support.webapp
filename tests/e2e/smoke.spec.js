import { expect, test } from '@playwright/test';

test('serves the landing page without browser errors', async ({ page }, testInfo) => {
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
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'support.webapp' })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('landing.png'), fullPage: true });
    expect(errors).toEqual([]);
});
