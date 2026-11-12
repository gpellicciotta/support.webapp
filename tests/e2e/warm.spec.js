import { expect, test } from '@playwright/test';
import { openGallery, tokenColor } from './gallery-helpers.js';

test('warm seasons preserve source accents on roots and specimen wrappers', async ({ page }, testInfo) => {
    const errors = await openGallery(page);
    page.on('requestfailed', request => errors.push(request.url()));
    await page.locator('#look-select').selectOption('warm');
    await page.waitForLoadState('networkidle');
    const dark = testInfo.project.use.colorScheme === 'dark';
    const colors = {
        spring: dark ? 'rgb(143, 194, 122)' : 'rgb(94, 140, 74)',
        summer: dark ? 'rgb(240, 194, 75)' : 'rgb(217, 154, 30)',
        autumn: dark ? 'rgb(227, 154, 95)' : 'rgb(166, 90, 42)',
        winter: dark ? 'rgb(158, 195, 230)' : 'rgb(74, 123, 166)'
    };
    for (const [season, color] of Object.entries(colors)) {
        await page.locator('#accent-select').selectOption(season);
        expect(await tokenColor(page, '--color-accent')).toBe(color);
        await expect(page.locator(`.season[data-accent="${season}"]`)).toHaveCSS('border-top-color', color);
    }
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveCSS('font-family', /Outfit/);
    await expect(page.locator('body')).toHaveCSS('font-family', /DM Sans/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('warm-seasons.png'), fullPage: true });
    await page.locator('#look-select').selectOption('neutral');
    await expect(page.locator('html')).not.toHaveAttribute('data-accent');
    await expect(page.locator('#accent-select')).toBeDisabled();
    expect(errors).toEqual([]);
});
