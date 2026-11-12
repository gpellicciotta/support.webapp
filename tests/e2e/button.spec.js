import { expect, test } from '@playwright/test';
import { STATES, expectRing, forcedRing, openGallery, ring, smallTargets, styles, tokenColor, tokenLength } from './gallery-helpers.js';

const VARIANTS = {
    default: '.button:not(.button--secondary, .button--danger, .button--quiet, .button--inverse, .button--small)',
    secondary: '.button--secondary:not(.button--danger)',
    danger: '.button--danger:not(.button--secondary)',
    'danger outline': '.button--secondary.button--danger',
    quiet: '.button--quiet',
    inverse: '.button--inverse',
    small: '.button--small'
};

test('the button section shows every variant in every state', async ({ page }) => {
    const problems = await openGallery(page);
    await expect(page.locator('#button h2')).toHaveText('Button');
    for (const [variant, selector] of Object.entries(VARIANTS)) {
        for (const state of STATES) {
            await expect(page.locator(`#button ${selector}${state}`), `${variant} ${state}`).not.toHaveCount(0);
        }
    }
    await expect(page.locator('#button .button[aria-disabled="true"]')).not.toHaveCount(0);
    await expect(page.locator('#button .button:has(svg.icon)')).not.toHaveCount(0);
    expect(problems).toEqual([]);
});

test('hover and active change the ground of every button variant', async ({ page }) => {
    await openGallery(page);
    for (const [variant, selector] of Object.entries(VARIANTS)) {
        const grounds = [];
        for (const state of [STATES[0], '.is-hover', '.is-active']) {
            grounds.push((await styles(page.locator(`#button ${selector}${state}`).first(), ['background-color']))['background-color']);
        }
        expect(new Set(grounds).size, `${variant}: ${grounds.join(' / ')}`).toBe(3);
    }
});

test('disabled buttons use the disabled text color and ignore hover', async ({ page }) => {
    await openGallery(page);
    const disabled = await tokenColor(page, '--color-text-disabled');
    const specimens = page.locator('#button .button:is(:disabled, [aria-disabled="true"])');
    expect(await specimens.count()).toBeGreaterThanOrEqual(Object.keys(VARIANTS).length);
    for (const specimen of await specimens.all()) {
        const style = await styles(specimen, ['color', 'cursor']);
        expect(style.color, await specimen.textContent()).toBe(disabled);
        expect(style.cursor).toBe('not-allowed');
    }
    const plain = await styles(page.locator('#button .button[aria-disabled="true"]:not(.is-hover)').first(), ['background-color']);
    const hovered = await styles(page.locator('#button .button[aria-disabled="true"].is-hover').first(), ['background-color']);
    expect(hovered).toEqual(plain);
});

test('danger buttons fill or outline in the danger color', async ({ page }) => {
    await openGallery(page);
    const danger = await tokenColor(page, '--color-danger');
    const onDanger = await tokenColor(page, '--color-on-danger');
    const filled = await styles(page.locator(`#button ${VARIANTS.danger}${STATES[0]}`).first(), ['background-color', 'color']);
    expect(filled).toEqual({ 'background-color': danger, 'color': onDanger });
    const outline = await styles(page.locator(`#button ${VARIANTS['danger outline']}${STATES[0]}`).first(), ['border-top-color']);
    expect(outline['border-top-color']).toBe(danger);
    const primary = await styles(page.locator(`#button ${VARIANTS.default}${STATES[0]}`).first(), ['background-color']);
    expect(primary['background-color']).toBe(await tokenColor(page, '--color-primary'));
});

test('buttons take the button radius role', async ({ page }) => {
    await openGallery(page);
    const radius = await tokenLength(page, '--radius-button');
    for (const selector of Object.values(VARIANTS)) {
        expect((await styles(page.locator(`#button ${selector}`).first(), ['border-top-left-radius']))['border-top-left-radius'], selector).toBe(radius);
    }
});

test('every button, including the small variant, is at least 44 by 44 px', async ({ page }) => {
    await openGallery(page);
    const { count, small } = await smallTargets(page, '#button .button');
    expect(count).toBeGreaterThanOrEqual(35);
    expect(small).toEqual([]);
});

test('focus draws the focus ring, and danger buttons draw it in the danger color', async ({ page }) => {
    await openGallery(page);
    const focus = await tokenColor(page, '--color-focus');
    const danger = await tokenColor(page, '--color-danger');
    for (const [variant, selector] of Object.entries(VARIANTS)) {
        const expected = variant.startsWith('danger') ? danger : focus;
        const live = await ring(page.locator(`#button ${selector}${STATES[0]}`).first());
        expectRing(live, expected, variant);
        const forced = await forcedRing(page.locator(`#button ${selector}.is-focus`).first());
        expectRing(forced, expected, `${variant} specimen`);
    }
});

test('the focus ring stays an outline in forced colors mode', async ({ page }) => {
    await openGallery(page);
    await page.emulateMedia({ forcedColors: 'active' });
    const live = await ring(page.locator(`#button ${VARIANTS.default}${STATES[0]}`).first());
    expect(live.style).toBe('solid');
    expect(live.width).toBeGreaterThanOrEqual(2);
});
