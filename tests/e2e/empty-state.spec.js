import { expect, test } from '@playwright/test';
import { openGallery, smallTargets } from './gallery-helpers.js';

test('empty states offer zero, one, or two actions with readable content', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    const states = page.locator('#empty-state .empty-state');
    await expect(states).toHaveCount(3);
    for (const [index, state] of (await states.all()).entries()) {
        await expect(state.locator('.empty-state__title')).toBeVisible();
        await expect(state.locator('.empty-state__text')).toBeVisible();
        await expect(state.locator('svg')).toHaveAttribute('aria-hidden', 'true');
        await expect(state.getByRole('button')).toHaveCount(index);
        await expect(state).toHaveCSS('display', 'grid');
    }
    expect((await smallTargets(page, '#empty-state button')).small).toEqual([]);
    await page.locator('#empty-state').screenshot({ path: testInfo.outputPath('empty-state.png') });
    expect(problems).toEqual([]);
});
