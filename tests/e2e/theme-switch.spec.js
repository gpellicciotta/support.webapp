import { expect, test } from '@playwright/test';
import { openGallery } from './gallery-helpers.js';

test('gallery stores the theme and follows System across reloads', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(request.url()));
    const root = page.locator('html');
    const artifact = process.env.THEME_PROOF_DIR ?? testInfo.outputPath('.');
    await page.screenshot({ path: `${artifact}/${process.env.THEME_PROOF_PHASE ?? 'after'}-${testInfo.project.name}.png` });
    await page.locator('input[name="theme"][value="dark"]').check();
    await expect(root).toHaveAttribute('data-theme', 'dark');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(root).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('input[name="theme"][value="dark"]')).toBeChecked();
    await page.locator('input[name="theme"][value="light"]').check();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(root).toHaveAttribute('data-theme', 'light');
    await page.locator('input[name="theme"][value="system"]').check();
    await page.reload({ waitUntil: 'networkidle' });
    await expect(root).not.toHaveAttribute('data-theme');
    await expect(page.locator('input[name="theme"][value="system"]')).toBeChecked();
    await page.emulateMedia({ colorScheme: 'dark' });
    const dark = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
    await page.emulateMedia({ colorScheme: 'light' });
    await expect.poll(() => page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(dark);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});
