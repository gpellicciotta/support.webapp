import { expect, test } from '@playwright/test';
import { GALLERY, MIN_TARGET, openGallery } from './gallery-helpers.js';
import { resolve } from 'node:path';

const evidence = process.env.COLLAPSIBLE_EVIDENCE;

test('collapsible opens and closes by pointer and keyboard', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    const section = page.locator('#collapsible');
    const toggle = page.locator('#collapsible-demo-toggle');
    const panel = page.locator('#collapsible-demo-panel');
    const chevron = toggle.locator('.collapsible__icon');
    await section.scrollIntoViewIfNeeded();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    const box = await toggle.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(MIN_TARGET);
    const collapsedRotation = await chevron.evaluate((element) => getComputedStyle(element).rotate);

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    expect(await chevron.evaluate((element) => getComputedStyle(element).rotate)).not.toBe(collapsedRotation);
    if (evidence) {
        await section.screenshot({ path: resolve(evidence, `section-collapsible-${testInfo.project.name}.png`) });
    }
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Space');
    await page.keyboard.press('Tab');
    await expect(panel.getByRole('link').first()).toBeFocused();

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});

test('find in page reveals a collapsed panel hidden until found', async ({ page }) => {
    const problems = await openGallery(page);
    const toggle = page.locator('#collapsible-found-toggle');
    const panel = page.locator('#collapsible-found-panel');
    await expect(panel).toHaveAttribute('hidden', 'until-found');
    await expect(panel).toBeHidden();
    await panel.evaluate((element) => element.dispatchEvent(new Event('beforematch')));
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    expect(problems).toEqual([]);
});

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('collapsed panels stay hidden until found and expanded ones stay readable', async ({ page }) => {
        await page.goto(GALLERY, { waitUntil: 'networkidle' });
        await expect(page.locator('#collapsible-found-panel')).toHaveAttribute('hidden', 'until-found');
        await expect(page.locator('#collapsible-expanded-panel')).toBeVisible();
    });
});
