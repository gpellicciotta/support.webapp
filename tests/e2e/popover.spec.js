import { expect, test } from '@playwright/test';
import { expectAnchored, expectOnTop, openGallery } from './gallery-helpers.js';
import { resolve } from 'node:path';

const evidence = process.env.MENU_EVIDENCE;

test('popover focus and anchoring', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    const trigger = page.locator('#popover-demo-trigger');
    const panel = page.locator('#popover-demo');
    for (const look of ['neutral', 'warm', 'bright']) {
        await page.locator('#look-select').selectOption(look);
        await page.waitForFunction(name => [...document.styleSheets].some(sheet => sheet.href?.includes(`/looks/${name}/index.css`)), look);
        await page.locator('#popover').scrollIntoViewIfNeeded();
        await trigger.click();
        await expect(panel).toBeVisible();
        await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        await expect(panel.getByLabel('To do')).toBeFocused();
        await expectAnchored(page, trigger, panel);
        await expectOnTop(panel.getByRole('button', { name: 'Clear' }));
        await page.keyboard.press('Space');
        await expect(trigger).toContainText('To do');
        if (evidence) {
            await page.screenshot({ path: resolve(evidence, `after-popover-${look}-${testInfo.project.name}.png`) });
        }
        await page.keyboard.press('Space');
        await expect(trigger).not.toContainText('To do');
        await page.keyboard.press('Escape');
        await expect(panel).toBeHidden();
        await expect(trigger).toBeFocused();
    }
    await trigger.click();
    await panel.getByLabel('To do').check();
    await expect(trigger).toContainText('To do');
    await panel.getByRole('button', { name: 'Clear' }).click();
    await expect(panel).toBeVisible();
    await expect(trigger).not.toContainText('To do');
    await page.keyboard.press('Tab');
    await expect(panel).toBeHidden();
    await trigger.click();
    await page.locator('#popover-title').click();
    await expect(panel).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});
