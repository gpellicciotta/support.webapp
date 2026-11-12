import { expect, test } from '@playwright/test';
import { openGallery, smallTargets } from './gallery-helpers.js';

test('rows respond to their container and preserve keyboard actions', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    await expect(page.locator('#row .row').first()).toBeVisible();
    await page.locator('#row').screenshot({ path: testInfo.outputPath('row.png') });
    await page.setViewportSize({ width: 1440, height: 900 });
    const list = page.locator('#row .list');
    const row = list.locator('.row').first();
    await expect(row).toBeVisible();
    await expect(list).toHaveCSS('container-type', 'inline-size');
    for (const width of [800, 575, 576, 320]) {
        await list.evaluate((element, size) => {
            element.style.width = `${size}px`;
        }, width);
        const main = await row.locator('.row__main').boundingBox();
        const actions = await row.locator('.row__actions').boundingBox();
        if (width < 576) {
            expect(actions.y).toBeGreaterThanOrEqual(main.y + main.height);
        }
        else {
            expect(actions.x).toBeGreaterThanOrEqual(main.x + main.width);
        }
        const button = row.getByRole('button');
        await button.focus();
        await expect(button).toBeFocused();
        expect(await row.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
    expect((await smallTargets(page, '#row button')).small).toEqual([]);
    expect(problems).toEqual([]);
});
