import { expect, test } from '@playwright/test';
import { STATES, expectRing, forcedRing, openGallery, ring, smallTargets, styles, tokenColor } from './gallery-helpers.js';

test('link buttons show every state with native button semantics', async ({ page }) => {
    const problems = await openGallery(page);
    await expect(page.locator('#link-button h2')).toHaveText('Link button');
    const order = await page.locator('main > section').evaluateAll(sections => sections.map(section => section.id));
    expect.soft(order.indexOf('link-button')).toBe(order.indexOf('icon-button') + 1);
    for (const state of STATES) {
        await expect(page.locator(`#link-button button.link-button${state}`)).toHaveCount(1);
    }
    const buttons = page.locator('#link-button .link-button');
    for (const button of await buttons.all()) {
        await expect(button).toHaveAttribute('type', 'button');
        const style = await styles(button, ['text-decoration-line', 'background-color', 'border-top-width']);
        expect(style).toEqual({ 'text-decoration-line': 'underline', 'background-color': 'rgba(0, 0, 0, 0)', 'border-top-width': '0px' });
        const typography = await styles(button, ['text-underline-offset', 'font-size']);
        expect(parseFloat(typography['text-underline-offset'])).toBeCloseTo(parseFloat(typography['font-size']) * 0.2);
    }
    expect(problems).toEqual([]);
});

test('real and specimen interactions use link colors and preserve disabled behavior', async ({ page }) => {
    const problems = await openGallery(page);
    const normal = page.locator(`#link-button .link-button${STATES[0]}`);
    const link = await tokenColor(page, '--color-link');
    const hover = await tokenColor(page, '--color-link-hover');
    await expect(normal).toHaveCSS('color', link);
    await normal.hover();
    await expect(normal).toHaveCSS('color', hover);
    await page.mouse.down();
    try {
        await expect(normal).toHaveCSS('color', hover);
        expect(await normal.evaluate(element => element.matches(':active'))).toBe(true);
    }
    finally {
        await page.mouse.up();
    }
    for (const state of ['.is-hover', '.is-active']) {
        await expect(page.locator(`#link-button .link-button${state}`)).toHaveCSS('color', hover);
    }
    const disabled = page.locator('#link-button .link-button:disabled');
    await expect(disabled).toBeDisabled();
    await disabled.hover({ force: true });
    await expect(disabled).toHaveCSS('color', await tokenColor(page, '--color-text-disabled'));
    await expect(disabled).toHaveCSS('cursor', 'not-allowed');
    expect(problems).toEqual([]);
});

test('link buttons keep 44 px targets, including short labels, and the global focus ring', async ({ page }) => {
    const problems = await openGallery(page);
    const normal = page.locator(`#link-button .link-button${STATES[0]}`);
    await normal.evaluate(element => {
        element.textContent = '?';
    });
    const targets = await smallTargets(page, '#link-button .link-button');
    expect(targets.count).toBe(5);
    expect(targets.small).toEqual([]);
    const color = await tokenColor(page, '--color-focus');
    expectRing(await ring(normal), color, 'live');
    expectRing(await forcedRing(page.locator('#link-button .is-focus')), color, 'specimen');
    await page.emulateMedia({ forcedColors: 'active' });
    const forced = await ring(normal);
    expect(forced.style).toBe('solid');
    expect(forced.width).toBeGreaterThanOrEqual(2);
    expect(problems).toEqual([]);
});
