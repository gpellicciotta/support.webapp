import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook } from './gallery-helpers.js';
import { resolve } from 'node:path';

test('tooltip focus, description, dismissal, hover and viewport', async ({ page }, info) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(request.url()));
    const trigger = page.locator('#tooltip-demo-trigger');
    const tip = page.locator('#tooltip-demo');
    for (const look of ['neutral', 'warm', 'bright']) {
        await selectGalleryLook(page, look);
        await trigger.focus();
        await expect(tip).toBeVisible();
        await expect(trigger).toBeFocused();
        expect(await tip.evaluate(element => element.matches(':popover-open'))).toBe(true);
        await expect(trigger).toHaveAccessibleDescription('Get the latest forecast for this location.');
        const box = await tip.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(info.project.use.viewport.width);
        if (process.env.TOOLTIP_EVIDENCE) {
            await page.screenshot({ path: resolve(process.env.TOOLTIP_EVIDENCE, `after-${look}-${info.project.name}.png`) });
        }
        await page.keyboard.press('Escape');
        await expect(tip).toBeHidden();
        await expect(trigger).toBeFocused();
        await expect(trigger).toHaveAccessibleDescription('Get the latest forecast for this location.');
        await trigger.blur();
        await trigger.hover();
        await expect(tip).toBeVisible();
        await tip.hover();
        await expect(tip).toBeVisible();
        await page.mouse.move(0, 0);
        await expect(tip).toBeHidden();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});

test('description updates, reduced motion, and forced colors', async ({ page }) => {
    const problems = await openGallery(page);
    await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
    const trigger = page.locator('#tooltip-demo-trigger');
    const tip = page.locator('#tooltip-demo');
    await tip.evaluate(element => {
        element.textContent = 'Haal de nieuwste voorspelling op.';
    });
    await trigger.focus();
    await expect(trigger).toHaveAccessibleDescription('Haal de nieuwste voorspelling op.');
    await expect(tip).toBeVisible();
    expect(await tip.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
    expect(problems).toEqual([]);
});

for (const missing of ['showPopover', 'hidePopover', 'both']) {
    test(`hidden-state fallback without ${missing}`, async ({ page }, info) => {
        await page.addInitScript(method => {
            for (const name of method === 'both' ? ['showPopover', 'hidePopover'] : [method]) {
                Object.defineProperty(HTMLElement.prototype, name, { configurable: true, value: undefined });
            }
        }, missing);
        const problems = await openGallery(page);
        page.on('requestfailed', request => problems.push(request.url()));
        const trigger = page.locator('#tooltip-demo-trigger');
        const tip = page.locator('#tooltip-demo');
        await trigger.focus();
        await expect(tip).toBeVisible();
        await expect(tip).not.toHaveAttribute('popover');
        await expect(tip).not.toHaveCSS('display', 'none');
        await expect(trigger).toHaveAccessibleDescription('Get the latest forecast for this location.');
        if (process.env.TOOLTIP_EVIDENCE) {
            await page.screenshot({ path: resolve(process.env.TOOLTIP_EVIDENCE, `fallback-${missing}-${info.project.name}.png`) });
        }
        await page.keyboard.press('Escape');
        await expect(tip).toBeHidden();
        await expect(trigger).toBeFocused();
        const restored = await page.evaluate(async () => {
            const { attachTooltip } = await import('/js/tooltip.js');
            const button = document.createElement('button');
            const element = document.createElement('span');
            element.className = 'tooltip';
            element.textContent = 'Fallback description';
            element.setAttribute('popover', 'auto');
            document.body.append(button, element);
            const controller = attachTooltip(button, element);
            controller.open();
            const visible = getComputedStyle(element).display !== 'none';
            controller.close();
            const closed = element.hidden && !controller.isOpen();
            controller.destroy();
            const result = { visible, closed, popover: element.getAttribute('popover'),
                hidden: element.hidden, described: button.hasAttribute('aria-describedby') };
            button.focus();
            result.reopened = controller.isOpen();
            button.remove(); element.remove();
            return result;
        });
        expect(restored).toEqual({ visible: true, closed: true, popover: 'auto', hidden: false, described: false, reopened: false });
        expect(problems).toEqual([]);
    });
}

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });
    test('authored description remains readable', async ({ page }) => {
        const response = await page.goto('/demo/visual-style-gallery.html');
        expect(response.status()).toBe(200);
        await expect(page.locator('#tooltip-demo')).toBeVisible();
        await expect(page.locator('#tooltip-demo-trigger')).toHaveAccessibleDescription('Get the latest forecast for this location.');
    });
});
