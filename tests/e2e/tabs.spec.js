import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { openGallery } from './gallery-helpers.js';

test('tabs switch by pointer and keyboard with accessible states', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(`request: ${request.url()}`));
    const section = page.locator('#tabs');
    const general = section.getByRole('tab', { name: 'General', exact: true });
    const sharing = section.getByRole('tab', { name: 'Sharing', exact: true });
    await expect(general).toHaveAttribute('aria-selected', 'true');
    await sharing.click();
    await expect(sharing).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tabs-sharing-panel')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(general).toBeFocused();
    await page.keyboard.press('End');
    await expect(sharing).toBeFocused();
    await page.keyboard.press('Home');
    await expect(general).toBeFocused();
    await page.keyboard.press('Space');
    await page.keyboard.press('Enter');
    await expect(general).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Tab');
    await expect(page.locator('#tabs-general-panel')).toBeFocused();
    for (const tab of await section.getByRole('tab').all()) {
        const box = await tab.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
    }
    if (process.env.TABS_EVIDENCE) {
        await section.screenshot({ path: resolve(process.env.TABS_EVIDENCE, `after-${testInfo.project.name}.png`) });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });
    test('all panel content remains readable', async ({ page }) => {
        await page.goto('/demo/visual-style-gallery.html');
        await expect(page.locator('#tabs-general-panel')).toBeVisible();
        await expect(page.locator('#tabs-sharing-panel')).toBeVisible();
    });
});
