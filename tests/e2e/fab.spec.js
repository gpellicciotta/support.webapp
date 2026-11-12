import { expect, test } from '@playwright/test';
import { join } from 'node:path';
import { expectRing, openGallery, ring, smallTargets, tokenColor } from './gallery-helpers.js';

test('fab specimens expose every state, labels, targets, and a keyboard focus ring', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    const section = page.locator('#fab');
    if (process.env.FAB_EVIDENCE_DIR) {
        const exists = await section.count();
        await (exists ? section : page.locator('#icon-button')).screenshot({
            path: join(process.env.FAB_EVIDENCE_DIR, `${exists ? 'after' : 'before'}-${testInfo.project.name}.png`)
        });
    }
    await expect(section).toHaveCount(1);
    for (const state of ['', '.is-hover', '.is-active', '.is-focus', ':disabled', '[hidden]']) {
        await expect(section.locator(`.fab${state}`).first()).toHaveAttribute('aria-label', 'Add task');
    }
    for (const button of await section.locator('.fab').all()) {
        await expect(button.locator('svg[aria-hidden="true"]')).toHaveCount(1);
        await expect(button.locator('use')).toHaveAttribute('href', /#icon-plus$/);
    }
    expect((await smallTargets(page, '#fab .fab')).small).toEqual([]);
    const button = section.locator('.fab').first();
    expectRing(await ring(button), await tokenColor(page, '--color-focus'), 'fab');
    await expect(section.locator('.fab[hidden]')).toBeHidden();
    await expect(section.locator('.fab:disabled')).toBeDisabled();
    expect(problems).toEqual([]);
});

test('the shell keeps the overlay fab visible above navigation while content scrolls', async ({ page }) => {
    const problems = await openGallery(page);
    await page.goto('/demo/shell-todos.html', { waitUntil: 'networkidle' });
    const button = page.locator('.app__overlays > .fab');
    await expect(button).toHaveAccessibleName('Add task');
    const before = await button.boundingBox();
    expect(before.width).toBeGreaterThanOrEqual(44);
    expect(before.height).toBeGreaterThanOrEqual(44);
    const viewport = page.viewportSize();
    expect(before.x).toBeGreaterThanOrEqual(0);
    expect(before.x + before.width).toBeLessThanOrEqual(viewport.width);
    expect(before.y + before.height).toBeLessThan(viewport.height);
    const nav = page.locator('.app__bottom-nav');
    if (await nav.isVisible()) {
        expect(before.y + before.height).toBeLessThan((await nav.boundingBox()).y);
    }
    await page.locator('.app__main').evaluate(element => {
        element.scrollTop = element.scrollHeight;
    });
    expect(await button.boundingBox()).toEqual(before);
    expect(await button.evaluate(element => getComputedStyle(element).position)).toBe('fixed');
    expect(problems).toEqual([]);
});
